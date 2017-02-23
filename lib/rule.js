'use strict';

const xtend = require('xtend');
const text_match = require('text-match');
const exec = require('./exec');

module.exports = function (config, text, context, argv) {
  const match = text_match.matcher(config.match);
  const values = match(text);
  if (values) {
    const vars = xtend(values, context);
    exec(config.command, vars, argv);
    return true;
  }
  return false;
};
