var config = require('./config'),
	express = require('express');
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	consolidate = require('consolidate'),
	passport = require('passport'),
	helmet = require('helmet'),
	http = require('http'),
	socketio = require('socket.io');

module.exports = function() {
	var app = express();
	var server = http.createServer(app);
	var io = socketio.listen(server);

	/*
	 * Enable morgan as the logging module; set the configured logging mode
	 */
	app.use(morgan(config.logMode));

	/*
	 * Turn on gzip compression of responses (if enabled in config).
	 * This should always be above any express.static declaration.
	 */
	if (config.compress) {
	    app.use(compress());
	}

	/*
	 * Add body-parser middleware to handle parsing of encoded URLs
	 * and JSON bodies. The parsed body is then available on the 
	 * req.body object. Then add methodOverride middleware to support
	 * clients that don't support HTTP verbs like PUT or DELETE.
	 */
	app.use(bodyParser.urlencoded({
	    extended : true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	/**
	 * Configure the Express session
	 * TODO: Once HTTPS is configured, should set cookie options and have 
	 *       secure:true. Then if behind a proxy (NGINX), will need to
	 *       also set app.set('trust proxy', 1). Should also revisit if
	 *       a maxAge and httpOnly is needed. Right now default to keeping
	 *       things lax.
	 */
	app.use(session({
	    saveUninitialized : true,
	    resave : true,
	    name : 'sessionId',
	    secret : config.sessionSecret
	}));

	/*
	 * Initialize Passport and use it to handle user sessions
	 */
	app.use(passport.initialize());
	app.use(passport.session());

	/*
	 * Set SWIG as the template engine that this app uses.
	 * Then set the view engine and location of templates (views)
	 */
	app.engine('server.view.html', consolidate['swig']);
	app.set('view engine', 'server.view.html');
	app.set('views', './app/views');

	/*
	 * Use helmet to handle various security concerns. But only use a
	 * subset of the nine middlewares included with helmet.
	 * 
	 * These are NOT being used...
	 *   - contentSecurityPolicy: No ready to configure this yet
	 *   - hsts: Not ready to enforce total HTTPS yet
	 *   - hpkp: Not ready to enforce and configure HTTPS yet
	 *   - noCache: Caching is good. Performance matters
	 * TODO: Revisit using some of these when HTTPS enabled.
	 */
	app.use(helmet.hidePoweredBy());
	app.use(helmet.ieNoOpen());
	app.use(helmet.noSniff());
	app.use(helmet.frameguard());
	app.use(helmet.xssFilter());

	/*
	 * Configure static routes for files to serve
	 */
	app.use(express.static('./public'));

	/*
	 * Add all routes for this application 
	 */
	require('../app/routes/core.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);
	require('../app/routes/groups.server.routes.js')(app);
	require('../app/routes/locationShares.server.routes.js')(app);

	/*
	 * Setup an custom error handler
	 */
	app.use(function(err, req, res, next) {
		// If the error object doesn't exist...
		if (!err) return next();

		// Log the error, then show error page
		console.error(err.stack);
		res.status(500).render('500', {});
	});

	/*
	 * If no other middleware has responsed to the request
	 * by this point, then return 404 Not Found.
	 */
	app.use(function(req, res) {
		res.status(404).render('404', {});
	});

	/*
	 * Initialize the Socket.io configuration
	 */
	require('./socketio')(server, io);

	return server;
}