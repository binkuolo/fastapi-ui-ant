import { request } from 'umi';

/** 登录 */
export async function login(body: USER.AccountLogin) {
  return request<USER.ResLogin>('/api/v1/admin/account/login', {
    method: 'POST',
    data: body,
  });
}

/** 当前用户信息 */
export async function currentUser() {
  return request<USER.ResGetUserInfo>('/api/v1/admin/user/info', {
    method: 'GET',
  });
}

/** 用户列表 */
export async function userList(params: USER.GetUserListQuery) {
  return request<USER.ResGetUserList>('/api/v1/admin/user/list', {
    method: 'GET',
    params
  });
}

/** 创建用户 */
export async function userAdd(body: USER.CreateUser) {
  return request<APIBASE.BASE>('/api/v1/admin/user/add', {
    method: 'POST',
    data: body,
  });
}

/** 用户删除 */
export async function userDelete(params: {user_id: number}) {
  return request<APIBASE.BASE>('/api/v1/admin/user/del', {
    method: 'DELETE',
    params
  });
}
