# macaca-reporter

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/macaca-reporter.svg?style=flat-square
[npm-url]: https://npmjs.org/package/macaca-reporter
[travis-image]: https://img.shields.io/travis/macacajs/macaca-reporter.svg?style=flat-square
[travis-url]: https://travis-ci.org/macacajs/macaca-reporter
[coveralls-image]: https://img.shields.io/coveralls/macacajs/macaca-reporter.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/macacajs/macaca-reporter?branch=master
[download-image]: https://img.shields.io/npm/dm/macaca-reporter.svg?style=flat-square
[download-url]: https://npmjs.org/package/macaca-reporter

---

> macaca-reporter is a reporter used for mocha and other frameworks.

## Installment

```bash
$ npm i macaca-reporter --save-dev
```

## Sample

<div align="center">
  <img src="http://wx4.sinaimg.cn/large/6d308bd9gy1fivuatxep5j21kw13dgs6.jpg" />
  <img src="http://wx3.sinaimg.cn/large/6d308bd9gy1fivtfos9r5j21kw130af7.jpg" />
</div>

## Features

- Supports displaying tree view
- Supports displaying failed tests
- Supprtts custom options

## Usage with macaca-cli

```bash
$ macaca run --reporter macaca-reporter
```

- [sample-nodejs](//github.com/macaca-sample/sample-nodejs)

Run with mocha

```bash
$ mocha run --reporter macaca-reporter
```

Run with Macaca [torchjs](//github.com/macacajs/torchjs)

```bash
$ torch --renderer --interactive --watch --notify-on-fail --debug test/*.test.js
```

## More usage

[docs](./docs)

## License

The MIT License (MIT)
