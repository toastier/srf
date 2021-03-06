'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  helmet = require('helmet'),
  passport = require('passport'),
  mongoStore = require('connect-mongo')({
    session: session
  }),
  flash = require('connect-flash'),
  config = require('./config'),
  consolidate = require('consolidate'),
  path = require('path');
var nodemailer = require('nodemailer');
var crypto = require('crypto');

module.exports = function (db) {
  // Initialize express app
  var app = express();
  var staticFolder = './src';

  // Globbing model files
  config.getGlobbedFiles('./app/models/**/*.js').forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });

  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords = config.app.keywords;

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.url = req.protocol + ':// ' + req.headers.host + req.url;
    next();
  });

  // Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Showing stack errors
  app.set('showStackError', true);

  // Set swig as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './app/views');

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Enable logger (morgan)
    //app.use(morgan('dev'));

    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    staticFolder = './dist';
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Enable jsonp
  app.enable('jsonp callback');

  // CookieParser should be above session
  app.use(cookieParser());

  // Express MongoDB session storage
  app.use(session({
    secret: config.sessionSecret,
    store: new mongoStore({
      db: db.connection.db,
      collection: config.sessionCollection
    })
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // connect flash for flash messages
  app.use(flash());

  // Use helmet to secure Express headers
  app.use(helmet.xframe());
  app.use(helmet.iexss());
  app.use(helmet.contentTypeOptions());
  app.use(helmet.ienoopen());
  app.disable('x-powered-by');

  // Setting the app router and static folder
  app.use(express.static(path.resolve(staticFolder)));

  // Globbing routing files
  config.getGlobbedFiles('./app/routes/**/*.js').forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });

  app.use(logErrors);
  app.use(clientErrorHandler);

  function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
  }

  function clientErrorHandler(err, req, res, next) {
    var message = err.message || 'Internal Server Error';
    var status = err.status || 500;
    res.jsonp(status, {
      message: message
    });
  }

  // Assume 404 since no middleware responded
  app.use(function (req, res) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not Found'
    });
  });

  return app;
};
