'use strict';

const rule = require('./rule');

module.exports = function (rules, text, context, argv) {
  for (let i = 0; i < rules.length; i++) {
    const config = rules[i];
    if (!config.match) {
      throw new Error('Missing "match" property');
    }
    if (Array.isArray(config.match)) {
      for (let j = 0; j < config.match.length; j++) {
        const match = config.match[j];
        if (rule({ match, command: config.command }, text, context, argv)) {
          return true;
        }
      }
      return false;
    }
    if (rule(config, text, context, argv)) {
      return true;
    }
  }
  return false;
};
