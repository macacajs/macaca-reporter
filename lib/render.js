'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const pkg = require('../package');
const _ = require('./common/helper');
const logger = require('./common/logger');

const {
  microtemplate,
  copyfile
} = _;

module.exports = data => {
  const inline = true;
  const targetHTML = path.join(process.cwd(), 'reports', 'index.html');
  _.mkdir(path.dirname(targetHTML));
  let originHTML = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
  let outputHTML = '';

  const originJS = fs.readFileSync(path.join(__dirname, '..', 'dist', `${pkg.name}.js`));
  const originCSS = fs.readFileSync(path.join(__dirname, '..', 'dist', `${pkg.name}.css`));

  const dataAttr = 'data-output';

  if (inline) {
    outputHTML = microtemplate.render(originHTML, {
      title: pkg.name,
      script: `<script>${originJS}</script>`,
      style: `<style>${originCSS}</style>`,
      element: `<div ${dataAttr}="${encodeURI(JSON.stringify(data))}" id="${pkg.name}"></div>`
    }, {
      tagOpen: '<!--',
      tagClose: '-->'
    });
  } else {
    outputHTML = microtemplate.render(originHTML, {
      title: pkg.name,
      script: `<script src="./${pkg.name}.js"></script>`,
      style: `<link rel="stylesheet" href="./${pkg.name}.css"/>`,
      element: `<div ${dataAttr}="${encodeURI(JSON.stringify(data))}" id="${pkg.name}"></div>`
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

  logger.info(chalk.cyan(`reporter generated: ${targetHTML}`));
};
