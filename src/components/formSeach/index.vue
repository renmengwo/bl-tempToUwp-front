<template>
  <div>
    <div id="seach-box" class="transtion_property">
      <div id="seach-content" class="clearfix">
        <div class="seach-box clearfix" style="flex:1">
          <form-create v-model="fApi" :rule="rule" :option="options" :value.sync="value"></form-create>
        </div>
        <div class="btn-box" :style="{width: btnwidth + 'px'}">
          <slot name="button">
          </slot>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    btnwidth: {
      type: Number,
      default: () => 0
    },
    valueObj: {
      type: Object,
      default: () => {}
    },
    rule: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      finalyHei: 0,
      fApi: {},
      value: this.valueObj,
      options: {
        global: {
          '*': {
            class: 'set-seach'
          }
        },
        form: {
          labelWidth: '130px'
        },
        submitBtn: {
          show: false
        },
        row: {
          tag: 'div'
        }
      }
    };
  },

  watch: {
    value: {
      handler(newValue, oldValue) {
        this.$emit('input', newValue);
      }, deep: true
    }
  },
  methods: {
    setAutoHeight(flag) {
      const seachBox = document.getElementById('seach-box');
      const seachContent = document.getElementById('seach-content');
      this.finalyHei = seachContent.offsetHeight;
      if (flag) {
        seachBox.style.height = `${this.finalyHei}px`;
      } else {
        seachBox.style.height = '55px';
      }
    },
    resetFiled() {
      this.fApi.resetFields();
    }
  }
};
</script>

<style scoped lang="scss">
#seach-content{
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
}
#seach-box{
  .el-form{
    width:100%;
  }
  .form-create{
    ::v-deep &>.el-row{
      display: flex;
      flex-wrap: wrap;
    }
  }
 .set-box{
    display: flex;
    flex-direction: row;
    //自动换行
    flex-wrap: wrap;
    //清除上下行的中间空隙
    align-content: flex-start;
  }
  ::v-deep .set-seach{
    flex: 0 0 350px;
    @extend .set-box;
    .el-form-item{
      margin-bottom: 15px;
    }
    label{
      text-align: right;
      padding-right: 10px;
      line-height: 40px;
      width: 130px;
      color: #333;
      font-size: 16px;
      font-weight: normal;
      &+div{
        width:calc(100% - 130px)
      }
    }
  }
}
.transtion_property{
  -webkit-transition:0.5s ease;
  -moz-transition:0.5s ease;
  -webkit-transition-property:height;
  -moz-transition-property:height;
  height: 55px;
  overflow: hidden;
}
.transitionHeight{
  height: 100px;
}
.btn-box {
  display: flex;height:40px; flex-direction: row;justify-content: space-around;align-items: center;
  width:300px;
}
</style>
