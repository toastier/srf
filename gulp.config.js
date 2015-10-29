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
  var modulesDir = clientApp + 'modules/';
  var controllers = modulesDir + '**/*.client.controller.js';
  var configs = modulesDir + '**/config/*.client.config.js';
  var routes = modulesDir + '**/config/*.client.routes.js';
  var tests = modulesDir + '**/tests/*.client.**.test.js';
  var filters = modulesDir + '**/filters/*.filters.js';
  var directives = modulesDir + '**/directives/*.directives.js';
  var services = modulesDir + '**/services/*.client.service.js';
  var cssFiles = modulesDir + ['core/css/*.css', 'core/css/*.*.css'];
  var sassFile = modulesDir + 'core/scss/dashboard-style.scss';
  var sassComponents = [ modulesDir + 'core/scss/duson/_*.scss', modulesDir + 'core/scss/local-styles.scss'];
  var cssDestination = modulesDir + 'core/css/';
  var jadeFiles = [
    modulesDir + '**/views/*.jade',
    modulesDir + '**/partials/*.jade',
    modulesDir + '**/views/partials/*.jade',
    modulesDir + '**/directives/*.jade',
    modulesDir + '**/directives/partials/*.jade'
  ];
  var htmlDest = dist + 'html/';
  var htmlTemplates = [ modulesDir + '**/views/*.client.view.html'];

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
    modulesDirectory: modulesDir,
    sassComponents: sassComponents,
    sassFile: sassFile,
    serverFile: root + 'server.js',
    testFiles: [tests]
  };
};