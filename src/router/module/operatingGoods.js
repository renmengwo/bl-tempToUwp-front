import Layout from '@/layout';

const GoodsRoute = {
  path: '/operatingoods',
  redirect: '/index',
  name: 'OperatingGoods',
  component: Layout,
  meta: { title: '运营商品管理', menuCode: 'DMS-YYSPGL' },
  children: [
    {
      path: 'goodsLevelChange',
      name: 'goodsLevelChange',
      component: () => import('@/views/operatingGoods/index.vue'),
      meta: { title: '商品层次变更', menuCode: 'DMS-SPCCBG' }
    },
    {
      path: 'goodsDataMonitor',
      name: 'goodsDataMonitor',
      component: () => import('@/views/operatingGoods/dataMonitor.vue'),
      meta: { title: '商品数据监控', menuCode: 'DMS-SPSJJK' }
    },
    {
      path: 'goodstrend',
      name: 'goodstrend',
      component: () => import('@/views/trendChart/index.vue'),
      meta: { title: '趋势图', permissionId: 'DMS-SPSJJK', activeMenu: '/operatingoods/goodsDataMonitor' }
    }
  ]
};

export default GoodsRoute;

