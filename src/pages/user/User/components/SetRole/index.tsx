import { memo, useRef, useState } from 'react';
import { message } from 'antd';
import { ModalForm, ProFormCheckbox } from '@ant-design/pro-form';
import type { FormInstance } from '@ant-design/pro-form';
import { userSetRole } from '@/services/user/api';
import { all_role } from '@/services/role/api';

interface IProps {
  visible: boolean;
  setvisible: (e: boolean) => void;
  UserData: USER.UserItem;
}

export default memo(({ visible, setvisible, UserData }: IProps) => {
  const formRef = useRef<FormInstance>();
  const [submit, setsubmit] = useState(true);

  // 权限分配
  const updateUserRole = async (values: USER.SetUserRole) => {
    values.user_id = UserData.id;
    const result = await userSetRole(values);
    if (result.code == 200) {
      message.success(result.message);
      setvisible(false);
    } else {
      message.info(result.message);
    }
  };

  return (
    <>
      {UserData && (
        <ModalForm
          title={'角色分配'}
          visible={visible}
          formRef={formRef}
          width={400}
          submitter={{
            searchConfig: { submitText: '设置' },
            submitButtonProps: { disabled: submit },
          }}
          onFinish={updateUserRole}
          modalProps={{
            destroyOnClose: true,
            mask: true,
            onCancel: () => setvisible(false),
          }}
        >
          <ProFormCheckbox.Group
            name={'roles'}
            layout={'vertical'}
            request={async () => {
              const result = await all_role({ user_id: UserData.id });
              if (result.code == 200) {
                formRef.current?.setFieldsValue({ roles: result.data.user_roles });
                if (result.data.all_role.length) {
                  setsubmit(false);
                }
                return result.data.all_role;
              }
              return [];
            }}
          />
        </ModalForm>
      )}
    </>
  );
});
