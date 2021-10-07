import { post, fetch } from '@/utils/request';
// 获取员工的菜单资源集合
export const findStaffResList = () => post(`/admin-server/findStaffResList`);
// 异步任务类型接口
export const getAllType = () => fetch(`/dms-server/asyntask/getAllType`);
