/*eslint-env mocha*/
/*eslint-disable no-sync*/
'use strict';

const assert = require('assert');
const child_process = require('child_process');
const sinon = require('sinon');
const rule = require('../lib/rule');

describe('rule', () => {
  const context = { file: 'file.pdf' };
  const flags = {};
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
    const matched = rule({
      match: { some: 'Other ${WORD}' }
    }, 'No match');

    assert.equal(matched, false);
  });

  it('executes command and returns true if match', () => {
    const matched = rule({
      match: { some: 'Some ${WORD}' },
      command: 'echo "Found ${some}"'
    }, 'Some thingy', context, flags);

    assert.equal(matched, true);
    sinon.assert.calledOnce(child_process.execSync);
    sinon.assert.calledWith(child_process.execSync, 'echo "Found thingy"');
  });

  it('throws if variable in command is not found in match', () => {
    assert.throws(() => {
      rule({
        match: { some: 'Some ${WORD}' },
        command: 'echo "Found ${unknown}"'
      }, 'Some thingy', context, flags);
    }, /ReferenceError: unknown is not defined/);
  });

  it('evaluates placeholder content as JavaScript', () => {
    const matched = rule({
      match: { some: 'Some ${WORD}' },
      command: 'echo "Found ${(some.toUpperCase())}"'
    }, 'Some thingy', context, flags);

    assert.equal(matched, true);
    sinon.assert.calledOnce(child_process.execSync);
    sinon.assert.calledWith(child_process.execSync, 'echo "Found THINGY"');
  });

  it('allows to access ${source_file} from context', () => {
    const matched = rule({
      match: { some: 'Some ${WORD}' },
      command: 'echo "Matched ${file}"'
    }, 'Some thingy', context, flags);

    assert.equal(matched, true);
    sinon.assert.calledOnce(child_process.execSync);
    sinon.assert.calledWith(child_process.execSync,
      'echo "Matched file.pdf"');
  });

  it('allows to access ${target_file} from context', () => {
    const matched = rule({
      match: { some: 'Some ${WORD}' },
      command: 'echo "Matched ${file}"'
    }, 'Some thingy', context, flags);

    assert.equal(matched, true);
    sinon.assert.calledOnce(child_process.execSync);
    sinon.assert.calledWith(child_process.execSync,
      'echo "Matched file.pdf"');
  });

  it('replaces multiple values in command', () => {
    const matched = rule({
      match: { some: 'Some ${WORD}' },
      command: 'echo "Matched ${file} with ${some}"'
    }, 'Some thingy', context, flags);

    assert.equal(matched, true);
    sinon.assert.calledOnce(child_process.execSync);
    sinon.assert.calledWith(child_process.execSync,
      'echo "Matched file.pdf with thingy"');
  });

});
