#!/usr/bin/env node

'use strict';

const path = require('path');
const program = require('commander');
const mergeReporter = require('../lib/merge-reporter');

function commaSeparatedList(value) {
  return value.split(',');
}

program
  .option('-l, --list <items>', 'pointed directory list', commaSeparatedList)
  .option('-d, --directory <s>', 'target directory', commaSeparatedList)
  .usage('');

program.parse();
const options = program.opts();

options.targetDir = options.directory || path.resolve(process.cwd(), 'report-merged');

if (!Array.isArray(options.list)) {
  console.log('argument `list` must be an array, %j', options);
  return;
}

mergeReporter(options)
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
