<template>
  <div>
    <div class="bg-containt p-t-15 p-l-15 p-r-15 clearfix m-b-20">
      <div class="seach-box clearfix" style="flex:1">
        <div class="seach-item">
          <p class="set-name">DDID</p>
          <div>
            <el-input v-model="panguGoodsDdid" placeholder="请输入DDID" clearable></el-input>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">日期</p>
          <div>
            <el-date-picker
              v-model="timeList"
              style="width: 110%"
              type="daterange"
              range-separator="-"
              start-placeholder="开始"
              end-placeholder="结束"
              value-format="timestamp"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </div>
        </div>
        <div class="seach-item p-l-40">
          <el-button type="primary" @click="handleSeach">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </div>
    </div>
    <div class="bg-containt p-15">
      <el-empty v-if="isEmpty" description="暂无数据展示"></el-empty>
      <template v-else>
        <vEcharts v-for="(item, index) in trends" :id="item.id" ref="vEcharts" :key="index" :options="trendSetting[index].options" :height="item.height"></vEcharts>
      </template>

    </div>
  </div>
</template>

<script>
import vEcharts from '@/components/echarts';
import { trendList } from './dataOption';
import _ from 'lodash';
import { parseTime } from '@/utils';
import { repertoryTendency, salesTendency } from '@/api/stockOperation';
export default {
  name: 'Index',
  components: { vEcharts },
  data() {
    return {
      panguGoodsDdid: '',
      timeList: '',
      isEmpty: true,
      trendSetting: trendList
    };
  },
  computed: {
    trends() {
      return trendList;
    },
    pickerOptions() {
      return {
        disabledDate(time) {
          const licenseStart = new Date();
          return time.getTime() > licenseStart.getTime();
        }
      };
    }
  },
  mounted() {
    this.getQuery();
  },
  methods: {
    reset() {
      this.panguGoodsDdid = '';
      this.timeList = '';
    },
    doSeach() {
      return {
        panguGoodsDdid: this.panguGoodsDdid,
        startTime: this.timeList && this.timeList[0] ? parseTime(this.timeList[0], '{y}-{m}-{d}') : '',
        endTime: this.timeList && this.timeList[1] ? parseTime(this.timeList[1], '{y}-{m}-{d}') : ''
      };
    },
    handleSeach() {
      if (this.panguGoodsDdid && this.timeList && this.timeList[0]) {
        const betweenTime = (this.timeList[1] - this.timeList[0]) / (1000 * 60 * 60 * 24);
        if (betweenTime > 60) {
          this.$message({
            type: 'error',
            message: '选择日期不大于60天',
            duration: 1000
          });
        } else {
          this.getData();
        }
      } else {
        this.$message({
          type: 'error',
          message: '搜索条件不能为空',
          duration: 1000
        });
      }
    },
    async getData() {
      this.trendSetting[0].options.series = [];
      this.trendSetting[1].options.series = [];
      salesTendency(this.doSeach()).then(result => {
        const { data: res } = result;
        if (res.code === 200) {
          if (res.data && res.data.length > 0) {
            this.trendSetting[0].options = trendList[0].options;
            this.setEchartSeries(res.data, 'salesDate', 'totalSales', 'skuSalesList', 'sales', '总销量', 0);
          } else {
            this.trendSetting[0].options = {};
          }
        }
      });
      repertoryTendency(this.doSeach()).then(result => {
        const { data: res } = result;
        if (res.code === 200) {
          if (res.data && res.data.length > 0) {
            this.trendSetting[1].options = trendList[1].options;
            this.setEchartSeries(res.data, 'repertoryDate', 'stocks', 'skuRepertoryList', 'stocks', '总库存', 1);
          } else {
            this.trendSetting[1].options = {};
          }
        }
      });

      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.vEcharts.forEach(item => {
            item.drawLine();
          });
        }, 1000);
      });
    },
    setEchartSeries(arr, dateKey, totalKey, listKey, salesKey, title, index) {
      let sizeList = [];
      let legendData = [];
      let xAxisData = [];
      const series = [];
      let skuList = [];
      arr.forEach(item => {
        sizeList = [...sizeList, ...item[listKey].map(child => child.size)];
      });
      legendData = _.uniq(sizeList);
      xAxisData = arr.map(item => parseTime(new Date(item[dateKey]).getTime(), '{m}-{d}'));
      arr.forEach(item => {
        skuList = [...skuList, ...item[listKey]];
      });
      legendData.forEach(item => {
        const sizeDate = _.filter(skuList, function(o) { return item === o.size; });
        const body = {
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          name: item,
          data: sizeDate.map(num => num[salesKey])
        };
        series.push(body);
      });
      const value = {
        type: 'line',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        yAxisIndex: 0,
        name: title,
        data: arr.map(num => num[totalKey])
      };
      series.push(value);
      legendData.push(title);
      this.trendSetting[index].options.series = series;
      this.trendSetting[index].options.xAxis[0].data = xAxisData;
      this.trendSetting[index].options.legend.data = legendData;
    },
    getQuery() {
      const { panguGoodsDdid, dates } = this.$route.query;
      if (panguGoodsDdid) {
        const leftDate = new Date(this.calcTime(5)).getTime() - 1000 * 60 * 60 * 24;
        const rightDate = new Date(leftDate).getTime() - 1000 * 60 * 60 * 24 * (Number(dates) - 1);
        this.panguGoodsDdid = panguGoodsDdid;
        this.timeList = [rightDate, leftDate];
        this.getData();
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
      }
    },
    calcTime(offset, value) {
      const d = value ? new Date(value) : new Date();
      const utc = d.getTime() + (d.getTimezoneOffset() * 60000) - 12 * 60 * 60 * 1000;
      const nd = new Date(utc + (3600000 * offset));
      return nd.getTime();
    }

  }
};
</script>

<style scoped>

</style>
