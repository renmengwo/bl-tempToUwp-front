<template>
  <div>
    <div class="bg-containt p-t-15 p-l-15 p-r-15 clearfix m-b-20">
      <formCreate
        ref="formCreate"
        v-model="formValue"
        :rule="rule"
        :btnwidth="300"
      >
        <template v-slot:button>
          <el-button type="primary" @click="handleSeach">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="handleAuto">高级搜索</el-button>
        </template>
      </formCreate>
    </div>
  </div>
</template>

<script>
import formCreate from '@/components/formSeach';
import { findByPage, findByPageCategory } from '@/api/dynamicRule';
import { categoryfindByPage } from '@/api/stockOperation';
import { levelToTree } from '@/utils';
import { formrule } from './js';
import _ from 'lodash';
export default {
  name: 'Index',
  components: {
    formCreate
  },
  data() {
    return {
      show: false,
      levelList: [],
      goodLists: [],
      categoryList: [],
      formValue: {},
      rule: []
    };
  },
  mounted() {
    const params = {
      page: 1,
      pageSize: 99999
    };
    const p1 = new Promise((resolve, reject) => {
      findByPage(params).then(res => {
        if (res.data.code === 200) {
          resolve(res.data.data.items);
        }
      });
    });
    const p2 = new Promise((resolve, reject) => {
      findByPageCategory(params).then(res => {
        if (res.data.code === 200) {
          resolve(res.data.data.items);
        }
      });
    });
    const p3 = new Promise((resolve, reject) => {
      categoryfindByPage(params).then(res => {
        if (res.data.code === 200) {
          resolve(res.data.data.items);
        }
      });
    });
    Promise.all([p1, p2, p3]).then(values => {
      values[0].forEach(item => {
        this.levelList.push({
          label: item.name,
          value: item.levelId
        });
      });
      values[1].filter(item => item.status === 1).forEach(item => {
        this.categoryList.push({
          label: item.name,
          value: item.categoryId
        });
      });
      this.goodLists = levelToTree(values[2], 'panguPId', 'panguCategoryId');
      this.rule = formrule.call(this);
    });
  },
  methods: {
    doSeach() {
      return _.cloneDeep(this.formValue);
    },
    handleSeach() {
      console.log(this.formValue);
    },
    reset() {
      this.$refs.formCreate.resetFiled();
    },
    handleAuto() {
      this.show = !this.show;
      this.$refs.formCreate.setAutoHeight(this.show);
    }
  }
};
</script>

<style scoped>

</style>
