# Gulp Sass Lint [![npm version](https://badge.fury.io/js/gulp-sass-lint.svg)](http://badge.fury.io/js/gulp-sass-lint)

[Gulp](http://gulpjs.com/) plugin for [Sass Lint](https://github.com/sasstools/sass-lint/tree/playground).

### Sample

```javascript
'use strict';

var gulp = require('gulp'),
    lint = require('../index');

gulp.task('default', function () {
  gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(lint())
    .pipe(lint.formatResults())
    .pipe(lint.failOnError())
});
```
