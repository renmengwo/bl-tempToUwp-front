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
      </formcreate>
    </div>
    <div class="bg-containt p-10 clearfix">
      <div class="fl">
        <el-button v-btnrole="{btnCode: 'DMS-SPCCPZ-NEW', meta:$route.meta}" type="primary" @click="handleAddOrEdite(0)">新增</el-button>
        <el-button v-btnrole="{btnCode: 'DMS-SPCCPZ-USE', meta:$route.meta}" type="primary" plain :disabled="isClick" @click="handleBatch(1)">启用</el-button>
        <el-button v-btnrole="{btnCode: 'DMS-SPCCPZ-NOTUSE', meta:$route.meta}" type="danger" plain :disabled="isClick" @click="handleBatch(0)">禁用</el-button>
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
          prop="levelCoding"
          label="商品层次编码"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="商品层次"
        ></el-table-column>
        <el-table-column
          label="是否清仓"
        >
          <template slot-scope="scope">
            {{ scope.row.isClearance === 1? '是': '否' }}
          </template>
        </el-table-column>
        <el-table-column
          label="是否回滚"
        >
          <template slot-scope="scope">
            {{ scope.row.isRollback === 1? '是': '否' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="levelShort"
          label="排序"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="适用上架时长"
        >
          <template slot-scope="scope">
            {{ scope.row.shelfTimeName }}
          </template>
        </el-table-column>
        <el-table-column
          label="商品层次状态"
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
            <el-button type="text" @click="handleLogs(scope.row.levelId)">操作记录</el-button>
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
        <el-form-item label="商品层次" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入商品层次"
            clearable
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="是否清仓" prop="isClearance">
          <el-select
            v-model="ruleForm.isClearance"
            placeholder="请输入"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否回滚" prop="isRollback">
          <el-select
            v-model="ruleForm.isRollback"
            placeholder="请输入"
            clearable
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="levelShort">
          <el-input
            v-model="ruleForm.levelShort"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="适用上架时长" prop="shelfTime">
          <el-select v-model="ruleForm.shelfTime" placeholder="请选择适用上架时长" clearable filterable>
            <el-option
              v-for="item in timeList"
              :key="item.shelfTime"
              :label="item.shelfTimeName"
              :value="item.shelfTime"
            ></el-option>
          </el-select>
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
</template>
<script>
import pageMixin from '../../utils/mixin';
import { saveOrUpdate, findByPage, bathDisabled, logsFindByPage, getLevelShelfEnums } from '@/api/dynamicRule';
import { logs } from '@/views/dynamicRules/components';
import formCreate from '@/components/formSeach';
import formJson from './js';
import _ from 'lodash';
export default {
  name: 'CommodityLevel',
  components: { logs, formCreate },
  mixins: [pageMixin],
  data() {
    return {
      formValue: {},
      rule: [],
      logsTables: [],
      title: '添加商品层次枚举值',
      rules: {
        name: [
          { required: true, message: '请输入商品层次', trigger: 'blur' }
        ],
        isClearance: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        isRollback: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        levelShort: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        shelfTime: [
          { required: true, message: '请选择适用上架时长', trigger: 'change' }
        ]
      },
      timeList: [],
      dialogVisible: false,
      dialogLogsVisible: false,
      nextButton: true,
      tableList: [],
      ruleForm: {
        name: '',
        isRollback: '',
        levelShort: '',
        isClearance: '',
        shelfTime: ''
      },
      rowData: {},
      name: '',
      flag: '',
      multipleSelection: []
    };
  },
  computed: {
    isClick() {
      return this.multipleSelection.length === 0;
    }
  },
  mounted() {
    this.getInitData();
    this.getLevelShelfEnums();
  },
  methods: {
    async getLevelShelfEnums() {
      const { data: res } = await getLevelShelfEnums();
      if (res.code === 200) {
        res.data.forEach(item => {
          const body = {
            value: item.shelfTime,
            label: item.shelfTimeName
          };
          this.timeList.push(body);
        });
        this.rule = formJson.levelRule.call(this);
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
      const { data: res } = await findByPage(this.doSeach());
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
          this.title = '编辑商品层次枚举值';
          this.rowData = obj;
          this.$set(this.ruleForm, 'name', obj.name);
          this.$set(this.ruleForm, 'shelfTime', obj.shelfTime);
          this.$set(this.ruleForm, 'isRollback', obj.isRollback);
          this.$set(this.ruleForm, 'levelShort', obj.levelShort);
          this.$set(this.ruleForm, 'isClearance', obj.isClearance);
        } else {
          this.title = '添加商品层次枚举值';
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
      const { data: res } = await findByPage(this.doSeach());
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
            params.levelId = this.rowData.levelId;
          }
          const { data: res } = await saveOrUpdate(params);
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
    * @params flag 0表示启用， 1表示禁用
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
          levelId: item.levelId,
          status: flag
        };
        params.push(body);
      });
      const { data: res } = await bathDisabled(params);
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
    async handleLogs(levelId) {
      this.logsTables = [];
      this.dialogLogsVisible = true;
      const params = {
        levelId,
        page: 1,
        pageSize: 99999
      };
      const { data: res } = await logsFindByPage(params);
      if (res.code === 200) {
        this.logsTables = res.data.items;
      }
    }
  }
};
</script>

<style scoped>

</style>
