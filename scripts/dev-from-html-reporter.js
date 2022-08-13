'use strict';

const fs = require('fs');
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
  fs.writeFileSync('./index.html', res, 'utf-8');
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
  } else {
    throw new Error(`request error: ${status}`);
  }
}

main()
  .catch(e => {
    console.log(e);
  });
