<template>
  <div class="p-t-4">
    <p class="task-top" @click="getInitData">
      查看任务列表
    </p>
    <el-drawer
      title="任务管理"
      :visible.sync="dialogVisible"
      direction="rtl"
      size="60%"
      :show-close="true"
      :with-header="false"
    >
      <div class="p-20">
        <div id="task-top">
          <p class="task-title">任务管理</p>
          <p class="color-reject m-b-10 m-t-10"><i class="el-icon-warning"></i>注意：异步处理任务需处理完成后才可以再次点击和下载导出文件</p>
        </div>
        <el-table
          :data="tableList"
          style="width: 100%"
          border
          stripe
          :max-height="tableHeight"
        >
          <el-table-column
            prop="name"
            label="任务类型"
          >
            <template slot-scope="scope">
              {{ taskTypeList[scope.row.type ] }}
              <!--              {{ scope.row.type | filterType }}-->
            </template>
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
          <el-table-column
            label="操作"
            width="90px"
          >
            <template slot-scope="scope">
              <el-button v-if="scope.row.url" type="text" @click="handleDownLoad(scope.row)">下载文件</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div id="task-foot">
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
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { taskExoprtList } from '@/api/dynamicRule';
import pageMixin from '@/utils/mixin';
import { getAllType } from '@/api/common';
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
    },
    filterType(val) {
      const type = {
        1: '批量修改拟下单数',
        2: '导出备货单',
        3: '导入备货单批量创建采购单',
        4: '批量修改当前层次'
      };
      return type[val];
    }
  },
  mixins: [pageMixin],
  data() {
    return {
      dialogVisible: false,
      tableHeight: 0,
      tableList: [],
      taskTypeList: []
    };
  },
  methods: {
    async getTskType() {
      const { data: res } = await getAllType();
      if (res.code === 200) {
        this.taskTypeList = res.data;
      }
    },
    async getInitData() {
      await this.getTskType();
      this.dialogVisible = true;
      this.setTableHei();
      this.tableList = [];
      this.page = 1;
      const { data: res } = await taskExoprtList(this.doSeach());
      if (res.code === 200) {
        this.tableList = res.data.items;
        this.totalCount = res.data.total;
      }
    },
    handleDownLoad(obj) {
      window.open(obj.url);
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
      const { data: res } = await taskExoprtList(this.doSeach());
      if (res.code === 200) {
        this.tableList = res.data.items;
        this.totalCount = res.data.total;
      }
    },
    setTableHei() {
      this.$nextTick(() => {
        const topHei = document.getElementById('task-top').offsetHeight;
        const footHei = document.getElementById('task-foot').offsetHeight;
        const bodyHei = document.body.clientHeight;
        this.tableHeight = bodyHei - footHei - topHei - 50;
      });
    }
  }
};
</script>

<style scoped lang="scss">
.task-title{
  @include classFontsize(#333,$lager)
}
.task-top{
  font-size:14px;
  color: #1fbfcd;
  background: #e9f9fa;
  border: 1px solid #a5e5eb;
  border-radius: 3px;
  text-align: center;
  padding:4px 7px 5px;
  margin-top: 4px;
  margin-right:10px;
  cursor: pointer;
  &:hover{
    color:#fff;
    background:#a5e5eb
  }
}
</style>
