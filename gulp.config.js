'use strict';

//@todo modify to pull any shared path/file info from config/*

var init = require('./config/init')();
var config = require('./config/config');

module.exports = function () {

  var root = './';
  var serverApp = root + 'app/';
  var appConfig = root + 'config/';
  var clientApp = root + 'public/';
  var dist = clientApp + 'dist/';
  var libraries = clientApp + 'lib/';
  var modules = clientApp + 'modules/';
  var controllers = modules + '**/*.client.controller.js';
  var configs = modules + '**/config/*.client.config.js';
  var routes = modules + '**/config/*.client.routes.js';
  var tests = modules + '**/tests/*.client.**.test.js';
  var filters = modules + '**/filters/*.filters.js';
  var directives = modules + '**/directives/*.directives.js';
  var services = modules + '**/services/*.client.service.js';
  var cssFiles = modules + ['core/css/*.css', 'core/css/*.*.css'];
  var sassFile = modules + 'core/scss/dashboard-style.scss';
  var sassComponents = [ modules + 'core/scss/duson/_*.scss', modules + 'core/scss/local-styles.scss'];
  var cssDestination = modules + 'core/css/';
  var jadeFiles = [
    modules + '**/views/*.client.view.jade',
    modules + '**/views/partials/*.client.partial.jade',
    modules + '**/directives/*.client.partial.jade',
    modules + '**/directives/partials/*.client.partial.jade'
  ];
  var htmlDest = dist + 'html/';
  var htmlTemplates = [ modules + '**/views/*.client.view.html'];

  return {
    appConfigJs: appConfig + '**/*.js',
    bower: {
      json: require(root + 'bower.json'),
      directory: libraries,
      excludeFromWiredep: libraries + 'bootstrap/dist/css/bootstrap.css'
    },
    buildDir: root + dist,
    cssDestination: cssDestination,
    cssFiles: cssFiles,
    gulpFile: root + 'gulpFile.js',
    htmlDestination: htmlDest,
    htmlTemplates: htmlTemplates,
    jadeFiles: jadeFiles,
    jsFiles: [
      configs,
      routes,
      controllers,
      services,
      directives,
      filters
    ],
    modulesDirectory: modules,
    sassComponents: sassComponents,
    sassFile: sassFile,
    serverFile: root + 'server.js',
    testFiles: [tests]
  };
};