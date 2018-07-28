let getNormPdf = function(x,mean,stdev) {
  let variance = stdev * stdev;
  let a = Math.pow((2 * Math.PI * variance),(-1/2));
  let b = Math.exp(Math.pow((x-mean),2)/(-2*variance));
  return a * b;
};

let testObj = [];
let mean=0,stdev=1;
let lower,upper,inc;

let genData = function(m,s) {
  lower = m - (s*3);
  upper = m + (s*3);
  inc = (Math.abs(lower) * 2) / 150;
  for (let x=lower; x<upper; x+=inc) {
    testObj.push({
      'xVal':x,
      'normPdf':getNormPdf(x,m,s)
    })
  }

  console.log(testObj);
}


let chart = d3.select('#wrapper')
  .attr('width','960')
  .attr('height','600');


let area = d3.area();
let yScale = d3.scaleLinear();
let xScale = d3.scaleLinear();
let normLine = chart.append('path');


let updateCurve = function() {
  mean = Number(d3.select("#input-mean").property("value"));
	stdev = Number(d3.select("#input-stdev").property("value"));

  let q = d3.queue();
  q.defer(genData(mean,stdev));
  q.await(function() {
    xScale
      .domain([lower,upper])
      .range([0,960]);

    yScale
      .domain([0,d3.max(testObj,function(d){return d.normPdf})])
      .range([600,0]);

    area
      .x(function(d){return xScale(+d.xVal)})
      .y1(function(d){return yScale(+d.normPdf)})
      .y0(yScale(0));

    normLine.enter()
      .datum(testObj)
      .attr('fill','pink')
      .attr('d',area);
  });

};

updateCurve();

let xAxis = d3.axisBottom();
let yAxis = d3.axisLeft();


d3.selectAll(".input-stat").on("input", function(){
	updateCurve();
});
