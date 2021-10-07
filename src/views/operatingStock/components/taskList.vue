<template>
  <div>
    <el-button type="primary" @click="handleCreat">创建任务</el-button>
    <p class="color-reject m-b-10 m-t-10"><i class="el-icon-warning"></i>注意：创建新任务必须在上一任务处理完成后才可以创建且两个任务时间间隔需2小时以上</p>
    <el-table
      :data="tableList"
      style="width: 100%"
      border
      stripe
    >
      <el-table-column
        prop="taskNo"
        label="任务号"
        width="120px"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="任务状态"
        width="120px"
      >
        <template slot-scope="scope">
          {{ scope.row.status | filterStatus }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createdTime"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        prop="finshedTime"
        label="完成时间"
      >
      </el-table-column>
      <el-table-column
        label="耗时（min）"
        width="110px"
      >
        <template slot-scope="scope">
          {{ scope.row.spendTime | timeTrans }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createdUserName"
        label="创建人"
        width="100px"
      >
      </el-table-column>
    </el-table>
    <p class="clearDiv m-b-10"></p>
    <div class="clearfix">
      <el-pagination
        class="fr"
        background
        :current-page="page"
        :page-sizes="[10]"
        :page-size="pageSize"
        :layout="layout"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import pageMixin from '@/utils/mixin';
import { taskfindByPage, creatSave } from '@/api/dynamicRule';
export default {
  name: 'TaskList',
  filters: {
    filterStatus(val) {
      const status = {
        1: '处理中',
        2: '处理成功',
        3: '处理失败'
      };
      return status[val];
    },
    timeTrans(val) {
      if (val) {
        return (parseFloat(val) / 1000 / 60).toFixed(2);
      } else {
        return '';
      }
    }
  },
  mixins: [pageMixin],
  data() {
    return {
      tableList: []
    };
  },
  methods: {
    async getInitData() {
      this.page = 1;
      const { data: res } = await taskfindByPage(this.doSeach());
      if (res.code === 200) {
        this.tableList = res.data.items;
        this.totalCount = res.data.total;
      }
    },
    async handleCreat() {
      const { data: res } = await creatSave();
      if (res.code === 200) {
        const _this = this;
        this.$message({
          type: 'success',
          message: '操作成功！',
          duration: 1000,
          onClose: () => {
            _this.getInitData();
          }
        });
      }
    },
    async handleCurrentChange(val) {
      this.page = val;
      await this.handlePageEvent();
    },
    async handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      await this.handlePageEvent();
    },
    doSeach() {
      return {
        page: this.page,
        pageSize: 10
      };
    },
    async handlePageEvent() {
      const { data: res } = await taskfindByPage(this.doSeach());
      if (res.code === 200) {
        this.tableList = res.data.items;
        this.totalCount = res.data.total;
      }
    }
  }
};
</script>

<style scoped>

</style>
