import { request } from 'umi';

/** 登录 */
export async function login(body: USER.AccountLogin) {
  return request<USER.ResLogin>('/api/v1/admin/user/account/login', {
    method: 'POST',
    data: body,
  });
}

/** 获取验证码 */
export async function getCaptcha(params: { phone_number: string }) {
  return request<APIBASE.BASE>('/api/v1/sms/send', {
    method: 'GET',
    params,
  });
}

/** 获取修改手机号验证码 */
export async function getModifyCaptcha(params: { phone_number: string }) {
  return request<APIBASE.BASE>('/api/v1/sms/modify/send', {
    method: 'GET',
    params,
  });
}

/** 获取腾讯云对象存储cos临时访问token */
export async function getFederationToken(params: { file_type: string }) {
  return request<USER.CosFederationToken>('/api/v1/cos/get/federation/token', {
    method: 'GET',
    params,
  });
}

/** 获取微信授权url */
export async function getWechatAuthUrl(params: { scan_type: string }) {
  return request<USER.WechatAuthUrl>('/api/v1/wechat/auth/url', {
    method: 'GET',
    params,
  });
}
/** 用户微信绑定二维码url */
export async function getWechatBindUrl() {
  return request<USER.WechatAuthUrl>('/api/v1/wechat/auth/bind/url', {
    method: 'GET',
  });
}

/** 微信授权检测 */
export async function wechatAuthCheck() {
  return request<USER.ResLogin>('/api/v1/wechat/auth/check', {
    method: 'GET',
  });
}

/** 当前用户信息 */
export async function currentUser() {
  return request<USER.ResGetUserInfo>('/api/v1/admin/user/info', {
    method: 'GET',
  });
}

/** 当前用户访问日志 */
export async function accessLog() {
  return request<USER.AccessLogList>('/api/v1/admin/user/access/log', {
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

/** 用户修改个人信息 */
export async function userUpdateInfo(body: USER.UpdateUserInfo) {
  return request<APIBASE.BASE>('/api/v1/admin/user/info', {
    method: 'PUT',
    data: body,
  });
}

/** 用户修改手机号 */
export async function userUpdateMobile(body: USER.UpdateMobile) {
  return request<APIBASE.BASE>('/api/v1/admin/user/modify/mobile', {
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
