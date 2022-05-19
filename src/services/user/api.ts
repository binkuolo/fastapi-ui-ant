import { request } from 'umi';

/** 登录 */
export async function login(body: USER.AccountLogin) {
  return request<USER.ResLogin>('/api/v1/admin/user/account/login', {
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
  return request<USER.ResGetUserList>('/api/v1/admin/user', {
    method: 'GET',
    params,
  });
}

/** 创建用户 */
export async function userAdd(body: USER.CreateUser) {
  return request<APIBASE.BASE>('/api/v1/admin/user', {
    method: 'POST',
    data: body,
  });
}

/** 修改用户 */
export async function userUpdate(body: USER.UpdateUser) {
  return request<APIBASE.BASE>('/api/v1/admin/user', {
    method: 'PUT',
    data: body,
  });
}

/** 分配角色 */
export async function userSetRole(body: USER.SetUserRole) {
  return request<APIBASE.BASE>('/api/v1/admin/user/set/role', {
    method: 'PUT',
    data: body,
  });
}

/** 用户删除 */
export async function userDelete(params: { user_id: number }) {
  return request<APIBASE.BASE>('/api/v1/admin/user', {
    method: 'DELETE',
    params,
  });
}
