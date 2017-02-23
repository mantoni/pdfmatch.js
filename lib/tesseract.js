'use strict';

const child_process = require('child_process');

module.exports = function (lang, source_file, target_file, callback) {
  source_file = source_file.replace(/ /g, '\\ ');
  if (!target_file.endsWith('.pdf')) {
    throw new Error('Target file must have extension .pdf');
  }
  target_file = target_file.replace(/ /g, '\\ ');
  target_file = target_file.substring(0, target_file.length - 4);
  const command = `tesseract -l ${lang} ${source_file} ${target_file} pdf`;
  child_process.exec(command, callback);
};
