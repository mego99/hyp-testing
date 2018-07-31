
let spawn = require('child_process').spawn;

  let py = spawn('python',['script.py']);

  stats = {
      "suc": "5",
      "n": "10",
      "prop": "0.168",
      "alt": "larger"
  }
  let dataString = '';

  py.stdout.on('data', function(data){
    // console.log('reading python file... data from python file below');
    dataString += data.toString();
    // console.log(dataString);
  });
  py.stdout.on('end', function(){
    // console.log(JSON.stringify(stats));
    // console.log('finished reading python file');
    console.log(dataString);
  });
  py.stdin.write(JSON.stringify(stats));
  py.stdin.end();
