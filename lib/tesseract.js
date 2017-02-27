'use strict';

const child_process = require('child_process');

module.exports = function (image_file, pdf_file, config, callback) {
  image_file = image_file.replace(/ /g, '\\ ');
  if (!pdf_file.endsWith('.pdf')) {
    throw new Error('Target file must have extension .pdf');
  }
  pdf_file = pdf_file.replace(/ /g, '\\ ');
  pdf_file = pdf_file.substring(0, pdf_file.length - 4);
  const command = `tesseract -l ${config.lang} ${image_file} ${pdf_file} pdf`;
  child_process.exec(command, callback);
};
