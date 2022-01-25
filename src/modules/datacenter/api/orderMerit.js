import request from '@/utils/request'

/**
 * 佣金明细
 */

export function commDetail (params) {
  return request({
    url: '/order/order/merit',
    method: 'get',
    params: params
  })
}

/**
 * 佣金明细--导出报表
 */
export function commissionDetailExportExcel (params) {
  return request({
    url: '/order/order/export',
    method: 'get',
    timeout: 65000,
    jsonHeader: true,
    apiType: 'downFile',
    responseType: 'blob',
    params: params
  })
}

/**
 * 全部商户订单列表
 */

export function getDataList (params) {
  return request({
    url: '/order/order/getOrderGoodsList',
    method: 'get',
    params: params
  })
}
