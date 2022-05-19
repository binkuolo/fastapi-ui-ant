import { memo, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import { Card, Tree, message, Button } from 'antd';
import { allAccess, roleUpdateAccess } from '@/services/role/api';
import { CheckCircleOutlined } from '@ant-design/icons';

export default memo(() => {
  const [RoleData] = useState<ROLE.RoleItem | any>(history.location.state);
  const [AccessData, setAccessData] = useState<Access.AccessItem[]>();
  const [RoleAccess, setRoleAccess] = useState<string[]>();
  const [checkedKeysData, setCheckedKeysData] = useState<number | string[]>([]);

  // 获取角色权限、所有权限
  const get_access = async () => {
    const result = await allAccess({ role_id: RoleData.id });
    if (result.code === 200) {
      setAccessData(result.data.all_access);
      setRoleAccess(result.data.role_access);
      return;
    }
    message.info(result.message);
  };

  const set_access = async () => {
    const result = await roleUpdateAccess({ role_id: RoleData.id, access: checkedKeysData });
    if (result.code === 200) {
      message.success(result.message);
      return;
    }
    message.info(result.message);
  };

  useEffect(() => {
    if (RoleData) {
      get_access();
      return;
    }
    history.goBack();
  }, [RoleData]);

  return (
    <PageContainer
      title={`${RoleData?.role_name} 权限设置`}
      footer={[
        <Button key={'back'}>
          <Link to={'/admin/role'}>返回</Link>
        </Button>,
        <Button type={'primary'} icon={<CheckCircleOutlined />} onClick={set_access} key={'save'}>
          保存
        </Button>,
      ]}
    >
      <Card>
        {AccessData && RoleAccess && (
          <Tree
            checkable
            defaultExpandAll
            defaultCheckedKeys={RoleAccess}
            selectable={false}
            onCheck={(_, info) => {
              setCheckedKeysData(
                info.checkedNodes.map((v) => v.key).filter((v) => typeof v == 'number'),
              );
            }}
            treeData={AccessData}
          />
        )}
      </Card>
    </PageContainer>
  );
});
