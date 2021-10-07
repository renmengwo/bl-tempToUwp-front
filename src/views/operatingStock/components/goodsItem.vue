<template>
  <div>
    <template v-if="detailsArray.demandItemBOList.length > 0">
      <div v-for="(item, index) in detailsArray.demandItemBOList" :key="index" class="title-common content-box">
        <!--        <p class="direction">
          <span>{{ item.goodsSize }}</span>
          <span v-if="item.canSale === 1">(可售)</span>
          <span v-if="item.canSale === 2">(不可售)</span>
        </p>-->
        <div>
          <div class="title-common box-border" :class="{minHei: isOneSingle}">
            <p :class="{'c-p': isOneSingle}" @click="handleOneTrend(detailsArray, 30)">{{ item.demandItemSalesInfoBO.thirtyDaysSales }}</p>
            <p :class="{'c-p': isOneSingle}" @click="handleOneTrend(detailsArray, 7)">{{ item.demandItemSalesInfoBO.sevenDaysSales }}</p>
            <p>{{ item.demandItemSalesInfoBO.sevenDaysAverageSales }}</p>
            <p>{{ item.demandItemSalesInfoBO.todaySales }}</p>
            <p>{{ item.demandItemSalesInfoBO.outOfStockNum }}</p>
          </div>
        </div>
        <div>
          <div class="title-common box-border" :class="{minHei: isOneSingle}">
            <!--            <p>{{ item.demandItemSalesInfoBO.scheduledStock }}</p>-->
            <p :class="{'c-p': isOneSingle}" @click="handleOneTrend(detailsArray, 30)">{{ item.demandItemSalesInfoBO.realStockQuantity }}</p>
            <p :class="{'c-p': isOneSingle}" @click="handleOneTrend(detailsArray, 30)">{{ item.demandItemSalesInfoBO.onwayStock }}</p>
          </div>
        </div>
        <div>
          <div class="title-common box-border" :class="{minHei: isOneSingle}">
            <p>{{ item.demandItemSalesInfoBO.vendibilityDay }}({{ (item.demandItemSalesInfoBO.vendibilityDay / 7) | numDecimalFull }})</p>
            <p>{{ detailsArray.productionCycle }} + {{ detailsArray.stockUpDay }} + {{ detailsArray.antiRiskDay }}</p>
            <p>{{ detailsArray.demandExtendBO.salesTrendLable | salesTrendNum }}</p>
            <p>{{ detailsArray.demandExtendBO.seasonalLable | seasonValue }}</p>
            <p>{{ item.demandItemSalesInfoBO.suggestOrderCount }}</p>
            <p>{{ item.demandItemSalesInfoBO.finalSuggestOrderCount }}</p>
          </div>
        </div>
        <!--        <p>{{ item.hadOrderCount }}</p>
        <div style="border:none">
          <p style="width:90px">
            <el-input v-model.number="item.demandItemSalesInfoBO.proposedOrderQuantity" placeholder="请输入"></el-input>
          </p>
        </div>-->
      </div>
    </template>
    <template v-else>
      <div class="title-common content-box">
        <p>暂无数据</p>
      </div>
    </template>
    <div v-if="showTotal" class="title-common content-box total-box">
      <!--      <p>合计</p>-->
      <div>
        <div class="title-common box-border">
          <p class="c-p" @click="handleTrend(detailsArray, 30)">{{ detailsArray.thirdTotal }}</p>
          <p class="c-p" @click="handleTrend(detailsArray, 7)">{{ detailsArray.sevenTotal }}</p>
          <p>{{ detailsArray.sevenDayTotal }}</p>
          <p>{{ detailsArray.todayCount }}</p>
          <p>{{ detailsArray.outOfStockNumTotal }}</p>
        </div>
      </div>
      <div>
        <div class="title-common box-border">
          <p class="c-p" @click="handleTrend(detailsArray, 30)">{{ detailsArray.realStockQuantityTotal }}</p>
          <p class="c-p" @click="handleTrend(detailsArray, 30)">{{ detailsArray.onwayTotal }}</p>
        </div>
      </div>
      <div>
        <div class="title-common box-border">
          <p>
            {{ detailsArray.demandExtendBO.vendibilityDay !== '' ? detailsArray.demandExtendBO.vendibilityDay : detailsArray.vendibilityDayTotal }}
            ({{ detailsArray.demandExtendBO.vendibilityDay !== '' ? detailsArray.demandExtendBO.vendibilityDay / 7 : detailsArray.vendibilityDayTotal / 7 | numDecimalFull }})
          </p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>{{ detailsArray.suggestOrderCountTotal }}</p>
          <p>{{ detailsArray.suggestTotal }}</p>
        </div>
      </div>
      <!--      <p>{{ detailsArray.hadOrderTotal }}</p>
      <div style="border:none">
        {{ detailsArray.proposedOrderQuantity }}
      </div>-->
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
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
      return this.detailsArray.demandItemBOList.length > 1;
    },
    isOneSingle() {
      return this.detailsArray.demandItemBOList.length === 1;
    }
  },
  watch: {
    detailsArray: {
      handler(newValue, oldValue) {
        newValue.proposedOrderQuantity = _.sumBy(newValue.demandItemBOList, 'demandItemSalesInfoBO.proposedOrderQuantity');
      },
      deep: true
    }
  },
  methods: {
    handleTrend(obj, dates) {
      const { panguGoodsDdid } = obj;
      window.open(`/#/operatinstock/stocktrend?panguGoodsDdid=${panguGoodsDdid}&dates=${dates}`);
    },
    handleOneTrend(obj, dates) {
      if (this.isOneSingle) {
        const { panguGoodsDdid } = obj;
        window.open(`/#/operatinstock/stocktrend?panguGoodsDdid=${panguGoodsDdid}&dates=${dates}`);
      }
    }
  }
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

