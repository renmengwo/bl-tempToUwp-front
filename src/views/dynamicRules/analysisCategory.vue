<template>
  <div>
    <div class="bg-containt p-l-15 p-t-15 p-r-15 clearfix m-b-20">
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
      </formCreate>
    </div>
    <div class="bg-containt p-10 clearfix">
      <div class="fl">
        <el-button v-btnrole="{btnCode: 'DMS-FFPLPZ-NEW', meta:$route.meta}" type="primary" @click="handleAddOrEdite(0)">新增</el-button>
        <el-button v-btnrole="{btnCode: 'DMS-FFPLPZ-USE', meta:$route.meta}" type="primary" plain :disabled="isClick" @click="handleBatch(1)">启用</el-button>
        <el-button v-btnrole="{btnCode: 'DMS-FFPLPZ-NOTUSE', meta:$route.meta}" type="danger" plain :disabled="isClick" @click="handleBatch(0)">禁用</el-button>
        <el-button v-btnrole="{btnCode: 'DMS-FFPLPZ-RELATION', meta:$route.meta}" type="success" plain @click="handleImport">导入品类映射关系</el-button>
        <el-button type="success" plain @click="handleExport">导出分析品类</el-button>
        <el-button type="success" plain @click="handleCategoryExport">导出品类映射关系</el-button>
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
          prop="categoryCoding"
          label="分析品类编码"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="分析品类"
        ></el-table-column>
        <el-table-column
          label="分析品类状态"
        >
          <template slot-scope="scope">
            <span :class="{'color-reject': !scope.row.status}">{{ !scope.row.status? '禁用' : '启用' }}</span>
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
            <el-button type="text" @click="handleLogs(scope.row.categoryId)">操作记录</el-button>
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
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
        <el-form-item label="分析品类" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入分析品类"
            clearable
            maxlength="100"
            show-word-limit
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
    <el-dialog
      title="导入品类映射关系"
      :visible.sync="dialogImportVisible"
      width="520px"
    >
      <upLoadFile ref="uploadFile" :page-from="3" @handleSuccess="handleSuccess">
        <li>1.每次最多导入500条数据，必须为 xls 格式文件</li>
        <li>2.末级品类ID 不允许重复</li>
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
  saveOrUpdateCategory,
  findByPageCategory,
  findByPageCategoryLog,
  exportData,
  categoryExportData,
  commodityCategorySalesRule
} from '@/api/dynamicRule';
import { logs, upLoadFile } from '@/views/dynamicRules/components';
import result from '@/utils/uploadResponse';
import _ from 'lodash';
export default {
  name: 'AnalysisCategory',
  components: { logs, upLoadFile, formCreate },
  mixins: [pageMixin],
  data() {
    return {
      status: -1,
      logsTables: [],
      shelfTime: 0,
      title: '新增分析品类枚举值',
      rules: {
        name: [
          { required: true, message: '请输入分析品类', trigger: 'blur' }
        ]
      },
      formValue: {},
      dialogVisible: false,
      dialogLogsVisible: false,
      dialogImportVisible: false,
      nextButton: true,
      tableList: [],
      ruleForm: {
        name: ''
      },
      rowData: {},
      flag: '',
      multipleSelection: []
    };
  },
  computed: {
    isClick() {
      return this.multipleSelection.length === 0;
    },
    rule() {
      return formJson.analysisRule();
    }
  },
  mounted() {
    this.getInitData();
  },
  methods: {
    async handleSuccess() {
      this.dialogImportVisible = false;
      await this.getInitData();
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
      const { data: res } = await findByPageCategory(this.doSeach());
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
          this.title = '修改分析品类枚举值';
          this.rowData = obj;
          this.$set(this.ruleForm, 'name', obj.name);
        } else {
          this.title = '新增分析品类枚举值';
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
      const { data: res } = await findByPageCategory(this.doSeach());
      if (res.code === 200) {
        this.tableList = res.data.items;
        this.totalCount = res.data.total;
      }
    },
    handleSure() {
      this.$refs['ruleForm'].validate(async(valid) => {
        if (valid) {
          this.ruleForm.name = this.ruleForm.name.trim();
          const params = {
            ...this.ruleForm
          };
          if (this.flag === 1) {
            params.categoryId = this.rowData.categoryId;
          }
          const { data: res } = await saveOrUpdateCategory(params);
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
      const params = [];
      this.multipleSelection.forEach(item => {
        const body = {
          categoryId: item.categoryId,
          status: flag
        };
        params.push(body);
      });
      const { data: res } = await commodityCategorySalesRule(params);
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
    async handleLogs(categoryId) {
      this.logsTables = [];
      this.dialogLogsVisible = true;
      const params = {
        categoryId,
        page: 1,
        pageSize: 99999
      };
      const { data: res } = await findByPageCategoryLog(params);
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
        let categoryIds = '';
        if (this.multipleSelection.length > 0) {
          this.multipleSelection.forEach(item => {
            categoryIds += `${item.categoryId},`;
          });
          if (categoryIds.length > 0) {
            categoryIds = categoryIds.substr(0, categoryIds.length - 1);
          }
        }
        const params = _.cloneDeep(this.doSeach());
        params.pageSize = this.totalCount;
        params.page = 1;
        params.categoryIds = categoryIds;
        await exportData(params);
      } else {
        this.$message.error('暂无数据，无法导出！');
      }
    }, 5000),
    handleCategoryExport: _.throttle(async function() {
      const params = {
        page: 1,
        pageSize: 9999
      };
      const res = await categoryExportData(params);
      await result(res.data);
    }, 5000)
  }
};
</script>

<style scoped>

</style>
