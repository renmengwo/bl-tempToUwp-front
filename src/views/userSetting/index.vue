<template>
  <div>
    <div class="bg-containt p-l-15 p-t-15 p-r-15 clearfix m-b-20">
      <div class="seach-box clearfix">
        <div class="seach-item">
          <p class="set-name"> 用户名</p>
          <div>
            <el-input v-model.trim="account" placeholder="请输入用户名" clearable></el-input>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name"> 姓名</p>
          <div>
            <el-input v-model.trim="name" placeholder="请输入姓名" clearable></el-input>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">手机号</p>
          <div>
            <el-input v-model="phone" placeholder="请输入手机号" clearable></el-input>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name"> 状态</p>
          <div>
            <el-select v-model="status" placeholder="请选择适状态" clearable filterable>
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
          <p class="set-name">&nbsp;</p>
          <div>
            <el-button type="primary" @click="getInitData">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-containt p-10 clearfix">
      <div class="fl">
        <el-button type="primary" @click="handleAdd(0)">新增</el-button>
        <el-button type="primary" plain :disabled="isClick" @click="handleBatch(1)">启用</el-button>
        <el-button type="danger" plain :disabled="isClick" @click="handleBatch(0)">禁用</el-button>
      </div>
      <el-table
        stripe
        :data="tableList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
        ></el-table-column>
        <el-table-column
          prop="account"
          label="用户名"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          label="状态"
        >
          <template slot-scope="scope">
            <span :class="{'color-reject': !scope.row.status}">{{ scope.row.status? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间"
        >
        </el-table-column>
        <el-table-column
          prop="updatedUserName"
          label="修改人"
        >
        </el-table-column>
        <el-table-column
          prop="updatedTime"
          label="修改时间"
        >
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="handleAdd(1, scope.row)">修改</el-button>
            <el-button type="text" @click="handleReset(scope.row)">重置密码</el-button>
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
      width="420px"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="account">
          <el-input v-model="ruleForm.account" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="英文名">
          <el-input v-model="ruleForm.nameEn" placeholder="请输入英文名" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入邮箱" clearable></el-input>
        </el-form-item>
        <el-form-item label="组织机构" prop="regList">
          <el-select v-model="ruleForm.regList" placeholder="请选择组织机构" clearable multiple filterable>
            <el-option
              v-for="item in regcodeList"
              :key="item.code"
              :label="item.text"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否管理者">
          <el-radio-group v-model="ruleForm.manager">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="flag !== 1" label="密码" prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer t-c">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="重置密码"
      :visible.sync="dialogResetVisible"
      width="420px"
    >
      <el-form ref="ruleFormReset" :model="ruleFormReset" :rules="rulesReset" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="ruleFormReset.account" placeholder="请输入用户名" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleFormReset.password" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer t-c">
        <el-button @click="dialogResetVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleResetSure">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageMixin from '../../utils/mixin';
import { userlist, userSaveOrUpdate, updatePasswordUnNeedOld, batchUpdateStatus } from '@/api/user';
export default {
  name: 'Index',
  mixins: [pageMixin],
  data() {
    const checkPhone = (rule, value, callback) => {
      const reg = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
      if (value === '') {
        return callback(new Error('请输入手机号！'));
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号！'));
        } else {
          callback();
        }
      });
    };
    return {
      title: '新增用户',
      dialogVisible: false,
      dialogResetVisible: false,
      tableList: [],
      multipleSelection: [],
      name: '',
      phone: '',
      flag: 1,
      status: -1,
      rowData: {},
      account: '',
      ruleFormReset: {
        account: '',
        password: ''
      },
      statusList: [{
        id: -1,
        value: '全部'
      }, {
        id: 0,
        value: '禁用'
      }, {
        id: 1,
        value: '启用'
      }],
      ruleForm: {
        name: '',
        password: '',
        account: '',
        email: '',
        nameEn: '',
        manager: 1,
        regList: '',
        phone: ''
      },
      rulesReset: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      regcodeList: [{
        code: '048E5C3D747F44BAA7B1BE3EB36779B5',
        text: 'BL'
      }, {
        code: '4C000434EA6E46CC8EF55D53F23E9D77',
        text: 'DM'
      }, {
        code: 'E9CBA8FABC3C429692CA12E571B522FD',
        text: 'PMS-B'
      }, {
        code: 'DC600EF27D134E1B956F0965A7181ABE',
        text: 'PMS-D'
      }],
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        regList: [
          { required: true, message: '请选择组织机构', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: checkPhone }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
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
      let staffId = '';
      this.multipleSelection.forEach(item => {
        staffId += `${item.staffId},`;
      });
      if (staffId.length > 0) {
        staffId = staffId.substr(0, staffId.length - 1);
      }
      params = {
        staffId,
        status: flag
      };
      const { data: res } = await batchUpdateStatus(params);
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    async handleSizeChange(val) {
      this.page = 1;
      this.pageSize = val;
      await this.getInitData();
    },
    async handleCurrentChange(val) {
      this.page = val;
      await this.getInitData();
    },
    doSeach() {
      return {
        status: this.status === -1 ? '' : this.status,
        account: this.account,
        name: this.name,
        page: this.page,
        pageSize: this.pageSize,
        phone: this.phone
      };
    },
    async getInitData() {
      const { data: res } = await userlist(this.doSeach());
      if (res.code === 200) {
        this.tableList = res.data.items;
        this.totalCount = res.data.total;
      }
    },
    reset() {
      this.status = -1;
      this.account = '';
      this.name = '';
      this.phone = '';
    },
    /*
    * @params flag 0是新增，1是编辑
    * @params row 这一行的对象
    * */
    handleAdd(flag, row) {
      this.flag = flag;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields();
        this.ruleForm.nameEn = '';
        if (flag === 1) {
          this.title = '修改用户信息';
          this.rowData = row;
          this.ruleForm = {
            name: row.name,
            password: row.password,
            account: row.account,
            phone: row.phone,
            email: row.email,
            nameEn: row.nameEn,
            manager: row.manager,
            regList: row.regList.map(item => item.regCode)
          };
        } else {
          this.title = '新增用户信息';
        }
      });
    },
    handleSure() {
      const _this = this;
      this.$refs['ruleForm'].validate(async(valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm
          };
          if (this.flag === 1) {
            params.staffId = this.rowData.staffId;
          }
          const { data: res } = await userSaveOrUpdate(params);
          if (res.code === 200) {
            this.dialogVisible = false;
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
    handleReset(obj) {
      this.rowData = obj;
      this.dialogResetVisible = true;
      this.ruleFormReset = {
        account: obj.account,
        password: obj.password
      };
      this.$nextTick(() => {
        this.$refs.ruleFormReset.resetFields();
      });
    },
    async handleResetSure() {
      const _this = this;
      this.$refs['ruleFormReset'].validate(async(valid) => {
        if (valid) {
          const { staffId } = this.rowData;
          const { password } = this.ruleFormReset;
          const params = {
            password,
            staffId
          };
          const { data: res } = await updatePasswordUnNeedOld(params);
          if (res.code === 200) {
            this.dialogResetVisible = false;
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
