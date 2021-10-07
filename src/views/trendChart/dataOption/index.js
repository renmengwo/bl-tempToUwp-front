export const trendList = [{
  height: '500px',
  id: 'sale',
  options: {
    title: {
      text: '销量趋势图',
      left: 'left'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: []
    },
    xAxis: [
      {
        type: 'category',
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '销量'
      }
    ],
    series: []
  }
}, {
  height: '500px',
  id: 'stock',
  options: {
    title: {
      text: '库存趋势图',
      left: 'left'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: []
    },
    xAxis: [
      {
        type: 'category',
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '库存'
      }
    ],
    series: []
  }
}
];
