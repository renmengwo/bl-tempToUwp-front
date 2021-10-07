import Layout from '@/layout';

const dynamicRouter = {
  path: '/dynamic',
  component: Layout,
  redirect: '/index',
  name: 'Rynamic',
  meta: { title: '动态规则管理', menuCode: 'DMS-DTGZGL' },
  children: [
    {
      path: 'commodityLevel',
      name: 'CommodityLevel',
      component: () => import('@/views/dynamicRules/commodityLevel'),
      meta: { title: '商品层次配置', menuCode: 'DMS-SPCCPZ' }
    },
    {
      path: 'analysisCategory',
      name: 'analysisCategory',
      component: () => import('@/views/dynamicRules/analysisCategory'),
      meta: { title: '分析品类配置', menuCode: 'DMS-FXPLPZ' }
    },
    {
      path: 'hierarchicalWeek',
      name: 'hierarchicalWeek',
      component: () => import('@/views/dynamicRules/hierarchicalWeek'),
      meta: { title: '层次周销配置', menuCode: 'DMS-CCZXPZ' }
    },
    {
      path: 'stockConfigSetting',
      name: 'stockConfigSetting',
      component: () => import('@/views/dynamicRules/stockConfigSetting'),
      meta: { title: '备货参数配置', menuCode: 'DMS-BHCSPZ' }
    },
    {
      path: 'festivalSetting',
      name: 'festivalSetting',
      component: () => import('@/views/dynamicRules/festivalSetting'),
      meta: { title: '节日款备货参数规则', menuCode: 'DMS-JRKBHCSGZ' }
    }
  ]
};

export default dynamicRouter;
