<template>
  <div>
    <div id="header-seach" class="bg-containt p-t-15 p-l-15 p-r-15 clearfix m-b-20">
      <seachTop
        ref="seachTop"
        @handleSeach="handleSeach"
        @reset="reset"
      ></seachTop>
    </div>
    <div class="bg-containt p-10 clearfix">
      <div class="clearfix m-b-10">
        <el-button type="primary" :disabled="isClick" @click="handleSetStock(1)">设为清仓</el-button>
        <el-button type="primary" :disabled="isClick" @click="handleSetStock(0)">移除清仓</el-button>
        <el-button type="primary" :disabled="isClick" @click="handleSetFestive">设置节日</el-button>
        <el-button type="primary" :disabled="isClick" @click="handleRemoveFestive">移除节日</el-button>
      </div>
      <tableStock
        ref="tableStock"
        :table-list="tableList"
        @handleSort="handleSort"
        @handleSuccess="getInitData"
        @selection-change="handlselectionChange"
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
    <el-dialog
      title="设置节日标签"
      :visible.sync="dialogVisible"
      width="420px"
    >
      <setFestival ref="setFestival"></setFestival>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pageMixin from '../../utils/mixin';
import seachTop from './component/seachTop';
import tableStock from './component/tableStock';
import setFestival from './component/setFestival';
import {
  findGoodsDataMonitoringByPage,
  getPgGoodsSalesAndStockList,
  setClearanceByDms,
  listByGoodsIds,
  removeFestivalBatch,
  setFestivalBatch
} from '@/api/stockOperation';
import _ from 'lodash';
export default {
  name: 'DataMonitorVue',
  components: {
    seachTop,
    tableStock,
    setFestival
  },
  mixins: [pageMixin],
  data() {
    return {
      tableList: [],
      multipleSelection: [],
      orderByColumn: '',
      orderByValue: '',
      dialogVisible: false
    };
  },
  computed: {
    isClick() {
      return this.multipleSelection.length === 0;
    }
  },
  mounted() {
    this.getInitData();
  },
  methods: {
    async handleSetStock(flag) {
      const setList = this.multipleSelection.some(item => item.dmsIsClearance === flag);
      if (setList) {
        this.$message({
          type: 'error',
          message: '请选择同一状态的数据',
          duration: 1000
        });
      } else {
        const params = {
          dmsIsClearance: flag,
          goodsIdList: this.multipleSelection.map(item => item.goodsId)
        };
        const { data: res } = await setClearanceByDms(params);
        if (res.code === 200) {
          const _this = this;
          this.$message({
            type: 'success',
            message: '操作成功！',
            duration: 1000,
            onClose: () => {
              _this.handleSeach();
            }
          });
        }
      }
    },
    handlselectionChange(val) {
      this.multipleSelection = val;
    },
    handleSeach() {
      this.page = 1;
      this.getInitData();
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
    async getInitData() {
      const { data: res } = await findGoodsDataMonitoringByPage(this.doSeach());
      if (res.code === 200) {
        if (res.data.items && res.data.items.length > 0) {
          await this.getAllData(res.data.items);
          this.totalCount = res.data.total;
        } else {
          this.totalCount = 0;
          this.tableList = [];
        }
      }
    },
    async getAllData(arr) {
      try {
        const goodsIds = arr.map(item => item.goodsId);
        const params = {
          goodsIds
        };
        const { data: res } = await getPgGoodsSalesAndStockList(params);
        if (res.code === 200) {
          if (res.data.mapList) {
            const objList = [];
            goodsIds.forEach(item => {
              const body = {
                goodsId: item,
                goodsIdItemBOList: []
              };
              for (const i in res.data.mapList) {
                if (item === i) {
                  body.goodsIdItemBOList = res.data.mapList[i];
                }
              }
              objList.push(body);
            });
            new Promise(resolve => {
              for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < objList.length; j++) {
                  if (arr[i].goodsId === objList[j].goodsId) {
                    this.$set(arr[i], 'goodsIdItemBOList', objList[j].goodsIdItemBOList);
                    break;
                  }
                }
              }
              resolve();
            }).then(() => {
              /* const setData = this.setPublicNum(arr);
              this.tableList = setData.items;*/
              this.tableList = arr;
            });
          } else {
            arr.forEach(item => {
              this.$set(item, 'goodsIdItemBOList', []);
            });
          }
        }
        const { data: result } = await listByGoodsIds(params);
        if (result.code === 200) {
          if (result.data && result.data.length > 0) {
            for (let i = 0; i < arr.length; i++) {
              const indexItem = arr[i];
              const { goodsId: tabGoodids } = indexItem;
              for (let j = 0; j < result.data.length; j++) {
                const { goodsId: tagGoodids } = result.data[j];
                if (tabGoodids === tagGoodids) {
                  this.$set(indexItem, 'tabBoinfo', result.data[j]);
                  break;
                }
              }
            }
          }
        }
        this.tableList = arr;
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
    reset() {
      this.orderByColumn = '';
      this.orderByValue = '';
    },
    handleSetFestive() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.setFestival.setInitData();
      });
    },
    handleSure() {
      this.$refs.setFestival.submite().then(async result => {
        const params = {
          goodsIds: this.multipleSelection.map(item => item.goodsId),
          festivalAttrIds: result
        };
        const { data: res } = await setFestivalBatch(params);
        if (res.code === 200) {
          this.dialogVisible = false;
          const _this = this;
          this.$message({
            type: 'success',
            message: '操作成功！',
            duration: 1000,
            onClose: () => {
              _this.handleSeach();
            }
          });
        }
      });
    },
    handleRemoveFestive() {
      this.$confirm('确定移除商品所有节日标签？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const params = {
          goodsIds: this.multipleSelection.map(item => item.goodsId)
        };
        const { data: res } = await removeFestivalBatch(params);
        if (res.code === 200) {
          const _this = this;
          this.$message({
            type: 'success',
            message: '操作成功！',
            duration: 1000,
            onClose: () => {
              _this.handleSeach();
            }
          });
        }
      }).catch(() => {

      });
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
    }
  }
};
</script>

<style scoped>

</style>
