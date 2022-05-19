import { request } from 'umi';

/** 所有角色 */
export async function all_role(params: { user_id?: number }) {
  return request<ROLE.AllRoleData>('/api/v1/admin/role/all', {
    method: 'GET',
    params,
  });
}

/** 角色列表 */
export async function roleList(params: APIBASE.TableQuery) {
  return request<ROLE.ResRoleList>('/api/v1/admin/role', {
    method: 'GET',
    params,
  });
}

/** 创建角色 */
export async function roleAdd(body: ROLE.CreateRole) {
  return request<APIBASE.BASE>('/api/v1/admin/role', {
    method: 'POST',
    data: body,
  });
}

/** 修改角色 */
export async function roleUpdate(body: ROLE.UpdateRole) {
  return request<APIBASE.BASE>('/api/v1/admin/role', {
    method: 'PUT',
    data: body,
  });
}

/** 角色删除 */
export async function roleDelete(params: { role_id: number }) {
  return request<APIBASE.BASE>('/api/v1/admin/role', {
    method: 'DELETE',
    params,
  });
}

/** 所有权限 */
export async function allAccess(params: { role_id: number }) {
  return request<Access.ResAccess>('/api/v1/admin/access', {
    method: 'GET',
    params,
  });
}

/** 修改角色 */
export async function roleUpdateAccess(body: Access.SetAccess) {
  return request<APIBASE.BASE>('/api/v1/admin/access', {
    method: 'PUT',
    data: body,
  });
}
