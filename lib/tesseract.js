'use strict';

const child_process = require('child_process');

module.exports = function (argv, config, callback) {
  const lang = argv.l || config.lang || 'eng';
  const source_file = argv._[0];
  if (!source_file) {
    throw new Error('Missing source file');
  }
  let target_file = argv._[1];
  if (!target_file) {
    throw new Error('Missing target file');
  }
  if (!target_file.endsWith('.pdf')) {
    throw new Error('Target file must have suffix .pdf');
  }
  target_file = target_file.substring(0, target_file.length - 4);
  const command = `tesseract -l ${lang} ${source_file} ${target_file} pdf`;
  child_process.exec(command, callback);
};
