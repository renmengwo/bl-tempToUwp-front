<template>
  <div>
    <p class="upload-top">
      <i class="el-icon-warning"></i>
      【必看】注意事项
    </p>
    <ul class="upload-tips">
      <slot></slot>
    </ul>
    <div class="m-t-10 p-b-10 upload-box">
      <el-button type="success" plain class="download-temp" @click="handleDownLoad">下载模板</el-button>
      <el-upload
        ref="upload"
        class="upload-demo"
        :http-request="handleUpload"
        :file-list="fileList"
        :on-success="handleFileSuccess"
        action="string"
      >
        <el-button type="primary">上传文件</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { importWeeklySaleRuleData, importStockUpData, importRelationData } from '@/api/dynamicRule';
import { importDemandDataUpdateOrderNum, importCommodityModifyLevel } from '@/api/stockOperation';

import result from '@/utils/uploadResponse';
import { uploadObj } from '@/utils/constants';
export default {
  name: 'UpLoadFile',
  props: {
    pageFrom: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      fileList: []
    };
  },
  methods: {
    handleUpload(content) {
      const formData = new FormData();
      formData.append('file', content.file);
      this.handlePageFrom(formData, content);
    },
    async handlePageFrom(params, content) {
      if (this.pageFrom === 1) { // 层次周销上传
        const res = await importWeeklySaleRuleData(params);
        await content.onSuccess(res);
      } else if (this.pageFrom === 2) { // 备货参数上传
        const res = await importStockUpData(params);
        await content.onSuccess(res);
      } else if (this.pageFrom === 3) { // 分析品类上传
        const res = await importRelationData(params);
        await content.onSuccess(res);
      } else if (this.pageFrom === 4) { // 备货需求单-批量修改拟下单
        const res = await importDemandDataUpdateOrderNum(params);
        await content.onSuccess(res);
      } else if (this.pageFrom === 5) { // 商品层次变更
        const res = await importCommodityModifyLevel(params);
        await content.onSuccess(res);
      } else {
        this.$message({
          message: '暂无操作！',
          type: 'error',
          duration: 1000
        });
      }
    },
    handleDownLoad() {
      /* const uploadUrl = {
        1: 'https://bl-supply-chain.s3.cn-north-1.amazonaws.com.cn/bl/dms/%E5%91%A8%E9%94%80%E8%A7%84%E5%88%99.xlsx',
        2: 'https://bl-supply-chain.s3.cn-north-1.amazonaws.com.cn/bl/dms/%E5%A4%87%E8%B4%A7%E5%8F%82%E6%95%B0%E8%A7%84%E5%88%99.xlsx',
        3: 'https://bl-supply-chain.s3.cn-north-1.amazonaws.com.cn/bl/dms/%E5%93%81%E7%B1%BB%E6%98%A0%E5%B0%84%E5%85%B3%E7%B3%BB.xlsx',
        4: 'https://bl-supply-chain.s3.cn-north-1.amazonaws.com.cn/bl/dms/%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%8B%9F%E4%B8%8B%E5%8D%95%E9%87%8F%E6%A8%A1%E6%9D%BF.xlsx',
        5: 'https://bl-supply-chain.s3.cn-north-1.amazonaws.com.cn/bl/dms/%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E5%BB%BA%E8%AE%AE%E5%B1%82%E6%AC%A1%E8%A7%84%E5%88%99.xlsx'
      };*/
      const uploadKeyToName = {
        1: 'hierarchicalWeek',
        2: 'stockConfigSetting',
        3: 'analysisCategory',
        4: 'orderondemand',
        5: 'goodsLevelChange'
      };
      const tarGetName = uploadKeyToName[this.pageFrom];
      console.log(uploadObj[tarGetName]);
      // window.open(uploadUrl[this.pageFrom]);
      window.open(uploadObj[tarGetName].downLoadUrl);
    },
    handleFileSuccess(response, file, fileList) {
      result.call(this, response.data, true);
    },
    resetFile() {
      this.$nextTick(() => {
        this.$refs['upload'].clearFiles();
      });
    }
  }
};
</script>

<style scoped lang="scss">
.upload-tips{
  @include classFontsize(#333,$middle);
  line-height: 1.5;
}
.upload-top{
  @include classFontsize(#ff0000,$middle);
}
</style>
<style lang="scss">
.upload-box{
  position: relative;
  .download-temp{
    position: absolute;
    top:0; left: 27%;
  }
  .el-upload{
    margin-left:51% !important
  }
}
</style>
