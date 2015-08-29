# Gulp Sass Lint [![npm version](https://badge.fury.io/js/gulp-sass-lint.svg)](http://badge.fury.io/js/gulp-sass-lint)

[Gulp](http://gulpjs.com/) plugin for [Sass Lint](https://github.com/sasstools/sass-lint).

## Install

```
npm install gulp-sass-lint --save-dev
```

## Using

```javascript
'use strict';

var gulp = require('gulp'),
    sassLint = require('gulp-sass-lint');

gulp.task('default', function () {
  gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});
```
