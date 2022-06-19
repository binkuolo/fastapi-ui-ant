import { userUpdateInfo } from '@/services/user/api';
import { UploadOutlined } from '@ant-design/icons';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Avatar, Button, message, Upload } from 'antd';
import { memo } from 'react';
import { useModel } from 'umi';
import styles from './index.less';

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string | undefined }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <Avatar className={styles.avatar} src={avatar} />
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);

export default memo(() => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState!;
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
