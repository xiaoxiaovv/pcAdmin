import request from '@/utils/request'
// import qs from 'qs'
// jsonHeader: true

/**
 *设备管理--列表获取
 */
export function deviceList (params) {
  return request({
    url: '/auth/equipment',
    method: 'get',
    jsonHeader: true,
    params: params
  })
}
/**
 *设备管理--列表流水清单
 */
export function deviceDetailList (params) {
  return request({
    url: '/auth/equipment/detail',
    method: 'get',
    jsonHeader: true,
    params: params
  })
}
/**
 *设备管理--列表流水清单--统计信息
 */
export function deviceDetailSummary (params) {
  return request({
    url: '/auth/equipment/summary',
    method: 'get',
    jsonHeader: true,
    params: params
  })
}
/**
 *设备管理--列表流水清单--导出
 */
export function deviceDetailExport (params) {
  return request({
    url: '/auth/equipment/export',
    method: 'get',
    jsonHeader: true,
    apiType: 'downFile',
    responseType: 'blob',
    params: params
  })
}
