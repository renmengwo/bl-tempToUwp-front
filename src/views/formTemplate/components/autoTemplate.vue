<template>
  <div>
    <div class="form-seach">
      <p class="set-name">自定义</p>
      <div>
        <el-col :span="11"><el-input v-model="compObj.shelvesDayBegin" placeholder="请输入" clearable></el-input></el-col>
        <el-col :span="2" class="t-c line40">--</el-col>
        <el-col :span="11"><el-input v-model="compObj.shelvesDayEnd" placeholder="请输入" clearable></el-input></el-col>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AutoTemplate',
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          shelvesDayBegin: '',
          shelvesDayEnd: ''
        };
      }
    },
    disabled: Boolean
  },
  data() {
    return {
      compObj: {
        shelvesDayBegin: '',
        shelvesDayEnd: ''
      }
    };
  },
  watch: {
    compObj: {
      handler(newValue) {
        this.$emit('input', newValue);
      }, deep: true
    },
    value: {
      handler(newValue) {
        this.compObj = newValue;
      }, deep: true
    }
  }
};
</script>

<style scoped>

</style>
