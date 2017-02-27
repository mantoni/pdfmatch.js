#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const pdfmatch = require('./lib/pdfmatch');

const argv = minimist(process.argv.slice(2), {
  boolean: ['debug', 'delete'],
  string: ['l', 'config']
});
const config = argv.config || `${process.cwd()}/pdfmatch.json`;

fs.readFile(config, 'utf8', (err, content) => {
  if (err) {
    throw err;
  }

  const json = JSON.parse(content);
  const file = argv._[0];
  if (!file) {
    throw new Error('No file specified');
  }

  // Override debug with `--debug` or default to false:
  json.debug = argv.debug || json.debug || false;

  if (file.endsWith('.pdf')) {
    pdfmatch.processText(file, json, (err) => {
      if (err) {
        throw err;
      }
    });
    return;
  }

  let target_file = argv._[1];
  if (!target_file) {
    target_file = file.substring(0, file.length - path.extname(file).length);
    target_file = `${target_file}.pdf`;
  }

  // Override lang with `-l` or default to "eng":
  json.lang = argv.l || json.lang || 'eng';

  pdfmatch.processImage(file, target_file, json, (err) => {
    if (err) {
      if (err.code === pdfmatch.ENOMATCH) {
        console.error('No match');
        process.exitCode = 1;
        return;
      }
      throw err;
    }
    if (argv.delete) {
      fs.unlink(file, (err) => {
        if (err) {
          throw err;
        }
      });
    }
  });
});
