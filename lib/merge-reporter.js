'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const moment = require('moment');
const { sync: mkdirp } = require('mkdirp');
const CircularJson = require('macaca-circular-json');

function getJSONData(filePath) {
  const finalJsonPath = path.resolve(filePath, 'json-final.json');
  return require(finalJsonPath);
}

function mergeStats(res, data) {
  const sumKeys = [
    'suites',
    'tests',
    'passes',
    'pending',
    'failures',
    'other',
    'skipped',
    'duration',
  ];
  // eslint-disable-next-line no-return-assign
  sumKeys.forEach(key => res[key] += data[key]);

  res.passPercent = res.passes / (res.tests - res.pending) * 100;
  res.pendingPercent = res.pending / res.tests * 100;
  res.hasOther = res.other > 0;
  res.hasSkipped = res.skipped > 0;
  res.start = moment(res.start) > moment(data.start) ? data.start : res.start;
  res.end = moment(res.end) < moment(data.end) ? data.end : res.end;
}

function mergeSuites(res, data) {
  res.suites = res.suites.concat(data.suites);
}

function mergeJSONData(options) {
  const { list: fileList, targetDir } = options;
  const resData = {};
  fileList.forEach(filePath => {
    const data = getJSONData(filePath);
    const clone = _.cloneDeep(data);
    if (_.isEmpty(resData)) {
      _.merge(resData, clone);
    } else {
      mergeStats(resData.stats, clone.stats);
      mergeSuites(resData.suites, clone.suites);
    }
  });
  const targetFilePath = path.resolve(targetDir, 'json-final.json');
  fs.writeFileSync(targetFilePath, CircularJson.stringify(resData));
}

function mergeStaticsFiles(options) {
  const { list: fileList, targetDir } = options;
  const targetStaticDir = path.resolve(targetDir, 'screenshots');
  mkdirp(targetStaticDir);
  fileList.forEach(filePath => {
    const staticDir = path.resolve(filePath, 'screenshots');
    const files = fs.readdirSync(staticDir);
    files.forEach(file => {
      const src = path.resolve(staticDir, file);
      const dest = path.resolve(targetStaticDir, file);
      fs.copyFileSync(src, dest);
    });
  });
}

module.exports = async (options = {}) => {
  const { targetDir } = options;
  mkdirp(targetDir);

  await mergeJSONData(options);
  await mergeStaticsFiles(options);
};
