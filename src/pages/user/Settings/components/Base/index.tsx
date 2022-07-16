import { userUpdateInfo } from '@/services/user/api';
import HeadImageUpload from '@/utils/cos';
import { CheckCircleOutlined, SmileOutlined, UploadOutlined } from '@ant-design/icons';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { UploadProps } from 'antd';
import { Avatar, Button, message, notification, Progress, Upload } from 'antd';
import type { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { memo } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

export default memo(() => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState!;

  const openNotification = (n: number) => {
    notification.open({
      message: '头像上传',
      description: <Progress size="small" percent={~~(n * 100)} />,
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      duration: 0,
      key: 'upload_headimg',
    });
  };
  // 头像上传
  const upload_props: UploadProps = {
    action: '/api/v1/admin/user/avatar/upload',
    name: 'avatar',
    method: 'PUT',
    maxCount: 1,
    accept: 'image/png, image/jpeg',
    headers: { Authorization: `Bearer ${localStorage.getItem('Authorization') || ''}` },
    beforeUpload: async (file: RcFile) => {
      // 回调的file是一个文件对象
      // 文件类型判断
      const file_type = "'image/png', 'image/jpeg'";
      if (!file_type.indexOf(file.type)) {
        message.info('支持文件类型png、jpg');
        return false;
      }
      // 文件大小判断
      if (file.size > 1 * 1048576) {
        message.info('文件大小1MB以内!');
        return false;
      }
      // -------------------------腾讯云cos-----------------------------------------------------------
      const c_obj = new HeadImageUpload(
        file,
        async (url) => {
          // 上传成功回调 返回对象存储中的访问地址
          console.log('url', url);
          const newCurrentUser = currentUser!;
          newCurrentUser.header_img = url;
          // 更新头像
          const result = await userUpdateInfo({ header_img: url });
          if (result.code == 200) {
            setInitialState({ ...initialState, currentUser: newCurrentUser });
            message.success(result.message);
            return;
          }
          message.info(result.message);
        },
        (progress) => {
          // 上传进度回调 返回进度0.0-1
          openNotification(progress);
          if (progress == 1) {
            notification.open({
              key: 'upload_headimg',
              message: '头像上传',
              description: <Progress size="small" percent={100} status="success" />,
              icon: <CheckCircleOutlined style={{ color: '#52c14A' }} />,
              duration: 3,
            });
            // 直接关闭
            // notification.close("upload_headimg")
          }
          console.log('percent', progress);
        },
      );
      c_obj.getFederationTokenData();
      // 返回 false 将不触发组件的action操作 即不使用组件的上传功能
      return false;
      // -------------------------腾讯云cos-----------------------------------------------------------
    },
    onChange: (info: UploadChangeParam) => {
      // 上传完成 标志为done
      if (info.file.status == 'done') {
        const newCurrentUser = currentUser!;
        newCurrentUser.header_img = info.file.response.data.url;
        setInitialState({ ...initialState, currentUser: newCurrentUser });
        message.success(info.file.response.message);
      }
    },
  };

  // 头像组件 方便以后独立，增加裁剪之类的功能
  const AvatarView = ({ avatar }: { avatar: string | undefined }) => (
    <>
      <div className={styles.avatar_title}>头像</div>
      <Avatar className={styles.avatar} src={avatar} />
      <Upload showUploadList={false} {...upload_props}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
      <span>推荐尺寸120pxX120px 1MB &lt; 文件大小 支持jpeg/png/jpg</span>
    </>
  );

  // 更新资料
  const handleFinish = async (values: USER.UpdateUserInfo) => {
    const result = await userUpdateInfo(values);
    if (result.code == 200) {
      message.success(result.message);
      return;
    }
    message.info(result.message);
  };
  return (
    <div className={styles.baseView}>
      {!currentUser ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  children: '更新基本信息',
                },
              }}
              initialValues={{
                user_email: currentUser.user_email,
                nickname: currentUser.nickname,
              }}
              hideRequiredMark
            >
              <ProFormText width="md" name="user_email" label="邮箱" />
              <ProFormText width="md" name="nickname" label="昵称" />
              <ProFormTextArea label="个人简介" placeholder="个人简介" />
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={currentUser.header_img} />
          </div>
        </>
      )}
    </div>
  );
});
