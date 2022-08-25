<p align="center">
  <a href="//macacajs.github.io">
    <img
      alt="Macaca"
      src="https://macacajs.github.io/macaca-ecosystem/macaca-logo/svg/monkey.svg"
      width="200"
    />
  </a>
</p>

---

# macaca-reporter

[Official Site](//macacajs.github.io/macaca-reporter/)

[![NPM version][npm-image]][npm-url]
[![CI][CI-image]][CI-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/macaca-reporter.svg
[npm-url]: https://npmjs.org/package/macaca-reporter
[CI-image]: https://github.com/macacajs/macaca-reporter/actions/workflows/ci.yml/badge.svg
[CI-url]: https://github.com/macacajs/macaca-reporter/actions/workflows/ci.yml
[coveralls-image]: https://img.shields.io/coveralls/macacajs/macaca-reporter.svg
[coveralls-url]: https://coveralls.io/r/macacajs/macaca-reporter?branch=master
[download-image]: https://img.shields.io/npm/dm/macaca-reporter.svg
[download-url]: https://npmjs.org/package/macaca-reporter

---

[Offcial Site](//macacajs.github.io/macaca-reporter)

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars.githubusercontent.com/u/11460601?v=4" width="100px;"/><br/><sub><b>zivyangll</b></sub>](https://github.com/zivyangll)<br/>|[<img src="https://avatars.githubusercontent.com/u/10104168?v=4" width="100px;"/><br/><sub><b>yihuineng</b></sub>](https://github.com/yihuineng)<br/>|[<img src="https://avatars.githubusercontent.com/u/52845048?v=4" width="100px;"/><br/><sub><b>snapre</b></sub>](https://github.com/snapre)<br/>|[<img src="https://avatars.githubusercontent.com/u/18617837?v=4" width="100px;"/><br/><sub><b>Stngle</b></sub>](https://github.com/Stngle)<br/>|[<img src="https://avatars.githubusercontent.com/u/1209810?v=4" width="100px;"/><br/><sub><b>paradite</b></sub>](https://github.com/paradite)<br/>|
| :---: | :---: | :---: | :---: | :---: | :---: |
[<img src="https://avatars.githubusercontent.com/u/8198256?v=4" width="100px;"/><br/><sub><b>SamuelZhaoY</b></sub>](https://github.com/SamuelZhaoY)<br/>|[<img src="https://avatars.githubusercontent.com/u/30293087?v=4" width="100px;"/><br/><sub><b>Jodeee</b></sub>](https://github.com/Jodeee)<br/>|[<img src="https://avatars.githubusercontent.com/u/24653016?v=4" width="100px;"/><br/><sub><b>amosnothing</b></sub>](https://github.com/amosnothing)<br/>|[<img src="https://avatars.githubusercontent.com/u/15245618?v=4" width="100px;"/><br/><sub><b>lsh382510118</b></sub>](https://github.com/lsh382510118)<br/>

This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Thu Aug 25 2022 14:12:05 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

## Config

Support custom JSON file name by ths config:

mocha.opts:
```
--reporter macaca-reporter
--reporter-options reportJSONFilename=customReportJSONFilename
```

with command:
```
$ mocha test.js --reporter macaca-reporter --reporter-options reportJSONFilename=customReportJSONFilename
```

custom reporter directory with environment variable
```
MACACA_REPORTER_DIR=customDirName
```

## Sample

<div align="center">
  <img src="https://macacajs.github.io/macaca-reporter/assets/6d308bd9gy1fivuatxep5j21kw13dgs6.jpg" />
  <img src="https://macacajs.github.io/macaca-reporter/assets/6d308bd9gy1fivtfos9r5j21kw130af7.jpg" />
</div>

## Who are using

- ⭐⭐⭐[alibaba/uirecorder](//github.com/alibaba/uirecorder)
- ⭐⭐⭐[apache/incubator-weex](//github.com/apache/incubator-weex)
- ⭐⭐⭐[hiloteam/Hilo](//github.com/hiloteam/Hilo)
- ⭐⭐⭐[xudafeng/autoresponsive-react](//github.com/xudafeng/autoresponsive-react)

[For more](//github.com/macacajs/macaca-reporter/network/dependents)

## Related

- [macaca-reporter-jest](https://github.com/macacajs/macaca-reporter-jest)
- [macaca-reporter-java-plugin](https://github.com/macacajs/macaca-reporter-java-plugin)

## Thanks to

- [d3-tree](//github.com/zhuyali/d3-tree)

## License

The MIT License (MIT)
