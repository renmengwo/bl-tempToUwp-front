export const tableHeaderTitle = [{
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
} /* {
    tableName: '已下单数',
    id: 4
  }, {
    tableName: '拟下单数',
    isChange: true,
    sortable: true,
    propName: 'proposedOrderQuantity',
    id: 5
  }*/];

