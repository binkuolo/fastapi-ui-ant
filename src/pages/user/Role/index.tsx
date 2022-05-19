import { useState, useRef, memo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumnType, ActionType } from '@ant-design/pro-table';
import {
  ModalForm,
  DrawerForm,
  ProFormText,
  ProFormSwitch,
  ProForm,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { roleAdd, roleList, roleDelete, roleUpdate } from '@/services/role/api';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history } from 'umi';

export default memo(() => {
  const actionRef = useRef<ActionType>();
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [RoleData, setRoleData] = useState<ROLE.RoleItem>();

  // 创建角色
  const createRole = async (values: ROLE.CreateRole) => {
    const result = await roleAdd(values);
    if (result.code === 200) {
      // 关闭窗口
      setAddVisible(false);
      // 刷新列表
      actionRef.current?.reload();
      message.success(result.message);
    } else {
      message.success(result.message);
    }
  };

  // 删除角色
  const deleteRole = async (d: ROLE.RoleItem) => {
    const result = await roleDelete({ role_id: d.id });
    if (result.code === 200) {
      // 刷新列表
      actionRef.current?.reload();
      message.success(result.message);
    } else {
      message.success(result.message);
    }
  };

  // 修改角色
  const updateRole = async (d: ROLE.UpdateRole) => {
    if (RoleData) {
      d.id = RoleData.id;
      const result = await roleUpdate(d);
      if (result.code === 200) {
        // 刷新列表
        actionRef.current?.reload();
        setEditVisible(false);
        message.success(result.message);
      } else {
        message.success(result.message);
      }
    }
  };

  // 修改角色状态
  const changeRoleStatus = async (d: ROLE.RoleItem) => {
    d.role_status = !d.role_status;
    const result = await roleUpdate(d);
    if (result.code === 200) {
      // 刷新列表
      actionRef.current?.reload();
      message.success(result.message);
    } else {
      message.success(result.message);
    }
  };

  // 定义表头
  const columns: ProColumnType<ROLE.RoleItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'role_name',
      valueType: 'text',
    },
    {
      title: '备注',
      dataIndex: 'role_desc',
      valueType: 'text',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      width: 150,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTimeRange',
      fieldProps: {
        // defaultValue:[moment().subtract(1, 'days').startOf('day'), moment()],
        ranges: {
          今天: [moment().startOf('day'), moment().endOf('day')],
          昨天: [
            moment().subtract(1, 'days').startOf('day'),
            moment().subtract(1, 'days').endOf('day'),
          ],
          '3天内': [moment().subtract(2, 'days').startOf('day'), moment().endOf('day')],
          '7天内': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
          本周: [moment().subtract('weeks').startOf('week'), moment().endOf('week')],
          本月: [moment().subtract('months').startOf('month'), moment().endOf('month')],
          上月: [
            moment().subtract(1, 'months').startOf('month'),
            moment().subtract(1, 'months').endOf('month'),
          ],
        },
        showTime: {
          defaultValue: [moment('00:00:00', 'hh:mm:ss'), moment('23:59:59', 'hh:mm:ss')],
        },
      },
      hideInTable: true,
    },

    {
      title: '状态',
      dataIndex: 'role_status',
      width: 100,
      valueEnum: {
        false: { text: '已禁用', status: 'Error' },
        true: { text: '已启用', status: 'Success' },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_dom, d) => {
        return [
          <Button
            key={'disable'}
            type={d.role_status ? 'link' : 'link'}
            danger={d.role_status}
            onClick={() => changeRoleStatus(d)}
          >
            {d.role_status ? '禁用' : '启用'}
          </Button>,
          <Button
            key={'edit'}
            type="link"
            onClick={() => {
              setRoleData(d);
              setEditVisible(true);
            }}
          >
            编辑
          </Button>,
          <Button
            key={'set_access'}
            onClick={() => history.push({ pathname: '/admin/set/access', state: d })}
            type="link"
          >
            权限
          </Button>,
          <Popconfirm
            key={'delete'}
            title="😫删除不可逆，谨慎操作！"
            onConfirm={() => deleteRole(d)}
            placement="leftTop"
          >
            <Button danger type="link">
              删除
            </Button>
          </Popconfirm>,
        ];
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="所有角色"
        actionRef={actionRef}
        columns={columns}
        size="small"
        cardProps={{ bodyStyle: { paddingBottom: 0, paddingTop: 0 } }}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: '未创建角色' }}
        request={async (params) => roleList({ ...params })}
        toolBarRender={() => [
          <Button key="add_user" type="primary" onClick={() => setAddVisible(true)}>
            <PlusOutlined />
            创建角色
          </Button>,
        ]}
      />
      <ModalForm
        title={'添加角色'}
        visible={addVisible}
        width={500}
        submitter={{ searchConfig: { submitText: '创建' } }}
        onFinish={createRole}
        modalProps={{
          destroyOnClose: true,
          mask: true,
          onCancel: () => setAddVisible(false),
        }}
      >
        <ProForm.Item>
          <ProFormText
            name={'role_name'}
            label={'角色名'}
            placeholder={'角色名3-10个字符!'}
            rules={[
              {
                required: true,
                message: '请输入角色名!',
              },
              {
                min: 3,
                message: '角色名3-10个字符!',
              },
              {
                max: 15,
                message: '角色名3-10个字符!',
              },
            ]}
          />
        </ProForm.Item>
        <ProFormSwitch label={'默认未启用'} name={'role_status'} initialValue={false} />
        <ProForm.Item label="备注">
          <ProFormTextArea
            name="role_desc"
            fieldProps={{ maxLength: 30, showCount: true }}
            rules={[{ max: 30, message: '备注长度输入30个字符以内' }]}
          />
        </ProForm.Item>
      </ModalForm>
      <DrawerForm
        title={'编辑角色'}
        visible={editVisible}
        width={500}
        submitter={{ searchConfig: { submitText: '保存' } }}
        initialValues={RoleData}
        onFinish={updateRole}
        drawerProps={{
          destroyOnClose: true,
          mask: true,
          onClose: () => setEditVisible(false),
        }}
      >
        <ProForm.Item>
          <ProFormText
            name={'role_name'}
            label={'名称'}
            placeholder={'角色名3-10个字符!'}
            rules={[
              {
                required: true,
                message: '请输入角色名!',
              },
              {
                min: 3,
                message: '角色名3-10个字符!',
              },
              {
                max: 15,
                message: '角色名3-10个字符!',
              },
            ]}
          />
        </ProForm.Item>
        <ProFormSwitch label={'默认未启用'} name={'role_status'} initialValue={false} />
        <ProForm.Item label="备注">
          <ProFormTextArea
            name="role_desc"
            fieldProps={{ maxLength: 30, showCount: true }}
            rules={[{ max: 30, message: '备注长度输入30个字符以内' }]}
          />
        </ProForm.Item>
      </DrawerForm>
    </PageContainer>
  );
});
