import request from '@/utils/request'
// import qs from 'qs'
// jsonHeader: true

/**
 *佣金结算--列表获取
 */
export function commissionList (params) {
  return request({
    url: '/order/commission/list',
    method: 'get',
    jsonHeader: true,
    params: params
  })
}
/**
 *佣金结算--数据统计
 */
export function commissionSummary (params) {
  return request({
    url: '/order/commission/summary',
    method: 'get',
    jsonHeader: true,
    params: params
  })
}
/**
 *佣金结算--结算
 */
export function commissionSettle (params) {
  return request({
    url: '/order/commission/settle',
    method: 'POST',
    jsonHeader: true,
    data: params
  })
}
/**
 *佣金结算--佣金记录
 */
export function commissionCretecomission (params) {
  return request({
    url: '/order/commission/cretecomission',
    method: 'get'
  })
}

/**
 *获取结算，未结算金额
 */
export function commissionCounts (params) {
  return request({
    url: '/order/commission/commission',
    method: 'get'
  })
}
/**
 *佣金管理--导出
 */
export function commissionListExport (params) {
  return request({
    url: '/order/commission/list/export',
    method: 'get',
    jsonHeader: true,
    apiType: 'downFile',
    responseType: 'blob',
    params: params
  })
}

/**
 * 佣金管理--导出结算报表
 */
export function commissionListExportExcel (params) {
  return request({
    url: '/order/commission/settle/export',
    method: 'get',
    jsonHeader: true,
    apiType: 'downFile',
    responseType: 'blob',
    params: params
  })
}
