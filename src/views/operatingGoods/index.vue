<template>
  <div>
    <div class="bg-containt p-15 clearfix m-b-20">
      <el-form ref="rulesform" :inline="true" :model="rulesform" class="demo-form-inline" :rules="rules">
        <el-form-item label="GoodsID">
          <el-input v-model="rulesform.panguGoodsId" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="DDID">
          <el-input v-model="rulesform.panguGoodsDdId" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="建议商品层次" class="minDay">
          <el-select
            v-model="rulesform.operatorType"
            clearable
            placeholder="请选择..."
            collapse-tags
          >
            <el-option label="等于" value="1"></el-option>
            <el-option label="不等于" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前商品层次"></el-form-item>
        <el-form-item label="建议商品层次">
          <el-select
            v-model="rulesform.suggestLevelIdList"
            placeholder="请选择..."
            collapse-tags
            clearable
            multiple
            filterable
          >
            <el-option label="无" value="empty"></el-option>
            <el-option v-for="(item, index) in levelList" :key="index" :label="item.name" :value="item.levelId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前商品层次">
          <el-select
            v-model="rulesform.nowLevelIdList"
            placeholder="请选择..."
            collapse-tags
            clearable
            multiple
            filterable
          >
            <el-option label="无" value="empty"></el-option>
            <el-option v-for="(item, index) in levelList" :key="index" :label="item.name" :value="item.levelId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节日款" class="minDay" prop="shelvesDaysLast">
          <el-select v-model="rulesform.festivalList" placeholder="请选择" clearable filterable multiple collapse-tags>
            <el-option
              v-for="item in festList"
              :key="item.attrId"
              :label="item.attrCnName"
              :value="item.attrId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="变更建议状态">
          <el-select v-model="rulesform.mode" placeholder="请选择..." collapse-tags>
            <el-option label="系统变更" value="1"></el-option>
            <el-option label="人工变更" value="2"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="上架天数" class="minDay" prop="shelvesDaysLast">
          <el-input v-model.trim="rulesform.shelvesDays" placeholder="最小"></el-input> -
          <el-input v-model.trim="rulesform.shelvesDaysLast" placeholder="最大"></el-input>
        </el-form-item>
        <el-form-item label="7日销量" class="minDay" prop="sevenDaysSalesLast">
          <el-input v-model.trim="rulesform.sevenDaysSales" placeholder="最小"></el-input> -
          <el-input v-model.trim="rulesform.sevenDaysSalesLast" placeholder="最大"></el-input>
        </el-form-item>
        <el-form-item label="分析品类" class="minDay">
          <el-select v-model="rulesform.categoryId" placeholder="请选择分析品类" clearable filterable multiple>
            <el-option
              v-for="item in categoryList"
              :key="item.categoryId"
              :label="item.name"
              :value="item.categoryId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="趋势">
          <el-select v-model="rulesform.salesTrendLable" placeholder="请选择趋势" clearable filterable>
            <el-option
              v-for="item in TrendLableList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="季节">
          <el-select v-model="rulesform.seasonsList" placeholder="请选择季节" clearable filterable multiple>
            <el-option
              v-for="item in seaoptionsList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="异常标签">
          <el-select v-model="rulesform.salesExceptionLable" placeholder="请选择异常标签" clearable filterable>
            <el-option
              v-for="item in Exception"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-cascader
            v-model="rulesform.categoryIdList"
            style="width:100%"
            :options="goodLists"
            :props="{ multiple: true, checkStrictly: true,value: 'panguCategoryId', label: 'name',children:'childrens'}"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getInitData">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg-containt p-10 clearfix">
      <div>
        <el-button type="primary" :disabled="!btnDisable" @click="changeStatus(2)">确认变更</el-button>
        <el-button type="primary" :disabled="!btnDisable" @click="changeStatus(3)">拒绝变更</el-button>
        <el-button type="primary" @click="handleBatchImport">批量导入变更</el-button>
        <el-button type="primary" @click="handleExportLevel">导出商品层次</el-button>
      </div>
      <el-table
        stripe
        :data="tableList"
        style="width: 100%;margin-top:20px"
        max-height="800"
        border
        highlight-current-row
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
        ></el-table-column>
        <el-table-column
          label="商品信息"
          min-width="200px"
        >
          <template slot-scope="{row}">
            <div v-if="row.extendBO && row.extendBO.image" class="adiut-img">
              <el-image
                class="image"
                fit="contain"
                :src="row.extendBO.image"
                :preview-src-list="[row.extendBO.image]"
              ></el-image>
            </div>
            <div v-if="row.extendBO" class="audit-cont">
              <div>
                <p>GoodsID:{{ row.panguGoodsId }}</p>
                <p>颜色: {{ row.extendBO.panguGoodsColor }}</p>
                <p>DDID：{{ row.panguGoodsDdId }}</p>
                <p>上架时间：{{ row.extendBO.shelvesTime }}</p>
                <p>分析品类：{{ row.extendBO.categoryName }}</p>
                <p v-if="row.extendBO.firstCategoryId">分类：
                  <el-tooltip class="item" effect="dark" placement="top">
                    <template slot="content">
                      {{ row.extendBO.firstCategoryName }}<span v-if="row.extendBO.secondCategoryName">/</span>{{ row.extendBO.secondCategoryName }}<span v-if="row.extendBO.thirdCategoryName">/</span>{{ row.extendBO.thirdCategoryName }}<span v-if="row.extendBO.fourthCategoryName">/</span>{{ row.extendBO.fourthCategoryName }}
                    </template>
                    <span class="c-p">
                      {{ row.extendBO.firstCategoryName }}<span v-if="row.extendBO.secondCategoryName">/</span>{{ row.extendBO.secondCategoryName }}...
                    </span>
                  </el-tooltip>
                </p>
              </div>
              <div>
                <el-tag v-if="row.extendBO.seasons" type="warning" size="mini" class="m-r-5 c-p">{{ row.extendBO.seasons }}</el-tag>
                <el-tag v-if="row.extendBO.salesExceptionLable" type="success" size="mini" class="m-r-5">销量{{ row.extendBO.salesExceptionLable | salesExceptValue }}</el-tag>
                <el-tag type="success" size="mini" class="m-r-5">趋势{{ row.extendBO.salesTrendLable | trendValue }}</el-tag>
                <el-tooltip v-if="row.extendBO && row.extendBO.festivalLabel" class="item" effect="dark" :content="`${row.extendBO.festivalLabel}`" placement="top">
                  <el-tag type="success" size="mini" class="m-r-5 c-p">  {{ row.extendBO.festivalLabel | festivalShow }}</el-tag>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="sevenDaysSales"
          sortable
          label="7日销量"
        >
        </el-table-column>
        <el-table-column
          sortable
          label="真实库存"
        >
          <template slot-scope="scope">
            {{ scope.row.extendBO.realStockQuantity }}
          </template>
        </el-table-column>
        <el-table-column
          sortable
          label="在途库存"
        >
          <template slot-scope="scope">
            {{ scope.row.extendBO.onwayStock }}
          </template>
        </el-table-column>
        <el-table-column
          prop="shelvesDays"
          sortable
          label="上架天数"
        >
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="建议生成时间"
          min-width="150px"
        >
        </el-table-column>
        <el-table-column
          prop="suggestLevelName"
          label="建议商品层次"
        >
        </el-table-column>
        <el-table-column
          prop="nowLevelName"
          label="当前商品层次"
        >
        </el-table-column>
        <el-table-column
          prop="oldLevelName"
          label="先前商品层次"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="变更建议状态"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status ===1?'待操作':scope.row.status ===2?'已确认':'已拒绝' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updatedTime"
          min-width="150px"
          label="操作时间"
        >
        </el-table-column>
        <el-table-column
          prop="updatedUserName"
          label="最后操作人"
        >
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <div class="button-style">
              <el-button type="primary" @click="changeStatus(1,scope.row)">手工变更</el-button>
              <el-button type="primary" @click="getOption(scope.row.recordId)">操作记录</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
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
      title="变更为"
      :visible.sync="dialogVisible"
      width="420px"
    >
      <el-form ref="form" :model="changeForm" label-width="80px" :rules="rules">
        <el-form-item label="商品层次">
          <el-select
            v-model="levelId"
            collapse-tags
            @change="getdigId"
          >
            <el-option v-show="diglevelName" :label="diglevelName" :value="diglevel"></el-option>
            <el-option v-for="(item, index) in levelList" :key="index" :label="item.name" :value="item.levelId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer t-c">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getchangeLevel(1)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="操作记录" :visible.sync="dialogLogsVisible">
      <el-table
        border
        style="width: 100%"
        :data="logsTables"
      >
        <el-table-column
          label="操作内容"
          prop="content"
        ></el-table-column>
        <el-table-column
          label="操作时间"
          prop="createdTime"
        ></el-table-column>
        <el-table-column
          label="操作人"
          prop="updatedUserName"
        ></el-table-column>

      </el-table>
    </el-dialog>
    <el-dialog
      title="导入"
      :visible.sync="dialogImportVisible"
      width="520px"
    >
      <upLoadFile ref="uploadFile" :page-from="5" @handleSuccess="handleSuccess">
        <li>1.每次最多导入数据，必须为 xls 格式文件</li>
        <li>2.DDID不允许重复</li>
        <li>3.若上传失败，请在系统返回的失败文件内第一列，查看失败的原因，重新上传时记得删除第一列失败原因；</li>
      </upLoadFile>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';

const idList = {
  1: 'firstCategoryIdList',
  2: 'secondCategoryIdList',
  3: 'thirdCategoryIdList',
  4: 'fourthCategoryIdList'
};
import pageMixin from '../../utils/mixin';
// import { logs } from '@/views/dynamicRules/components';
import { upLoadFile } from '@/views/dynamicRules/components';
import {
  commodityModifyRecordList,
  commoditymodifyRecordList,
  findByPage,
  commoditychangeLevel,
  findByPageCategory, getFestivalList

} from '@/api/dynamicRule';
import { categoryfindByPage, exportCommodityRecordData } from '@/api/stockOperation';
import { levelToTree } from '@/utils';
export default {
  name: 'Index',
  components: { upLoadFile },
  filters: {
    festivalShow(value) {
      const list = value.split(',');
      if (list.length > 1) {
        return `${list[0]}...`;
      } else {
        return value;
      }
    },
    salesExceptValue(value) {
      const body = {
        'up': '骤升',
        'down': '骤降'
      };
      return body[value];
    },
    trendValue(value) {
      const body = {
        'up': '上升',
        'down': '下降',
        'steady': '稳健'
      };
      return body[value];
    }
  },
  mixins: [pageMixin],
  data() {
    var numberRule = (rule, value, callback) => {
      if (Number(value) && (Number(value) < Number(this.rulesform.sevenDaysSales))) {
        return callback(new Error('最大值不能小于最小值'));
      }
      callback();
    };
    var numberRuleday = (rule, value, callback) => {
      if (Number(value) && (Number(value) < Number(this.rulesform.shelvesDays))) {
        return callback(new Error('最大值不能小于最小值'));
      }
      callback();
    };
    return {
      dialogLogsVisible: false,
      dialogImportVisible: false,
      dialogVisible: false,
      logsTables: [],
      festList: [],
      changeForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请选择商品层次', trigger: 'blur' }
        ],
        sevenDaysSalesLast: [{ validator: numberRule, trigger: 'blur' }],
        shelvesDaysLast: [{ validator: numberRuleday, trigger: 'blur' }]
      },
      rulesform: {
        panguGoodsId: '',
        panguGoodsDdId: '',
        categoryIdList: []
      },
      tableList: [],
      goodLists: [],
      Exception: [{
        id: 'up',
        value: '销量骤升'
      }, {
        id: 'down',
        value: '销量骤降'
      }],
      seaoptionsList: [{
        id: 'Spring',
        value: '春季'
      }, {
        id: 'Summer',
        value: '夏季'
      }, {
        id: 'Fall',
        value: '秋季'
      }, {
        id: 'Winter',
        value: '冬季'
      }, {
        id: 'Four seasons',
        value: '全季'
      }],
      levelList: [],
      selectList: [],
      categoryList: [],
      TrendLableList: [{
        id: 'up',
        value: '上升'
      }, {
        id: 'down',
        value: '下降'
      }, {
        id: 'steady',
        value: '稳健'
      }],
      btnDisable: true,
      recordId: '',
      levelId: '',
      diglevelName: '',
      diglevel: ''
    };
  },
  created() {
    this.getInitData();
    this.getLevel();
  },
  methods: {
    async handleExportLevel() {
      const { data: res } = await exportCommodityRecordData(this.doSeach());
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '操作成功，请在任务列表查看！',
          duration: 1000
        });
      }
    },
    handleBatchImport() {
      this.dialogImportVisible = true;
      this.$nextTick(() => {
        this.$refs.uploadFile.resetFile();
      });
    },
    getdigId(val) {
      this.levelId = val;
    },
    handleSuccess() {},
    changeStatus(number, e) {
      if (number === 2 || number === 3) {
        const data = [];
        this.selectList.forEach(item => {
          data.push(item.recordId);
        });
        this.recordId = data.join(',');
        this.getchangeLevel(number);
      }

      if (number === 1) {
        this.recordId = e.recordId;
        this.dialogVisible = true;
        this.diglevelName = e.suggestLevelId;
        this.diglevel = e.suggestLevelName;
        this.levelId = e.suggestLevelId;
      }
    },
    async getchangeLevel(number) {
      const params = {
        recordId: this.recordId,
        commodityLevelId: this.levelId,
        operatorType: number
      };
      const { data: res } = await commoditychangeLevel(params);
      if (res.code === 200) {
        const _this = this;
        this.$message({
          type: 'success',
          message: '操作成功',
          duration: 1000,
          onClose: () => {
            _this.getInitData();
          }
        });
        this.dialogVisible = false;
      }
    },
    handleSelectionChange(val) {
      this.selectList = val;
      // this.selectList.length > 0 ? this.btnDisable = !this.selectList.every(x => x.status === 1) : this.btnDisable = true;
      this.btnDisable = val.length > 0;
    },
    getOption(recordId) {
      const data = {
        recordId: recordId
      };
      commoditymodifyRecordList(data)
        .then(res => {
          if (res.data.code === 200) {
            this.logsTables = res.data.data.items;
            this.dialogLogsVisible = true;
          }
        });
    },
    getLevel() {
      const data = {
        page: 1,
        pageSize: 99999,
        status: 1
      };
      findByPage(data)
        .then(res => {
          if (res.data.code === 200) {
            this.levelList = res.data.data.items;
          }
        });
      findByPageCategory(data).then(res => {
        if (res.data.code === 200) {
          this.categoryList = res.data.data.items;
        }
      });
      const params = {
        page: 1,
        pageSize: 99999
      };
      categoryfindByPage(params).then(res => {
        if (res.data.code === 200) {
          this.goodLists = levelToTree(res.data.data.items, 'panguPId', 'panguCategoryId');
        }
      });
      this.getFestival();
    },
    async getFestival() {
      const { data: res } = await getFestivalList();
      if (res.code === 200) {
        this.festList = res.data;
      }
    },
    reset() {
      this.rulesform = {
        panguGoodsId: '',
        panguGoodsDdId: '',
        categoryIdList: []
      };
    },
    doSeach() {
      let panguGoodsId = [];
      let panguGoodsDdId = [];
      if (!this.rulesform.panguGoodsId) {
        panguGoodsId = '';
      } else {
        panguGoodsId = this.rulesform.panguGoodsId.trim().split(/\s+/).filter(item => item).join(',');
      }
      if (!this.rulesform.panguGoodsDdId) {
        panguGoodsDdId = '';
      } else {
        panguGoodsDdId = this.rulesform.panguGoodsDdId.trim().split(/\s+/).filter(item => item).join(',');
      }
      let body = {
        page: this.page,
        pageSize: this.pageSize,
        panguGoodsId: panguGoodsId,
        panguGoodsDdId: panguGoodsDdId,
        operatorType: this.rulesform.operatorType,
        sevenDaysSales: this.rulesform.sevenDaysSales,
        sevenDaysSalesLast: this.rulesform.sevenDaysSalesLast,
        shelvesDays: this.rulesform.shelvesDays,
        shelvesDaysLast: this.rulesform.shelvesDaysLast,
        suggestLevelIdList: this.rulesform.suggestLevelIdList,
        nowLevelIdList: this.rulesform.nowLevelIdList,
        festivalList: this.rulesform.festivalList,
        categoryIdList: this.rulesform.categoryId,
        salesTrendLable: this.rulesform.salesTrendLable,
        seasonsList: this.rulesform.seasonsList,
        salesExceptionLable: this.rulesform.salesExceptionLable
      };
      const params = {};
      for (const i in idList) {
        const keyValue = idList[i];
        params[keyValue] = [];
        this.rulesform.categoryIdList.forEach(item => {
          if (item.length === Number(i)) {
            params[keyValue].push(item[Number(i) - 1]);
            params[keyValue] = _.uniq(params[keyValue]);
          }
        });
      }
      body = { ...body, ...params };
      return body;
    },
    async getInitData() {
      // const data = {
      //   startTime: '',
      //   endTime: '',
      //   recordId: '', // 主键ID
      //   goodsId: '', // 商品ID,多个逗号隔开
      //   goodsDdId: '', // 商品DdID,多个逗号隔开
      //   operatorType: '',	// //	操作类型 1 等于 2 不等于
      //   sevenDaysSales: '',	// integer	7天销量-前置(范围查询)
      //   sevenDaysSalesLast: '',	// integer7天销量-后置(范围查询)
      //   shelvesDays: '',	// 上架天数-前置(范围查询)
      //   shelvesDaysLast: '',	// 上架天数-后置(范围查询)
      //   suggestLevelId: '', // 建议商品层次ID
      //   nowLevelId: '', // 当前商品层次ID
      //   oldLevelId: '', // 先前商品层次ID
      //   mode: '',	//	变更模式  1：系统变更  2：人工变更
      //   status: '',	// 状态，1：待操作  2：已确认   3：已拒绝
      //   isDeleted: ''	//	是否已被删除，0：未删除，1：已删除
      // };
      this.page = 1;
      const { data: res } = await commodityModifyRecordList(this.doSeach());
      if (res.code === 200) {
        this.tableList = res.data.items;
        this.totalCount = res.data.total;
      }
    },
    async handleSizeChange(val) {
      this.page = 1;
      this.pageSize = val;
      await this.handlePageEvent();
    },
    async handleCurrentChange(val) {
      this.page = val;
      await this.handlePageEvent();
    },
    async handlePageEvent() {
      const { data: res } = await commodityModifyRecordList(this.doSeach());
      if (res.code === 200) {
        this.tableList = res.data.items;
        this.totalCount = res.data.total;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.minDay{
  .el-input{
    width: 80px;
  }

}
::v-deep{
  .el-dialog__body{
    padding: 30px 20px 20px;
  }
}

::v-deep{
    .adiut-img{
      float: left;
      width: 120px;
      position: relative;
      img{
        height: auto;
      }
    }
  }
  .audit-cont {
    float: left;
    width: calc(100% - 120px);
    text-align: left;
    padding-left: 10px;
    /*span {
      display: inline-block;
      margin: 0;
      padding: 0;
    }*/
  }
  .button-style{
    .el-button{
      padding: 5px 20px;
      margin-bottom: 5px;
      margin-left: 0;
    }
  }
</style>
