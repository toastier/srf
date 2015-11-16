'use strict';

module.exports = function () {
  var clientSource = './src/';
  var server = './app/';
  var report = './report/';
  var root = './';
  var specRunnerFile = 'specs.html';
  var temp = clientSource + '.tmp/';
  var wiredep = require('wiredep');
  var bowerFiles = wiredep({devDependencies: true})['js'];
  var nodeModules = 'node_modules';
  var bower = {
    json: require('./bower.json'),
    directory: clientSource + 'lib/',
    ignorePath: '../..'
  };
  var sass = clientSource + 'scss/';

  var config = {
    alljs: [
      server + '**/*.js',
      clientSource + 'modules/' + '**/*.js',
      '!' + clientSource + '**/*.spec.js',
      '!' + clientSource + '**/*.test.js',
      '!' + clientSource + 'dist/**.**',
      '!' + bower.directory + '**/**'
    ],
    angularModules: clientSource + 'modules/',
    bower: bower,
    browserReloadDelay: 1000,
    clientSource: clientSource,
    defaultPort: '8001',
    dist: './dist/',
    fonts: bower.directory + 'font-awesome/fonts/**/*.*',
    html: clientSource + '**/*.html',
    htmlTemplates: clientSource + '**/*.html',
    images: clientSource + 'img/**/*.*',
    index: clientSource + 'index.html',
    jadeFiles: [
      clientSource + 'index.jade',
      clientSource + 'modules/**/*.jade',
      clientSource + 'modules/**/**/*.jade',
      '!' + clientSource + 'lib/'
    ],
    // clientSource js, with no specs, tests, or bower dependencies
    js: [
      clientSource + '**/*.module.js',
      clientSource + '**/*.js',
      '!' + clientSource + '**/*.spec.js',
      '!' + clientSource + '**/*.test.js',
      '!' + clientSource + 'dist/**.**',
      '!' + bower.directory + '**/**'
    ],
    // glob pattern for ordering the clientSource side application code (not the bower stuff, which is done my wiredep)
    jsOrder: [
      '**/config.js',
      '**/application.js',
      '**/core/**.module.js',
      '**/**.module.js',
      '**/*.js'
    ],
    optimized: {
      app: 'app.js',
      lib: 'lib.js'
    },
    nodeServer: 'server.js',
    packages: [
      './package.json',
      './bower.json'
    ],
    plato: {js: clientSource + '**/*.js'},
    specRunner: clientSource + specRunnerFile,
    specRunnerFile: specRunnerFile,
    report: report,
    root: root,
    sass: sass,
    sassBaseFile: sass + 'dashboard-style.scss',
    scssFiles: [
      sass + '*.scss',
      sass + '**/*.scss'
    ],
    server: server,
    serverIntegrationSpecs: [clientSource + '/tests/server-integration/**/*.spec.js'],
    specHelpers: [clientSource + 'test-helpers/*.js'],
    specs: [clientSource + '**/*.spec.js'],
    stubsJs: [
      bower.directory + 'angular-mocks/angular-mocks.js',
      clientSource + 'stubs/**/*.js'
    ],
    styles: clientSource + 'styles/',
    temp: temp,
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'core',
        root: '',
        standalone: false
      }
    },
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
    ]
  };

  /**
   * wiredep and bower settings
   */
  config.getWiredepDefaultOptions = function () {
    var options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath + '/src'
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
        clientSource + '**/*.module.js',
        clientSource + '**/*.js',
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
    options.preprocessors[clientSource + '**/!(*.spec)+(.js)'] = ['coverage'];
    return options;
  }
};
