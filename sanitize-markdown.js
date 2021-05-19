'use strict';

var she = require('./she');
var assign = require('assignment');
var parser = require('./parser');
var sanitizer = require('./sanitizer');
var defaults = require('./defaults');

function sanitizeMarkdown (html, options, strict) {
  var buffer = [];
  var configuration = strict === true ? options : assign({}, defaults, options);
  var handler = sanitizer(buffer, configuration);

  parser(html, handler);

  return buffer.join('');
}

sanitizeMarkdown.defaults = defaults;
module.exports = sanitizeMarkdown;
