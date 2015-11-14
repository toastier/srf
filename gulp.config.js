'use strict';

module.exports = function () {
  var client = './public/';
  var server = './app/';
  var report = './report/';
  var root = './';
  var specRunnerFile = 'specs.html';
  var temp = './.tmp/';
  var wiredep = require('wiredep');
  var bowerFiles = wiredep({devDependencies: true})['js'];
  var nodeModules = 'node_modules';
  var bower = {
    json: require('./bower.json'),
    directory: client + 'lib/',
    ignorePath: '../..'
  };
  var sass = client + 'modules/core/scss/';
  var serverHtml = server + 'views/';

  var config = {
    alljs: [
      server + '**/*.js',
      client + 'modules/' + '**/*.js',
      '!' + client + '**/*.spec.js',
      '!' + client + '**/*.test.js',
      '!' + client + 'dist/**.**',
      '!' + bower.directory + '**/**'
    ],
    angularModules: client + 'modules/',
    build: './build/',
    client: client,
    css: client + 'modules/core/css/',
    cssDestination: client + 'modules/core/css/',
    fonts: bower.directory + 'font-awesome/fonts/**/*.*',
    html: client + '**/*.html',
    htmlTemplates: client + '**/*.html',
    images: client + 'images/**/*.*',
    serverHtml: serverHtml,
    index: serverHtml + 'index.server.view.html',
    jadeFiles: [
      client + 'modules/**/*.jade',
      client + 'modules/**/**/*.jade'
    ],
    // client js, with no specs, tests, or bower dependencies
    js: [
      client + '**/*.module.js',
      client + '**/*.js',
      '!' + client + '**/*.spec.js',
      '!' + client + '**/*.test.js',
      '!' + client + 'dist/**.**',
      '!' + bower.directory + '**/**'
    ],
    // glob pattern for ordering the client side application code (not the bower stuff, which is done my wiredep)
    jsOrder: [
      '**/config.js',
      '**/application.js',
      '**/core/**.module.js',
      '**/**.module.js',
      '**/*.js'
    ],
    report: report,
    root: root,
    sass: sass,
    sassBaseFile: sass + 'dashboard-style.scss',
    scssFiles: [
      sass + '*.scss',
      sass + '**/*.scss'
    ],
    server: server,
    stubsJs: [
      bower.directory + 'angular-mocks/angular-mocks.js',
      client + 'stubs/**/*.js'
    ],
    temp: temp,
    optimized: {
      app: 'app.js',
      lib: 'lib.js'
    },
    plato: {js: client + '**/*.js'},
    browserReloadDelay: 1000,
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'core',
        root: '',
        standalone: false
      }
    },
    /**
     * Bower and NPM files
     */
    bower: bower,
    packages: [
      './package.json',
      './bower.json'
    ],
    specRunner: client + specRunnerFile,
    specRunnerFile: specRunnerFile,
    /**
     * The sequence of the injections into specs.html:
     *  1 testlibraries
     *      mocha setup
     *  2 bower
     *  3 js
     *  4 spechelpers
     *  5 specs
     *  6 templates
     */
    testLibraries: [
      nodeModules + '/mocha/mocha.js',
      nodeModules + '/chai/chai.js',
      nodeModules + '/sinon-chai/lib/sinon-chai.js'
    ],
    specHelpers: [client + 'test-helpers/*.js'],
    specs: [client + '**/*.spec.js'],
    serverIntegrationSpecs: [client + '/tests/server-integration/**/*.spec.js'],

    /**
     * Node settings
     */
    nodeServer: 'server.js',
    defaultPort: '8001',
    nodemonWatch: ['app/**/*.js', 'config/**/*.js']
  };

  /**
   * wiredep and bower settings
   */
  config.getWiredepDefaultOptions = function () {
    var options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath + '/public'
    };
    return options;
  };

  /**
   * karma settings
   */
  config.karma = getKarmaOptions();

  return config;

  function getKarmaOptions() {
    var options = {
      files: [].concat(
        bowerFiles,
        config.specHelpers,
        client + '**/*.module.js',
        client + '**/*.js',
        temp + config.templateCache.file,
        config.serverIntegrationSpecs
      ),
      exclude: [],
      coverage: {
        dir: report + 'coverage',
        reporters: [
          // reporters not supporting the `file` property
          {type: 'html', subdir: 'report-html'},
          {type: 'lcov', subdir: 'report-lcov'},
          {type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
        ]
      },
      preprocessors: {}
    };
    options.preprocessors[client + '**/!(*.spec)+(.js)'] = ['coverage'];
    return options;
  }
};
