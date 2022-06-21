'use strict';

const suites = require('./fixtures/suites');

module.exports = {
  stats: {
    suites: 0,
    tests: 0,
    passes: 0,
    pending: 0,
    failures: 0,
    start: new Date(),
    passPercent: 0,
    pendingPercent: 0,
    other: 0,
    hasOther: false,
    skipped: 1,
    hasSkipped: false,
    duration: 0,
    end: new Date(),
  },
  suites: suites || {},
  current: {
    image: 'https://macacajs.github.io/macaca-ecosystem/macaca-logo/svg/monkey.svg',
    list: [{
      title: 'info1 title',
      value: 'info1 content',
    }, {
      title: 'info2 title',
      value: 'info2 content',
    }, {
      title: 'info3 title',
      value: 'info3 content',
    }],
  },
};
