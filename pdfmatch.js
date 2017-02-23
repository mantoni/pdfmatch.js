#!/usr/bin/env node
'use strict';

const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2), {
  boolean: ['debug'],
  string: ['l', 'config']
});
const moment = require('moment');
const tesseract = require('./lib/tesseract');
const pdftotext = require('./lib/pdftotext');
const rules = require('./lib/rules');
const exec = require('./lib/exec');

const cwd = process.cwd();
const config = argv.config || `${cwd}/pdfmatch.json`;

function processText(file, json) {
  pdftotext(file, (err, text) => {
    if (err) {
      throw err;
    }
    if (argv.debug) {
      console.log(text);
    }

    const now = moment();
    const context = { file, now };
    if (rules(json.rules, text, context, argv)) {
      return;
    }

    const no_match_command = json['no-match'];
    if (no_match_command) {
      exec(no_match_command, context, argv);
      return;
    }
    console.error('No match');
    process.exitCode = 1;
  });
}

fs.readFile(config, 'utf8', (err, content) => {
  if (err) {
    throw err;
  }

  const json = JSON.parse(content);
  const file = argv._[0];

  if (argv.debug || file.endsWith('.pdf')) {
    processText(file, json);
    return;
  }

  tesseract(argv, json, (err) => {
    if (err) {
      throw err;
    }
    processText(file, json);
  });

});
