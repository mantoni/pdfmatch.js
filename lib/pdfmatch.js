'use strict';

const moment = require('moment');
const pdftotext = require('./pdftotext');
const rules = require('./rules');
const exec = require('./exec');
const tesseract = require('./tesseract');

const ENOMATCH = 'ENOMATCH';

exports.ENOMATCH = ENOMATCH;

exports.processText = function (pdf_file, config, callback) {
  pdftotext(pdf_file, (err, text) => {
    if (err) {
      callback(err);
      return;
    }
    if (config.debug) {
      console.log(text);
    }

    const now = moment();
    const context = { file: pdf_file.replace(/ /g, '\\ '), now };
    if (rules(config.rules, text, context, config)) {
      callback(null);
      return;
    }

    const no_match_command = config['no-match'];
    if (no_match_command) {
      exec(no_match_command, context, config);
      callback(null);
      return;
    }

    const no_match = new Error('No match');
    no_match.code = ENOMATCH;
    callback(no_match);
  });
};

exports.processImage = function (image_file, pdf_file, config, callback) {
  tesseract(image_file, pdf_file, config, (err) => {
    if (err) {
      callback(err);
      return;
    }
    exports.processText(pdf_file, config, callback);
  });
};
