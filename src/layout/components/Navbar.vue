<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"></hamburger>
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="right-menu">
      <el-dropdown class="avatar-container p-t-4" trigger="click">
        <div class="avatar-wrapper p-r-20 c-p">
          <el-avatar size="medium" :src="circleUrl" class="user-avatar"></el-avatar>
          <span class="m-l-10">
            {{ userinfo.account }}/{{ userinfo.name }}
          </span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!--          <el-dropdown-item @click.native="handleReset">
            <span style="display:block;">重置密码</span>
          </el-dropdown-item>-->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退 出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="fr reg-box p-t-8 m-r-10">
      <el-select v-model="code" placeholder="组织机构" size="small" @change="handleCode">
        <el-option
          v-for="item in siteList"
          :key="item.regCode"
          :label="item.name"
          :value="item.regCode"
        >
        </el-option>
      </el-select>
    </div>
    <TaskList class="fr"></TaskList>
    <el-dialog
      title="重置密码"
      :visible.sync="dialogVisible"
      width="420px"
    >
      <el-form ref="ruleform" :model="ruleform" :rules="rules" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="ruleform.account" placeholder="请输入用户名" disabled></el-input>
        </el-form-item>
        <el-form-item label="旧密码" prop="passwordOld">
          <el-input v-model="ruleform.passwordOld" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="ruleform.password" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repeatPassword">
          <el-input v-model="ruleform.repeatPassword" placeholder="请输入密码" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer t-c">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';
import TaskList from './TaskList';
import { updatePasswordNeedOld } from '@/api/user';
import { setStorage, removeStorage } from '@/utils/auth';
const IS_LOCALTION = process.env.VUE_APP_BASE_API === '/api';
const ENV = process.env.NODE_ENV;
const setting = require('@/settings');
export default {
  components: {
    Breadcrumb,
    Hamburger,
    TaskList
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleform.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      circleUrl: '@/assets/USER_images/userImg.jpg',
      dialogVisible: false,
      siteList: [],
      code: '',
      ruleform: {
        password: '',
        repeatPassword: '',
        passwordOld: '',
        account: ''
      },
      rules: {
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' }
        ],
        repeatPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        passwordOld: [
          { required: true, trigger: 'blur', message: '请输入旧密码' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      'userinfo',
      'regcode',
      'regcodeList',
      'sidebar'
    ])
  },
  mounted() {
    this.getSiteList();
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout').then(() => {
        removeStorage('UWP_REGCHANG');
        if (IS_LOCALTION) {
          this.$router.push(`/login?redirect=${this.$route.fullPath}`);
        } else {
          window.location = `${setting.redirect[ENV]}/login?outType=1`;
        }
      });
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    async getSiteList() {
      if (JSON.parse(this.regcodeList).length > 0) {
        this.siteList = JSON.parse(this.regcodeList);
        this.code = this.regcode;
      }
    },
    async handleCode(val) {
      await this.$store.commit('user/SET_REGCODE', val);
      await setStorage('regcode', val);
      await setStorage('UWP_REGCHANG', true);
      await location.reload();
    },
    async handleReset() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs['ruleform'].resetFields();
        this.ruleform.account = this.userinfo.account;
      });
    },
    handleSure() {
      const _this = this;
      this.$refs['ruleform'].validate(async(valid) => {
        if (valid) {
          const { staffId } = this.userinfo;
          const { password,
            repeatPassword,
            passwordOld } = this.ruleform;
          const params = {
            password,
            repeatPassword,
            passwordOld,
            staffId
          };
          const { data: res } = await updatePasswordNeedOld(params);
          if (res.code === 200) {
            this.$message({
              message: '修改成功，即将退出重新登录！',
              type: 'success',
              duration: 1000,
              onClose: () => {
                _this.logout();
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        @include classFontsize(#333,$small);
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
        }
      }
    }
  }
}
</style>
