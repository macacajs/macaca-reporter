import React from 'react';
import {
  Progress,
} from 'antd';
import './NavBar.less';
import Icon from './Icon';
import pkg from '../../package.json';
import styles from './NavBar.module.less';

export default function NavBar(props) {
  const { stats } = props;
  return (
    <ul className="head">
      <li>
        <a href={pkg.homepage}>
          <div title={`version: ${pkg.version}`} className={styles.info}>
            <Icon
              width={60}
              type="monkey"
            />
            <span className={styles.title}>
              Macaca Reporter
            </span>
          </div>
        </a>
      </li>
      <li>
        <h5>suites</h5>
        <p>{ stats.suites }</p>
      </li>
      <li>
        <h5>tests</h5>
        <p>{ stats.tests }</p>
      </li>
      <li>
        <h5>passes</h5>
        <p style={{ color: '#a5d86e' }}>{ stats.passes }</p>
      </li>
      <li>
        <h5>failures</h5>
        <p style={{ color: '#df5869' }}>{ stats.failures }</p>
      </li>
      <li>
        <h5>pending</h5>
        <p style={{ color: 'rgb(234, 187, 56)' }}>{ stats.pending }</p>
      </li>
      <li>
        <h5>skipped</h5>
        <p style={{ color: '#898989' }}>{ stats.skipped }</p>
      </li>
      <li>
        <h5>duration</h5>
        <p>{ (stats.duration / 1000).toFixed(2) }s</p>
      </li>
      <li>
        <div className="head-circle">
          <Progress
            type="circle"
            percent={stats.passPercent}
            format={percent => { return `${percent}%`; }}
            status={stats.passPercent >= 90 ? 'success' : 'exception'}
            width={50}
          />
        </div>
      </li>
    </ul>
  );
}
