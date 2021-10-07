import Layout from '@/layout';

const StocksRoute = {
  path: '/operatinstock',
  redirect: '/index',
  name: 'OperatinStock',
  component: Layout,
  meta: { title: '运营备货管理', menuCode: 'DMS-YYBHGL' },
  children: [
    {
      path: 'orderondemand',
      name: 'orderOnDemand',
      component: () => import('@/views/operatingStock/index.vue'),
      meta: { title: '备货需求下单', menuCode: 'DMS-BHXQXD' }
    },
    {
      path: 'stocktrend',
      name: 'stocktrend',
      component: () => import('@/views/trendChart/index.vue'),
      meta: { title: '趋势图', permissionId: 'DMS-BHXQXD', activeMenu: '/operatingoods/orderondemand' }
    }
  ]
};

export default StocksRoute;

