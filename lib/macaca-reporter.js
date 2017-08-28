'use strict';

const mocha = require('mocha');

const render = require('./render');
const _ = require('./common/helper');

const {
  Base,
  Spec
} = mocha.reporters;

const {
  stringify,
  getSuite
} = _;

const totalTests = {
  total: 0
};

function done(output, config, failures, exit) {
  try {
    render(output, {});
  } catch (e) {
    console.log(e);
  }

  if (exit) {
    exit();
  }
}

function MacacaReporter(runner, options) {

  const getSuiteData = () => {
    const result = getSuite(stringify(this._originSuiteData), totalTests);
    const obj = {
      stats: this.stats,
      suites: JSON.parse(result)
    };

    const {
      passes,
      failures,
      pending,
      tests
    } = obj.stats;

    const passPercentage = Math.round((passes / (totalTests.total - pending)) * 1000) / 10;
    const pendingPercentage = Math.round((pending / totalTests.total) * 1000) / 10;

    obj.stats.passPercent = passPercentage;
    obj.stats.pendingPercent = pendingPercentage;
    obj.stats.other = passes + failures + pending - tests;
    obj.stats.hasOther = obj.stats.other > 0;
    obj.stats.skipped = totalTests.total - tests;
    obj.stats.hasSkipped = obj.stats.skipped > 0;
    obj.stats.failures -= obj.stats.other;
    return obj;
  };

  this.done = (failures, exit) => done(this.output, this.config, failures, exit);
  totalTests.total = 0;

  this.config = {
    reportFilename: 'report',
    saveJson: true
  };
  Base.call(this, runner);

  new Spec(runner);

  const handleTestEnd = () => {
    const obj = getSuiteData();
    obj.stats.duration = obj.suites._totalTime || 0;
    this.output = obj;

    if (typeof window === 'object' &&
      window._macaca_reportor &&
      window._macaca_reportor._update) {
      window._macaca_reportor._update(encodeURI(stringify(obj)));
    }
  };

  runner.on('start', () => {
    this._originSuiteData = runner.suite;
  });

  runner.on('test', test => {
    test.uuid = _.uuid();
    handleTestEnd();

  });

  runner.on('pending', test => {
    test.uuid = _.uuid();
  });

  runner.on('end', test => {
    handleTestEnd();
  });
}

MacacaReporter.appendToContext = function (...args) {
  const test = args[0].currentTest || args[0].test;
  const content = args[1];

  if (!test.context) {
    test.context = content;
  } else if (Array.isArray(test.context)) {
    test.context.push(content);
  } else {
    test.context = [test.context];
    test.context.push(content);
  }
};

module.exports = MacacaReporter;
