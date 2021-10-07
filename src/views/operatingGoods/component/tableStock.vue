<template>
  <div class="clearfix">
    <el-table
      stripe
      :data="tableList"
      style="width: 100%"
      border
      :max-height="900"
      :header-row-class-name="tableHeader"
      :row-class-name="tableRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50px"
        fixed="left"
      ></el-table-column>
      <el-table-column
        label="商品信息"
        header-align="center"
        min-width="400px"
        fixed="left"
      >
        <template slot-scope="scope">
          <div class="m-t-5 m-b-5">
            <div class="clearfix  m-b-5">
              <div class="fl p-l-10">
                <el-image
                  style="width: 80px; height: 100px"
                  :src="scope.row.image"
                  lazy
                  scroll-container=".el-table__fixed-body-wrapper"
                  :preview-src-list="[scope.row.image]"
                >
                </el-image>
              </div>
              <div class="fl p-r-10 m-l-9">
                <p>GoodsID:{{ scope.row.panguGoodsId }}</p>
                <p>颜色:{{ scope.row.panguGoodsColor }}</p>
                <p>DDID:{{ scope.row.panguGoodsDdid }}</p>
                <p>上架时间:{{ scope.row.shelvesTime }} <template v-if="scope.row.shelvesDayCount">({{ scope.row.shelvesDayCount }})</template></p>
                <p v-if="scope.row.firstCategoryId">分类：
                  <el-tooltip class="item" effect="dark" placement="top">
                    <template slot="content">
                      {{ scope.row.firstCategoryName }}<span v-if="scope.row.secondCategoryName">/</span>{{ scope.row.secondCategoryName }}<span v-if="scope.row.thirdCategoryName">/</span>{{ scope.row.thirdCategoryName }}<span v-if="scope.row.fourthCategoryName">/</span>{{ scope.row.fourthCategoryName }}
                    </template>
                    <span class="c-p">
                      {{ scope.row.firstCategoryName }}<span v-if="scope.row.secondCategoryName">/</span>{{ scope.row.secondCategoryName }}...
                    </span>
                  </el-tooltip>
                </p>
                <p>分析品类:{{ scope.row.categoryName }}</p>
              </div>
            </div>
            <tagList :row-data="scope.row"></tagList>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="left"
        min-width="100px"
        label="尺码"
      >
        <template slot-scope="{row}">
          <template v-for="item in row.goodsIdItemBOList">
            <p v-if="item.panguSize !== 'statistics'" :key="item.goodsSizeId" class="direction">
              <span>{{ item.panguSize }}</span>
              <span v-if="item.canSale === 1">(可售)</span>
              <span v-if="item.canSale === 2">(不可售)</span>
            </p>
          </template>
          <p v-if="row.goodsIdItemBOList.length >2" class="allTotal">合计</p>
        </template>
      </el-table-column>
      <el-table-column
        width="770px"
      >
        <template slot="header" slot-scope="scope">
          <div class="title-common details-title">
            <div v-for="item in headerTitle" :key="item.id">
              <div class="p-t-5 p-b-5">
                <div>
                  <span :style=" item.sortable? OnesortStyle : ''">{{ item.tableName }}</span>
                  <span v-if="item.sortable" class="title-sort">
                    <i class="el-icon-caret-top c-p hover-color" @click="sortData('asc',item.propName)"></i>
                    <i class="el-icon-caret-bottom c-p hover-color" @click="sortData('desc',item.propName)"></i>
                  </span>
                </div>
              </div>
              <div v-if="item.children" class="title-common goods-title">
                <p v-for="childitem in item.children" :key="childitem.id">
                  <el-tooltip v-if="childitem.tipsShow" class="item" effect="dark" :content="childitem.tipsValue" placement="top">
                    <span class="c-p">{{ childitem.tableName }} <i class="el-icon-question"></i></span>
                  </el-tooltip>
                  <span v-else>{{ childitem.tableName }}</span>
                  <span v-if="childitem.sortable" class="title-sort" :style=" childitem.sortable? sortStyle : ''">
                    <i class="el-icon-caret-top c-p hover-color" @click="sortData('asc',childitem.propName )"></i>
                    <i class="el-icon-caret-bottom c-p hover-color" @click="sortData('desc',childitem.propName)"></i>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </template>
        <template slot-scope="scope">
          <goodsItem :details-array="scope.row"></goodsItem>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        width="150px"
        fixed="right"
        align="center"
        label="操作"
      >
        <template slot-scope="{row}">
          <p class="btn-common c-p t-c" @click="handleOpreta(row)">{{ row.dmsIsClearance === 1 ? '移除清仓' : '设置清仓' }}</p>
          <p class="btn-common c-p t-c" @click="handleSetFestival(row)">设置节日</p>
          <p class="btn-common c-p t-c" @click="handleRemoveFestival(row)">移除节日</p>
          <p class="btn-common c-p t-c" @click="handleLogs(row)">操作记录</p>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="设置节日标签"
      :visible.sync="dialogVisible"
      width="420px"
    >
      <setFestival ref="setFestival" :has-festival="hasFestival"></setFestival>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="操作记录"
      :visible.sync="dialogLogsVisible"
      width="520px"
    >
      <logs :table-list="logsTables"></logs>
    </el-dialog>
  </div>
</template>

<script>
import { tableHeaderTitle } from '@/views/operatingGoods/component/index';
import goodsItem from './goodsItem';
import tagList from './tagList';
import setFestival from './setFestival';
import { setClearanceByDms, removeFestivalBatch, setFestivalBatch, logFindPage } from '@/api/stockOperation';
import { logs } from '@/views/dynamicRules/components';
export default {
  name: 'TableStock',
  components: {
    goodsItem,
    tagList,
    setFestival,
    logs
  },
  filters: {
    trendValue(value) {
      const body = {
        'up': '上升',
        'down': '下降',
        'steady': '稳健'
      };
      return body[value];
    },
    seasonValue(value) {
      const body = {
        'in': '应季',
        'out': '反季'
      };
      return body[value];
    },
    salesExceptValue(value) {
      const body = {
        'up': '骤升',
        'down': '骤降'
      };
      return body[value];
    },
    statusValue(value) {
      const body = {
        1: '待创建需求单 ',
        2: '已创建需求',
        3: '已作废'
      };
      return body[value];
    }
  },
  props: {
    tableList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      batchOrderCount: '',
      value1: '',
      dialogVisible: false,
      dialogLogsVisible: false,
      sortStyle: {
        position: 'relative',
        top: '7px'
      },
      OnesortStyle: {
        position: 'relative',
        top: '-7px'
      },
      content: '',
      flag: 1,
      maxHei: 700,
      rowData: {},
      multipleSelection: [],
      logsTables: [],
      hasFestival: []
    };
  },
  computed: {
    headerTitle() {
      return tableHeaderTitle;
    }
  },
  mounted() {
    // this.$emit('handleSetHei');
  },
  methods: {
    async handleLogs(obj) {
      this.logsTables = [];
      this.dialogLogsVisible = true;
      const { goodsId } = obj;
      const params = {
        goodsId,
        page: 1,
        pageSize: 99999
      };
      const { data: res } = await logFindPage(params);
      if (res.code === 200) {
        this.logsTables = res.data.items;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('selection-change', val);
    },
    handleUpdate() {
      this.dialogTaskVisible = true;
      this.$nextTick(() => {
        this.$refs.TaskList.getInitData();
      });
    },
    tableHeader({ row, rowIndex }) {
      return 'table-row-header';
    },
    tableRow({ row, rowIndex }) {
      return 'table-row-content';
    },
    sortData(value, name) {
      this.$emit('handleSort', value, name);
    },
    handleOpreta(obj) {
      const msg = `是否确认${obj.dmsIsClearance === 1 ? '移除' : '设置'}清仓商品!`;
      this.$confirm(`${msg}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.setStatusDms(obj);
      }).catch(() => {

      });
    },
    handleSetFestival(obj) {
      const { festivalIds } = obj.tabBoinfo;
      this.rowData = obj;
      this.dialogVisible = true;
      if (festivalIds) {
        this.hasFestival = festivalIds.split(',');
      } else {
        this.hasFestival = [];
      }
      this.$nextTick(() => {
        this.$refs.setFestival.setInitData();
      });
    },
    handleSure() {
      this.$refs.setFestival.submite().then(async result => {
        const params = {
          goodsIds: [this.rowData.goodsId],
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
              _this.$emit('handleSuccess');
            }
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    handleRemoveFestival(obj) {
      this.$confirm('确定移除该商品所有节日标签？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeGoodsFestive(obj);
      }).catch(() => {

      });
    },
    async removeGoodsFestive(obj) {
      const params = {
        goodsIds: [obj.goodsId]
      };
      const { data: res } = await removeFestivalBatch(params);
      if (res.code === 200) {
        const _this = this;
        this.$message({
          type: 'success',
          message: '操作成功！',
          duration: 1000,
          onClose: () => {
            _this.$emit('handleSuccess');
          }
        });
      }
    },
    async setStatusDms(obj) {
      const params = {
        dmsIsClearance: 1 - obj.dmsIsClearance,
        goodsIdList: [obj.goodsId]
      };
      const { data: res } = await setClearanceByDms(params);
      if (res.code === 200) {
        const _this = this;
        this.$message({
          type: 'success',
          message: '操作成功！',
          duration: 1000,
          onClose: () => {
            _this.$emit('handleSuccess');
          }
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.btn-common{
  color:#409EFF
}
.hover-color{
  &:hover{
   @extend .btn-common
  }
}
.create-box{
  @include classFontsize(#333,$middle)
}
$border: 1px solid #ebeef5;
::v-deep .title-common{
  display:flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
}
::v-deep .details-title{
  &>div{
    border-right:$border;
    &>p, &>div{
      text-align: center;
    }
  }
  &>div:last-child{border:none;}
  /*&>div:nth-child(4),&>div:nth-child(5){
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }*/
}
::v-deep .goods-title{
  p{
    border-top:$border;
    border-right:$border;
    width:110px;
    text-align: center;
    padding: 5px 0;
    height: 50px;
    line-height: 40px;
  }
  &>p:last-child{border-right:none;}
}

.btn-remark{
  width:100%;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}
.title-sort{
  display: inline-block;
  width: 16px;
  i{
    display: block;
  }
}
.direction{
  display: flex;
  flex-direction: column;
  height: 51px;
  border-bottom: 1px solid #ebeef5;
  justify-content: center;
  align-items: center;
  &:last-child{
    border-bottom:none;
  }
}
.allTotal{
  background: #b3d8ff;
  height: 50px;
  line-height: 50px;
}
.btn-common{
  color:$btnColor
}
</style>
<style lang="scss">
.table-row-header{
  th,.cell{
    padding:0!important;
  }
}
.table-row-content{
  td,.cell{
    padding:0!important;
  }
}
</style>
