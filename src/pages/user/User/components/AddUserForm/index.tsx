import { memo } from 'react';
import { message } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSwitch, ProFormTextArea } from '@ant-design/pro-form';
import { userAdd } from '@/services/user/api';

interface IProps {
  actionRef: ActionType | undefined;
  visible: boolean;
  setvisible: (e: boolean) => void;
}

export default memo(({ actionRef, visible, setvisible }: IProps) => {
  // 创建用户
  const createUser = async (values: USER.CreateUser) => {
    if (values.user_phone == '') {
      values.user_phone = null;
    }
    const result = await userAdd(values);
    if (result.code === 200) {
      // 关闭窗口
      setvisible(false);
      // 刷新列表
      actionRef?.reload();
      message.success(result.message);
    } else {
      message.info(result.message);
    }
  };

  return (
    <ModalForm
      title={'添加用户'}
      visible={visible}
      width={500}
      submitter={{ searchConfig: { submitText: '创建' } }}
      onFinish={createUser}
      modalProps={{
        destroyOnClose: true,
        mask: true,
        onCancel: () => setvisible(false),
      }}
    >
      <ProFormText
        name={'username'}
        label={'用户名'}
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
        name={'password'}
        label={'密码'}
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
      <ProFormText
        name="user_phone"
        placeholder="手机号"
        label={'手机号'}
        rules={[{ pattern: /^1[3456789][0-9]{9}$/, message: '请输入手机号' }]}
      />

      <ProFormSwitch
        label={'用户状态'}
        tooltip={'默认禁用'}
        name={'user_status'}
        initialValue={false}
      />

      <ProFormTextArea
        label="备注"
        name="remarks"
        fieldProps={{ maxLength: 30, showCount: true }}
        rules={[{ max: 30, message: '备注长度输入30个字符以内' }]}
      />
    </ModalForm>
  );
});
