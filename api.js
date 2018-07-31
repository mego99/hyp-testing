"use strict";

let spawn = require('child_process').spawn;
let express = require('express'), app = express();
let server = app.listen(4000,  "127.0.0.1", function () {
});

let dataStr = '';

let get_py = function(req,res,next) {
    let py = spawn('python',['script.py']);
    let str = '';
    py.stdout.on('data', function(data){
      console.log(data);
      str += data.toString();
    });
    py.stdout.on('end', function(){
      res.locals.data = str;
      next();
    });
    console.log(JSON.stringify(req.params));
    py.stdin.write(JSON.stringify(req.params));
    py.stdin.end();
};


app.get('/api/z1/:suc-:n-:prop-:alt', [get_py], function(req,res) {
  res.send(res.locals.data);
});

app.get('/api/z2/:suc1-:suc2-:n1-:n2-:alt', function(req,res) {
  res.send(req.params);
});

app.get('/api/t1/:mu-:xbar-:xsd-:n-:alt', function(req,res) {
  res.send(req.params);
});

app.get('/api/t2/:xbar1-:xsd1-:n1-:xbar2-:xsd2-:n2-:alt', function(req,res) {
  res.send(req.params);
});

app.get('/api/temp/:mu-:xbar-:xsd-:n-:alt', function(req,res) {
  res.send(req.params);
});
