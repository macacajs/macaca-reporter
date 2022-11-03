import React from 'react';
import {
  Progress,
} from 'antd';
import { formatSeconds } from '@/common/helper';
import './NavBar.less';
import Icon from './Icon';
import pkg from '../../package.json';
import styles from './NavBar.module.less';

export default function NavBar(props) {
  const { stats } = props;
  const { envInfo = {} } = stats;
  let envInfoStr = `reporter_version: ${pkg.version}`;
  for (const key in envInfo) {
    envInfoStr += `\r\n${key}: ${envInfo[key]}`;
  }
  return (
    <ul className="head">
      <li>
        <a href={pkg.homepage}>
          <div title={envInfoStr} className={styles.info}>
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
        <p>{stats.suites}</p>
      </li>
      <li>
        <h5>tests</h5>
        <p>{stats.tests}</p>
      </li>
      <li>
        <h5>passes</h5>
        <p style={{ color: '#a5d86e' }}>{stats.passes}</p>
      </li>
      <li>
        <h5>failures</h5>
        <p style={{ color: '#df5869' }}>{stats.failures}</p>
      </li>
      <li>
        <h5>pending</h5>
        <p style={{ color: 'rgb(234, 187, 56)' }}>{stats.pending}</p>
      </li>
      <li>
        <h5>skipped</h5>
        <p style={{ color: '#898989' }}>{stats.skipped}</p>
      </li>
      <li>
        <h5>duration</h5>
        <p>{formatSeconds(stats.duration)}</p>
      </li>
      <li>
        <div className="head-circle">
          <Progress
            type="circle"
            percent={stats.passPercent}
            format={percent => {
              return `${percent}%`;
            }}
            status={stats.passPercent >= 90 ? 'success' : 'exception'}
            width={50}
          />
        </div>
      </li>
    </ul>
  );
}
