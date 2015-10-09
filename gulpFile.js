'use strict';

var concat = require('gulp-concat');
var csslint = require('gulp-csslint');
var csso = require('gulp-csso');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var gulpConfig = require('./gulp.config')();
var jade = require('gulp-jade');
var karma = require('gulp-karma');
var livereload = require('gulp-livereload');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var open = require('gulp-open');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglifyjs');

var applicationJavaScriptFiles,
    applicationCSSFiles,
    applicationTestFiles;

gulp.task('compileJade', ['loadConfig'], function() {
  var outputDir = gulpConfig.modulesDirectory;
  if(process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    outputDir = gulpConfig.htmlDestination;
  }
  var LOCALS = {};
  gulp.src(gulpConfig.jadeFiles)
    .pipe(jade({
      locals: LOCALS
    }))
    .pipe(gulp.dest(outputDir));
  console.log('Jade files compiled to ' + outputDir);
});

gulp.task('csslint', function() {
  gulp.src(['public/modules/**/css/*.css', '!app/bower_components/**/*.css'])
    .pipe(csslint('.csslintrc'))
    .pipe(csslint.reporter());
  });

gulp.task('eslint', function () {
  gulp.src(['public/modules', 'public/modules/**/*.js', 'public/modules/**/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
  });

gulp.task('karma', function () {
  gulp.src(applicationTestFiles)
    .pipe(karma({configFile: 'karma.conf.js', action: 'run'}))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('launchBrowser', ['nodemon'], function () {
  gulp.src('')
    .pipe(open({app: 'Google Chrome', uri: 'http://localhost:3000'}));
});

gulp.task('loadConfig', function() {
  applicationJavaScriptFiles = gulpConfig.jsFiles;
  applicationCSSFiles = gulpConfig.cssFiles;
  applicationTestFiles = gulpConfig.jsFiles.concat(gulpConfig.jsFiles, gulpConfig.testFiles);
});

gulp.task('minifyCss', function () {
  gulp.src(applicationCSSFiles)
     .pipe(concat('application.css'))
     .pipe(csso())
     .pipe(rename('application.min.css'))
     .pipe(gulp.dest('public/dist'));
  });

gulp.task('mochaTest', function () {
  process.env.NODE_ENV = 'test';
  gulp.src(['server.js', 'app/tests/**/*.js'])
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('nodemon', function () {
  nodemon({ script: 'server.js', env: { 'NODE_ENV': 'development' }})
    .on('restart');
});

gulp.task('transpileSass', function() {
  gulp.src(gulpConfig.sassFile)
    //.pipe($.sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(sass({sourceComments: true}))
    .pipe(sass().on('error', sass.logError))
    //.pipe($.sourcemaps.write())
    .pipe(gulp.dest(gulpConfig.cssDestination));
  console.log('Sass Transpiled to ' + gulpConfig.cssDestination);
  });

gulp.task('uglify', function() {
  gulp.src(applicationJavaScriptFiles)
    .pipe(uglify('application.min.js', {outSourceMap: true}))
    .pipe(gulp.dest('public/dist'));
});

gulp.task('watch', function() {
  var server = livereload();
  gulp.watch(['gulpFile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/**/*.js', 'public/modules/**/*.js'], ['eslint']);
  gulp.watch(['public/**/css/*.css'], ['csslint']);
  gulp.watch(gulpConfig.sassComponents.concat(gulpConfig.sassComponents, gulpConfig.sassFile), ['transpileSass']);
  gulp.watch(gulpConfig.jadeFiles, ['compileJade']);
  gulp.watch(['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js', 'public/modules/**/views/*.html', 'public/js/**/*.js', 'public/modules/**/*.js', 'public/**/css/*.css']).on('change', function(file) {
    server.changed(file.path);
  });
});

// Default task(s).
gulp.task('default', ['compileJade', 'transpileSass', 'lint', 'watch', 'launchBrowser']);

// Lint task(s).
gulp.task('lint', ['eslint', 'csslint']);

// Build task(s).
gulp.task('build', ['loadConfig', 'uglify', 'minifyCss']);

// Test task.
gulp.task('test', ['loadConfig', 'mochaTest', 'karma']);
