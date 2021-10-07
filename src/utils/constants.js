const ENV = process.env.VUE_APP_BASE_ENV;
let prefixUrl = '';
if (ENV === 'development' || ENV === 'test') {
  prefixUrl = 'https://bl-supply-chain-test.s3.cn-north-1.amazonaws.com.cn/bl/dms/';
}
if (ENV === 'pre' || ENV === 'production') {
  prefixUrl = 'https://bl-supply-chain.s3.cn-north-1.amazonaws.com.cn/bl/dms/';
}

const uploadFileTemp = {
  development: {
    stockConfigSetting: {
      name: '备货参数配置',
      downLoadUrl: `${prefixUrl}importExcel-dev/%E5%A4%87%E8%B4%A7%E5%8F%82%E6%95%B0%E8%A7%84%E5%88%99.xlsx`
    },
    analysisCategory: {
      name: '分析品类配置',
      downLoadUrl: `${prefixUrl}importExcel-dev/%E5%93%81%E7%B1%BB%E6%98%A0%E5%B0%84%E5%85%B3%E7%B3%BB.xlsx`
    },
    hierarchicalWeek: {
      name: '层次周销配置',
      downLoadUrl: `${prefixUrl}importExcel-dev/%E5%91%A8%E9%94%80%E8%A7%84%E5%88%99.xlsx`
    },
    orderondemand: {
      name: '备货需求下单',
      downLoadUrl: `${prefixUrl}importExcel-dev/%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%8B%9F%E4%B8%8B%E5%8D%95%E9%87%8F%E6%A8%A1%E6%9D%BF.xlsx`
    },
    goodsLevelChange: {
      name: '商品层次变更',
      downLoadUrl: `${prefixUrl}importExcel-dev/%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E5%BB%BA%E8%AE%AE%E5%B1%82%E6%AC%A1%E8%A7%84%E5%88%99.xlsx`
    }
  },
  test: {
    stockConfigSetting: {
      name: '备货参数配置',
      downLoadUrl: `${prefixUrl}importExcel-test/%E5%A4%87%E8%B4%A7%E5%8F%82%E6%95%B0%E8%A7%84%E5%88%99.xlsx`
    },
    analysisCategory: {
      name: '分析品类配置',
      downLoadUrl: `${prefixUrl}importExcel-test/%E5%93%81%E7%B1%BB%E6%98%A0%E5%B0%84%E5%85%B3%E7%B3%BB.xlsx`
    },
    hierarchicalWeek: {
      name: '层次周销配置',
      downLoadUrl: `${prefixUrl}importExcel-test/%E5%91%A8%E9%94%80%E8%A7%84%E5%88%99.xlsx`
    },
    orderondemand: {
      name: '备货需求下单',
      downLoadUrl: `${prefixUrl}importExcel-test/%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%8B%9F%E4%B8%8B%E5%8D%95%E9%87%8F%E6%A8%A1%E6%9D%BF.xlsx`
    },
    goodsLevelChange: {
      name: '商品层次变更',
      downLoadUrl: `${prefixUrl}importExcel-test/%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E5%BB%BA%E8%AE%AE%E5%B1%82%E6%AC%A1%E8%A7%84%E5%88%99.xlsx`
    }
  },
  pre: {
    stockConfigSetting: {
      name: '备货参数配置',
      downLoadUrl: `${prefixUrl}importExcel-pre/%E5%A4%87%E8%B4%A7%E5%8F%82%E6%95%B0%E8%A7%84%E5%88%99.xlsx`
    },
    analysisCategory: {
      name: '分析品类配置',
      downLoadUrl: `${prefixUrl}importExcel-pre/%E5%93%81%E7%B1%BB%E6%98%A0%E5%B0%84%E5%85%B3%E7%B3%BB.xlsx`
    },
    hierarchicalWeek: {
      name: '层次周销配置',
      downLoadUrl: `${prefixUrl}importExcel-pre/%E5%91%A8%E9%94%80%E8%A7%84%E5%88%99.xlsx`
    },
    orderondemand: {
      name: '备货需求下单',
      downLoadUrl: `${prefixUrl}importExcel-pre/%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%8B%9F%E4%B8%8B%E5%8D%95%E9%87%8F%E6%A8%A1%E6%9D%BF.xlsx`
    },
    goodsLevelChange: {
      name: '商品层次变更',
      downLoadUrl: `${prefixUrl}importExcel-pre/%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E5%BB%BA%E8%AE%AE%E5%B1%82%E6%AC%A1%E8%A7%84%E5%88%99.xlsx`
    }
  },
  production: {
    stockConfigSetting: {
      name: '备货参数配置',
      downLoadUrl: `${prefixUrl}importExcel-prod/%E5%A4%87%E8%B4%A7%E5%8F%82%E6%95%B0%E8%A7%84%E5%88%99.xlsx`
    },
    analysisCategory: {
      name: '分析品类配置',
      downLoadUrl: `${prefixUrl}importExcel-prod/%E5%93%81%E7%B1%BB%E6%98%A0%E5%B0%84%E5%85%B3%E7%B3%BB.xlsx`
    },
    hierarchicalWeek: {
      name: '层次周销配置',
      downLoadUrl: `${prefixUrl}importExcel-prod/%E5%91%A8%E9%94%80%E8%A7%84%E5%88%99.xlsx`
    },
    orderondemand: {
      name: '备货需求下单',
      downLoadUrl: `${prefixUrl}importExcel-prod/%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%8B%9F%E4%B8%8B%E5%8D%95%E9%87%8F%E6%A8%A1%E6%9D%BF.xlsx`
    },
    goodsLevelChange: {
      name: '商品层次变更',
      downLoadUrl: `${prefixUrl}importExcel-prod/%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E5%BB%BA%E8%AE%AE%E5%B1%82%E6%AC%A1%E8%A7%84%E5%88%99.xlsx`
    }
  }
};
export const uploadObj = uploadFileTemp[ENV];

