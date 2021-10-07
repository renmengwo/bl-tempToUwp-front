import Layout from '@/layout';

const permissionRoute = {
  path: '/permission',
  redirect: '/index',
  name: 'Permission',
  component: Layout,
  meta: { title: '系统设置', icon: 'el-icon-setting' },
  children: [
    {
      path: 'userSetting',
      name: 'userSetting',
      component: () => import('@/views/userSetting/index.vue'),
      meta: { title: '用户管理', icon: 'el-icon-user-solid' }
    }
  ]
};

export default permissionRoute;

