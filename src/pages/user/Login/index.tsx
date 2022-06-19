import Footer from '@/components/Footer';
import { getCaptcha, getWechatAuthUrl, login, wechatAuthCheck } from '@/services/user/api';
import { LockOutlined, MobileOutlined, UserOutlined, WechatOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Alert, message, Tabs } from 'antd';
import Qr from 'qrcode.react';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl, useModel } from 'umi';
import logo from '../../../../public/logo.svg';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const [loginMessage, setloginMessage] = useState<string>('');
  const [authorizeUrl, setauthorizeUrl] = useState<string>('');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [countDown] = useState(600);
  const timer = useRef<NodeJS.Timer>();
  const [expire, setExpire] = useState(0);

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const result = await login({ ...values });
      if (result.code === 200) {
        localStorage.setItem('Authorization', result.data.token);
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: result.message,
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      }
      console.log(result);
      // 如果失败去设置用户错误信息
      setUserLoginState({ type: 'account', status: 'error' });
      setloginMessage(result.message);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登陆接口异常，登陆失败！',
      });
      message.error(defaultLoginFailureMessage);
    }
  };
  // 微信扫码登陆检测
  const login_check = async () => {
    const result = await wechatAuthCheck();
    if (result.code == 200) {
      clearInterval(timer.current);
      localStorage.setItem('Authorization', result.data.token);
      message.success(result.message);
      await fetchUserInfo();
      /** 此方法会跳转到 redirect 参数所在的位置 */
      if (!history) return;
      const { query } = history.location;
      const { redirect } = query as { redirect: string };
      history.push(redirect || '/');
      return;
    }
    if (result.code != -1) {
      clearInterval(timer.current);
      message.info(result.message, 5);
      setType('account');
      return;
    }
  };

  // 获取微信授权url
  const get_authorize_url = async () => {
    const result = await getWechatAuthUrl({ scan_type: 'login' });
    if (result.code == 200) {
      setauthorizeUrl(result.data.authorize_url);
      let t = 0;
      const Timer = setInterval(() => {
        if (t > result.data.expire) {
          // 过期清除定时器
          clearInterval(timer.current);
          setType('account');
          message.info('二维码已过期!');
          return;
        }
        setExpire(result.data.expire - t);
        t++;
        login_check();
      }, 1000);
      timer.current = Timer;
      return;
    }
    message.info(result.message);
  };
  useEffect(() => {
    if (type == 'wechat') {
      get_authorize_url();
    }
    clearInterval(timer.current);
  }, [type]);

  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        {type != 'wechat' && (
          <LoginForm
            logo={<img alt="logo" src={logo} />}
            title="Ant Design"
            subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
            initialValues={{
              autoLogin: true,
            }}
            actions={[
              <FormattedMessage
                key="loginWith"
                id="pages.login.loginWith"
                defaultMessage="其他登录方式"
              />,
              <WechatOutlined
                onClick={() => setType('wechat')}
                key="WechatOutlined"
                className={styles.icon}
              />,
              // <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
              // <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
            ]}
            onFinish={async (values) => {
              await handleSubmit(values as API.LoginParams);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="account"
                tab={intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                })}
              />
              <Tabs.TabPane
                key="mobile"
                tab={intl.formatMessage({
                  id: 'pages.login.phoneLogin.tab',
                  defaultMessage: '手机号登录',
                })}
              />
            </Tabs>

            {status === 'error' && loginType === 'account' && (
              <LoginMessage content={loginMessage} />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={'用户名3-10个字符!'}
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名!',
                    },
                    {
                      min: 3,
                      message: '用户名3-10个字符!',
                    },
                    {
                      max: 15,
                      message: '用户名3-10个字符!',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={'密码长度6-12位'}
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                    {
                      min: 6,
                      message: '密码长度6-12位',
                    },
                    {
                      max: 12,
                      message: '密码长度6-12位',
                    },
                  ]}
                />
              </>
            )}

            {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
            {type === 'mobile' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined className={styles.prefixIcon} />,
                  }}
                  name="mobile"
                  placeholder={intl.formatMessage({
                    id: 'pages.login.phoneNumber.placeholder',
                    defaultMessage: '手机号',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.phoneNumber.required"
                          defaultMessage="请输入手机号！"
                        />
                      ),
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: (
                        <FormattedMessage
                          id="pages.login.phoneNumber.invalid"
                          defaultMessage="手机号格式错误！"
                        />
                      ),
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
                  placeholder={intl.formatMessage({
                    id: 'pages.login.captcha.placeholder',
                    defaultMessage: '请输入验证码',
                  })}
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} ${intl.formatMessage({
                        id: 'pages.getCaptchaSecondText',
                        defaultMessage: '获取验证码',
                      })}`;
                    }
                    return intl.formatMessage({
                      id: 'pages.login.phoneLogin.getVerificationCode',
                      defaultMessage: '获取验证码',
                    });
                  }}
                  name="captcha"
                  phoneName="mobile"
                  countDown={countDown}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.captcha.required"
                          defaultMessage="请输入验证码！"
                        />
                      ),
                    },
                    { len: 6, message: '请输入验证码！' },
                  ]}
                  onGetCaptcha={async (phone) => {
                    const result = await getCaptcha({ phone_number: phone });
                    if (result.code !== 200) {
                      message.info(result.message);
                      throw new Error(result.message);
                    }
                    message.success(result.message);
                  }}
                />
              </>
            )}
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
              </a>
            </div>
          </LoginForm>
        )}
        {type == 'wechat' && (
          <div className={styles.wechat}>
            <Qr size={200} level={'L'} value={authorizeUrl} />
            <p className={styles.qrcode_footer}>
              <WechatOutlined className={styles.qrcode_icon} />
              打开微信扫一扫 {expire} 秒
            </p>
            <a onClick={() => setType('account')}>账户密码登录？</a>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Login;
