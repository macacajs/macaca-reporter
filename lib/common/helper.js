'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('macaca-utils');
const { utils: mochaUtils } = require('mocha');
const CircularJson = require('macaca-circular-json');

const _ = utils.merge({}, utils);

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function transferCode(data) {
  data = data
    .replace(/\r\n?|[\n\u2028\u2029]/g, '\n')
    .replace(/^\uFEFF/, '')
    .replace(/^function\s*\(.*\)\s*{|\(.*\)\s*=>\s*{?/, '')
    .replace(/\s*\}$/, '');

  const spaces = data.match(/^\n?( *)/)[1].length;
  const tabs = data.match(/^\n?(\t*)/)[1].length;
  const reg = new RegExp(`^\n?${tabs ? '\t' : ' '}{${tabs || spaces}}`, 'gm');

  return data
    .replace(reg, '')
    .replace(/^\s+|\s+$/g, '')
    .replace(/&quot;/g, '')
    .replace(/\)\./g, '\)\n\.');
}

function transferTest(test, suite, parentTitle) {
  const code = test.fn ? test.fn.toString() : test.body;
  const firstTitle = parentTitle ? parentTitle + ' -- ' : '';

  const cleaned = {
    title: test.title,
    fullTitle: firstTitle + suite.title + ' -- ' + test.title,
    duration: test.duration || 0,
    state: test.state,
    pass: test.state === 'passed',
    fail: test.state === 'failed',
    pending: test.pending,
    context: mochaUtils.stringify(test.context),
    code: code && transferCode(code),
    err: test.err,
    uuid: test.uuid || uuid(),
  };

  cleaned.skipped = !cleaned.pass && !cleaned.fail && !cleaned.pending && !cleaned.isHook;
  return cleaned;
}

function transferSuite(suite, totalTests, totalTime, parentTitle) {
  suite.uuid = uuid();
  const cleanTmpTests = suite.tests.map(test => test.state && transferTest(test, suite, parentTitle));
  const cleanTests = cleanTmpTests.filter(test => !!test);

  const passingTests = cleanTests.filter(item => item.state === 'passed');

  const failingTests = cleanTests.filter(item => item.state === 'failed');
  const pendingTests = cleanTests.filter(item => item.pending);
  const skippedTests = cleanTests.filter(item => item.skipped);
  let duration = 0;

  cleanTests.forEach(test => {
    duration += test.duration;
    totalTime.time += test.duration;
  });

  suite.tests = cleanTests;
  suite.fullFile = suite.file || '';
  suite.file = suite.file ? suite.file.replace(process.cwd(), '') : '';
  suite.passes = passingTests;
  suite.failures = failingTests;
  suite.pending = pendingTests;
  suite.skipped = skippedTests;
  suite.totalTests = suite.tests.length;
  suite.totalPasses = passingTests.length;
  suite.totalFailures = failingTests.length;
  suite.totalPending = pendingTests.length;
  suite.totalSkipped = skippedTests.length;
  suite.duration = duration;
}

function getSuite(suite, totalTests) {
  const totalTime = {
    time: 0,
  };
  const queue = [];
  const result = CircularJson.parse(suite.replace(/&quot;/g, ''));
  let next = result;
  totalTests.total++;
  while (next) {

    if (next.root) {
      transferSuite(next, totalTests, totalTime);
    }

    if (next.suites && next.suites.length) {
      // eslint-disable-next-line no-loop-func
      next.suites.forEach(nextSuite => {
        transferSuite(nextSuite, totalTests, totalTime, next.title);
        queue.push(nextSuite);
      });
    }
    next = queue.shift();
  }
  result._totalTime = totalTime.time;
  return CircularJson.stringify(result);
}

_.getSuite = getSuite;
_.stringify = CircularJson.stringify;

_.copyfile = function(origin, target) {
  _.mkdir(path.dirname(target));
  fs.writeFileSync(target, origin, 'utf8');
};

_.powerJSONStringify = (str) => {
  const err = new Error('json stringify failed');
  try {
    return JSON.stringify(str);
  } catch (e) {
    if (e.name === 'TypeError' && e.message && e.message.includes('circular structure')) {
      return CircularJson.stringify(str);
    }
    err.name = e.name;
    err.message = e.message;
    
  }
  err.string = str;
  throw err;
};

module.exports = _;
