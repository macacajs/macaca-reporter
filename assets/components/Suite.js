import React from 'react';
import D3Tree from 'd3-tree';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  xcode
} from 'react-syntax-highlighter/dist/styles';
import remove from 'lodash/remove';
import find from 'lodash/find';
import { Table } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  PauseOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import { autoWrapText, guid } from '@/common/helper';
import './Suite.less';

/**
 * require('mocha').utils.stringify
  [
    "screenshots/1658287045044.png"
    "screenshots/1658286967297-automation.mp4"
  ]
*/
function resolveImageListFormat(data = '') {
  if (!data) return null;
  const list = data.split('\n');
  return list.map(item => {
    if (!item.includes('.')) return item;
    const isImage = item.includes('.jpg')
      || item.includes('.png')
      || item.includes('.gif');
    if (isImage) return item.trim().replace(/"/g, '');
  }).filter(item => item).join('\n');
}
  
export default class Suite extends React.Component {

  constructor(props) {
    super(props);
    this.uid = guid();

    this.state = {
      expandKeys: [],
    }
  }

  _getD3UnitData(item) {
    return {
      text: autoWrapText(item.title),
      image: resolveImageListFormat(item.context),
    };
  }

  // handle single-layer cases: describle -> it
  _transtromOneTree(suite) {
    suite.name = suite.title;
    this.maxD3Height = suite.tests.length;
    suite.tests.forEach(test => {
      test.id = guid();
      test.data = this._getD3UnitData(test);
    })
    suite.children = suite.tests;
    return suite;
  }

  // handle muti-layer cases: describle -> describl -> it
  _transtromTree(suites) {
    if (suites.length > this.maxD3Height) {
      this.maxD3Height = suites.length;
    }
    suites.forEach((suite, index) => {
      suite.name = suite.title;
      suite.children = suite.tests;
      suite.id = guid();
      suite.data = this._getD3UnitData(suite);

      if (suite.suites && suite.suites.length) {
        suite.children = suite.children.concat(suite.suites);
      }

      if (suite.children) {
        this._transtromTree(suite.children);
      }
    });
    return suites;
  }

  _deleteNullTest(suites) {
    remove(suites, suite => {
      const willDelete = suite.children && !suite.children.length && !suite.suites.length;
      return willDelete;
    });
    suites.forEach(suite => {
      this._deleteNullTest(suite.suites);
    });
    return suites;
  }

  componentDidMount() {
    this.maxD3Height = 1;
    let suites;
    const suite = this.props.suite;
    const d3Data = {
      data: {
        image: null,
        text: autoWrapText(suite.title) || '',
      },
    }

    if (suite.tests.length) {
      suites = this._transtromOneTree(suite);
      d3Data.children = suites.children;
    } else {
      suites = this._transtromTree(suite.suites);
      d3Data.children = suites;
      suites = this._deleteNullTest(suites);
    }

    const selector = `.d3-tree-${this.uid}`;

    const d3tree = new D3Tree({
      selector: selector,
      data: d3Data,
      width: document.querySelector('ul.head').clientWidth,
      height: this.maxD3Height * 300,
      duration: 500,
      imageHeight: 200,
      imageWidth: 200,
      imageMargin: 10,
      itemConfigHandle: () => {
        return {
          isVertical: false
        };
      }
    });
    d3tree.init();
  }

  getCaseState(state) {
    if (state.pass) {
      return <span style={{color:'#a5d86e'}}><CheckOutlined />passed</span>;
    } else if (state.fail) {
      return <span style={{color:'#df5869'}}><CloseOutlined style={{ verticalAlign: 'sub' }} />failed</span>;
    } else if (state.pending) {
      return <span style={{color:'rgb(234, 187, 56)'}}><PauseOutlined />pending</span>;
    } else if (state.skipped) {
      return <span style={{color:'#898989'}}><InboxOutlined />skipped</span>;
    }
  }

  handleExpand(expanded, record) {
    const expandKeys = [...this.state.expandKeys]
    if (!~expandKeys.indexOf(record.key)) {
      expandKeys.push(record.key);
    } else {
      expandKeys.splice(expandKeys.indexOf(record.key), 1);
    }
    this.setState({
      expandKeys,
    });
  }

  getImages(record) {
    if (record.context && !~record.context.indexOf('undefined')) {
      return record.context.replace(/[\[\] "]/g,'').split('\n').filter(i => i);
    }
    return [];
  }

  getErrorInfo(record) {
    const err = record.err;
    if (!err || !err.name) return null;

    return <div className="suite-error-info">
      <h1>{err.name}:</h1>
      {err.expected && <p>expected: {err.expected}</p>}
      {err.actual && <p>actual: {err.actual}</p>}
      <p>{err.message}</p>
      <p style={{whiteSpace: 'pre-wrap'}}>{err.stack}</p>
    </div>
  }

  render() {

    const allTest = [];
    const suite = this.props.suite;
    const allStats = {
      totalFailures: 0,
      totalPasses: 0,
      totalPending: 0,
      totalSkipped: 0,
      totalTests: 0,
      duration: 0,
      title: suite.title,
      file: suite.file
    };

    const handleTest = suite => {
      suite.tests.forEach(test => {
        // save test images
        if (test.context && !find(images, item => item.src.replace(/"/g, '') === test.context.replace(/"/g, ''))) {
          images.push({
            src: test.context.replace(/"/g, ''),
            text: test.fullTitle,
          });
        }

        if ((this.props.showError && test.fail) || !this.props.showError) {
          test.key = test.uuid;
          test.state = this.getCaseState(test);

          if (test.duration && !~(test.duration + '').indexOf('ms')) {
            test.duration = `${test.duration}ms`;
          }

          allTest.push(test);
        }
      });
      allStats.totalFailures += suite.totalFailures;
      allStats.totalPasses += suite.totalPasses;
      allStats.totalPending += suite.totalPending;
      allStats.totalSkipped += suite.totalSkipped;
      allStats.totalTests += suite.totalTests;
      allStats.duration += suite.duration;

      if (suite.suites.length) {
        suite.suites.forEach(child => {
          handleTest(child);
        });
      }
    }

    handleTest(suite);

    const columns = [
      {
        title: 'case',
        dataIndex: 'fullTitle',
        key: 'fullTitle'
      },
      {
        title: 'duration',
        dataIndex: 'duration',
        key: 'duration',
        width: 88
      },
      {
        title: 'state',
        dataIndex: 'state',
        key: 'state',
        width: 100
      }
    ];

    let percent = 0;
    if (allStats.totalTests > 0) {
      percent = parseInt(allStats.totalPasses / allStats.totalTests * 100, 10);
    }

    const showSvg = this.props.showSvg;
    let showSuite = this.props.showSuite;
    if (this.props.showError) {
      showSuite = allStats.totalFailures > 0;
    }

    return (
      <div className="suite" style={{ display: showSuite ? 'block' : 'none' }}>
        <div className="file-head">
          <div className="file-head-top">
            <h1>{ allStats.title }</h1>
            <p>{ allStats.file }</p>
          </div>
          <ul>
            <li><ClockCircleOutlined /><span><span>Time:</span><span> { allStats.duration }ms</span></span></li>
            <li><InboxOutlined /><span><span>Tests:</span><span> { allStats.totalTests }</span></span></li>
            <li style={{color: '#a5d86e'}}><CheckOutlined /><span><span>Passes:</span><span> { allStats.totalPasses }</span></span></li>
            <li style={{color: '#df5869'}}><CloseOutlined /><span><span>Failures:</span><span>  { allStats.totalFailures }</span></span></li>
            <li style={{color: 'rgb(234, 187, 56)'}}><PauseOutlined /><span><span>Pending:</span><span>  { allStats.totalPending }</span></span></li>
            <li style={{color: '#898989'}}><InboxOutlined /><span><span>Skipped:</span><span>  { allStats.totalSkipped }</span></span></li>
            { percent >= 90
              ? <li style={{color: '#39a854'}}><PieChartOutlined /><span><span>rate:</span><span> { percent }%</span></span></li>
              : <li style={{color: '#df5869'}}><PieChartOutlined /><span><span>rate:</span><span>  { percent }%</span></span></li>
            }
          </ul>
        </div>

        <div style={{ display: showSvg ? 'block' : 'none' }} className={ `ani-box d3-tree-${this.uid}` }></div>
        <Table
          pagination={ !this.props.showSvg }
          columns={ columns }
          expandedRowKeys={ this.state.expandKeys }
          onExpand={this.handleExpand.bind(this)}
          expandedRowRender={ record =>
            <div>
              <SyntaxHighlighter
                language='javascript'
                showLineNumbers
                style={ xcode }
              >
                { record.code }
              </SyntaxHighlighter>
              {this.getErrorInfo(record)}
              <div style={{ display: 'flex' }}>
                {this.getImages(record).map((src, index) => {
                  if (src.endsWith('.webm') || src.endsWith('.mp4')) {
                    return <video
                      key={index}
                      data-title={ record.fullTitle }
                      style={{height: '600px', width: 'auto'}}
                      src={ src } 
                      preload="none"
                      controls
                    />
                  } else {
                    return <img
                      key={index}
                      data-title={ record.fullTitle }
                      style={{height: '600px', width: 'auto'}}
                      src={ src }
                    />
                  }
                })}
              </div>
            </div>
          }
          dataSource={ allTest }
        />
      </div>
    );
  }
}
