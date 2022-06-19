import { getWechatBindUrl, wechatAuthCheck } from '@/services/user/api';
import { AlipayOutlined, DingdingOutlined, WechatOutlined } from '@ant-design/icons';
import { List, message, Modal } from 'antd';
import Qr from 'qrcode.react';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

export default memo(() => {
  const [visible, setvisible] = useState(false);
  const [codeurl, setcodeurl] = useState('');
  const timer = useRef<NodeJS.Timer>();
  const [expire, setExpire] = useState(0);
  const { initialState, setInitialState } = useModel('@@initialState');

  const { currentUser } = initialState!;

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  // 微信扫码绑定检测
  const wechat_bind_check = async () => {
    const result = await wechatAuthCheck();
    if (result.code == 200) {
      await fetchUserInfo();
      clearInterval(timer.current);
      message.success(result.message);
      setvisible(false);
      return;
    }
    if (result.code != -1) {
      clearInterval(timer.current);
      message.info(result.message, 5);
      setvisible(false);
      return;
    }
  };
  // 获取微信授权二维码
  const get_auth_url = async () => {
    const result = await getWechatBindUrl();
    if (result.code == 200) {
      setvisible(true);
      setcodeurl(result.data.authorize_url);
      let t = 0;
      const Timer = setInterval(() => {
        if (t > result.data.expire) {
          // 过期清除定时器
          clearInterval(timer.current);
          setvisible(false);
          message.info('二维码已过期!');
          return;
        }
        setExpire(result.data.expire - t);
        t++;
        wechat_bind_check();
      }, 1000);
      timer.current = Timer;
      return;
    }

    message.info(result.message);
  };

  useEffect(() => {
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  const getData = () => [
    {
      title: '绑定微信',
      description: currentUser?.nickname ? currentUser.nickname : '当前未绑微信账号',
      actions: [
        <a key="Bind" onClick={() => get_auth_url()}>
          {currentUser?.nickname == 'binkuolo' ? '绑定' : '换绑'}
        </a>,
      ],
      avatar: <WechatOutlined style={{ fontSize: 48, color: '#07c160' }} className="wechat" />,
    },
    {
      title: '绑定支付宝',
      description: '当前未绑定支付宝账号',
      actions: [<a key="Bind">绑定</a>],
      avatar: <AlipayOutlined className="alipay" />,
    },
    {
      title: '绑定钉钉',
      description: '当前未绑定钉钉账号',
      actions: [<a key="Bind">绑定</a>],
      avatar: <DingdingOutlined className="dingding" />,
    },
  ];

  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        dataSource={getData()}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta
              avatar={item.avatar}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
      <Modal
        title={'微信绑定'}
        visible={visible}
        onCancel={() => {
          setvisible(false);
          clearInterval(timer.current);
        }}
        maskClosable={false}
        footer={false}
        width={300}
        destroyOnClose
      >
        <div className={styles.bind_modal}>
          <div key={'qrcode'} className={styles.qrcode}>
            {codeurl && <Qr value={codeurl} size={200} level={'L'} />}
          </div>
          <div key={'info'} className={styles.bind_info}>
            {' '}
            <WechatOutlined style={{ fontSize: 18, color: '#07c160', marginRight: 10 }} />{' '}
            打开微信扫一扫 {expire} 秒
          </div>
        </div>
      </Modal>
    </Fragment>
  );
});
