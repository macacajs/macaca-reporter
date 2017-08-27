'use strict';

import React from 'react';

import {
  Row,
  Col,
  Card
} from 'antd';

require('./Screen.less');

export default class NavBar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const current = this.props.current;

    if (!current) {
      return null;
    }

    return (
      <div className="screen">
        <Row
          gutter={24}
          type="flex"
          justify="space-around"
        >
          <Col span={16}>
            <Card title="Current Screen" bordered={false}>
              <img src={ current.image } />
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Current status" bordered={false}>
            {
              current.list.map((item, key) => {
                return (
                  <p key={ key }>{ item.title }: { item.value }</p>
                );
              })
            }
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
