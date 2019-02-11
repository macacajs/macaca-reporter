# Tutorial

---

## Best Practice

The outer layer suite name is the file name, then the use case suite name, followed by the use case.

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

## Usage with macaca-cli

```
$ macaca run --reporter macaca-reporter
```

Example: [sample-nodejs](https://github.com/macaca-sample/sample-nodejs)


## Run with mocha

```
$ mocha run --reporter macaca-reporter
```

## Generate html reporter with cli tool

```
$ npm i macaca-reporter -g
$ macaca-reporter -d 'test/fixtures/final'
```

