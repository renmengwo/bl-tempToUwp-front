<template>
  <div id="seach-box" class="transtion_property">
    <el-row id="seach-content" type="flex" class="clearfix">
      <div class="seach-box clearfix" style="flex:1">
        <slot name="seach"></slot>
      </div>
      <div class="btn-box" :style="{width: btnwidth + 'px'}">
        <slot name="button">
        </slot>
      </div>
    </el-row>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'Index',
  props: {
    btnwidth: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      finalyHei: 0
    };
  },
  beforeMount() {
    window.addEventListener('resize', this.getInitHei);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getInitHei);
  },
  mounted() {
    this.getInitHei();
  },
  methods: {
    getInitHei: _.throttle(async function() {
      const seachBox = document.getElementById('seach-content');
      this.finalyHei = seachBox.offsetHeight;
    }, 1000),
    setAutoHeight(flag) {
      const seachBox = document.getElementById('seach-box');
      if (flag) {
        seachBox.style.height = `${this.finalyHei}px`;
      } else {
        seachBox.style.height = '55px';
      }
    }
  }
};
</script>

<style scoped lang="scss">
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
