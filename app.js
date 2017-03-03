// modules
let config = require('./config/config');
let fields = require('./config/fields');
let fs = require('fs');
let request = require('request');
let async = require('async');
let json2xls = require('json2xls');
let csvWriter = require('csv-write-stream');
let express = require('express');
let ws_server = new require('./app_function/ws_server');
let F = new require('./app_function/work_function.js');
//start server

let template_fields = F.gen_template_fields(fields);
fs.writeFile('./public/data.json', JSON.stringify(template_fields), function(){
	console.log('ok');
})
console.log(template_fields);

let app = express();
app.use(express.static('public'));



app.listen(config.server_port, function () {
  console.log('start!');
});

app.get('/', function (req, res) {
  	

});









