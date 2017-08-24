'use strict';

const fs = require('fs');
const path = require('path');
const mocha = require('mocha');

const pkg = require('../package');

const {
  Base,
  Spec
} = mocha.reporters;

const _ = require('./common/helper');

const {
  render,
  stringify,
  getSuite,
  copyfile
} = _;

const totalTests = {
  total: 0
};

function done(output, config, failures, exit) {
  const inline = true;
  const targetHTML = path.join(process.cwd(), 'reports', 'index.html');
  _.mkdir(path.dirname(targetHTML));
  let originHTML = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
  let outputHTML = '';

  const originJS = fs.readFileSync(path.join(__dirname, '..', 'dist', `${pkg.name}.js`));
  const originCSS = fs.readFileSync(path.join(__dirname, '..', 'dist', `${pkg.name}.css`));

  const dataAttr = 'data-output';

  if (inline) {
    outputHTML = render(originHTML, {
      title: pkg.name,
      script: `<script>${originJS}</script>`,
      style: `<style>${originCSS}</style>`,
      element: `<div ${dataAttr}="${encodeURI(JSON.stringify(output))}" id="${pkg.name}"></div>`
    }, {
      tagOpen: '<!--',
      tagClose: '-->'
    });
  } else {
    outputHTML = render(originHTML, {
      title: pkg.name,
      script: `<script src="./${pkg.name}.js"></script>`,
      style: `<link rel="stylesheet" href="./${pkg.name}.css"/>`,
      element: `<div ${dataAttr}="${encodeURI(JSON.stringify(output))}" id="${pkg.name}"></div>`
    }, {
      tagOpen: '<!--',
      tagClose: '-->'
    });
    const targetJS = path.join(process.cwd(), 'reports', `${pkg.name}.js`);
    copyfile(originJS, targetJS);
    const targetCSS = path.join(process.cwd(), 'reports', `${pkg.name}.css`);
    copyfile(originCSS, targetCSS);
  }

  copyfile(outputHTML, targetHTML);

  exit && exit();
}

function MacacaReporter(runner, options) {

  const getSuiteData = () => {
    const result = getSuite(stringify(this._originSuiteData), totalTests);
    const obj = {
      stats: this.stats,
      suites: JSON.parse(result),
      copyrightYear: new Date().getFullYear()
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
    window._macaca_reportor._update(encodeURI(stringify(obj)));
  };

  runner.on('start', () => {
    this._originSuiteData = runner.suite;
  });

  runner.on('test', test => {
    test.uuid = _.uuid();
  });

  runner.on('test end', test => {
    handleTestEnd();
  });

  runner.on('pending', test => {
    test.uuid = _.uuid();
  });
}

MacacaReporter.appendToContext = function (...args) {
  const content = args[1];
  const test = args[0].currentTest || args[0].test;

  if (content.title && content.value === undefined) {
    content.value = 'undefined';
  }

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
