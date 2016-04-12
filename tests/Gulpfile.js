'use strict';

var gulp = require('gulp'),
    lint = require('../index');

gulp.task('default', function () {
  gulp.src(['sass/foo.scss', 'sass/bar/baz.sass'])
    .pipe(lint())
    .pipe(lint.format())
    .pipe(lint.failOnError())
});

/**
 * If test pulls in config from default location, 
 * it will fail with an error. If it correctly uses the 
 * custom location, it will only show warnings.
 */
gulp.task('testCustomConfigLocation', function () {
  gulp.src('sass/custom-config.scss')
    .pipe(lint('./config/sasslint-config.yml'))
    .pipe(lint.format())
    .pipe(lint.failOnError())
});