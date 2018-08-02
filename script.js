document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('fieldset[name="test-type"]').onchange=testSelection;
    document.querySelector('input[type="button"]').onclick=sendParams;
},false);

function testSelection(event) {
  console.log(event.target);
  console.log(event.target.value);
  let selectedTest = event.target.value + "Form";
  console.log(selectedTest);
  let forms  = document.querySelectorAll("form.test");
  console.log(forms);
  forms.forEach(function(form) {
    form.classList.add('hide-form');
    form.classList.add('selected-form');
  });
  document.getElementById(selectedTest).classList.remove('hide-form');
  document.getElementById(selectedTest).classList.add('selected-form');
}

function sendParams(event) {
  console.log(document.querySelector('.selected-form'));
  thisForm = new FormData(document.querySelector('.selected-form'));
  console.log(thisForm);
  console.log(thisForm.entries());
  let str = '', url = '';
  let id = event.target.id;
  for (let param of thisForm.entries()) {
    str += param[1] + "-";
  }
  console.log(str);
  console.log(str.substring(0,str.length-1));
  str = str.substring(0,str.length-1);
  url = 'http://localhost:4000/api/' + id + '/' + str;
  console.log(url);
  console.log(this);
  console.log(event.target.id);
  var xhr = new XMLHttpRequest;
  xhr.addEventListener("load", transferComplete);
  xhr.open('GET', url);
  xhr.send();
}

function transferComplete() {
  let response = JSON.parse(this.response);
  updateCurve(response['teststat'],response['pval']);
}

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

//generate set of x-values and y-values for a Normal curve & assign to above variables
let genData = function(m,s) {
  testObj.length = 0;
  lower = m - (s*6);
  upper = m + (s*6);
  inc = (upper - lower) / 200;
  for (let x=lower; x<upper; x+=inc) {
    testObj.push({
      'xVal':x,
      'normPdf':getNormPdf(x,m,s)
    })
  }
}

//set up main chart
d3.select('#wrapper')
  .attr('width',width+(margin*2))
  .attr('height',height+(margin*2))

let chart = d3.select('#wrapper').append('g')
  .attr('width',width+(margin*2))
  .attr('height',height+(margin*2))
  .attr('transform','translate(0,'+margin+')');

//populate variables with data for a standard normal curve
genData(0,1);

//set up scales and x-axis
let yScale = d3.scaleLinear()
  .domain([0,d3.max(testObj,function(d){return +d.normPdf + 0.1})])
  .range([height,0]);

let xScale = d3.scaleLinear()
  .domain([lower,upper])
  .range([0,width]);

let ticks = [];
for(let i=-6;i<=6;i++) {
  ticks.push(mean + (stdev * i));
};

let xAxis = d3.axisBottom(xScale)
  .tickValues(ticks);

//generate svg for filled in area under urve
let area = d3.area()
  .x(function(d){return xScale(+d.xVal)})
  .y1(function(d){return yScale(+d.normPdf)})
  .y0(yScale(0));

let normLine = chart.append('path')
  .datum(testObj)
  .attr("class", "norm-line")
  .attr('transform','translate('+margin+','+-margin+')')
  .attr('d',area);

chart.append('g')
  .attr("class", "x-axis axis")
  .attr('transform','translate('+margin+','+(height-margin)+')')
  .call(xAxis);

//display results of the hypothesis test on the chart
let updateCurve = function(tstat,pval) {
  console.log(tstat,pval);
  if (d3.selectAll('g.test-result') !== null) {
    d3.selectAll('g.test-result').remove();
  }
  let testresult = chart.append('g')
    .attr('class','test-result');

  testresult.append('line')
    .attr('x1',xScale(tstat))
    .attr('y1',0)
    .attr('x2',xScale(tstat))
    .attr('y2',height)
    .style("stroke-width", 2)
    .style("stroke", "red")
    .style("fill", "none");

  //
  // let t = chart.transition()
  //   .duration(600);
  //
  // t.select('.norm-line')
  //   .attr('d',area);
  //
  // t.select('.x-axis')
  //   .call(xAxis);
};
//
// d3.selectAll(".input-stat").on("input", function(){
// 	updateCurve();
// });
