import { MessageOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Avatar, Button, Card, Col, Form, Input, message, Row, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { useModel } from 'umi';
import styles from './Welcome.less';

type UserItem = {
  username: string;
  id: number;
};

const LineUser: React.FC<UserItem> = ({ username }) => (
  <div style={{ marginBottom: 8 }}>
    <Avatar size={'small'} src={'https://joeschmoe.io/api/v1/random'} />
    {username}
  </div>
);

const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  // 全局用户数据
  const currentUser = initialState?.currentUser;
  // 当前发送的消息form
  const [formref] = Form.useForm();
  // 聊天对话框
  const chatListRef = useRef(null);

  // 基于redux的models数据流管理概念
  const { ws, connect_websocket, onlineUser, messageList } = useModel('useWebsocketModel');

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    connect_websocket();
    return () => {
      ws?.close();
    };
  }, [currentUser, connect_websocket, ws]);

  useEffect(() => {
    const current = chatListRef.current!;
    current.scrollTop = current.scrollHeight;
  }, [messageList, chatListRef]);

  // 消息发送
  const sendMessage = (values: any) => {
    if (values.message) {
      ws?.send(JSON.stringify({ action: 'push_msg', user: 1, data: values.message }));
      formref.resetFields();
      return;
    }
    message.info('发送信息不能为空😫');
  };

  return (
    <PageContainer>
      <Card>
        <Row gutter={10}>
          <Col xxl={4} xl={4}>
            <Card
              bodyStyle={{ height: 600 }}
              size={'small'}
              title={
                <Alert
                  message={`当前在线人数 ${onlineUser.length}`}
                  type="success"
                  showIcon
                  banner
                  style={{
                    margin: 0,
                    padding: 0,
                  }}
                />
              }
            >
              {onlineUser.map((value) => (
                <LineUser username={value.username} id={value.id} key={value.id} />
              ))}
            </Card>
          </Col>
          <Col xxl={20} xl={20}>
            <Card
              title={
                <>
                  <MessageOutlined />
                  <> 即时消息</>
                </>
              }
              bodyStyle={{ padding: 20, height: 600, overflow: 'hidden' }}
              size={'small'}
            >
              <div className={styles.mcon}>
                <div className={styles.wechat} ref={chatListRef}>
                  {messageList.map((value, index) => (
                    <div className={styles.msglist} key={index.toString()}>
                      <div className={styles.header}>
                        <div>
                          <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
                        </div>
                        <span>User {value.id}</span>
                      </div>
                      <div className={styles.context}>
                        <div className={styles.message}>{value.message}</div>
                        <div className={styles.time}>
                          <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                            <span>{moment().fromNow()}</span>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Form onFinish={sendMessage} form={formref}>
                <Row gutter={10}>
                  <Col xxl={20} xl={20}>
                    <Form.Item name="message">
                      <Input.TextArea placeholder={'hello'} rows={3} />
                    </Form.Item>
                  </Col>
                  <Col xxl={4} xl={4}>
                    <Button
                      style={{ height: 75 }}
                      htmlType={'submit'}
                      size={'large'}
                      type={'primary'}
                      block
                    >
                      发送
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
