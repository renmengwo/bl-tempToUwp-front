const { systemId } = require('@/settings')
import Vue from 'vue';
import Router from 'vue-router';
// import permissionRoute from '@/router/module/permissionSetting';
import dynamicRouter from '@/router/module/dynamicRules';
import Layout from '@/layout';
import GoodsRoute from '@/router/module/operatingGoods';
import StocksRoute from '@/router/module/operatingStock';

Vue.use(Router);

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 404 page must be placed at the end !!!export
export const errorPath = { path: '*', redirect: '/404', hidden: true };

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/formTemplate/index.vue'),
    meta: { title: '表单自定义构建' }
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import(/* webpackChunkName: "layout" */'@/views/main.vue')
      }
    ]
  }

];

export const aynscRoutes = [
  // permissionRoute,
  GoodsRoute,
  StocksRoute,
  dynamicRouter
];

const createRouter = () => new Router({
  // mode: 'history' require service support
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes: systemId && systemId !== '' ? constantRoutes : [...constantRoutes, ...aynscRoutes]
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
