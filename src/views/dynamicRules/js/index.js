import formCreate from '@form-create/element-ui';
// 分析品类
const analysisRule = function() {
  const rule = [{
    type: 'div',
    children: [
      formCreate.maker.input('分析品类', 'name', '').props({
        placeholder: '请输入分析品类',
        clearable: true
      })
    ]
  }, {
    type: 'div',
    children: [
      formCreate.maker.select('分析品类状态', 'status', '').options([{
        value: 1,
        label: '启用'
      }, {
        value: 0,
        label: '禁用'
      }]).props({
        clearable: true,
        filterable: true,
        placeholder: '请选择状态'
      })
    ]
  }];
  return rule;
};
// 商品层次配置
const levelRule = function() {
  const rule = [{
    type: 'div',
    children: [
      formCreate.maker.input('商品层次', 'name', '').props({
        placeholder: '请输入商品层次',
        clearable: true
      })
    ]
  }, {
    type: 'div',
    children: [
      formCreate.maker.select('商品层次状态', 'status', '').options([{
        value: 1,
        label: '启用'
      }, {
        value: 0,
        label: '禁用'
      }]).props({
        clearable: true,
        filterable: true,
        placeholder: '请选择状态'
      })
    ]
  }, {
    type: 'div',
    children: [
      formCreate.maker.select('适用上架时长', 'shelfTime', '').options([...this.timeList]).props({
        clearable: true,
        filterable: true,
        placeholder: '请选择状态'
      })
    ]
  }];
  return rule;
};
// 层次周销配置，备货参数配置
const stockweekRule = function() {
  const rule = [{
    type: 'div',
    children: [
      formCreate.maker.select('商品层次', 'commodityLevelId', '').options([...this.formList.levelList]).props({
        clearable: true,
        filterable: true,
        placeholder: '请选择商品层次'
      })
    ]
  }, {
    type: 'div',
    children: [
      formCreate.maker.select('分析品类', 'commodityCategoryId', '').options([...this.formList.categoryList]).props({
        clearable: true,
        filterable: true,
        placeholder: '请选择分析品类'
      })
    ]
  }, {
    type: 'div',
    children: [
      formCreate.maker.select('规则状态', 'status', '').options([{
        value: 1,
        label: '启用'
      }, {
        value: 0,
        label: '禁用'
      }]).props({
        clearable: true,
        filterable: true,
        placeholder: '请选择规则状态'
      })
    ]
  }];
  return rule;
};
export default {
  analysisRule,
  levelRule,
  stockweekRule
};
