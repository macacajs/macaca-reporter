## Best Practice

``` javascript
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

