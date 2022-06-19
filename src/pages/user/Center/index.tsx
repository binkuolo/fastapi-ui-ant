import { accessLog } from '@/services/user/api';
import { getTtimeSlot } from '@/utils/utils';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Row, Space, Tag, Timeline, Typography } from 'antd';
import moment from 'moment';
import { memo, useEffect, useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

const { Title, Text } = Typography;

export default memo(() => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState!;
  const [accesslog, setaccesslog] = useState<USER.AccessLog[]>([]);
  // 获取访问日志
  const get_access_log = async () => {
    const result = await accessLog();
    if (result.code == 200) {
      setaccesslog(result.data);
    }
  };
  useEffect(() => {
    get_access_log();
  }, []);

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card>
          <Title level={4}>
            Hi, {currentUser?.username} {getTtimeSlot()}
          </Title>
        </Card>
        <Row gutter={10}>
          <Col xxl={8} xl={8}>
            <Card title={'个人信息'}>
              <div className={styles.userinfo}>
                <div className={styles.header}>
                  <Avatar
                    size={'large'}
                    className={styles.info_avatar}
                    src={currentUser?.header_img}
                  />
                  <Title level={4} key={'username'}>
                    {' '}
                    {currentUser?.username}
                  </Title>
                  <Text key={'nickname'} className={styles.nickname}>
                    {currentUser?.nickname}
                  </Text>
                </div>
                <div className={styles.footer}>
                  <Text key={'email'}>
                    <MailOutlined className={styles.info_icon} /> {currentUser?.user_email}
                  </Text>
                  <Text key={'phone'}>
                    <PhoneOutlined className={styles.info_icon} /> {currentUser?.user_phone}
                  </Text>
                </div>
              </div>
              <Divider orientation="left">职称</Divider>
              <div key={'zc'}>
                <Tag className={styles.info_tag} color="magenta">
                  美团骑手
                </Tag>
                <Tag className={styles.info_tag} color="red">
                  饿了么骑手
                </Tag>
                <Tag className={styles.info_tag} color="volcano">
                  Python爬🐛
                </Tag>
                <Tag className={styles.info_tag} color="orange">
                  up主
                </Tag>
                <Tag className={styles.info_tag} color="gold">
                  容器专家
                </Tag>
                <Tag className={styles.info_tag} color="lime">
                  镜像工程师
                </Tag>
                <Tag className={styles.info_tag} color="green">
                  不打产品经理
                </Tag>
                <Tag className={styles.info_tag} color="cyan">
                  UI
                </Tag>
                <Tag className={styles.info_tag} color="blue">
                  Go
                </Tag>
                <Tag className={styles.info_tag} color="geekblue">
                  氢氧高分子移动技术
                </Tag>
                <Tag className={styles.info_tag} color="purple">
                  Cv工程师
                </Tag>
              </div>
              <Divider orientation="left">团队</Divider>
              <div key={'td'}>
                <Tag color="#f50">某某事业群</Tag>
                <Tag color="#2db7f5">运营中心</Tag>
                <Tag color="#87d068">Spa商务</Tag>
                <Tag color="#108ee9">产品部</Tag>
              </div>
            </Card>
          </Col>
          <Col xxl={10} xl={10}>
            <Card title={'最近访问'}>
              <Timeline>
                {accesslog.map((value) => (
                  <Timeline.Item key={value.id}>
                    {moment(value.create_time).format('YYYY-MM-DD HH:mm:ss')} {value.note} 来自{' '}
                    {value.ip}
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
});
