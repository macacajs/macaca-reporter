module.exports = {
  "title": "",
  "ctx": {},
  "suites": [{
    "title": "macaca-test/desktop-browser-sample.test.js",
    "suites": [{
      "title": "macaca desktop sample",
      "suites": [{
        "title": "macaca desktop sample",
        "suites": [],
        "tests": [{
          "title": "#0 should be ok",
          "fullTitle": "macaca desktop sample--#0 should be ok",
          "duration": 7509,
          "state": "passed",
          "pass": true,
          "fail": false,
          "pending": false,
          "context": "\"https://avatars1.githubusercontent.com/u/9263023?v=4&s=460\"",
          "code": "const url = path.join(__dirname, './pages/desktop-sample.html');\nreturn driver\n  .get(`file://${url}`)\n  .sleep(3000)\n  .execute(`document.querySelector('#select').selectedIndex = 1`)\n  .sleep(1000)\n  .elementById('select')\n  /*\n  .getProperty('value')\n  .then(value => {\n    value.should.be.equal('2');\n  })\n  */\n  .execute(`\n    var element = document.querySelector('#hover_text');\n    var event = document.createEvent('MouseEvent');\n    event.initMouseEvent('mouseover', true, true);\n    element.dispatchEvent(event);\n  `)\n  .elementById('hover_text')\n  .getComputedCss('color')\n  .then(value => {\n    value.should.containEql('255');\n  })\n  // https://github.com/macacajs/macaca-electron#windowalert\n  .execute(`\n    var e = document.createElement('div');\n    e.id = 'alert_msg';\n    window.alert = function() {\n      e.innerHTML = JSON.stringify(arguments[0]);\n      document.body.appendChild(e);\n    };\n  `)\n  .elementById('alert_button')\n  .click()\n  .elementById('alert_msg')\n  .text()\n  .then(value => {\n    value.should.containEql('this message is from alert');\n  })\n  .sleep(3000);",
          "uuid": "03dacaa9-a969-4f88-bebd-5141fbe35cba",
          "skipped": false
        }],
      }],
      "tests": [{
        "title": "#0 should be ok",
        "fullTitle": "macaca desktop sample--#0 should be ok",
        "duration": 7509,
        "state": "passed",
        "pass": true,
        "fail": false,
        "pending": false,
        "context": "\"https://avatars1.githubusercontent.com/u/9263023?v=4&s=460\"",
        "code": "const url = path.join(__dirname, './pages/desktop-sample.html');\nreturn driver\n  .get(`file://${url}`)\n  .sleep(3000)\n  .execute(`document.querySelector('#select').selectedIndex = 1`)\n  .sleep(1000)\n  .elementById('select')\n  /*\n  .getProperty('value')\n  .then(value => {\n    value.should.be.equal('2');\n  })\n  */\n  .execute(`\n    var element = document.querySelector('#hover_text');\n    var event = document.createEvent('MouseEvent');\n    event.initMouseEvent('mouseover', true, true);\n    element.dispatchEvent(event);\n  `)\n  .elementById('hover_text')\n  .getComputedCss('color')\n  .then(value => {\n    value.should.containEql('255');\n  })\n  // https://github.com/macacajs/macaca-electron#windowalert\n  .execute(`\n    var e = document.createElement('div');\n    e.id = 'alert_msg';\n    window.alert = function() {\n      e.innerHTML = JSON.stringify(arguments[0]);\n      document.body.appendChild(e);\n    };\n  `)\n  .elementById('alert_button')\n  .click()\n  .elementById('alert_msg')\n  .text()\n  .then(value => {\n    value.should.containEql('this message is from alert');\n  })\n  .sleep(3000);",
        "uuid": "03dacaa9-a969-4f88-bebd-5141fbe35cba",
        "skipped": false
      },
      {
        "title": "#1 should works with online pages",
        "fullTitle": "macaca desktop sample--#1 should works with online pages",
        "duration": 20880,
        "state": "passed",
        "pass": true,
        "fail": false,
        "pending": false,
        "context": "\"https://avatars1.githubusercontent.com/u/9263023?v=4&s=460\"",
        "code": "const initialURL = 'https://www.baidu.com';\nreturn driver\n  .get(initialURL)\n  .sleep(3000)\n  .elementById('kw')\n  .sendKeys('macaca')\n  .sleep(3000)\n  .elementById('su')\n  .click()\n  .sleep(5000)\n  .source()\n  .then(function(html) {\n    html.should.containEql('macaca');\n  })\n  .hasElementByCss('#head > div.head_wrapper')\n  .then(function(hasHeadWrapper) {\n    hasHeadWrapper.should.be.true();\n  })\n  .elementByXPathOrNull('//*[@id=\"kw\"]')\n  .sendKeys(' elementByXPath')\n  .sleep(3000)\n  .elementById('su')\n  .click()\n  .sleep(5000)\n  .saveScreenshot('pic1');",
        "uuid": "3ac3ba51-b26a-4fa6-9bd0-9fff568347ea",
        "skipped": false
      }],
    }],
    "tests": [],
  }],
};
