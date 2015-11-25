var config = require('./config'),
	express = require('express');
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	flash = require('connect-flash');
	//passport = require('passport');

module.exports = function() {
	var app = express();

	// Set the logging mode
	app.use(morgan(config.logMode));

	// Set if responses should be compressed
	if (config.compress) {
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended : true
	}));

	app.use(bodyParser.json());
	app.use(methodOverride());

	app.use(session({
		saveUninitialized : true,
		resave : true,
		secret : config.sessionSecret
	}));

	app.set('views', './app/views');
	app.set('view engine', 'ejs');

	app.use(flash());
	//app.use(passport.initialize());
	//app.use(passport.session());

	// Required Routes
	require('../app/routes/core.server.routes.js')(app);

	app.use(express.static('./public'));
	return app;
}