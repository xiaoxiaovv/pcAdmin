import request from '@/utils/request'
import qs from 'qs'

// 获取商户列表
export function getOrderList (params) {
  return request({
    url: '/pay/code_card/cash_collect',
    method: 'get',
    params
  })
}
// 结算
export function cashCollect (params) {
  return request({
    url: '/pay/code_card/cash_collect',
    method: 'post',
    jsonHeader: true,
    data:params
  })
}
// 结算
export function codecardModifyStatus (params) {
  return request({
    url: '/pay/code_card/cash_item/modify_status',
    method: 'post',
    jsonHeader: true,
    data:params
  })
}
// 结算
export function collectList (params) {
  return request({
    url: '/pay/code_card/cash_item',
    method: 'get',
    params
  })
}
// 结算
export function collitemList (params) {
  return request({
    url: '/pay/code_card/item',
    method: 'get',
    params
  })
}
export function exportf (params) {
  return request({
    url: '/pay/code_card/cash_collect/excel',
    method: 'get',
    jsonHeader: true,
    apiType: 'downFile',
    responseType: 'blob',
    params: params
  })
}
export function exports (params) {
  return request({
    url: '/pay/code_card/cash_item/excel',
    method: 'get',
    jsonHeader: true,
    apiType: 'downFile',
    responseType: 'blob',
    params: params
  })
}
export function exportt (params) {
  return request({
    url: '/pay/code_card/item/excel',
    method: 'get',
    jsonHeader: true,
    apiType: 'downFile',
    responseType: 'blob',
    params: params
  })
}
