var config = require('./config'),
	express = require('express');
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	consolidate = require('consolidate'),
	passport = require('passport');

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

	// Set swig as the template engine
	app.engine('server.view.html', consolidate['swig']);

	// Set views path and view engine
	app.set('view engine', 'server.view.html');
	app.set('views', './app/views');

	app.use(passport.initialize());
	app.use(passport.session());

	// Required Routes
	require('../app/routes/core.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);
	require('../app/routes/groups.server.routes.js')(app);

	app.use(express.static('./public'));

	// Setup an custom error handler
	app.use(function(err, req, res, next) {
		// If the error object doesn't exist...
		if (!err) return next();

		// Log the error, then show error page
		console.error(err.stack);
		res.status(500).render('500', {});
	});

	// If no other middleware has responsed to the request
	// by this point, then return 404 Not Found.
	app.use(function(req, res) {
		res.status(404).render('404', {});
	});

	return app;
}