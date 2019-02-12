# 使用

---

## 示例工程

- [web-app-bootstrap](//github.com/app-bootstrap/web-app-bootstrap)
- [sample-nodejs](//github.com/macaca-sample/sample-nodejs)
- [Hilo](//github.com/hiloteam/Hilo)

## 编写用例最佳实践

最外层 suite 名称为文件名，然后是用例 suite 名称，之后是用例。

```javascript
const appendToContext = require('macaca-reporter').appendToContext;

// XXX.test.js
describe('XXX.test.js', function() {
  describe('XXX Module', function() {

    afterEach(function(done) {
      const that = this;
      setTimeout(() => {
        Macaca.screenshot({
          directory: `${YOUR_PROJECT_PATH}/screenshots/${that.currentTest.title}.png`,
          height: 110,
          width: 400
        }, (e) => {
          // or upload img files to cloud space
          appendToContext(that, `${YOUR_PROJECT_PATH}/screenshots/${that.currentTest.title}.png`);
          done();
        });
      }, 500);
    });

    it('test case', (done) => {

    });
  });
});

// XXXYYY.test.js
describe('XXXYYY.test.js', function() {
  describe('XXXYYY Module', function() {

    afterEach(function(done) {
      const that = this;
      setTimeout(() => {
        Macaca.screenshot({
          directory: `${YOUR_PROJECT_PATH}/screenshots/${that.currentTest.title}.png`,
          height: 110,
          width: 400
        }, (e) => {
          // or upload img files to cloud space
          appendToContext(that, `${YOUR_PROJECT_PATH}/screenshots/${that.currentTest.title}.png`);
          done();
        });
      }, 500);
    });

    it('test case', (done) => {

    });
  });
});

```

## 通过 macaca-cli 运行

```
$ macaca run --reporter macaca-reporter
```

Example: [sample-nodejs](https://github.com/macaca-sample/sample-nodejs)


## 通过 mocha 运行

```
$ mocha run --reporter macaca-reporter
```

## 命令行工具生成报告

```
$ npm i macaca-reporter -g
$ macaca-reporter -d 'test/fixtures/final'
```

