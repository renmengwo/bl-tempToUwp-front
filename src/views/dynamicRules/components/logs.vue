<template>
  <div>
    <el-table
      :data="tableList"
      style="width: 100%"
      stripe
    >
      <el-table-column
        prop="content"
        label="操作内容"
        width="300px"
      >
      </el-table-column>
      <el-table-column
        prop="updatedTime"
        label="操作时间"
      >
      </el-table-column>
      <el-table-column
        prop="updatedUserName"
        label="操作人"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Logs',
  props: {
    tableList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    };
  }
};
</script>

<style scoped>

</style>
