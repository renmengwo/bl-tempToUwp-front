<template>
  <div>
    <div id="header-seach" class="bg-containt p-t-15 p-l-15 p-r-15 clearfix m-b-20">
      <seachTop
        ref="seachTop"
        @handleIsExport="handleIsExport"
        @handleCanSale="handleCanSale"
        @handleSeach="handleSeach"
        @reset="reset"
      ></seachTop>
    </div>
    <div class="bg-containt p-10 clearfix">
      <tableStock
        ref="tableStock"
        :table-list="tableList"
        :updated-time="updatedTime"
        :task-no="taskNo"
        :is-export-data="isExportData"
        @handleExportAll="handleExportAll"
        @handleSort="handleSort"
        @handleSuccess="getInitData"
      ></tableStock>
      <p class="clearDiv m-b-10"></p>
      <div class="clearfix">
        <el-pagination
          class="fr"
          background
          :current-page="page"
          :page-sizes="pageSizeList"
          :page-size="pageSize"
          :layout="layout"
          :total="totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import pageMixin from '../../utils/mixin';
import tableStock from '@/views/operatingStock/components/tableStock';
import { StockPage } from '@/api/stockOperation';
import _ from 'lodash';
import { exportDemandData, getByDemandId } from '@/api/dynamicRule';
import seachTop from './components/seachTop';
import { LimitLoad } from '@/utils';
export default {
  name: 'Index',
  components: { tableStock, seachTop },
  mixins: [pageMixin],
  data() {
    return {
      show: false, // 1
      maxHei: 0,
      canSale: '',
      isExportData: '',
      taskNo: '',
      updatedTime: '',
      orderByColumn: '',
      orderByValue: '',
      tableList: []
    };
  },
  mounted() {
    this.getInitData();
    // this.resizeMaxHei();
  },
  /* beforeMount() {
    window.addEventListener('resize', this.resizeMaxHei);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeMaxHei);
  },*/
  methods: {
    handleCanSale(val) {
      this.canSale = val;
    },
    handleIsExport(val) {
      this.isExportData = val;
    },
    handleExportAll: _.throttle(async function() {
      const params = _.cloneDeep(this.doSeach());
      params.pageSize = this.totalCount;
      params.page = 1;
      const { data: res } = await exportDemandData(params);
      if (res.code === 200) {
        this.$message.success('导出任务创建成功！');
      }
    }, 5000),
    handleSeach() {
      this.page = 1;
      this.getInitData();
    },
    async getInitData() {
      const { data: res } = await StockPage(this.doSeach());
      if (res.code === 200) {
        if (res.data.taskNo) {
          this.taskNo = res.data.taskNo;
          this.updatedTime = res.data.updatedTime;
        }
        if (res.data.demandPageData) {
          await this.getAllData(res.data.demandPageData);
          this.totalCount = res.data.demandPageData.total;
        } else {
          this.totalCount = 0;
          this.tableList = [];
        }
      }
    },
    async getAllData(obj) {
      try {
        const demandIdList = obj.items.map(item => item.demandId);
        const reulst = _.chunk(demandIdList, 30);
        const limit = new LimitLoad(reulst, this.getLimitFun, 30);
        limit.handleLimtite().then(res => {
          console.log(res);
        });
        /* const params = {
          canSale: this.canSale,
          demandIdList: demandIdList
        };
        const { data: res } = await getByDemandId(params);
        if (res.code === 200) {
          if (res.data && res.data.length > 0) {
            const objList = [];
            demandIdList.forEach(item => {
              const body = {
                demandId: item,
                demandItemBOList: []
              };
              res.data.forEach(childitem => {
                if (item === childitem.demandId) {
                  body.demandItemBOList.push(childitem);
                }
              });
              objList.push(body);
            });
            new Promise(resolve => {
              for (let i = 0; i < obj.items.length; i++) {
                for (let j = 0; j < objList.length; j++) {
                  if (obj.items[i].demandId === objList[j].demandId) {
                    this.$set(obj.items[i], 'demandItemBOList', objList[j].demandItemBOList);
                    break;
                  }
                }
              }
              resolve();
            }).then(() => {
              const setData = this.setPublicNum(obj);
              this.tableList = setData.items;
            });
          } else {
            obj.items.forEach(item => {
              this.$set(item, 'demandItemBOList', []);
            });
            this.tableList = obj.items;
          }
        }*/
      } catch (e) {
        console.log(e);
      }
    },
    async handleCurrentChange(val) {
      this.page = val;
      await this.getInitData();
    },
    async handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      await this.getInitData();
    },
    // 计算合计和每一行的拟下单量
    setPublicNum(obj) {
      obj.items.forEach(item => {
        // 设置拟下单量877版本去掉了
        /* item.demandItemBOList.forEach(itemdto => {
          if (item.status === 1) {
            this.$set(itemdto, 'orderCount', itemdto.demandItemSalesInfoBO.finalSuggestOrderCount);
          } else if (item.status === 2) {
            const orderCount = itemdto.demandItemSalesInfoBO.finalSuggestOrderCount > itemdto.hadOrderCount ? itemdto.demandItemSalesInfoBO.finalSuggestOrderCount - itemdto.hadOrderCount : 0;
            this.$set(itemdto, 'orderCount', orderCount);
          } else {
            this.$set(itemdto, 'orderCount', 0);
          }
        });*/
        // 计算合计总和
        item.thirdTotal = _.sumBy(item.demandItemBOList, 'demandItemSalesInfoBO.thirtyDaysSales');
        item.sevenTotal = _.sumBy(item.demandItemBOList, 'demandItemSalesInfoBO.sevenDaysSales');
        item.sevenDayTotal = _.sumBy(item.demandItemBOList, 'demandItemSalesInfoBO.sevenDaysAverageSales').toFixed(2);
        item.realStockQuantityTotal = _.sumBy(item.demandItemBOList, 'demandItemSalesInfoBO.realStockQuantity');
        item.onwayTotal = _.sumBy(item.demandItemBOList, 'demandItemSalesInfoBO.onwayStock');
        item.suggestTotal = _.sumBy(item.demandItemBOList, 'demandItemSalesInfoBO.finalSuggestOrderCount');
        item.suggestOrderCountTotal = _.sumBy(item.demandItemBOList, 'demandItemSalesInfoBO.suggestOrderCount');
        // item.hadOrderTotal = _.sumBy(item.demandItemBOList, 'hadOrderCount');
        item.todayHadOrderCountTotal = _.sumBy(item.demandItemBOList, 'todayHadOrderCount');
        item.proposedOrderQuantity = _.sumBy(item.demandItemBOList, 'demandItemSalesInfoBO.proposedOrderQuantity');
        item.todayCount = _.sumBy(item.demandItemBOList, 'demandItemSalesInfoBO.todaySales');
        item.outOfStockNumTotal = _.sumBy(item.demandItemBOList, 'demandItemSalesInfoBO.outOfStockNum');
        item.vendibilityDayTotal = _.sumBy(item.demandItemBOList, 'demandItemSalesInfoBO.vendibilityDay');
      });
      return obj;
    },
    doSeach() {
      let body = _.cloneDeep(this.$refs.seachTop.doSeach());
      const params = {
        page: this.page,
        orderByColumn: this.orderByColumn,
        orderByValue: this.orderByValue,
        pageSize: this.pageSize
      };
      body = { ...body, ...params };
      return body;
    },
    resizeMaxHei: _.throttle(async function() {
      const documentHei = document.documentElement.clientHeight;
      const seachHei = document.getElementById('header-seach').clientHeight;
      const HEADER_HEI = 50;
      const PAGE_HEI = 42;
      const _HEI = 162;
      this.$refs.tableStock.maxHei = documentHei - seachHei - HEADER_HEI - PAGE_HEI - _HEI;
    }, 2000),
    reset() {
      this.orderByColumn = '';
      this.orderByValue = '';
      this.isExportData = '';
      this.canSale = '';
    },
    async handleSort(value, name) {
      if (name) {
        this.orderByColumn = name;
        this.orderByValue = value;
        await this.getInitData();
      } else {
        if (value === 'asc') {
          this.tableList = _.sortBy(this.tableList, function(item) {
            return -item.sevenDayTotal;
          });
        } else {
          this.tableList = _.sortBy(this.tableList, function(item) {
            return item.sevenDayTotal;
          });
        }
      }
    },
    async getLimitFun(demandIdList) {
      const params = {
        canSale: this.canSale,
        demandIdList: demandIdList
      };
      const { data: res } = await getByDemandId(params);
    }
  }
};
</script>

<style scoped lang="scss">
.line40{
  line-height:40px;
}
.transtion_property{
  -webkit-transition:0.5s ease;
  -moz-transition:0.5s ease;
  -webkit-transition-property:height;
  -moz-transition-property:height;
  height: 55px;
  overflow: hidden;
}
.transitionHeight{
  height: 100px;
}
</style>
