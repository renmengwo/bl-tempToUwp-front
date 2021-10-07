<template>
  <div class="p-l-10 p-r-10">
    <el-tag v-if="RowData.levelName" size="mini" class="m-r-5">{{ RowData.levelName }}</el-tag>
    <el-tag type="success" size="mini" class="m-r-5">趋势{{ RowData.demandExtendBO.salesTrendLable | trendValue }}</el-tag>
    <el-tag v-if="RowData.demandExtendBO.salesExceptionLable" type="info" size="mini" class="m-r-5">销量{{ RowData.demandExtendBO.salesExceptionLable |salesExceptValue }}</el-tag>
    <el-tooltip class="item" effect="dark" :content="`适用季节：${RowData.demandExtendBO.seasons}`" placement="top">
      <el-tag type="warning" size="mini" class="m-r-5 c-p">{{ RowData.demandExtendBO.seasonalLable | seasonValue }}</el-tag>
    </el-tooltip>
    <el-tag v-if="RowData.demandExtendBO.infringingLable" type="danger" size="mini" class="m-r-5">{{ RowData.demandExtendBO.infringingLable ? '侵权产品' : '' }}</el-tag>
    <el-tag v-if="RowData.supplierType === 1" type="success" size="mini" class="m-r-5">线上供应商</el-tag>
    <el-tag v-if="RowData.supplierType === 2" type="success" size="mini" class="m-r-5">线下供应商</el-tag>
    <el-tag v-if="RowData.demandExtendBO.shelvesStatus === 1" type="info" size="mini" class="m-r-5">已上架</el-tag>
    <el-tag v-if="RowData.demandExtendBO.shelvesStatus === 0" type="info" size="mini" class="m-r-5">未上架</el-tag>
    <el-tag v-if="RowData.demandExtendBO.shortFlag === '1'" type="info" size="mini" class="m-r-5">
      断码
    </el-tag>
    <el-tag v-if="RowData.demandExtendBO.attrLable === 'MAO_NIU_YONG'" type="info" size="mini" class="m-r-5">
      毛牛泳
    </el-tag>
    <el-tooltip v-if="RowData.demandExtendBO && RowData.demandExtendBO.festivalAttrStr" class="item" effect="dark" :content="`${RowData.demandExtendBO.festivalAttrStr}`" placement="top">
      <el-tag type="success" size="mini" class="m-r-5 c-p">  {{ RowData.demandExtendBO.festivalAttrStr | festivalShow }}</el-tag>
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
