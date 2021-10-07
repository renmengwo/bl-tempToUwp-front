import formCreate from '@form-create/element-ui';
import autoTemplate from '../components/autoTemplate';
formCreate.component('autoTemplate', autoTemplate);
export const formrule = function() {
  const rule =
    [{
      type: 'div',
      children: [
        formCreate.maker.input('GoodsID', 'panguGoodsId', '123').props({
          placeholder: '请输入GoodsID',
          clearable: true
        })
      ]
    }, {
      type: 'div',
      children: [
        formCreate.maker.input('DDID', 'panguGoodsDdid', '').props({
          placeholder: '请输入DDID',
          clearable: true
        })
      ]
    }, {
      type: 'div',
      children: [
        formCreate.maker.select('商品层次', 'levelIdList', '').options([...this.levelList]).props({
          clearable: true,
          filterable: true,
          collapseTags: true,
          multiple: true,
          placeholder: '请选择商品层次'
        })
      ]
    },
    {
      type: 'div',
      children: [
        formCreate.maker.select('下单建议状态', 'statusList', '').options([{
          value: 1,
          label: '待创建需求单'
        }, {
          value: 2,
          label: '已创建需求单'
        }, {
          value: 3,
          label: '已作废'
        }]).props({
          clearable: true,
          filterable: true,
          collapseTags: true,
          multiple: true,
          placeholder: '请选择状态'
        })
      ]
    },
    {
      type: 'div',
      children: [
        formCreate.maker.dateRange('时间控件', 'time', '').props({
          startPlaceholder: '请选择',
          endPlaceholder: '请选择',
          format: 'yyyy/MM/dd',
          valueFormat: 'timestamp'
        })
      ]
    },
    {
      type: 'div',
      children: [
        formCreate.maker.cascader('级联测试', 'address', []).props({
          clearable: true,
          filterable: true,
          placeholder: '请选择',
          options: this.goodLists,
          props: {
            multiple: true,
            checkStrictly: true,
            value: 'panguCategoryId',
            label: 'name',
            children: 'childrens'
          }
        })
      ]
    },
    {
      type: 'div',
      children: [
        formCreate.maker.create('autoTemplate', 'testField', '').value({})
      ]
    }
    ];
  return rule;
};
