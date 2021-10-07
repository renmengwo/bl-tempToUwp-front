<template>
  <div>
    <el-button type="primary" @click="handleExcleImport">
      批量修改拟下单量
    </el-button>
    <el-dialog
      title="EXCEL导入批量修改拟下单量"
      :visible.sync="dialogImportVisible"
      width="520px"
    >
      <upLoadFile ref="uploadFile" :page-from="4" @handleSuccess="handleSuccess">
        <li>1.必须为 xls 格式文件；</li>
        <li>2.DDID，尺码需为已存在数据，拟下单量需为整数；</li>
        <li>3.若上传失败，请在系统返回的失败文件内第一列，查看失败的原因，重新上传时记得删除第一列失败原因</li>
      </upLoadFile>
    </el-dialog>
  </div>
</template>

<script>
import { upLoadFile } from '@/views/dynamicRules/components';
export default {
  name: 'BatchChangeNum',
  components: {
    upLoadFile
  },
  data() {
    return {
      dialogImportVisible: false
    };
  },
  methods: {
    async handleSuccess() {
      this.dialogImportVisible = false;
      this.$emit('handleSeach');
    },
    handleExcleImport() {
      this.dialogImportVisible = true;
      this.$nextTick(() => {
        this.$refs.uploadFile.resetFile();
      });
    }
  }
};
</script>

<style scoped>

</style>
