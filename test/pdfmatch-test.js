/*eslint-env mocha*/
/*eslint-disable no-sync*/
'use strict';

const assert = require('assert');
const sinon = require('sinon');
const child_process = require('child_process');
const pdfmatch = require('..');

describe('API', () => {
  const pdftotext_flags = '-q -nopgbrk -layout -eol unix -enc UTF-8';
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(child_process, 'execSync');
    sandbox.stub(child_process, 'exec');
    sandbox.stub(console, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('exposes ENOMATCH', () => {
    assert.equal(pdfmatch.ENOMATCH, 'ENOMATCH');
  });

  describe('processText', () => {

    it('calls pdftotext and responds with "ENOMATCH"', () => {
      const spy = sinon.spy();

      pdfmatch.processText('some.pdf', { rules: [] }, spy);

      sinon.assert.calledOnce(child_process.exec);
      sinon.assert.calledWith(child_process.exec,
        `pdftotext ${pdftotext_flags} some.pdf -`);

      child_process.exec.yield(null, new Buffer(''));

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, sinon.match({
        name: 'Error',
        code: pdfmatch.ENOMATCH
      }));
    });

    it('escapes blanks in pdf path', () => {
      pdfmatch.processText('some path to.pdf', { rules: [] }, () => {});

      sinon.assert.calledOnce(child_process.exec);
      sinon.assert.calledWith(child_process.exec,
        `pdftotext ${pdftotext_flags} some\\ path\\ to.pdf -`);
    });

    it('escapsed blanks in "file" context property for commands', () => {
      pdfmatch.processText('some path to.pdf', {
        rules: [{
          match: {
            what: 'text'
          },
          command: 'echo "Matched ${what} in ${file}"'
        }]
      }, () => {});

      child_process.exec.yield(null, new Buffer('some text to match'));

      sinon.assert.calledOnce(child_process.execSync);
      sinon.assert.calledWith(child_process.execSync,
        'echo "Matched text in some\\ path\\ to.pdf"');
    });

  });

  describe('processImage', () => {

    it('calls tesseract and responds with "ENOMATCH"', () => {
      const spy = sinon.spy();

      pdfmatch.processImage('some.tif', 'some.pdf', {
        lang: 'eng',
        rules: []
      }, spy);

      sinon.assert.calledOnce(child_process.exec);
      sinon.assert.calledWith(child_process.exec,
        'tesseract -l eng some.tif some pdf');

      child_process.exec.firstCall.yield(null);

      sinon.assert.calledWith(child_process.exec,
        `pdftotext ${pdftotext_flags} some.pdf -`);

      child_process.exec.secondCall.yield(null, new Buffer(''));

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, sinon.match({
        name: 'Error',
        code: pdfmatch.ENOMATCH
      }));
    });

    it('escapes blanks in image path before passing to tesseract', () => {
      pdfmatch.processImage('some path to.tif', 'some.pdf', {
        lang: 'eng',
        rules: []
      }, () => {});

      sinon.assert.calledOnce(child_process.exec);
      sinon.assert.calledWith(child_process.exec,
        'tesseract -l eng some\\ path\\ to.tif some pdf');
    });

    it('escapes blanks in PDF path before passing to tesseract', () => {
      pdfmatch.processImage('some.tif', 'some path to.pdf', {
        lang: 'eng',
        rules: []
      }, () => {});

      sinon.assert.calledOnce(child_process.exec);
      sinon.assert.calledWith(child_process.exec,
        'tesseract -l eng some.tif some\\ path\\ to pdf');
    });

    it('escapes blanks in PDF path before passing to pdftotext', () => {
      pdfmatch.processImage('some.tif', 'some path to.pdf', {
        lang: 'eng',
        rules: []
      }, () => {});
      child_process.exec.firstCall.yield(null);

      sinon.assert.calledWith(child_process.exec,
        `pdftotext ${pdftotext_flags} some\\ path\\ to.pdf -`);
    });

  });

});
