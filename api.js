"use strict";

let spawn = require('child_process').spawn;

let py = spawn('python',['script.py']);

let data = [5,10,.168,'two-sided'];
let dataString = '';

py.stdout.on('data', function(data){
  dataString += data.toString();
  // console.log('data!!',data,dataString);

});
py.stdout.on('end', function(){
  console.log('FINAL ANSWER:');
  console.log(dataString);
});
py.stdin.write(JSON.stringify(data));
py.stdin.end();

//
//
//
//
// let getNormPdf = function(x,mean,stdev) {
//   let variance = stdev * stdev;
//   let a = Math.pow((2 * Math.PI * variance),(-1/2));
//   let b = Math.exp(Math.pow((x-mean),2)/(-2*variance));
//   return a * b;
// };
