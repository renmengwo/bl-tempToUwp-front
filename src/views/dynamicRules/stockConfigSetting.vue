<template>
  <div>
    <div class="bg-containt p-t-15 p-l-15 p-r-15 clearfix m-b-20">
      <formCreate
        ref="formCreate"
        v-model="formValue"
        :rule="rule"
        :btnwidth="200"
      >
        <template v-slot:button>
          <el-button type="primary" @click.native="getInitData">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </template>
      </formcreate>
    </div>
    <div class="bg-containt p-10 clearfix">
      <div class="fl">
        <el-button v-btnrole="{btnCode: 'DMS-BHCSPZ-NEW', meta:$route.meta}" type="primary" @click="handleAddOrEdite(0)">新增</el-button>
        <el-button v-btnrole="{btnCode: 'DMS-BHCSPZ-USE', meta:$route.meta}" type="primary" plain :disabled="isClick" @click="handleBatch(1)">启用</el-button>
        <el-button v-btnrole="{btnCode: 'DMS-BHCSPZ-NOTUSE', meta:$route.meta}" type="danger" plain :disabled="isClick" @click="handleBatch(0)">禁用</el-button>
        <el-button v-btnrole="{btnCode: 'DMS-BHCSPZ-RULE', meta:$route.meta}" type="success" plain @click="handleImport">EXCEL导入规则</el-button>
        <el-button type="success" plain @click="handleExport">导出规则</el-button>
      </div>
      <el-table
        :data="tableList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
        ></el-table-column>
        <el-table-column
          prop="stockUpCoding"
          label="备货参数规则编码"
        ></el-table-column>
        <el-table-column
          prop="commodityLevelName"
          label="商品层次"
        ></el-table-column>
        <el-table-column
          prop="commodityCategoryName"
          label="分析品类"
        >
        </el-table-column>
        <el-table-column
          prop="productionCycle"
          label="生产周期"
        ></el-table-column>
        <el-table-column
          prop="stockUpDay"
          label="备货天数"
        ></el-table-column>
        <el-table-column
          prop="antiRiskDay"
          label="抗风险天数"
        ></el-table-column>
        <el-table-column
          prop="virtualInventoryCoefficient"
          label="虚库自动开通系数"
        ></el-table-column>
        <el-table-column
          label="规则状态"
        >
          <template slot-scope="scope">
            <span :class="{'color-reject': !scope.row.status}">{{ scope.row.status? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updatedTime"
          label="最后修改时间"
        ></el-table-column>
        <el-table-column
          prop="updatedUserName"
          label="最后修改人"
        >
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="handleAddOrEdite(1, scope.row)">修改</el-button>
            <el-button type="text" @click="handleLogs(scope.row.stockUpId)">操作记录</el-button>
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
      :title="title"
      :visible.sync="dialogVisible"
      width="520px"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px">
        <el-form-item label="商品层次" prop="commodityLevelId">
          <el-select v-model="ruleForm.commodityLevelId" placeholder="请选择商品层次" filterable>
            <el-option
              v-for="item in enableList.levelList"
              :key="item.levelId"
              :label="item.name"
              :value="item.levelId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <p v-if="!tipLevelshow" class="color-reject p-l-120 m-tops">该商品层次已被禁用</p>
        <el-form-item label="分析品类" prop="commodityCategoryId">
          <el-select v-model="ruleForm.commodityCategoryId" placeholder="请选择分析品类" filterable>
            <el-option
              v-for="item in enableList.categoryList"
              :key="item.categoryId"
              :label="item.name"
              :value="item.categoryId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <p v-if="!tipCateshow" class="color-reject p-l-120 m-tops">该分析品类已被禁用</p>
        <el-form-item label="生产周期" prop="productionCycle">
          <el-input v-model="ruleForm.productionCycle" placeholder="请输入生产周期"></el-input>
        </el-form-item>
        <el-form-item label="备货天数" prop="stockUpDay">
          <el-input v-model="ruleForm.stockUpDay" placeholder="请输入备货天数"></el-input>
        </el-form-item>
        <el-form-item label="抗风险天数" prop="antiRiskDay">
          <el-input v-model="ruleForm.antiRiskDay" placeholder="请输入抗风险天数"></el-input>
        </el-form-item>
        <el-form-item label="虚库自动开通系数" prop="virtualInventoryCoefficient">
          <el-input v-model="ruleForm.virtualInventoryCoefficient" placeholder="虚库自动开通系数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer t-c">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="操作记录"
      :visible.sync="dialogLogsVisible"
      width="520px"
    >
      <logs :table-list="logsTables"></logs>
    </el-dialog>
    <el-dialog
      ref="uploadFile"
      title="EXCEL导入备货参数"
      :visible.sync="dialogImportVisible"
      width="520px"
    >
      <upLoadFile ref="uploadFile" :page-from="2" @handleSuccess="handleSuccess">
        <li>1.每次最多导入500条数据，必须为 xls 格式文件</li>
        <li>2.商品层次+分析品类不允许重复</li>
        <li>3.若上传失败，请在系统返回的失败文件内第一列，查看失败的原因，重新上传时记得删除第一列失败原因；</li>
      </upLoadFile>
    </el-dialog>
  </div>
</template>
<script>
import pageMixin from '../../utils/mixin';
import formCreate from '@/components/formSeach';
import formJson from './js';
import {
  commodityStockUpSaveOrUpdate,
  findByPage,
  commodityStockUpupdateStatus,
  commodityStockUpLog,
  findByPageCategory,
  commodityStockUpfindByPage,
  exportStockUpData
} from '../../api/dynamicRule';
import { logs, upLoadFile } from '@/views/dynamicRules/components';
import _ from 'lodash';
export default {
  name: 'StockConfigSetting',
  components: { logs, upLoadFile, formCreate },
  mixins: [pageMixin],
  data() {
    const checkNum = (rule, value, callback) => {
      const reg = /^[0-9]*[0-9][0-9]*$/;
      if (!value) {
        return callback(new Error('不能为空'));
      }
      if (!reg.test(value)) {
        callback(new Error('请输入不小于0的整数'));
      } else {
        callback();
      }
    };
    const checkNumDouble = (rule, value, callback) => {
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
      if (!value) {
        return callback(new Error('不能为空'));
      }
      if (!reg.test(value)) {
        callback(new Error('请输入不小于0且最多为2位小数的数字'));
      } else {
        callback();
      }
    };
    return {
      formValue: {},
      rule: [],
      logsTables: [],
      formList: { // 下拉框展示全部的
        categoryList: [],
        levelList: []
      },
      enableList: { // 下拉框展示启用的
        categoryList: [],
        levelList: []
      },
      tipCateshow: true,
      tipLevelshow: true,
      title: '新增备货参数配置',
      rules: {
        commodityLevelId: [
          { required: true, message: '请选择商品层次', trigger: 'blur' }
        ],
        commodityCategoryId: [
          { required: true, message: '请选择分析品类', trigger: 'blur' }
        ],
        productionCycle: [
          { required: true, validator: checkNum, trigger: 'blur' }
        ],
        stockUpDay: [
          { required: true, validator: checkNum, trigger: 'blur' }
        ],
        antiRiskDay: [
          { required: true, validator: checkNum, trigger: 'blur' }
        ],
        virtualInventoryCoefficient: [
          { required: true, validator: checkNumDouble, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      dialogLogsVisible: false,
      dialogImportVisible: false,
      nextButton: true,
      tableList: [],
      ruleForm: {
        commodityLevelId: '',
        commodityCategoryId: '',
        productionCycle: '',
        virtualInventoryCoefficient: '',
        stockUpDay: '',
        antiRiskDay: ''
      },
      rowData: {},
      commodityLevelId: '',
      flag: '',
      commodityCategoryId: '',
      multipleSelection: []
    };
  },
  computed: {
    isClick() {
      return this.multipleSelection.length === 0;
    }
  },
  watch: {
    'ruleForm.commodityCategoryId'(val) {
      if (val !== '') {
        this.tipCateshow = this.enableList.categoryList.filter(item => item.categoryId === val).length > 0;
      } else {
        this.tipCateshow = true;
      }
    },
    'ruleForm.commodityLevelId'(val) {
      if (val !== '') {
        this.tipLevelshow = this.enableList.levelList.filter(item => item.levelId === val).length > 0;
      } else {
        this.tipLevelshow = true;
      }
    }
  },
  mounted() {
    this.getInitData();
    this.getSelectList();
  },
  methods: {
    async handleSuccess() {
      this.dialogImportVisible = false;
      await this.getInitData();
    },
    getSelectList() {
      const params = {
        page: 1,
        pageSize: 99999
      };
      const p1 = new Promise((resolve, reject) => {
        findByPageCategory(params).then(res => {
          if (res.data.code === 200) {
            resolve(res.data.data.items);
          }
        });
      });
      const p2 = new Promise((resolve, reject) => {
        findByPage(params).then(res => {
          if (res.data.code === 200) {
            resolve(res.data.data.items);
          }
        });
      });
      Promise.all([p1, p2]).then(values => {
        this.enableList.categoryList = values[0].filter(item => item.status === 1);
        this.enableList.levelList = values[1].filter(item => item.status === 1);
        values[0].forEach(item => {
          this.formList.categoryList.push({
            label: item.name,
            value: item.categoryId
          });
        });
        values[1].forEach(item => {
          this.formList.levelList.push({
            label: item.name,
            value: item.levelId
          });
        });
        this.rule = formJson.stockweekRule.call(this);
      });
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
      const { data: res } = await commodityStockUpfindByPage(this.doSeach());
      if (res.code === 200) {
        this.tableList = res.data.items;
        this.totalCount = res.data.total;
      }
    },
    /*
    * @params flag 0表示添加， 1表示编辑
    * @params obj 一行的数据
    * */
    handleAddOrEdite(flag, obj) {
      this.dialogVisible = true;
      this.flag = flag;
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields();
        if (flag === 1) {
          this.title = '修改备货参数配置';
          this.rowData = obj;
          this.ruleForm = {
            commodityLevelId: obj.commodityLevelId,
            commodityCategoryId: obj.commodityCategoryId,
            antiRiskDay: obj.antiRiskDay,
            stockUpDay: obj.stockUpDay,
            virtualInventoryCoefficient: obj.virtualInventoryCoefficient,
            productionCycle: obj.productionCycle
          };
        } else {
          this.title = '新增备货参数配置';
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    reset() {
      this.$refs.formCreate.resetFiled();
    },
    doSeach() {
      const body = _.cloneDeep(this.formValue);
      return {
        page: this.page,
        pageSize: this.pageSize,
        ...body
      };
    },
    async getInitData() {
      this.page = 1;
      const { data: res } = await commodityStockUpfindByPage(this.doSeach());
      if (res.code === 200) {
        this.tableList = res.data.items;
        this.totalCount = res.data.total;
      }
    },
    handleSure() {
      this.$refs['ruleForm'].validate(async(valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm
          };
          if (this.flag === 1) {
            params.stockUpCoding = this.rowData.stockUpCoding;
            params.stockUpId = this.rowData.stockUpId;
          }
          const { data: res } = await commodityStockUpSaveOrUpdate(params);
          if (res.code === 200) {
            this.dialogVisible = false;
            const _this = this;
            this.$message({
              message: '操作成功！',
              type: 'success',
              duration: 1000,
              onClose: () => {
                _this.getInitData();
              }
            });
          }
        }
      });
    },
    /*
    * @params flag 1表示启用， 0表示禁用
    * */
    async handleBatch(flag) {
      const isOperation = this.multipleSelection.some(item => item.status === flag);
      if (isOperation) {
        this.$message.error('请选择不同状态的数据操作！');
        return false;
      }
      let params = {};
      let stockUpId = '';
      this.multipleSelection.forEach(item => {
        stockUpId += `${item.stockUpId},`;
      });
      if (stockUpId.length > 0) {
        stockUpId = stockUpId.substr(0, stockUpId.length - 1);
      }
      params = {
        stockUpId,
        status: flag
      };
      const { data: res } = await commodityStockUpupdateStatus(params);
      if (res.code === 200) {
        const _this = this;
        this.$message({
          message: '操作成功！',
          type: 'success',
          duration: 1000,
          onClose: () => {
            _this.getInitData();
          }
        });
      }
    },
    async handleLogs(stockUpId) {
      this.dialogLogsVisible = true;
      const params = {
        stockUpId,
        page: 1,
        pageSize: 99999
      };
      const { data: res } = await commodityStockUpLog(params);
      if (res.code === 200) {
        this.logsTables = res.data.items;
      }
    },
    handleImport() {
      this.dialogImportVisible = true;
      this.$nextTick(() => {
        this.$refs.uploadFile.resetFile();
      });
    },
    handleExport: _.throttle(async function() {
      if (this.totalCount) {
        let stockUpId = '';
        if (this.multipleSelection.length > 0) {
          this.multipleSelection.forEach(item => {
            stockUpId += `${item.stockUpId},`;
          });
          if (stockUpId.length > 0) {
            stockUpId = stockUpId.substr(0, stockUpId.length - 1);
          }
        }
        const params = _.cloneDeep(this.doSeach());
        params.pageSize = this.totalCount;
        params.page = 1;
        params.stockUpId = stockUpId;
        await exportStockUpData(params);
      } else {
        this.$message.error('暂无数据，无法导出！');
      }
    }, 5000)
  }
};
</script>

<style scoped>
.m-tops{
  margin-top:-20px;
}
</style>
