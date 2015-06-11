/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
/*global */

var settings = require('./config/settings');
var seed = require('./seed/seed');

var xbeeAPI = require('xbee-api');
var xbeeCallbackHelper = require('./helpers/xbeeCallbackHelper');
var SerialPort = require('serialport').SerialPort;

var mraa = new require("mraa"); //require mraa
console.log('MRAA Version: ' + mraa.getVersion());

var xbeeAPIConstants = xbeeAPI.constants;

var express = require('express');
var session = require('express-session');

var index = require("./routes/index");
var sessionRouter = require("./routes/session");
var settingsRouter = require("./routes/settings");

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

// routes setup
app.use('/', index);
app.use('/session', sessionRouter);
app.use('/settings', settingsRouter);

// server setup
var server = http.createServer(app);

var u = new mraa.Uart(0); // init uart

models.sequelize.sync({force: true}).then(function () {
	
	seed.run().done(function(setting) {
		var port = setting.port || settings.defaultPort;
		
		server.listen(port, function () {

			console.log('Server started');
		
			var xbee_api = new xbeeAPI.XBeeAPI({
				api_mode: 2
			});

			// init serial;
			var serialport = new SerialPort(u.getDevicePath(), {
               baudrate: 9600,
               parser: xbee_api.rawParser()
            });
			
			// run serial
			serialport.on("open", function() {
			  console.log("port open");
			  var frame_obj = { // AT Request to be sent to  
			    type: xbeeAPIConstants.FRAME_TYPE.AT_COMMAND,
			    command: "NI",
			    commandParameter: [],
			  };
			 
			  serialport.write(xbee_api.buildFrame(frame_obj));
			});
		
			xbee_api.on("frame_object", xbeeCallbackHelper);		
		});
	});
	
});



