import React, { useEffect } from 'react';
import Editor from '@antv/g6-editor';
import { guid } from '@/common/helper';
import styles from './Mind.module.less';

function _transformTree(suites = []) {
  suites.forEach((suite) => {
    suite.name = suite.title;
    suite.children = suite.tests;
    suite.id = guid();
    if (suite?.suites?.length) {
      suite.children = suite.children.concat(suite.suites);
    }
    if (suite.children) {
      _transformTree(suite.children);
    }
  });
  return suites;
}

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

export default function Mind(props) {
  useEffect(() => {
    const { title, suites } = props;
    const _suites = _transformTree(suites);

    const mindSuite = {
      roots: [{
        label: title,
        children: adaptor(_suites, true),
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
  }, []);

  return (
    <div id="mind-node" className={styles.wrapper} />
  );
}
