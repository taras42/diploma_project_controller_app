/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
/*global */
//var mraa = require('mraa'); //require mraa
var settings = require('./config/settings');
var seed = require('./seed/seed');

var xbeeAPI = require('xbee-api');
var request = require('request');

var express = require('express');
var session = require('express-session');

var index = require("./routes/index");
var models = require("./models");

var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cons = require('consolidate');
var logger = require('morgan');

var app = express();

// session setup
app.use(cookieParser());

app.use(session({
  secret: settings.sessionSecret,
  resave: false,
  saveUninitialized: true
}));

// routes setup
app.use('/', index);

// view engine setup
app.engine('html', cons.underscore);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'web')));

// server setup
var server = http.createServer(app);

models.sequelize.sync({force: true}).then(function () {
	
	seed.run().done(function(setting) {
		var port = setting.port,
			host = setting.host;
		
		server.listen(settings.defaultPort, function () {

			console.log('Server started');
			
			if(host) {
				var xbee_api = new xbeeAPI.XBeeAPI({
					api_mode: 2
				});
			
				xbee_api.on("frame_object", function(frame) {
					request({
						url: host + '/io/trigger',
						method: 'POST',
						json: {data: frame}
					}, function(error, response, body){
						if(error) {
							console.log(error);
						} else {
							console.log(response.statusCode, body);
						}
					});
				});
			}
		});
	});
	
});



