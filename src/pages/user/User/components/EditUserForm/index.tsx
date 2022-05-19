import { memo, useRef } from 'react';
import { message } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import { DrawerForm, ProFormText, ProFormSwitch, ProFormTextArea } from '@ant-design/pro-form';
import type { FormInstance } from '@ant-design/pro-form';
import { userUpdate } from '@/services/user/api';

interface IProps {
  actionRef: ActionType | undefined;
  visible: boolean;
  setvisible: (e: boolean) => void;
  UserData: USER.UserItem;
}

export default memo(({ actionRef, visible, setvisible, UserData }: IProps) => {
  const formRef = useRef<FormInstance>();
  // 修改用户
  const updateUser = async (d: USER.UpdateUser) => {
    if (UserData) {
      console.log(d);

      if (d.user_phone == '') {
        d.user_phone = null;
      }
      if (d.password == '') {
        d.password = null;
      }
      d.id = UserData.id;
      const result = await userUpdate(d);
      if (result.code === 200) {
        // 刷新列表
        actionRef?.reload();
        setvisible(false);
        message.success(result.message);
      } else {
        message.info(result.message);
      }
    }
  };

  return (
    <DrawerForm
      title={'编辑用户'}
      visible={visible}
      formRef={formRef}
      width={500}
      submitter={{ searchConfig: { submitText: '保存' } }}
      initialValues={UserData}
      onFinish={updateUser}
      drawerProps={{
        destroyOnClose: true,
        mask: true,
        onClose: () => setvisible(false),
      }}
    >
      <ProFormText
        label={'用户名'}
        name={'username'}
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
        label={'密码'}
        name={'password'}
        placeholder={'密码长度6-12位'}
        rules={[
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
      <ProFormSwitch label={'用户状态'} tooltip={'默认禁用'} name={'user_status'} />
      <ProFormTextArea
        name="remarks"
        label="备注"
        fieldProps={{ maxLength: 30, showCount: true }}
        rules={[{ max: 30, message: '备注长度输入30个字符以内' }]}
      />
    </DrawerForm>
  );
});
