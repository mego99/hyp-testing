"use strict";

let spawn = require('child_process').spawn;
let express = require('express'), app = express();
var server = app.listen(3005,  "127.0.0.1", function () {
});

let get_py(stats) {
  let py = spawn('python',['script.py']);

  // let data = [5,10,.168,'two-sided'];
  let data = stats;
  let dataString = '';

  py.stdout.on('data', function(data){
    dataString += stats.toString();
    // console.log('data!!',data,dataString);

  });
  py.stdout.on('end', function(){
    console.log('FINAL ANSWER:');
    console.log(dataString);
  });
  py.stdin.write(JSON.stringify(stats));
  py.stdin.end();
}

app.get('/api/:type')
