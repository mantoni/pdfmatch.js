'use strict';

const child_process = require('child_process');

module.exports = function (source_file, callback) {
  if (!source_file) {
    throw new Error('Missing source file');
  }
  const file = source_file.replace(/ /g, '\\ ');
  const flags = '-q -nopgbrk -layout -eol unix -enc UTF-8';
  const command = `pdftotext ${flags} ${file} -`;
  child_process.exec(command, (err, buffer) => {
    if (err) {
      callback(err);
      return;
    }
    const text = buffer.toString('utf8');
    callback(null, text.replace(/[ ]{2,}/g, ' '));
  });
};
