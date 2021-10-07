<template>
  <div class="p-l-10 p-r-10">
    <el-tag v-if="RowData.nowLevelName" size="mini" class="m-r-5">{{ RowData.nowLevelName }}</el-tag>
    <el-tag type="success" size="mini" class="m-r-5">趋势{{ RowData.tabBoinfo.salesTrendLable | trendValue }}</el-tag>
    <el-tag v-if="RowData.tabBoinfo && RowData.tabBoinfo.salesExceptionLable" type="info" size="mini" class="m-r-5">销量{{ RowData.tabBoinfo.salesExceptionLable |salesExceptValue }}</el-tag>
    <el-tooltip class="item" effect="dark" :content="`适用季节：${RowData.tabBoinfo.seasons}`" placement="top">
      <el-tag type="warning" size="mini" class="m-r-5 c-p">{{ RowData.tabBoinfo.seasonalLable | seasonValue }}</el-tag>
    </el-tooltip>
    <el-tag v-if="RowData.tabBoinfo && RowData.tabBoinfo.infringingLable" type="danger" size="mini" class="m-r-5">{{ RowData.tabBoinfo.infringingLable ? '侵权产品' : '' }}</el-tag>
    <el-tag v-if="RowData.tabBoinfo && RowData.tabBoinfo.supplierType === 1" type="success" size="mini" class="m-r-5">线上供应商</el-tag>
    <el-tag v-if="RowData.tabBoinfo && RowData.tabBoinfo.supplierType === 2" type="success" size="mini" class="m-r-5">线下供应商</el-tag>
    <el-tag v-if="RowData.tabBoinfo && RowData.tabBoinfo.shelvesStatus === 1" type="info" size="mini" class="m-r-5">已上架</el-tag>
    <el-tag v-if="RowData.tabBoinfo && RowData.tabBoinfo.shelvesStatus === 0" type="info" size="mini" class="m-r-5">未上架</el-tag>
    <el-tag v-if="RowData.tabBoinfo && RowData.tabBoinfo.shortFlag === '1'" type="info" size="mini" class="m-r-5">
      断码
    </el-tag>
    <el-tag v-if="RowData.tabBoinfo && RowData.tabBoinfo.attrLable === 'MAO_NIU_YONG'" type="info" size="mini" class="m-r-5">
      毛牛泳
    </el-tag>
    <el-tag v-if="RowData.tabBoinfo && RowData.tabBoinfo.dmsIsClearance === 1" type="info" size="mini" class="m-r-5">
      清仓商品
    </el-tag>
    <el-tooltip v-if="RowData.tabBoinfo && RowData.tabBoinfo.festivalLabel" class="item" effect="dark" :content="`${RowData.tabBoinfo.festivalLabel}`" placement="top">
      <el-tag type="success" size="mini" class="m-r-5 c-p">  {{ RowData.tabBoinfo.festivalLabel | festivalShow }}</el-tag>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'TagList',
  filters: {
    trendValue(value) {
      const body = {
        'up': '上升',
        'down': '下降',
        'steady': '稳健'
      };
      return body[value];
    },
    festivalShow(value) {
      const list = value.split(',');
      if (list.length > 1) {
        return `${list[0]}...`;
      } else {
        return value;
      }
    },
    seasonValue(value) {
      const body = {
        'in': '应季',
        'out': '反季'
      };
      return body[value];
    },
    salesExceptValue(value) {
      const body = {
        'up': '骤升',
        'down': '骤降'
      };
      return body[value];
    }
  },
  props: {
    RowData: {
      type: Object,
      default: () => {}
    }
  }
};
</script>

<style scoped>

</style>
