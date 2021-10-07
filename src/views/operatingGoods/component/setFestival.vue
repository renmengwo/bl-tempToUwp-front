<template>
  <div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
      <el-form-item label="节日标签" prop="festivalAttrIds">
        <el-select v-model="ruleForm.festivalAttrIds" placeholder="请选择节日标签" clearable filterable multiple>
          <el-option
            v-for="item in festivalList"
            :key="item.attrId"
            :label="item.attrCnName"
            :value="item.attrId"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getFestivalList } from '@/api/dynamicRule';

export default {
  name: 'SetFestival',
  props: {
    hasFestival: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      ruleForm: {
        festivalAttrIds: []
      },
      rules: {
        festivalAttrIds: [
          { required: true, message: '请选择节日标签', trigger: 'blur' }
        ]
      },
      festivalList: []
    };
  },
  methods: {
    setInitData() {
      this.FestivalList();
      this.$refs['ruleForm'].resetFields();
      this.ruleForm.festivalAttrIds = this.hasFestival;
    },
    async FestivalList() {
      const { data: res } = await getFestivalList();
      if (res.code === 200) {
        this.festivalList = res.data;
      }
    },
    submite() {
      return new Promise((resolve, reject) => {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            const { festivalAttrIds } = this.ruleForm;
            resolve(festivalAttrIds);
          } else {
            reject(false);
          }
        });
      });
    }
  }
};
</script>

<style scoped>

</style>
