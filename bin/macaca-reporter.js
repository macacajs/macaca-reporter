#!/usr/bin/env node

'use strict';

const path = require('path');
const EOL = require('os').EOL;
const program = require('commander');

const pkg = require('../package.json');
const render = require('../lib/render');
const _ = require('../lib/common/helper');

const {
  chalk,
} = _;
const cwd = process.cwd();

program
  .option('-d, --data <s>', 'data for reporter')
  .option('-v, --versions', 'output version infomation')
  .usage('');

program.parse();
const options = program.opts();

if (options.versions) {
  console.info(`${EOL} ${chalk.grey(pkg.version)} ${EOL}`);
  process.exit(0);
}

if (!options.data) {
  program.help();
  process.exit(0);
}

const data = require(path.resolve(cwd, program.data));
render(data);
