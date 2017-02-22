/*eslint-env mocha*/
/*eslint-disable no-sync*/
'use strict';

const assert = require('assert');
const child_process = require('child_process');
const sinon = require('sinon');
const rules = require('../lib/rules');

describe('rules', () => {
  const context = { source_file: 'source.txt', target_file: 'target.pdf' };
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(child_process, 'execSync');
    sandbox.stub(console, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns false if no match', () => {
    const matched = rules({
      rules: [{
        match: { some: 'Other ${WORD}' }
      }]
    }, 'Some thingy', context);

    assert.equal(matched, false);
  });

  it('matches single match', () => {
    const matched = rules([{
      match: { some: 'Some ${WORD}' },
      command: 'echo "Found ${some}"'
    }], 'Some thingy', context);

    assert.equal(matched, true);
    sinon.assert.calledOnce(child_process.execSync);
    sinon.assert.calledWith(child_process.execSync, 'echo "Found thingy"');
  });

  it('attempts to match multiple matches', () => {
    const matched = rules([{
      match: [{ some: 'Other ${WORD}' }, { some: 'Some ${WORD}' }],
      command: 'echo "Found ${some}"'
    }], 'Some thingy', context);

    assert.equal(matched, true);
    sinon.assert.calledOnce(child_process.execSync);
    sinon.assert.calledWith(child_process.execSync, 'echo "Found thingy"');
  });

  it('does not execute the command if --debug is given', () => {
    const matched = rules([{
      match: [{ some: 'Other ${WORD}' }, { some: 'Some ${WORD}' }],
      command: 'echo "Found ${some}"'
    }], 'Some thingy', context, { debug: true });

    assert.equal(matched, true);
    sinon.assert.notCalled(child_process.execSync);
  });

});
