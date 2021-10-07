<template>
  <div>
    <SeachStretch ref="SeachStretch" :btnwidth="300">
      <template v-slot:seach>
        <div class="seach-item">
          <p class="set-name">GoodsID</p>
          <div>
            <el-input v-model="panguGoodsIds" placeholder="请输入GoodsID" clearable></el-input>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">DDID</p>
          <div>
            <el-input v-model="panguGoodsDdids" placeholder="请输入DDID" clearable></el-input>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">商品层次</p>
          <div>
            <el-select v-model="levelIds" placeholder="请选择商品层次" clearable filterable multiple>
              <el-option
                v-for="item in levelList"
                :key="item.levelId"
                :label="item.name"
                :value="item.levelId"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">供应商类型</p>
          <div>
            <el-select v-model="dmsSupplierType" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">上下架状态</p>
          <div>
            <el-select v-model="shelvesStatus" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in upList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">是否可售</p>
          <div>
            <el-select v-model="canSale" placeholder="请选择" clearable filterable @change="handleCanSale">
              <el-option
                v-for="item in enableList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">是否断码</p>
          <div>
            <el-select v-model="shortFlag" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in enableList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">是否侵权</p>
          <div>
            <el-select v-model="infringingLable" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in tortList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">是否毛牛泳</p>
          <div>
            <el-select v-model="isMaoNiuYong" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in enableList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">分析品类</p>
          <div>
            <el-select v-model="categoryIds" placeholder="请选择" clearable filterable multiple>
              <el-option
                v-for="item in categoryList"
                :key="item.categoryId"
                :label="item.name"
                :value="item.categoryId"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">商品分类</p>
          <div>
            <el-cascader
              v-model="categoryIdList"
              style="width:100%"
              :options="goodLists"
              :props="{ multiple: true, checkStrictly: true,value: 'panguCategoryId', label: 'name',children:'childrens'}"
              clearable
            ></el-cascader>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">趋势</p>
          <div>
            <el-select v-model="salesTrendLabelValues" placeholder="请选择" clearable filterable multiple>
              <el-option
                v-for="item in TrendLableList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">是否清仓</p>
          <div>
            <el-select v-model="dmsIsClearance" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in clearList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">季节</p>
          <div>
            <el-select v-model="seasonList" placeholder="请选择" clearable filterable multiple>
              <el-option
                v-for="item in seaoptionsList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">节日款</p>
          <div>
            <el-select v-model="festivalList" placeholder="请选择" clearable filterable multiple collapse-tags>
              <el-option
                v-for="item in festList"
                :key="item.attrId"
                :label="item.attrCnName"
                :value="item.attrId"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">异常标签</p>
          <div>
            <el-select v-model="salesExceptionLabelValues" placeholder="请选择" clearable filterable>
              <el-option
                v-for="item in Exception"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">缺货数量</p>
          <div>
            <el-col :span="11"><el-input v-model="outOfStockNumBegin" placeholder="请输入" clearable></el-input></el-col>
            <el-col :span="2" class="t-c line40">--</el-col>
            <el-col :span="11"><el-input v-model="outOfStockNumEnd" placeholder="请输入" clearable></el-input></el-col>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">今日销量</p>
          <div>
            <el-col :span="11"><el-input v-model="tdSalesNumBegin" placeholder="请输入" clearable></el-input></el-col>
            <el-col :span="2" class="t-c line40">--</el-col>
            <el-col :span="11"><el-input v-model="tdSalesNumEnd" placeholder="请输入" clearable></el-input></el-col>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">7日销量</p>
          <div>
            <el-col :span="11"><el-input v-model="sevenDaySalesNumBegin" placeholder="请输入" clearable></el-input></el-col>
            <el-col :span="2" class="t-c line40">--</el-col>
            <el-col :span="11"><el-input v-model="sevenDaySalesNumEnd" placeholder="请输入" clearable></el-input></el-col>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">30日销量</p>
          <div>
            <el-col :span="11"><el-input v-model="thirtyDaySalesNumBegin" placeholder="请输入" clearable></el-input></el-col>
            <el-col :span="2" class="t-c line40">--</el-col>
            <el-col :span="11"><el-input v-model="thirtyDaySalesNumEnd" placeholder="请输入" clearable></el-input></el-col>
          </div>
        </div>
        <div class="seach-item">
          <p class="set-name">上架天数</p>
          <div>
            <el-col :span="11"><el-input v-model="shelvesDayBegin" placeholder="请输入" clearable></el-input></el-col>
            <el-col :span="2" class="t-c line40">--</el-col>
            <el-col :span="11"><el-input v-model="shelvesDayEnd" placeholder="请输入" clearable></el-input></el-col>
          </div>
        </div>
      </template>
      <template v-slot:button>
        <el-button type="primary" @click="handleSeach">查询</el-button>
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="handleAuto">高级搜索</el-button>
      </template>
    </SeachStretch>
  </div>
</template>

<script>
import { findByPage, findByPageCategory, getFestivalList } from '@/api/dynamicRule';

const idList = {
  1: 'firstCategoryIdList',
  2: 'secondCategoryIdList',
  3: 'thirdCategoryIdList',
  4: 'fourthCategoryIdList'
};
import SeachStretch from '@/components/SeachStretch';
import _ from 'lodash';
import { categoryfindByPage } from '@/api/stockOperation';
import { levelToTree } from '@/utils';
export default {
  name: 'SeachTop',
  components: { SeachStretch },
  data() {
    return {
      show: false,
      seasonList: [],
      categoryIdList: [],
      festivalList: [],
      salesTrendLabelValues: [],
      salesExceptionLabelValues: '',
      infringingLable: '',
      seaoptionsList: [{
        id: 'Spring',
        value: '春季'
      }, {
        id: 'Summer',
        value: '夏季'
      }, {
        id: 'Fall',
        value: '秋季'
      }, {
        id: 'Winter',
        value: '冬季'
      }, {
        id: 'Four seasons',
        value: '全季'
      }],
      outOfStockNumBegin: '',
      outOfStockNumEnd: '',
      tdSalesNumBegin: '',
      tdSalesNumEnd: '',
      sevenDaySalesNumBegin: '',
      sevenDaySalesNumEnd: '',
      shelvesDayBegin: '',
      shelvesDayEnd: '',
      thirtyDaySalesNumBegin: '',
      thirtyDaySalesNumEnd: '',
      timeList: [{
        id: 1,
        value: '待创建需求单'
      }, {
        id: 2,
        value: '已创建需求单'
      }, {
        id: 3,
        value: '已作废'
      }],
      levelList: [],
      categoryIds: [],
      statusList: [],
      panguGoodsIds: '',
      isExportData: '',
      panguGoodsDdids: '',
      canSale: '',
      shortFlag: '',
      shelvesStatus: '',
      categoryList: [],
      isMaoNiuYong: '',
      dmsIsClearance: '',
      goodLists: [],
      supplierList: [{
        id: 1,
        value: '线上供应商'
      }, {
        id: 2,
        value: '线下供应商'
      }],
      levelIds: [],
      festList: [],
      dmsSupplierType: '',
      Exception: [{
        id: 'up',
        value: '销量骤升'
      }, {
        id: 'down',
        value: '销量骤降'
      }],
      TrendLableList: [{
        id: 'up',
        value: '上升'
      }, {
        id: 'down',
        value: '下降'
      }, {
        id: 'steady',
        value: '稳健'
      }],
      upList: [{
        id: '1',
        value: '已上架'
      }, {
        id: '0',
        value: '未上架'
      }],
      tortList: [{
        id: '1',
        value: '侵权'
      }, {
        id: '0',
        value: '不侵权'
      }],
      enableList: [{
        id: '1',
        value: '是'
      }, {
        id: '2',
        value: '否'
      }],
      clearList: [{
        id: '1',
        value: '是'
      }, {
        id: '0',
        value: '否'
      }]
    };
  },
  mounted() {
    const params = {
      page: 1,
      pageSize: 99999
    };
    findByPage(params).then(res => {
      if (res.data.code === 200) {
        this.levelList = res.data.data.items;
      }
    });
    findByPageCategory(params).then(res => {
      if (res.data.code === 200) {
        this.categoryList = res.data.data.items.filter(item => item.status === 1);
      }
    });
    categoryfindByPage(params).then(res => {
      if (res.data.code === 200) {
        this.goodLists = levelToTree(res.data.data.items, 'panguPId', 'panguCategoryId');
      }
    });
    this.getFestival();
  },
  methods: {
    handleCanSale(val) {
      this.$emit('handleCanSale', val);
    },
    handleAuto() {
      this.show = !this.show;
      this.$refs.SeachStretch.setAutoHeight(this.show);
      this.$emit('handleAuto');
    },
    handleSeach() {
      this.$emit('handleSeach');
    },
    reset() {
      this.panguGoodsIds = '';
      this.categoryIdList = [];
      this.isExportData = '';
      this.isMaoNiuYong = '';
      this.shelvesDayBegin = '';
      this.shelvesDayEnd = '';
      this.seasonList = [];
      this.salesTrendLabelValues = [];
      this.salesExceptionLabelValues = '';
      this.panguGoodsDdids = '';
      this.dmsSupplierType = '';
      this.levelIds = [];
      this.categoryIds = [];
      this.festivalList = [];
      this.statusList = [];
      this.dmsIsClearance = '';
      this.maxSuggestOrderCount = '';
      this.minSuggestOrderCount = '';
      this.shelvesStatus = '';
      this.shortFlag = '';
      this.infringingLable = '';
      this.canSale = '';
      this.orderByColumn = '';
      this.orderByValue = '';
      this.outOfStockNumBegin = '';
      this.outOfStockNumEnd = '';
      this.tdSalesNumBegin = '';
      this.tdSalesNumEnd = '';
      this.sevenDaySalesNumBegin = '';
      this.sevenDaySalesNumEnd = '';
      this.thirtyDaySalesNumBegin = '';
      this.thirtyDaySalesNumEnd = '';
      this.$emit('reset');
    },
    async getFestival() {
      const { data: res } = await getFestivalList();
      if (res.code === 200) {
        this.festList = res.data;
      }
    },
    doSeach() {
      let panguGoodsIds = [];
      let panguGoodsDdids = [];
      if (this.panguGoodsIds === '') {
        panguGoodsIds = [];
      } else {
        panguGoodsIds = this.panguGoodsIds.trim().split(/\s+/);
      }
      if (this.panguGoodsDdids === '') {
        panguGoodsDdids = [];
      } else {
        panguGoodsDdids = this.panguGoodsDdids.trim().split(/\s+/);
      }
      let body = {
        panguGoodsIds: panguGoodsIds,
        seasonList: this.seasonList,
        festivalList: this.festivalList,
        salesTrendLabelValues: this.salesTrendLabelValues,
        salesExceptionLabelValues: this.salesExceptionLabelValues !== '' ? [this.salesExceptionLabelValues] : [],
        categoryIds: this.categoryIds,
        dmsSupplierType: this.dmsSupplierType,
        shelvesDayBegin: this.shelvesDayBegin,
        shelvesDayEnd: this.shelvesDayEnd,
        shelvesStatus: this.shelvesStatus,
        infringingLable: this.infringingLable,
        dmsIsClearance: this.dmsIsClearance,
        panguGoodsDdids: panguGoodsDdids,
        shortFlag: this.shortFlag,
        levelIds: this.levelIds,
        canSale: this.canSale,
        isMaoNiuYong: this.isMaoNiuYong,
        statusList: this.statusList,
        outOfStockNumBegin: this.outOfStockNumBegin,
        outOfStockNumEnd: this.outOfStockNumEnd,
        tdSalesNumBegin: this.tdSalesNumBegin,
        tdSalesNumEnd: this.tdSalesNumEnd,
        sevenDaySalesNumBegin: this.sevenDaySalesNumBegin,
        sevenDaySalesNumEnd: this.sevenDaySalesNumEnd,
        thirtyDaySalesNumBegin: this.thirtyDaySalesNumBegin,
        thirtyDaySalesNumEnd: this.thirtyDaySalesNumEnd
      };
      const params = {};
      for (const i in idList) {
        const keyValue = idList[i];
        params[keyValue] = [];
        this.categoryIdList.forEach(item => {
          if (item.length === Number(i)) {
            params[keyValue].push(item[Number(i) - 1]);
            params[keyValue] = _.uniq(params[keyValue]);
          }
        });
      }
      body = { ...body, ...params };
      return body;
    }
  }
};
</script>

<style scoped>
.line40{
  line-height:40px;
}
</style>
