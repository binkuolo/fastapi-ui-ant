import { getModifyCaptcha, userUpdateMobile } from '@/services/user/api';
import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import { ModalForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-form';
import { List, message } from 'antd';
import { memo, useState } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = {
  strong: <span className="strong">强</span>,
  medium: <span className="medium">中</span>,
  weak: <span className="weak">弱 Weak</span>,
};

export default memo(() => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState!;
  const [visible, setvisible] = useState(false);
  const [countDown] = useState(600);
  // 拉取最新个人信息
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  // 修改提交
  const submitForm = async (values: USER.UpdateMobile) => {
    console.log(values);
    const result = await userUpdateMobile(values);
    if (result.code == 200) {
      setvisible(false);
      await fetchUserInfo();
      message.success(result.message);
      return;
    }
    message.info(result.message);
  };

  const getData = () => [
    {
      title: '账户密码',
      description: (
        <>
          当前密码强度：
          {passwordStrength.strong}
        </>
      ),
      actions: [<a key="Modify">修改</a>],
    },
    {
      title: '安全手机',
      description: currentUser?.user_phone
        ? `已绑定手机：${currentUser.user_phone}`
        : '未绑定安全手机',
      actions: [
        <a key="Modify" onClick={() => setvisible(true)}>
          {currentUser?.user_phone ? '修改' : '绑定'}
        </a>,
      ],
    },
    {
      title: '密保问题',
      description: '未设置密保问题，密保问题可有效保护账户安全',
      actions: [<a key="Set">设置</a>],
    },
    {
      title: '备用邮箱',
      description: `已绑定邮箱：ant***sign.com`,
      actions: [<a key="Modify">修改</a>],
    },
    {
      title: 'MFA 设备',
      description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
      actions: [<a key="bind">绑定</a>],
    },
  ];

  const data = getData();
  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
      <ModalForm
        title={`${currentUser?.user_phone ? '修改' : '绑定'}手机号`}
        visible={visible}
        size={'small'}
        width={400}
        onFinish={submitForm}
        modalProps={{ okText: '提交', onCancel: () => setvisible(false) }}
      >
        <ProFormText
          fieldProps={{
            size: 'large',
            prefix: <MobileOutlined className={styles.prefixIcon} />,
          }}
          name="mobile"
          placeholder="手机号"
          rules={[
            {
              required: true,
              message: '请输入手机号！',
            },
            {
              pattern: /^1\d{10}$/,
              message: '手机号格式错误！',
            },
          ]}
        />
        <ProFormCaptcha
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={styles.prefixIcon} />,
          }}
          captchaProps={{
            size: 'large',
          }}
          placeholder={'请输入验证码'}
          captchaTextRender={(timing, count) => {
            if (timing) {
              return `${count} 获取验证码`;
            }
            return '获取验证码';
          }}
          name="captcha"
          phoneName="mobile"
          countDown={countDown}
          rules={[
            {
              required: true,
              message: '请输入验证码！',
            },
            { len: 6, message: '请输入验证码！' },
          ]}
          onGetCaptcha={async (phone) => {
            const result = await getModifyCaptcha({ phone_number: phone });
            if (result.code !== 200) {
              message.info(result.message);
              throw new Error(result.message);
            }
            message.success(result.message);
          }}
        />
      </ModalForm>
    </>
  );
});
