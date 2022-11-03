import React from 'react';
import ReactGA from 'react-ga';
import ReactDom from 'react-dom';
import CircularJson from 'macaca-circular-json';
import {
  Affix,
  Card,
  Col,
  Row,
  Layout,
  Radio,
  Empty,
  BackTop,
  Popover,
} from 'antd';
import {
  EyeOutlined,
  ClusterOutlined,
  VideoCameraOutlined,
  TableOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import uniqBy from 'lodash/uniqBy';
import flatten from 'lodash/flatten';
import io from 'socket.io-client';
import { guid, validVideo } from '@/common/helper';
import { startsVideoPreload, addImageEvent } from '@/common/biz';
import Mind from './components/Mind';
import Suite from './components/Suite';
import NavBar from './components/NavBar';
import Screen from './components/Screen';
import pkg from '../package.json';
import './app.less';
import styles from './app.module.less';

const { Header } = Layout;
const { Footer } = Layout;
const { Content } = Layout;
const { Meta } = Card;

const importAll = (r) => {
  return r.keys().forEach(r);
};
importAll(require.context('./icons', false, /\.svg$/));

let container;
const dataAttr = 'data-output';
const configAttr = 'config-output';

window.addEventListener('load', () => {
  ReactGA.initialize('UA-49226133-2');
  ReactGA.pageview(window.location.pathname + window.location.search);
  process.env.traceFragment;
});

class App extends React.Component {
  constructor(props) {
    super(props);
    container = document.querySelector(`#${pkg.name}`);

    const output = CircularJson.parse(decodeURI(container.getAttribute(dataAttr)));

    let showType = 'tree';
    const hashMode = location.hash.replace('#mode=', '');

    if (hashMode) {
      showType = hashMode;
    } else if (output.stats.failures) {
      showType = 'error';
    }

    this.state = {
      output,
      showType,
      hashError: output.stats.failures,
    };
  }

  componentDidMount() {
    addImageEvent();
  }

  handleRadioChange(e) {
    const radio = e.target.value;
    location.hash = `mode=${radio}`;

    this.setState({
      showType: e.target.value,
    });
  }

  handleImageList(allTest) {
    const allImages = [];
    let _tests = uniqBy(allTest, it => { return it.context; });
    _tests = _tests.filter(it => { return it.context && !it.context.includes('undefined'); });
    _tests.map(it => {
      const imgList = it.context.replace(/[\[\] "]/g, '').split('\n').filter(i => {
        return i;
      });
      allImages.push(...(imgList.map(it => {
        return {
          src: it,
          text: '',
        };
      })));
    });
    return allImages;
  }

  // 图片、录像视图
  renderImages(allTest) {
    const mediasList = this.handleImageList(allTest);
    let cards = mediasList.map((item, index) => {
      const title = item.text;
      const { src } = item;
      const isVideo = validVideo(src);
      return (
        <Col key={guid()} span={4} style={{ padding: '5px' }}>
          <Card
            id="display-items"
            hoverable
            cover={
              isVideo
                ? (
                  <a href={src} target="_blank">
                    <video
                      data-index={index}
                      className="video-item display-item"
                      src={src}
                      data-title={title}
                      preload="none"
                      controls
                    />
                  </a>
                )
                : (
                  <img
                    data-index={index}
                    className="picture-item display-item"
                    src={src}
                    data-title={title}
                    alt={title}
                  />
                )
            }
          >
            <Meta
              description={title.split(' -- ') && title.split(' -- ').reverse()[0]}
            />
          </Card>
        </Col>
      );
    });
    cards = flatten(cards);

    if (!mediasList.length) {
      cards = <Empty description={null} />;
    }

    setTimeout(() => {
      startsVideoPreload();
    }, 100);
    return (
      <Row style={{
        width: '1280px',
        margin: '30px auto',
      }}
      >
        {cards}
      </Row>
    );
  }

  /**
   * 递归获取所有测试用例
   */
  getAllTests = (suites = []) => {
    const tests = [];
    if (suites.length > 0) {
      suites.forEach(s => {
        if (s.tests.length > 0) {
          tests.push(...s.tests);
        }
        if (s.suites.length > 0) {
          tests.push(...this.getAllTests(s.suites));
        }
      });
    }
    return tests;
  }

  deleteNullTest = (suites = []) => {
    suites = suites.filter(s => {
      if (s.suites.length > 0) {
        return s.suites.find(ss => {
          return ss.tests.length > 0;
        });
      } else {
        return s.tests.length > 0;
      }
    });
    suites.forEach(suite => {
      this.deleteNullTest(suite.suites);
    });
    return suites;
  }

  renderSuites() {
    const { showType } = this.state;
    const stats = this.state?.output?.stats;
    const originSuites = this.state?.output?.suites;
    const suites = this.deleteNullTest(originSuites.suites);
    if (showType === 'mind') {
      return <Mind suites={suites} title={stats.title} />;
    } else if (showType === 'image') {
      // 获取 images
      const allTest = this.getAllTests(originSuites.suites);
      return this.renderImages(allTest);
    } else if (Array.isArray(suites)) {
      return suites.map((suite, index) => {
        return (
          <Suite
            showSuite
            showSvg={showType !== 'text' && showType !== 'error'}
            showError={showType === 'error'}
            suite={suite}
            key={index}
          />
        );
      });
    }
    return null;
  }

  renderFooter() {
    const { showType } = this.state;
    if (showType === 'mind') return null;
    return (
      <Footer>
        &copy;&nbsp;<a href={pkg.homepage}>Macaca Team</a> { new Date().getFullYear() }
      </Footer>
    );
  }

  render() {
    const stats = this.state?.output?.stats;
    const current = this.state?.output?.current;
    const envInfo = this.state?.output?.envInfo || {};
    const { showType } = this.state;
    return (
      <Layout>
        <Affix>
          <Header>
            <NavBar stats={stats} />
          </Header>
        </Affix>
        <Content>
          <div className="panel-container">
            <Popover
              title={null}
              placement="bottom"
              content={(
                <div>
                  <span>version: {pkg.version}<br /></span>
                  {
                    Object.keys(envInfo).map(envKey => {
                        return (
                        <span key={envKey}>{envKey}: {envInfo[envKey]}<br /></span>
                        );
                    })
                  }
                </div>
              )}
            >
              <div className={styles.extraInfoWrapper}>
                <InfoCircleOutlined />
              </div>
            </Popover>
            <div className="case-show-panel">
              <Radio.Group className="case-show-radio" value={showType} onChange={this.handleRadioChange.bind(this)}>
                <Radio.Button value="tree">
                  <EyeOutlined />
                </Radio.Button>
                <Radio.Button value="mind">
                  <ClusterOutlined />
                </Radio.Button>
                <Radio.Button value="image">
                  <VideoCameraOutlined />
                </Radio.Button>
                <Radio.Button value="text">
                  <TableOutlined />
                </Radio.Button>
                {this.state.hashError ? (
                  <Radio.Button value="error">
                    <QuestionCircleOutlined theme="twoTone" twoToneColor="red" />
                  </Radio.Button>
                ) : ''}
              </Radio.Group>
            </div>
          </div>
          <Screen current={current} />
          { this.renderSuites() }
        </Content>
        { this.renderFooter() }
        <BackTop />
      </Layout>
    );
  }
}

window._macaca_reportor = {

  _render: () => {
    console.log('reporter view render');
    ReactDom.render(<App />, container);

    // onload 时如果有 scrollY url参数，则滚动到目标位置
    const currUrl = new URL(window.location.href);
    const scrollY = currUrl.searchParams.get('scrollY');
    if (scrollY) {
      console.log('found scrollY param, do scroll');
      window.scrollTo({
        top: parseInt(scrollY, 10),
        behavior: 'smooth',
      });
    }
    // 定时更新url中的scrollY值, 每5秒更新一次url
    setInterval(() => {
      console.log('update url interval');
      const url = new URL(window.location.href);
      if (url.searchParams.get('scrollY') === null) {
        url.searchParams.append('scrollY', `${window.scrollY}`);
      } else if (url.searchParams.get('scrollY') === `${window.scrollY}`) {
        // 没有变化不更新
        return;
      } else {
        url.searchParams.set('scrollY', `${window.scrollY}`);
      }
      window.history.replaceState({}, '', url.href.replace(window.location.origin, ''));
    }, 5E3);
  },

  _update: data => {
    console.log('reporter view update');
    container.innerHTML = '';
    container.setAttribute(dataAttr, data);
    ReactDom.render(<App />, container);
  },

};

container = document.querySelector(`#${pkg.name}`);

if (container.getAttribute(configAttr)) {
  const config = CircularJson.parse(decodeURI(container.getAttribute(configAttr)));

  if (config && config.socket) {
    const socket = io(config.socket.server);
    socket.on('update reporter', (data) => {
      window._macaca_reportor._update(encodeURI(CircularJson.stringify(data)));
    });

    socket.on('disconnect', (data) => {
      socket.close();
    });
  }
}
