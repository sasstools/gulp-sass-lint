//////////////////////////////
// Sass Lint
//  - A Gulp Plugin
//
// Lints Sass files
//////////////////////////////
'use strict';

//////////////////////////////
// Variables
//////////////////////////////
var through = require('through2'),
    gutil = require('gulp-util'),
    lint = require('sass-lint'),
    path = require('path'),
    PluginError = gutil.PluginError,
    PLUGIN_NAME = 'sass-lint';

//////////////////////////////
// Export
//////////////////////////////
var sassLint = function (options) {
  options = options || {};
  var compile = through.obj(function (file, encoding, cb) {
    var config;
    if (file.isNull()) {
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    config = lint.getConfig(options);

    file.sassConfig = config;

    try {
      file.sassLint = [lint.lintText({
        'text': file.contents,
        'format': path.extname(file.path).replace('.', ''),
        'filename': path.relative(process.cwd(), file.path)
      }, config)];
    } catch(e) {
      this.emit('error', new PluginError(PLUGIN_NAME, e.message));
    }
    
    this.push(file);
    cb();
  });
  return compile;
}

sassLint.format = function () {
  var compile = through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    lint.outputResults(file.sassLint, file.sassConfig);

    this.push(file);
    cb();
  });
  return compile;
}

sassLint.failOnError = function () {
  var filesWithErrors = [];
  var compile = through({objectMode: true}, function (file, encoding, cb) {
    if (file.isNull()) {
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.sassLint[0].errorCount > 0) {
      filesWithErrors.push(file);
    }

    this.push(file);
    cb();
  }, function (cb) {
    var errorMessage;

    if (filesWithErrors.length > 0) {
      errorMessage = filesWithErrors.map(function (file) {
        return file.sassLint[0].errorCount + ' errors detected in ' + file.relative
      }).join('\n');

      this.emit('error', new PluginError(PLUGIN_NAME, errorMessage));
    }

    cb();
  });

  return compile;
}

module.exports = sassLint;
