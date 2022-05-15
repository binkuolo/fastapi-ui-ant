import { useState, useRef, memo } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Popconfirm, Avatar } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumnType, ActionType } from '@ant-design/pro-table'
import { ModalForm, DrawerForm, ProFormText, ProFormSwitch, ProForm, ProFormTextArea } from '@ant-design/pro-form'
import { userAdd, userList, userDelete } from '@/services/user/api';
import { PlusOutlined } from '@ant-design/icons';


export default memo(() => {
  const actionRef = useRef<ActionType>();
  const [addVisible, setAddVisible] = useState(false)
  const [editVisible, setEditVisible] = useState(false)

  // 创建用户
  const createUser = async (values: USER.CreateUser) => {
    if (values.user_phone == "") {
      values.user_phone = null
    }
    const result = await userAdd(values)
    if (result.code === 200) {
      // 关闭窗口
      setAddVisible(false)
      // 刷新列表
      actionRef.current?.reload()
      message.success(result.message)
    } else {
      message.success(result.message)
    }
  }
  // 删除用户
  const deletUser = async (key: number) => {
    const result = await userDelete({ user_id: key })
    if (result.code === 200) {
      // 刷新列表
      actionRef.current?.reload()
      message.success(result.message)
    } else {
      message.success(result.message)
    }
  }
  // 定义表头
  const columns: ProColumnType<USER.UserItem>[] = [
    {
      title: "头像",
      dataIndex: 'header_img',
      search: false,
      width: 60,
      render: (_, d) => <Avatar src={d.header_img} />
    },
    {
      title: "用户名",
      dataIndex: 'username',
      valueType: "text",
    },
    {
      title: "手机号",
      dataIndex: 'user_phone',
      valueType: "text",
    },
    {
      title: "邮箱",
      dataIndex: 'user_email',
      valueType: "text",
      search: false
    },
    {
      title: "备注",
      dataIndex: 'remarks',
      valueType: "text",
      search: false
    },
    {
      title: "状态",
      dataIndex: 'user_status',
      width: 100,
      valueEnum: {
        false: { text: '已禁用', status: 'Error' },
        true: { text: '已启用', status: 'Success' }
      },
    },
    {
      title: "操作",
      valueType: 'option',
      width: 200,
      render: (_dom, d) => {
        return ([
          d.user_status ? <Button key={'disable'} type='dashed' danger>禁用</Button> : <Button key={'enabled'} type='primary'>启用</Button>,
          <Button key={'edit'} ghost type='primary' onClick={() => setEditVisible(true)}>编辑</Button>,
          <Popconfirm key={'delete'} title='😫删除不可逆，谨慎操作！' onConfirm={() => deletUser(d.key)} placement='leftTop'>
            <Button danger>删除</Button>
          </Popconfirm>
        ])
      }
    },
  ]
  return (
    <PageContainer>
      <ProTable
        headerTitle="所有用户"
        actionRef={actionRef}
        columns={columns}
        size='small'
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: '未创建管理员' }}
        request={async (params) => userList({ ...params })}
        toolBarRender={() => [
          <Button key="add_user" type="primary" onClick={() => setAddVisible(true)}>
            <PlusOutlined />
            创建用户
          </Button>,
        ]}
      />
      <ModalForm
        title={"添加用户"}
        visible={addVisible}
        width={500}
        submitter={{ searchConfig: { submitText: "创建" } }}
        onFinish={createUser}
        modalProps={{
          destroyOnClose: true,
          mask: true,
          onCancel: () => setAddVisible(false)
        }}
      >
        <ProForm.Item>
          <ProFormText
            name={'username'}
            label={'用户名'}
            placeholder={'用户名3-10个字符!'}
            rules={[
              {
                required: true,
                message: '请输入用户名!'
              },
              {
                min: 3,
                message: '用户名3-10个字符!'
              },
              {
                max: 15,
                message: '用户名3-10个字符!'
              }
            ]}
          />
        </ProForm.Item>
        <ProForm.Item>
          <ProFormText.Password
            name={'password'}
            label={'密码'}
            placeholder={'密码长度6-12位'}
            rules={[
              {
                required: true,
                message: '请输入密码！'
              },
              {
                min: 6,
                message: '密码长度6-12位'
              },
              {
                max: 12,
                message: '密码长度6-12位'
              },
            ]}
          />
        </ProForm.Item>
        <ProForm.Item>
          <ProFormText
            name="user_phone"
            placeholder="手机号"
            label={"手机号"}

            rules={[
              // { required: true, message: "请输入手机号" },
              { pattern: /^1[3456789][0-9]{9}$/, message: "请输入手机号" },
            ]}
          />
        </ProForm.Item>

        <ProFormSwitch label={'默认未启用'} name={'user_status'} initialValue={false} />

        <ProForm.Item label="备注">
          <ProFormTextArea
            name="remarks"
            fieldProps={{ maxLength: 30, showCount: true }}
            rules={[
              { max: 30, message: "备注长度输入30个字符以内" }
            ]}
          />
        </ProForm.Item>
      </ModalForm>
      <DrawerForm
        title={"编辑用户"}
        visible={editVisible}
        width={500}
        submitter={{ searchConfig: { submitText: "保存" } }}
        drawerProps={{
          destroyOnClose: true,
          mask: true,
          onClose: () => setEditVisible(false)
        }}
      >
        <ProForm.Item>
          <ProFormText
            name={'username'}
            label={'用户名'}
            placeholder={'用户名3-10个字符!'}
            rules={[
              {
                required: true,
                message: '请输入用户名!'
              },
              {
                min: 3,
                message: '用户名3-10个字符!'
              },
              {
                max: 15,
                message: '用户名3-10个字符!'
              }
            ]}
          />
        </ProForm.Item>
        <ProForm.Item>
          <ProFormText.Password
            name={'password'}
            label={'密码'}
            placeholder={'密码长度6-12位'}
            rules={[
              {
                required: true,
                message: '请输入密码！'
              },
              {
                min: 6,
                message: '密码长度6-12位'
              },
              {
                max: 12,
                message: '密码长度6-12位'
              },
            ]}
          />
        </ProForm.Item>
        <ProForm.Item>
          <ProFormText
            name="user_phone"
            placeholder="手机号"
            rules={[
              { required: true, message: "请输入手机号" },
              { pattern: /^1[3456789][0-9]{9}$/, message: "请输入手机号" },
            ]}
          />
        </ProForm.Item>

        <ProFormSwitch label={'默认未启用'} name={'user_status'} initialValue={false} />

        <ProForm.Item label="备注">
          <ProFormTextArea
            name="remarks"
            fieldProps={{ maxLength: 30, showCount: true }}
            rules={[
              { max: 30, message: "备注长度输入30个字符以内" }
            ]}
          />
        </ProForm.Item>
      </DrawerForm>
    </PageContainer>
  )
})
