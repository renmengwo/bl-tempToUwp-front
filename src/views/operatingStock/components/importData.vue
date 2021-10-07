<template>
  <div>
    <el-button type="primary" :disabled="isExportData !=='1'" @click="handleExcleImport">
      导入数据批量下单
    </el-button>
    <el-dialog
      title="提示"
      :visible.sync="dialogBatchVisible"
      width="420px"
    >
      <div class="create-box">
        <template v-if="infringingList.length > 0">
          <p class="color-reject"><i class=" el-icon-warning"></i>【必看】注意事项</p>
          <p>
            该GoodsID :{{ infringingList }} 已经被标记为“侵权产品”
          </p>
        </template>
        <p>是否确认创建需求单?</p>
      </div>
      <div slot="footer" class="dialog-footer t-c">
        <el-button @click="dialogBatchVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { verifyDemandOrderBatchByImport, saveDemandOrderBatchByImport } from '@/api/stockOperation';
export default {
  name: 'ImportData',
  props: {
    isExportData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogBatchVisible: false,
      infringingList: []
    };
  },
  methods: {
    async handleExcleImport() {
      const { data: res } = await verifyDemandOrderBatchByImport();
      if (res.code === 200) {
        if (res.data && res.data.length !== 0) {
          this.infringingList = res.data;
        }
        this.dialogBatchVisible = true;
      }
    },
    async handleSure() {
      const { data: res } = await saveDemandOrderBatchByImport();
      if (res.code === 200) {
        const _this = this;
        this.$message({
          type: 'success',
          message: res.message || '操作成功！',
          duration: 1000,
          onClose: () => {
            _this.dialogBatchVisible = false;
            _this.$emit('handleSeach');
          }
        });
      }
    }
  }
};
</script>

<style scoped>

</style>
