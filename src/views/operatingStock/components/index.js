export const tableHeaderTitle = [/* {
  tableName: '尺码',
  id: 0
}, */{
    tableName: '销量信息',
    id: 1,
    children: [{
      tableName: '30日销量',
      id: 11,
      propName: 'thirtyDaysSales',
      sortable: true
    }, {
      tableName: '7日销量',
      id: 12,
      propName: 'sevenDaysSales',
      sortable: true
    }, {
      tableName: '7日日均',
      id: 13
    // sortable: true
    }, {
      tableName: '今日销量',
      id: 17,
      propName: 'todaySales',
      sortable: true
    }, {
      tableName: '缺货数量',
      id: 20,
      propName: 'outOfStockNum',
      sortable: true
    }]
  }, {
    tableName: '库存信息',
    id: 2,
    children: [{
      tableName: '真实库存',
      id: 21
    }, {
      tableName: '在途',
      id: 22
    }]
  }, {
    tableName: '备货信息',
    id: 3,
    children: [{
      tableName: '可售天数(周)',
      id: 35,
      propName: 'vendibilityDay',
      sortable: true
    }, {
      tableName: '备货参数',
      tipsValue: '生产周期+备货天数+抗风险天数',
      tipsShow: true,
      id: 31
    }, {
      tableName: '趋势系数',
      id: 32
    }, {
      tableName: '应季系数',
      id: 33
    }, {
      tableName: '建议下单量(前)',
      sortable: true,
      propName: 'suggestOrderCount',
      id: 39
    }, {
      tableName: '建议下单量',
      tipsValue: '7日日均x【生产周期+备货天数+抗风险天数+趋势系数】x 应季系数 - (在仓+在途-已占用)+缺货数量',
      tipsShow: true,
      id: 34
    }]
  }/* {
    tableName: '已下单数',
    id: 4
  }, {
    tableName: '拟下单数',
    isChange: true,
    sortable: true,
    propName: 'proposedOrderQuantity',
    id: 5
  }*/];

