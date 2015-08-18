'use strict';

var gulp = require('gulp'),
    lint = require('../index');

gulp.task('default', function () {
  gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(lint())
    .pipe(lint.formatResults())
    .pipe(lint.failOnError())
});