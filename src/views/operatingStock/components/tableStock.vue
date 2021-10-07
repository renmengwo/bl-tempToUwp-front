<template>
  <div class="clearfix">
    <div class="fl m-b-10">
      <el-button type="primary" :disabled="multipleSelection.length === 0" @click="handleBatch">批量创建需求单</el-button>
      <el-button type="primary" @click="handleUpdate">更新建议下单量</el-button>
      <el-button type="primary" @click="handleExportAll">导出全部备货建议</el-button>
      <batchChangeNum style="display: inline-block" class="m-l-13" @handleSeach="handleSeach"></batchChangeNum>
      <importData :is-export-data="isExportData" style="display: inline-block" class="m-l-13" @handleSeach="handleSeach"></importData>
      <el-tag v-if="taskNo" class="m-l-10">说明:本批次{{ (taskNo) }}更新时间为: {{ updatedTime }}</el-tag>
    </div>
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
        width="400px"
        fixed="left"
      >
        <template slot-scope="scope">
          <div class="m-t-5 m-b-5">
            <div class="clearfix  m-b-5">
              <div class="fl p-l-10">
                <el-image
                  style="width: 80px; height: 100px"
                  :src="scope.row.demandExtendBO.image"
                  lazy
                  scroll-container=".el-table__fixed-body-wrapper"
                  :preview-src-list="[scope.row.demandExtendBO.image]"
                >
                </el-image>
              </div>
              <div class="fl p-r-10 m-l-9">
                <p>GoodsID:{{ scope.row.panguGoodsId }}</p>
                <p>颜色:{{ scope.row.demandExtendBO.panguGoodsColor }}</p>
                <p>DDID:{{ scope.row.panguGoodsDdid }}</p>
                <p>上架时间:{{ scope.row.demandExtendBO.panguShelvesTime }}<template v-if="scope.row.demandExtendBO.shelvesDayCount || scope.row.demandExtendBO.shelvesDayCount === 0">({{ scope.row.demandExtendBO.shelvesDayCount }})</template></p>
                <p v-if="scope.row.demandExtendBO.firstCategoryName">分类：
                  <el-tooltip class="item" effect="dark" placement="top">
                    <template slot="content">
                      {{ scope.row.demandExtendBO.firstCategoryName }}<span v-if="scope.row.demandExtendBO.secondCategoryName">/</span>{{ scope.row.demandExtendBO.secondCategoryName }}<span v-if="scope.row.demandExtendBO.thirdCategoryName">/</span>{{ scope.row.demandExtendBO.thirdCategoryName }}<span v-if="scope.row.demandExtendBO.fourthCategoryName">/</span>{{ scope.row.demandExtendBO.fourthCategoryName }}
                    </template>
                    <span class="c-p">
                      {{ scope.row.demandExtendBO.firstCategoryName }}<span v-if="scope.row.demandExtendBO.secondCategoryName">/</span>{{ scope.row.demandExtendBO.secondCategoryName }}...
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
        label="尺码"
        width="100px"
      >
        <template slot-scope="{row}">
          <p v-for="item in row.demandItemBOList" :key="item.demandItemId" class="direction">
            <span>{{ item.goodsSize }}</span>
            <span v-if="item.canSale === 1">(可售)</span>
            <span v-if="item.canSale === 2">(不可售)</span>
          </p>
          <p v-if="row.demandItemBOList.length >1" class="allTotal">合计</p>
        </template>
      </el-table-column>
      <el-table-column
        width="1430px"
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
                <div class="p-l-5 p-r-5">
                  <el-input
                    v-if="item.isChange"
                    v-model="batchOrderCount"
                    placeholder="请输入"
                    @blur="handleChangeBatch"
                  ></el-input>
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
      <!--      <el-table-column
        header-align="center"
        align="center"
        label="已下单数"
        fixed="right"
        width="100px"
      >
        <template slot-scope="{row}">
          <p v-for="item in row.demandItemBOList" :key="`${item.demandItemId}ready`" class="direction">
            <span>{{ item.hadOrderCount }}</span>
          </p>
          <p v-if="row.demandItemBOList.length >1" class="allTotal">{{ row.hadOrderTotal }}</p>
        </template>
      </el-table-column>-->
      <el-table-column
        header-align="center"
        align="center"
        label="已下单数"
        fixed="right"
        width="100px"
      >
        <template slot-scope="{row}">
          <p v-for="item in row.demandItemBOList" :key="`${item.demandItemId}tody`" class="direction">
            <span>{{ item.todayHadOrderCount }}</span>
          </p>
          <p v-if="row.demandItemBOList.length >1" class="allTotal">{{ row.todayHadOrderCountTotal }}</p>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        width="130px"
      >
        <template slot="header" slot-scope="scope">
          <div>
            <span style="position:relative; top:-7px;">拟下单数</span>
            <span class="title-sort">
              <i class="el-icon-caret-top c-p hover-color" @click="sortData('asc','proposedOrderQuantity')"></i>
              <i class="el-icon-caret-bottom c-p hover-color" @click="sortData('desc','proposedOrderQuantity')"></i>
            </span>
          </div>
          <div class="p-l-5 p-r-5">
            <el-input
              v-model="batchOrderCount"
              placeholder="请输入"
              @blur="handleChangeBatch"
            ></el-input>
          </div>
        </template>
        <template slot-scope="{row}">

          <div v-for="item in row.demandItemBOList" :key="`${item.demandItemId}ready`" class="direction">
            <p style="width:90px">
              <el-input v-model.number="item.demandItemSalesInfoBO.proposedOrderQuantity" placeholder="请输入"></el-input>
            </p>
          </div>
          <p v-if="row.demandItemBOList.length >1" class="allTotal">{{ row.proposedOrderQuantity }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="备货建议状态"
        header-align="center"
        align="center"
        width="130px"
        fixed="right"
      >
        <template slot-scope="scope">
          <span :class="[scope.row.status === 3? 'color-reject' : '']">{{ scope.row.status | statusValue }}</span>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        width="150px"
        fixed="right"
      >
        <template slot="header" slot-scope="scope">
          <p>操作</p>
          <div class="p-l-5 p-r-5">
            <el-date-picker
              v-model="batchDate"
              style="width: 100%"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
              @change="handleChangeDate"
            >
            </el-date-picker>
          </div>
        </template>
        <template slot-scope="scope">
          <div class="p-l-5 p-r-5">
            <el-date-picker
              v-model="scope.row.expectedDeliveryDate"
              style="width: 100%"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </div>
          <p class="btn-common c-p t-c" @click="handleSingleCreat(scope.row, 1)">创建需求单</p>
          <p class="btn-common c-p t-c" @click="handleRemak(scope.row)">添加备注</p>
          <el-tooltip v-if="scope.row.remark.length > 7" class="item" effect="dark" :content="scope.row.remark" placement="top">
            <p class="c-p color-reject btn-remark p-l-5 p-r-5 t-c">{{ scope.row.remark }} </p>
          </el-tooltip>
          <p v-else class="color-reject t-c">{{ scope.row.remark }} </p>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加备注"
      :visible.sync="dialogVisible"
      width="420px"
    >
      <el-table
        border
        stripe
        :data="tableRemak"
        style="width: 100%"
      >
        <el-table-column
          prop="content"
          label="备注内容"
        >
        </el-table-column>
        <el-table-column
          prop="updatedTime"
          label="操作时间"
        >
        </el-table-column>
        <el-table-column
          prop="updatedUserName"
          label="操作人"
        >
        </el-table-column>
      </el-table>
      <p class="clearDiv m-t-10"></p>
      <div class="clearfix">
        <el-col class="set-name" :span="4">
          备注
        </el-col>
        <el-col :span="20">
          <el-input
            v-model="content"
            placeholder="请输入备注"
            type="textarea"
            clearable
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-col>
      </div>
      <div slot="footer" class="dialog-footer t-c">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="content.length === 0" @click="handleAddRemark">添 加 备 注</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogBatchVisible"
      width="420px"
    >
      <div class="create-box">
        <template v-if="infringingList.length > 0">
          <p class="color-reject"><i class=" el-icon-warning"></i>【必看】注意事项</p>
          <p>
            该GoodsID :{{ infringingList.join('、') }} 已经被标记为“侵权产品”
          </p>
        </template>
        <p>是否确认创建需求单?</p>
      </div>
      <div slot="footer" class="dialog-footer t-c">
        <el-button @click="dialogBatchVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="建议下单量任务管理"
      :visible.sync="dialogTaskVisible"
      width="820px"
    >
      <TaskList ref="TaskList"></TaskList>
    </el-dialog>
  </div>
</template>

<script>
import { tableHeaderTitle } from '@/views/operatingStock/components/index';

import goodsItem from '@/views/operatingStock/components/goodsItem';
import TaskList from '@/views/operatingStock/components/taskList';
import batchChangeNum from '@/views/operatingStock/components/batchChangeNum';
import importData from '@/views/operatingStock/components/importData';
import tagList from '@/views/operatingStock/components/tagList';
import { remarkSaveOrUpdate, remarkfindByPage, stockBatchCreate } from '@/api/stockOperation';
import { parseTime } from '@/utils';
import _ from 'lodash';
import { mapGetters } from 'vuex';
export default {
  name: 'TableStock',
  components: {
    goodsItem,
    TaskList,
    tagList,
    batchChangeNum,
    importData
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
    isExportData: {
      type: String,
      default: ''
    },
    tableList: {
      type: Array,
      default: () => []
    },
    taskNo: {
      type: String,
      default: ''
    },
    updatedTime: {
      type: String,
      default: ''
    }
  /*  maxHei: {
      type: Number,
      default: 0
    }*/
  },
  data() {
    return {
      dialogVisible: false,
      dialogTaskExportVisible: false,
      dialogBatchVisible: false,
      dialogTaskVisible: false,
      batchOrderCount: '',
      batchDate: '',
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
      tableRemak: [],
      infringingList: [],
      tableData: this.tableList,
      multipleSelection: []
    };
  },
  computed: {
    headerTitle() {
      return tableHeaderTitle;
    },
    tableHei() {
      return this.maxHei;
    },
    ...mapGetters(['regcode'])
  },
  mounted() {
    // this.$emit('handleSetHei');
  },
  methods: {
    handleExportAll() {
      this.$emit('handleExportAll');
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
    async handleRemak(obj) {
      this.dialogVisible = true;
      this.tableRemak = [];
      this.content = '';
      this.rowData = obj;
      const { demandId } = this.rowData;
      const params = {
        demandId,
        page: 1,
        pageSize: 9999
      };
      const { data: res } = await remarkfindByPage(params);
      if (res.code === 200) {
        this.tableRemak = res.data.items;
      }
    },
    async handleAddRemark() {
      const { demandId } = this.rowData;
      const params = {
        content: this.content,
        demandId
      };
      const { data: res } = await remarkSaveOrUpdate(params);
      if (res.code === 200) {
        this.dialogVisible = false;
        this.$message({
          message: '操作成功！',
          type: 'success',
          duration: 1000,
          onClose: () => {
            this.$emit('handleSuccess');
          }
        });
      }
    },
    handleBatch() {
      this.dialogBatchVisible = true;
      const infri = _.filter(this.multipleSelection, { 'infringingLable': 1 });
      if (infri.length > 0) {
        this.infringingList = infri.map(item => item.panguGoodsId);
      } else {
        this.infringingList = [];
      }
    },
    handleSelectionChange(val) {
      this.flag = 0;
      this.multipleSelection = val;
    },
    handleSingleCreat(obj, flag) {
      this.flag = flag;
      if (obj.proposedOrderQuantity !== 0) {
        this.rowData = obj;
        if (obj.infringingLable === 1) {
          this.infringingList.push(obj.panguGoodsId);
        } else {
          this.infringingList = [];
        }
        this.dialogBatchVisible = true;
      } else {
        this.$message.error('拟下单数为0，不能创建需求单！');
      }
    },
    async handleSure() {
      const _this = this;
      const params = _this.flag === 1 ? this.singleCreat() : this.batchCreat();
      const { data: res } = await stockBatchCreate(params);
      if (res.code === 200) {
        this.dialogBatchVisible = false;
        this.$message({
          message: '操作成功！',
          type: 'success',
          duration: 1000,
          onClose: () => {
            _this.$emit('handleSuccess');
          }
        });
      }
    },
    handleSeach() {
      this.$emit('handleSuccess');
    },
    singleCreat() {
      const params = [];
      const demandItemDTOList = [];
      const { demandId, goodsId, expectedDeliveryDate } = this.rowData;
      const finallyDate = expectedDeliveryDate.split(' ')[0].replace(/-/g, '/');
      const lastTime = new Date(finallyDate).getTime() + (24 * 60 * 60 * 1000) - 1;
      this.rowData.demandItemBOList.forEach(item => {
        const { demandItemId, goodsSizeId, goodsSize } = item;
        const { proposedOrderQuantity: orderCount } = item.demandItemSalesInfoBO;
        const body = {
          orderCount,
          demandItemId,
          goodsSizeId,
          goodsSize
        };
        demandItemDTOList.push(body);
      });
      const value = {
        demandId,
        goodsId,
        expectedDeliveryDate: parseTime(lastTime),
        demandItemDTOList
      };
      params.push(value);
      return params;
    },
    batchCreat() {
      const params = [];
      this.multipleSelection.forEach(item => {
        const demandItemDTOList = [];
        const { demandId, goodsId, expectedDeliveryDate } = item;
        const finallyDate = expectedDeliveryDate.split(' ')[0].replace(/-/g, '/');
        const lastTime = new Date(finallyDate).getTime() + (24 * 60 * 60 * 1000) - 1;
        item.demandItemBOList.forEach(itemDto => {
          const { demandItemId, goodsSizeId, goodsSize } = itemDto;
          const { proposedOrderQuantity: orderCount } = itemDto.demandItemSalesInfoBO;
          const body = {
            orderCount,
            demandItemId,
            goodsSizeId,
            goodsSize
          };
          demandItemDTOList.push(body);
        });
        const value = {
          demandId,
          goodsId,
          expectedDeliveryDate: parseTime(lastTime),
          demandItemDTOList
        };
        params.push(value);
      });
      return params;
    },
    handleChangeDate() {
      if (this.tableList.length > 0) {
        this.tableList.forEach(item => {
          item.expectedDeliveryDate = this.batchDate;
        });
      }
    },
    handleChangeBatch() {
      if (this.tableList.length > 0) {
        this.tableList.forEach(item => {
          item.demandItemBOList.forEach(childitem => {
            childitem.demandItemSalesInfoBO.proposedOrderQuantity = Number(this.batchOrderCount);
          });
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.btn-common{
  color:$btnColor
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
