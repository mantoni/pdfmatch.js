'use strict';

const rule = require('./rule');

module.exports = function (rules, text, context, config) {
  for (let i = 0; i < rules.length; i++) {
    const rule_config = rules[i];
    if (!rule_config.match) {
      throw new Error('Missing "match" property');
    }
    if (Array.isArray(rule_config.match)) {
      for (let j = 0; j < rule_config.match.length; j++) {
        const match = rule_config.match[j];
        if (rule({
          match,
          command: rule_config.command
        }, text, context, config)) {
          return true;
        }
      }
      return false;
    }
    if (rule(rule_config, text, context, config)) {
      return true;
    }
  }
  return false;
};
