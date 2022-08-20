import React from 'react';
import remove from 'lodash/remove';
import Editor from '@antv/g6-editor';
import { guid } from '@/common/helper';

import './Mind.less';

export default class Mind extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  _transformTree(suites = []) {
    suites.forEach((suite) => {
      suite.name = suite.title;
      suite.children = suite.tests;
      suite.id = guid();
      if (suite?.suites?.length) {
        suite.children = suite.children.concat(suite.suites);
      }
      if (suite.children) {
        this._transformTree(suite.children);
      }
    });
    return suites;
  }

  _deleteNullTest(suites) {
    remove(suites, suite => {
      const willDelete = suite.children
        && !suite.children.length
        && !suite.suites.length;
      return willDelete;
    });
    suites.forEach(suite => {
      this._deleteNullTest(suite.suites);
    });
    return suites;
  }

  componentDidMount() {
    const { title } = this.props;
    let { suites } = this.props;
    suites = this._transformTree(suites);
    suites = this._deleteNullTest(suites);

    const adaptor = (listData, isRoot) => {
      const midNum = parseInt(listData.length / 2, 10);
      return listData.map((item, index) => {
        item.label = item.title;
        if (isRoot) {
          item.side = index > midNum ? 'left' : 'right';
        }
        if (item?.children?.length) {
          item.children = adaptor(item.children);
        }
        return item;
      });
    };

    const mindSuite = {
      roots: [{
        label: title,
        children: adaptor(suites, true),
      }],
    };

    Editor.track(false);

    new Editor.Mind({
      defaultData: mindSuite,
      graph: {
        mode: 'readOnly',
        container: 'mind-node',
        height: window.innerHeight - 100,
        width: window.innerWidth,
      },
    });
  }

  render() {
    return (
      <div id="mind-node" className="mind-node"></div>
    );
  }
}
