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
    req.params.type = res.locals.testType;
    console.log(JSON.stringify(req.params));
    console.log(res.locals.testType);
    py.stdin.write(JSON.stringify(req.params));
    py.stdin.end();
};


app.get('/api/z1/:suc-:n-:prop-:alt', function(req,res,next) {
  res.locals.testType = 'z1';
  next();
}, [get_py], function(req,res) {
  res.send(res.locals.data);
});

app.get('/api/z2/:suc1-:suc2-:n1-:n2-:alt', function(req,res,next) {
  res.locals.testType = 'z2';
  next();
}, [get_py], function(req,res) {
  res.send(res.locals.data);
});

app.get('/api/t1/:mu-:xbar-:xsd-:n-:alt', function(req,res,next) {
  res.locals.testType = 't1';
  next();
}, [get_py], function(req,res) {
  res.send(res.locals.data);
});

app.get('/api/t2/:xbar1-:xsd1-:n1-:xbar2-:xsd2-:n2-:alt', function(req,res,next) {
  res.locals.testType = 't2';
  next();
}, [get_py], function(req,res) {
  res.send(res.locals.data);
});

app.get('/api/temp/:mu-:xbar-:xsd-:n-:alt', function(req,res,next) {
  res.locals.testType = 'tm';
  next();
}, [get_py], function(req,res) {
  res.send(res.locals.data);
});
