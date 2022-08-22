'use strict';

const fs = require('fs');
const chalk = require('chalk');
const jsdom = require('jsdom');
const urllib = require('urllib');

const { JSDOM } = jsdom;

function updateTemplateHtml(configStr, dataStr) {
  const html = fs.readFileSync('./index.html', 'utf-8');
  const dom = new JSDOM(html);
  const node = dom.window.document.querySelector('#macaca-reporter');
  node.setAttribute('config-output', configStr);
  node.setAttribute('data-output', dataStr);
  const res = dom.serialize();
  fs.writeFileSync('./debug.html', res, 'utf-8');
  console.log('\nopen: %s\n', 'http://localhost:8080/debug.html');
}

function outputProxyConfig(reporterUrl) {
  const urlObj = new URL(reporterUrl);
  urlObj.query = '';
  urlObj.hash = '';
  urlObj.search = '';
  urlObj.pathname = urlObj.pathname.replace('/index.html', '');
  const targetUrl = urlObj.toString();
  const tpl = `
proxy: {
  '/screenshots': {
    target: '${targetUrl}',
  },
},
  `.trim();
  console.log('proxy config: \n\n%s\n', chalk.cyan(tpl));
}

async function main() {
  const reporterUrl = process.argv.pop();

  console.log('request url: %s', reporterUrl);
  
  const { status, data } = await urllib.request(reporterUrl, {
    dataType: 'text',
  });

  if (status === 200) {
    const { window } = new JSDOM(data);
    const node = window.document.querySelector('#macaca-reporter');
    const configStr = node.getAttribute('config-output');
    const dataStr = node.getAttribute('data-output');
    updateTemplateHtml(configStr, dataStr);
    outputProxyConfig(reporterUrl);
  } else {
    throw new Error(`request error: ${status}`);
  }
}

main()
  .catch(e => {
    console.log(e);
  });
