"use strict";

var jshint = require('gulp-jshint');
var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');

// add custom browserify options here
var customOpts = {
  entries: ['./javascripts/main.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

gulp.task('bundle', bundle); // changed from the sample gulpfile. Was 'default'

gulp.task('default', ['bundle', 'lint', 'watch']); //add test?

gulp.task('lint', function() {
  return gulp.src('./javascripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// stretch goal: Make Jasmine and Browserify work together
// gulp.task('test', function() {
//   gulp.src('spec/RobotSpec.js')
//   // gulp-jasmine works on filepaths so you can't have any plugins before it
//   .pipe(jasmine());
// });

gulp.task('watch', function() {
  gulp.watch(['./javascripts/**/*.js'], ['lint', 'bundle']);
});

// Makes watch keep watching even on JS error. Need to learn about gutil
var onError = function ( err ) {
  gutil.log( gutil.colors.green( err.message ) );
  this.emit( 'end' );
};

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist'));
}