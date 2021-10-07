<template>
  <div>
    <template v-for="(item, index) in detailsArray.goodsIdItemBOList">
      <div v-if="item.panguSize !== 'statistics'" :key="index" class="title-common content-box">
        <div>
          <div class="title-common box-border" :class="{minHei: isOneSingle}">
            <p>{{ item.thirtyDaysSales }}</p>
            <p>{{ item.sevenDaysSales }}</p>
            <p>{{ item.sevenAvgSales }}</p>
            <p>{{ item.salesCount }}</p>
            <p>{{ item.outOfStock }}</p>
          </div>
        </div>
        <div>
          <div class="title-common box-border" :class="{minHei: isOneSingle}">
            <!--            <p>{{ item.demandItemSalesInfoBO.scheduledStock }}</p>-->
            <p>{{ item.realStockCount }}</p>
            <p>{{ item.onPassageCount }}</p>
          </div>
        </div>
      </div>
    </template>
    <!--    <template>
      <div class="title-common content-box">
        <p>暂无数据</p>
      </div>
    </template>-->
    <div v-if="showTotal" class="title-common content-box total-box">
      <!--      <p>合计</p>-->
      <div>
        <div class="title-common box-border">
          <p class="c-p" @click="handleTrend(detailsArray, 30)">{{ detailsArray.goodsIdItemBOList[detailsArray.goodsIdItemBOList.length - 1].thirtyDaysSales }}</p>
          <p class="c-p" @click="handleTrend(detailsArray, 7)">{{ detailsArray.goodsIdItemBOList[detailsArray.goodsIdItemBOList.length - 1].sevenDaysSales }}</p>
          <p>{{ detailsArray.goodsIdItemBOList[detailsArray.goodsIdItemBOList.length - 1].sevenAvgSales }}</p>
          <p>{{ detailsArray.goodsIdItemBOList[detailsArray.goodsIdItemBOList.length - 1].salesCount }}</p>
          <p>{{ detailsArray.goodsIdItemBOList[detailsArray.goodsIdItemBOList.length - 1].outOfStock }}</p>
        </div>
      </div>
      <div>
        <div class="title-common box-border">
          <p class="c-p" @click="handleTrend(detailsArray, 30)">{{ detailsArray.goodsIdItemBOList[detailsArray.goodsIdItemBOList.length - 1].realStockCount }}</p>
          <p class="c-p" @click="handleTrend(detailsArray, 30)">{{ detailsArray.goodsIdItemBOList[detailsArray.goodsIdItemBOList.length - 1].onPassageCount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { keepTwoDecimalFull } from '@/utils';
export default {
  name: 'GoodsItem',
  filters: {
    salesTrendNum(value) {
      const body = {
        'up': '+1',
        'down': '-2',
        'steady': '+0'
      };
      return body[value];
    },
    seasonValue(value) {
      const body = {
        'in': '1',
        'out': '0.8'
      };
      return body[value];
    },
    numDecimalFull(value) {
      if (value === 0) {
        return value;
      } else {
        return keepTwoDecimalFull(value);
      }
    }
  },
  props: {
    detailsArray: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      input: ''
    };
  },
  computed: {
    showTotal() {
      const showList = this.detailsArray.goodsIdItemBOList.filter(item => item.panguSize !== 'statistics');
      return showList.length > 1;
    },
    isOneSingle() {
      const showList = this.detailsArray.goodsIdItemBOList.filter(item => item.panguSize !== 'statistics');
      return showList.length === 1;
    }
  },
  methods: {
    handleTrend(obj, dates) {
      const { panguGoodsDdid } = obj;
      window.open(`/#/operatingoods/goodstrend?panguGoodsDdid=${panguGoodsDdid}&dates=${dates}`);
    }
  }
  /* watch: {
    detailsArray: {
      handler(newValue, oldValue) {
        newValue.proposedOrderQuantity = _.sumBy(newValue.demandItemBOList, 'demandItemSalesInfoBO.proposedOrderQuantity');
      },
      deep: true
    }
  }*/
};
</script>

<style scoped lang="scss">
$border: 1px solid #ebeef5;
.content-box{
  border-bottom: $border;
  &:last-child{
    border-bottom: none;
  }
  /*&>p:nth-child(4),&>div:nth-child(5){
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }*/
  &>div p{
    width:110px;
    padding:5px 0;
    text-align: center;
    height: 50px;
    line-height: 40px;
  }
  &>p,&>div{
    border-right:$border;
  }
  &>p:last-child{
    border-right:none;
  }
}
.minHei{
  p{
    min-height:160px!important;
    line-height: 160px!important;
    padding:0!important;
    height:auto;
  }
}
.box-border{
  p{
    border-right:$border;
    &:last-child{
      border:none;
    }
  }
}
.total-box{
  background:#b3d8ff
}
.direction{
  flex-direction: column;
}
</style>
