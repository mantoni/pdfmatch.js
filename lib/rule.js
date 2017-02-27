'use strict';

const xtend = require('xtend');
const text_match = require('text-match');
const exec = require('./exec');

module.exports = function (rule_config, text, context, config) {
  const match = text_match.matcher(rule_config.match);
  const values = match(text);
  if (values) {
    const vars = xtend(values, context);
    exec(rule_config.command, vars, config);
    return true;
  }
  return false;
};
