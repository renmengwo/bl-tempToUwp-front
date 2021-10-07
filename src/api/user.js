import { post } from '@/utils/request';
// const api = process.env.VUE_APP_BASE_API === 'dev' ? '/api' : '';
export const login = (params) => post(`/admin-server/login`, params);
export const logout = () => post(`/admin-server/loginout`);
// 用户管理列表页
export const userlist = (params) => post(`/admin-server/staff/findByPage`, params);
// 新增或修改用户管理
export const userSaveOrUpdate = (params) => post(`/admin-server/staff/saveOrUpdate`, params);
// 用户管理批量启用禁用
export const batchUpdateStatus = (params) => post(`/admin-server/staff/updateStatus`, params);
// 修改密码不需要原密码
export const updatePasswordUnNeedOld = (params) => post(`/admin-server/staff/updatePasswordUnNeedOld`, params);
// 获取用户信息
export const getUserInfo = () => post(`/admin-server/staff/getUserInfo`);
// 修改密码需要原密码
export const updatePasswordNeedOld = (params) => post(`/admin-server/staff/updatePasswordNeedOld`, params);

/* export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}*/

/* export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}*/
