'use strict';

const render = require('../lib/render');
const data = require('./fixtures/final');

describe.only('test/render.test.js', () => {
  before(() => {
  });

  it('reporter render should be ok', () => {
    console.log(data);
  });

});
