import { post, fetch, put } from '@/utils/request';
// 新增或修改CommodityLevel对象
export const saveOrUpdate = (params) => post(`/dms-server/commoditylevel/saveOrUpdate`, params);
// 根据层次名称查询CommodityLevel对象
export const commodityLevel = (params) => fetch(`/dms-server/commoditylevel/findByName`, params);
// 根据主键ID查询CommodityLevel对象
export const findById = (id) => fetch(`/dms-server/commoditylevel/findById/${id}`);
// CommodityLevel分页查询
export const findByPage = (params) => post(`/dms-server/commoditylevel/findByPage`, params);
// 批量禁用、启用商品层次
export const bathDisabled = (params) => put(`/dms-server/commoditylevel/bathEdit`, params);
// 商品层次操作记录
export const logsFindByPage = (params) => post(`/dms-server/commoditylevellog/findByPage`, params);
// 新增或修改层次周销
export const saveOrUpdateWeekly = (params) => post(`/dms-server/commodityWeeklySalesRule/saveOrUpdate`, params);
// 新增或修改分析品类
export const saveOrUpdateCategory = (params) => post(`/dms-server/commoditycategory/saveOrUpdate`, params);
// 分析品类列表接口
export const findByPageCategory = (params) => post(`/dms-server/commoditycategory/findByPage`, params);
// 分析品类日志查询
export const findByPageCategoryLog = (params) => post(`/dms-server/commoditycategorylog/findByPage`, params);
// 分析品类导出
export const exportData = (params) => post(`/dms-server/commoditycategory/exportData`, params, { responseType: 'blob' });
// 分析品类映射关系导出
export const categoryExportData = (params) => post(`/dms-server/commoditycategoryrelation/exportRelationData`, params, { responseType: 'blob' });
// 层次周销导出
export const exportWeeklySaleRuleData = (params) => post(`/dms-server/commodityWeeklySalesRule/exportWeeklySaleRuleData`, params, { responseType: 'blob' });
// 备货参数导出
export const exportStockUpData = (params) => post(`/dms-server/commodityStockUp/exportStockUpData`, params, { responseType: 'blob' });
// 层次周销分页查询
export const commodityWeeklySalesRule = (params) => post(`/dms-server/commodityWeeklySalesRule/findByPage`, params);
// 分析品类批量启用禁用
export const commodityCategorySalesRule = (params) => put(`/dms-server/commoditycategory/bathEdit`, params);
// 层次周销操作记录
export const commodityWeeklyLog = (params) => post(`/dms-server/commodityWeeklySalesRuleLog/findByPage`, params);
// 层次周销启用禁用
export const commodityWeeklyUpdateBatch = (params) => post(`/dms-server/commodityWeeklySalesRule/updateStatus`, params);
// 备货参数分页
export const commodityStockUpfindByPage = (params) => post(`/dms-server/commodityStockUp/findByPage`, params);
// 备货参数新增修改
export const commodityStockUpSaveOrUpdate = (params) => post(`/dms-server/commodityStockUp/saveOrUpdate`, params);
// 备货参数修改记录
export const commodityStockUpLog = (params) => post(`/dms-server/commodityStockUpLog/findByPage`, params);
// 备货参数启用禁用
export const commodityStockUpupdateStatus = (params) => post(`/dms-server/commodityStockUp/updateStatus`, params);
// 层次周销上传
// export const importWeeklySaleRuleData = `/api/dms-server/commodityWeeklySalesRule/importWeeklySaleRuleData`;
export const importWeeklySaleRuleData = (params) => post(`/dms-server/commodityWeeklySalesRule/importWeeklySaleRuleData`, params, { responseType: 'blob' });
// 分析品类上传
export const importRelationData = (params) => post(`/dms-server/commoditycategoryrelation/importRelationData`, params, { responseType: 'blob' });
// 备货参数上传
export const importStockUpData = (params) => post(`/dms-server/commodityStockUp/importStockUpData`, params, { responseType: 'blob' });
// 商品层次变更列表
export const commodityModifyRecordList = (params) => post(`/dms-server/commodityModifyRecord/findByPage`, params);
// 查询操作记录
export const commoditymodifyRecordList = (params) => post(`/dms-server/commoditymodifyrecordlog/findByPage`, params);
// 变更的接口
export const commoditychangeLevel = (params) => post(`/dms-server/commodityModifyRecord/changeLevel`, params);
// 任务分页查询
export const taskfindByPage = (params) => post(`/dms-server/demand/task/findByPage`, params);
// 创建任务
export const creatSave = () => post(`/dms-server/demand/task/save`);
// 批量获取备货单详情
export const getByDemandId = (params) => post(`/dms-server/demanditem/getByDemandId`, params);
// 异步任务分页查询
export const taskExoprtList = (params) => post(`/dms-server/asyntask/findByPage`, params);
// 导出备货需求单数据
export const exportDemandData = (params) => post(`/dms-server/demand/exportDemandData`, params);
// 获取层次枚举值集合
export const getLevelShelfEnums = () => fetch(`/dms-server/commoditylevel/getLevelShelfEnums`);
// 节日款参数规则配置分页查询
export const festivalfindByPage = (params) => post(`/dms-server/festivalrule/findByPage`, params);
// 节日款参数规则配置批量启用禁用
export const festivalbatchUpdateStatus = (params) => post(`/dms-server/festivalrule/batchUpdateStatus`, params);
// 节日备货参数规则配置日志分页查询
export const festivalrulelog = (params) => post(`/dms-server/festivalrulelog/findByPage`, params);
// 新增或修改节日款参数规则配置对象
export const festivalsaveOrUpdate = (params) => post(`/dms-server/festivalrule/saveOrUpdate`, params);
// 获取节日标签
export const getFestivalList = () => fetch(`/dms-server/goodsattributesrelation/getFestivalList`);

