<template>
  <div>
    <div :id="id" :style="{height:height,width:width}"></div>
  </div>

</template>

<script>

import * as echarts from 'echarts';
export default {
  name: 'Index',
  props: {
    height: { type: String, default: '80vh' },
    width: { type: String, default: '100%' },
    id: { type: String, default: 'myEchart' },
    options: { type: Object, default: () => {} }
  },
  data() {
    return {};
  },
  computed: {
    myOptions: function() {
      return this.options || {};
    }
  },
  methods: {
    drawLine() {
      const myChart = echarts.init(document.getElementById(`${this.id}`));
      myChart.setOption(this.myOptions); // 绘制图表
      window.onresize = () => myChart.resize();
    }
  }
};
</script>

<style scoped>

</style>
