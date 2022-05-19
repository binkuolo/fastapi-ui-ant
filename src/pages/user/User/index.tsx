import { useState, useRef, memo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Popconfirm, Avatar } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumnType, ActionType } from '@ant-design/pro-table';
import { userList, userDelete, userUpdate } from '@/services/user/api';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import AddUserForm from './components/AddUserForm';
import EditUserForm from './components/EditUserForm';
import SetRole from './components/SetRole';

export default memo(() => {
  const actionRef = useRef<ActionType>();
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [roleVisible, setroleVisible] = useState(false);
  const [UserData, setUserData] = useState<USER.UserItem>();

  // 删除用户
  const deletUser = async (d: USER.UserItem) => {
    const result = await userDelete({ user_id: d.id });
    if (result.code === 200) {
      // 刷新列表
      actionRef.current?.reload();
      message.success(result.message);
    } else {
      message.info(result.message);
    }
  };

  // 修改用户状态
  const changeUserStatus = async (d: USER.UpdateUser) => {
    d.user_status = !d.user_status;
    const result = await userUpdate(d);
    if (result.code === 200) {
      // 刷新列表
      actionRef.current?.reload();
      message.success(result.message);
    } else {
      message.info(result.message);
    }
  };

  // 定义表头
  const columns: ProColumnType<USER.UserItem>[] = [
    {
      title: '头像',
      dataIndex: 'header_img',
      search: false,
      width: 60,
      render: (_, d) => <Avatar src={d.header_img} />,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      valueType: 'text',
    },
    {
      title: '手机号',
      dataIndex: 'user_phone',
      valueType: 'text',
      copyable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'user_email',
      valueType: 'text',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
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
      dataIndex: 'user_status',
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
            type={d.user_status ? 'dashed' : 'primary'}
            danger={d.user_status}
            onClick={() => changeUserStatus(d)}
          >
            {d.user_status ? '禁用' : '启用'}
          </Button>,
          <Button
            key={'setrole'}
            type={'dashed'}
            onClick={() => {
              setUserData(d);
              setroleVisible(true);
            }}
          >
            角色
          </Button>,
          <Button
            key={'edit'}
            ghost
            type="primary"
            onClick={() => {
              setUserData(d);
              setEditVisible(true);
            }}
          >
            编辑
          </Button>,
          <Popconfirm
            key={'delete'}
            title="😫删除不可逆，谨慎操作！"
            onConfirm={() => deletUser(d)}
            placement="leftTop"
          >
            <Button danger>删除</Button>
          </Popconfirm>,
        ];
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="所有用户"
        rowKey={'key'}
        actionRef={actionRef}
        columns={columns}
        size="small"
        cardProps={{ bodyStyle: { paddingBottom: 0, paddingTop: 0 } }}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: '未创建用户' }}
        request={async (params) => userList({ ...params })}
        toolBarRender={() => [
          <Button key="add_user" type="primary" onClick={() => setAddVisible(true)}>
            <PlusOutlined />
            创建用户
          </Button>,
        ]}
      />
      <AddUserForm visible={addVisible} setvisible={setAddVisible} actionRef={actionRef.current} />
      {UserData && (
        <EditUserForm
          visible={editVisible}
          setvisible={setEditVisible}
          actionRef={actionRef.current}
          UserData={UserData}
        />
      )}
      {UserData && (
        <SetRole visible={roleVisible} setvisible={setroleVisible} UserData={UserData} />
      )}
    </PageContainer>
  );
});
