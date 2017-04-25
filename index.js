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
  var userOptions = options || {};
  var configFile = userOptions.configFile;

  var compile = through.obj(function (file, encoding, cb) {

    if (file.isNull()) {
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    // load our config from sassLint and the user provided options if available
    file.sassConfig = lint.getConfig(userOptions, configFile);
    // save the config file within the file object for access when this file is piped around
    file.userOptions = userOptions;
    file.configFile = configFile;

    // lint the file and pass the user defined options and config path to sass lint to handle
    try {
      file.sassLint = [
        lint.lintFileText({
          'text': file.contents,
          'format': path.extname(file.path).replace('.', ''),
          'filename': path.relative(process.cwd(), file.path)
        }, userOptions, configFile)];
    } catch(e) {
      this.emit('error', new PluginError(PLUGIN_NAME, e.message));
    }

    this.push(file);
    cb();
  });
  return compile;
}

sassLint.format = function (writable) {
  var compile = through.obj(function (file, encoding, cb) {
    if (file.isNull()) {
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (writable) {
      var result = lint.format(file.sassLint, file.userOptions, file.configFile);
      writable.write(result);
    }
    else {
      lint.outputResults(file.sassLint, file.userOptions, file.configFile);
    }

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
      const indent = '    ';
      const newline = `\n${indent.repeat(2)}- `;
      errorMessage = filesWithErrors.map(file => {
        const count = file.sassLint[0].errorCount;
        return `${count} error${count > 1 ? 's' : ''} detected in ` +
          file.relative + newline +
          file.sassLint[0].messages.map(m => m.message).join(newline);
      }).join(`\n${indent}`);

      this.emit('error', new PluginError(PLUGIN_NAME, errorMessage));
    }

    cb();
  });

  return compile;
}

module.exports = sassLint;
