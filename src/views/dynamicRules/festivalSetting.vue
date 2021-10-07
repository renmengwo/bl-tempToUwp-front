<template>
  <div>
    <div class="bg-containt p-l-15 p-t-15 p-r-15 clearfix m-b-20">
      <div class="seach-box clearfix">
        <div class="seach-item">
          <p class="set-name">节日标签</p>
          <div>
            <el-select v-model="attributeIdList" placeholder="请选择节日标签" clearable filterable multiple collapse-tags>
              <el-option
                v-for="item in festivalList"
                :key="item.attrId"
                :label="item.attrCnName"
                :value="item.attrId"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">规则状态</p>
          <div>
            <el-select v-model="status" placeholder="请选择规则状态" clearable filterable>
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <div class="p-l-20">
            <el-button type="primary" @click="getInitData">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-containt p-10 clearfix">
      <div class="fl">
        <el-button type="primary" @click="handleAddOrEdite(0)">新增</el-button>
        <el-button type="primary" plain :disabled="isClick" @click="handleBatch(1)">启用</el-button>
        <el-button type="danger" plain :disabled="isClick" @click="handleBatch(0)">禁用</el-button>
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
          prop="festivalCoding"
          label="规则编码"
        ></el-table-column>
        <el-table-column
          prop="festivalName"
          label="节日标签"
        ></el-table-column>
        <el-table-column
          label="备货时间"
        >
          <template slot-scope="scope">
            {{ scope.row.stockingTimeBegin | parseTime('{y}年{m}月{d}日') }}~{{ scope.row.stockingTimeEnd | parseTime('{y}年{m}月{d}日') }}
          </template>
        </el-table-column>
        <el-table-column
          label="备货系数"
          prop="coefficient"
        >
        </el-table-column>
        <el-table-column
          label="状态"
        >
          <template slot-scope="scope">
            <span :class="{'color-reject': !scope.row.status}">{{ !scope.row.status? '禁用' : '启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updatedTime"
          label="最后修改时间"
        >
        </el-table-column>
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
            <el-button type="text" @click="handleLogs(scope.row.festivalId)">操作记录</el-button>
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
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="520px"
      >
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
          <el-form-item label="节日标签" prop="attributeId">
            <el-select v-model="ruleForm.attributeId" placeholder="请选择节日标签">
              <el-option
                v-for="item in festivalList"
                :key="item.attrId"
                :label="item.attrCnName"
                :value="item.attrId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备货时间">
            <el-date-picker
              v-model="ruleForm.stockingTime"
              type="daterange"
              range-separator="至"
              format="yyyy年MM月dd日"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备货系数" prop="coefficient">
            <el-input
              v-model="ruleForm.coefficient"
              placeholder="请输入"
              clearable
            ></el-input>
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
    </div>
  </div>
</template>

<script>
import pageMixin from '../../utils/mixin';
import { logs } from '@/views/dynamicRules/components';
import {
  getFestivalList,
  festivalfindByPage,
  festivalbatchUpdateStatus,
  festivalrulelog,
  festivalsaveOrUpdate
} from '@/api/dynamicRule';
export default {
  name: 'FestivalSetting',
  components: { logs },
  mixins: [pageMixin],
  data() {
    const checkCoefficient = (rule, value, callback) => {
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
      if (!value) {
        return callback(new Error('不能为空'));
      }
      if (!reg.test(value)) {
        callback(new Error('请输入不小于0且最多两位小数的数字'));
      } else {
        callback();
      }
    };
    return {
      title: '新增节日款备货参数规则',
      logsTables: [],
      tableList: [],
      flag: '',
      dialogVisible: false,
      dialogLogsVisible: false,
      attributeIdList: [],
      multipleSelection: [],
      attributeList: [],
      festivalList: [],
      ruleForm: {
        attributeId: '',
        stockingTime: '',
        coefficient: 1
      },
      statusList: [{
        id: 1,
        value: '启用'
      }, {
        id: 0,
        value: '禁用'
      }],
      rules: {
        attributeId: [
          { required: true, message: '请选择节日标签', trigger: 'blur' }
        ],
        coefficient: [
          { trigger: 'blur', validator: checkCoefficient }
        ]
      },
      status: ''
    };
  },
  computed: {
    isClick() {
      return this.multipleSelection.length === 0;
    }
  },
  mounted() {
    this.FestivalList();
    this.getInitData();
  },
  methods: {
    async FestivalList() {
      const { data: res } = await getFestivalList();
      if (res.code === 200) {
        this.festivalList = res.data;
      }
    },
    doSeach() {
      return {
        attributeIdList: this.attributeIdList,
        status: this.status
      };
    },
    reset() {
      this.attributeIdList = [];
      this.status = '';
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
    async getInitData() {
      this.page = 1;
      const { data: res } = await festivalfindByPage(this.doSeach());
      if (res.code === 200) {
        this.tableList = res.data.items;
        this.totalCount = res.data.total;
      }
    },
    async handlePageEvent() {
      const { data: res } = await festivalfindByPage(this.doSeach());
      if (res.code === 200) {
        this.tableList = res.data.items;
        this.totalCount = res.data.total;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
        this.ruleForm.stockingTime = [];
        if (flag === 1) {
          this.title = '编辑节日款备货参数规则';
          this.rowData = obj;
          this.$set(this.ruleForm, 'attributeId', obj.attributeId);
          this.$set(this.ruleForm, 'coefficient', obj.coefficient);
          this.$set(this.ruleForm, 'stockingTime', obj.stockingTimeBegin ? [obj.stockingTimeBegin, obj.stockingTimeEnd] : []);
        } else {
          this.title = '新增节日款备货参数规则';
        }
      });
    },
    /*
    * @params flag 0表示启用， 1表示禁用
    * */
    async handleBatch(flag) {
      const isOperation = this.multipleSelection.some(item => item.status === flag);
      if (isOperation) {
        this.$message.error('请选择不同状态的数据操作！');
        return false;
      }
      const festivalIdList = this.multipleSelection.map(item => item.festivalId);
      const params = {
        festivalIdList,
        status: flag
      };
      const { data: res } = await festivalbatchUpdateStatus(params);
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
    async handleLogs(festivalId) {
      this.logsTables = [];
      this.dialogLogsVisible = true;
      const params = {
        festivalId,
        page: 1,
        pageSize: 99999
      };
      const { data: res } = await festivalrulelog(params);
      if (res.code === 200) {
        this.logsTables = res.data.items;
      }
    },
    handleSure() {
      this.$refs['ruleForm'].validate(async(valid) => {
        if (valid) {
          const festivalName = this.festivalList.filter(item => item.attrId === this.ruleForm.attributeId)[0].attrCnName;
          const params = {
            coefficient: this.ruleForm.coefficient,
            stockingTimeBegin: this.ruleForm.stockingTime && this.ruleForm.stockingTime[0] ? this.ruleForm.stockingTime[0] : '',
            stockingTimeEnd: this.ruleForm.stockingTime && this.ruleForm.stockingTime[1] ? this.ruleForm.stockingTime[1] : '',
            attributeId: this.ruleForm.attributeId,
            festivalName
          };
          if (this.flag === 1) {
            params.festivalId = this.rowData.festivalId;
          }
          const { data: res } = await festivalsaveOrUpdate(params);
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
    }
  }
};
</script>

<style scoped>

</style>
