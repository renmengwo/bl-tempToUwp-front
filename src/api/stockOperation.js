import { post } from '@/utils/request';
// 备货需求列表页
export const StockPage = (params) => post(`/dms-server/demand/findByPage`, params);
// 新增或修改备注信息
export const remarkSaveOrUpdate = (params) => post(`/dms-server/demandremark/saveOrUpdate`, params);
// 备注分页
export const remarkfindByPage = (params) => post(`/dms-server/demandremark/findByPage`, params);
// 备货需求批量创建
export const stockBatchCreate = (params) => post(`/dms-server/demand/batchCreate`, params);
// 批量修改拟下单量
export const importDemandDataUpdateOrderNum = (params) => post(`/dms-server/demand/importDemandDataUpdateOrderNum`, params, { responseType: 'blob' });
// 校验 需求单-导入数据批量下单
export const verifyDemandOrderBatchByImport = (params) => post(`/dms-server/demandorder/verifyDemandOrderBatchByImport`, params, { isHideLoading: true });
// 需求单-导入数据批量下单
export const saveDemandOrderBatchByImport = () => post(`/dms-server/demandorder/saveDemandOrderBatchByImport`);
// 批量导入变更建议层次
export const importCommodityModifyLevel = (params) => post(`/dms-server/commodityModifyRecord/importCommodityModifyLevel`, params, { responseType: 'blob' });
// 商品分类分页查询
export const categoryfindByPage = (params) => post(`/dms-server/pangugoodscategory/findByPage`, params);
// 商品数据监控分页
export const findGoodsDataMonitoringByPage = (params) => post(`/dms-server/pangugoods/findGoodsDataMonitoringByPage`, params);
// 批量操作商品“清仓”状态
export const setClearanceByDms = (params) => post(`/dms-server/panguGoodsExtend/setClearanceByDms`, params);
// 根据goodsId集合获取实时销量库存缺货数量
export const getPgGoodsSalesAndStockList = (params) => post(`/dms-server/pangugoodssalesday/getPgGoodsSalesAndStockList`, params);
// 获取商品标签数据
export const listByGoodsIds = (params) => post(`/dms-server/goodslabel/listByGoodsIds`, params);
// 查询sku、skc每日库存趋势
export const repertoryTendency = (params) => post(`/dms-server/pangugoodsrepertoryday/repertoryTendency`, params);
// 查询sku、skc每日销量趋势
export const salesTendency = (params) => post(`/dms-server/pangugoodssalesday/salesTendency`, params);
// 导出建议层次
export const exportCommodityRecordData = (params) => post(`/dms-server/commodityModifyRecord/exportCommodityRecordData`, params);
// 批量设置商品节日标签
export const setFestivalBatch = (params) => post(`/dms-server/goodslabel/setFestivalLabel`, params);
// 批量清除商品节日标签
export const removeFestivalBatch = (params) => post(`/dms-server/goodslabel/removeAllFestivalLabel`, params);
// 商品数据监控日志分页查询
export const logFindPage = (params) => post(`/dms-server/goodsdatamonitoringlog/findByPage`, params);
