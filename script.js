//calculate Normal PDF given x-value, mean, and standard deviation
let getNormPdf = function(x,mean,stdev) {
  let variance = stdev * stdev;
  let a = Math.pow((2 * Math.PI * variance),(-1/2));
  let b = Math.exp(Math.pow((x-mean),2)/(-2*variance));
  return a * b;
};

//initialize variables
let testObj = [];
let mean=0,stdev=1;
let lower,upper,inc;
let width = 960, height = 600, margin = 30;

//generate set of x-values and y-values for a Normal curve
let genData = function(m,s) {
  testObj.length = 0;
  lower = m - (s*6);
  upper = m + (s*6);
  inc = (upper - lower) / 100;
  console.log("mean:"+m);
  console.log("st dev:"+s);
  console.log("lower: "+lower);
  console.log("upper: "+upper);
  console.log("increment: "+inc);
  for (let x=lower; x<upper; x+=inc) {
    testObj.push({
      'xVal':x,
      'normPdf':getNormPdf(x,m,s)
    })
  }

  console.log(testObj);
}

//set up main chart

d3.select('#wrapper')
  .attr('width',width+(margin*2))
  .attr('height',height+(margin*2))

let chart = d3.select('#wrapper').append('g')
  .attr('width',width+(margin*2))
  .attr('height',height+(margin*2))
  .attr('transform','translate(0,'+margin+')');

genData(0,1);

let yScale = d3.scaleLinear()
  .domain([0,d3.max(testObj,function(d){return +d.normPdf + 0.1})])
  .range([height,0]);

let xScale = d3.scaleLinear()
  .domain([lower,upper])
  .range([0,width]);

let xAxis = d3.axisBottom(xScale)
  .tickArguments([9]);

let yAxis = d3.axisLeft(yScale);

let area = d3.area()
  .x(function(d){return xScale(+d.xVal)})
  .y1(function(d){return yScale(+d.normPdf)})
  .y0(yScale(0));

let normLine = chart.append('path')
  .datum(testObj)
  .attr('fill','purple')
  .attr("class", "norm-line")
  .attr('transform','translate('+margin+','+-margin+')')
  .attr('d',area);

chart.append('g')
  .attr("class", "x-axis axis")
  .attr('transform','translate('+margin+','+(height-margin)+')')
  .call(xAxis);

chart.append('g')
  .attr("class", "y-axis axis")
  .attr('transform','translate('+margin+','+-margin+')')
  .call(yAxis);


let updateCurve = function() {

  console.log(mean, stdev);
  console.log(d3.select("#input-mean").property("value"));
  console.log(typeof d3.select("#input-mean").property("value"));
  if (parseInt(d3.select("#input-mean").property("value")) !== NaN) {
    mean = Number(d3.select("#input-mean").property("value"))
  }
  if (parseInt(d3.select("#input-stdev").property("value")) !== NaN ) {
    stdev = Number(d3.select("#input-stdev").property("value"))
  }
  console.log(mean, stdev);

  genData(mean,stdev);

  xScale
    .domain([lower,upper]);

  yScale
  .domain([0,d3.max(testObj,function(d){return +d.normPdf + 0.1})]);

  area
    .x(function(d){return xScale(+d.xVal)})
    .y1(function(d){return yScale(+d.normPdf)})
    .y0(yScale(0));

  normLine
    .datum(testObj)
    .attr('d',area);

  let t = chart.transition()
    .duration(600);

  t.select('.norm-line')
    .attr('d',area);

  t.select('.x-axis')
    .call(xAxis);

  t.select('.y-axis')
    .call(yAxis);

};


d3.selectAll(".input-stat").on("input", function(){
	updateCurve();
});
