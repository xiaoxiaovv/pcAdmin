import request from '@/utils/request'
import qs from 'qs'

// 获取商户列表
export function getAllList (params) {
  return request({
    url: '/merchant/merchant/merchant_search_for_name',
    method: 'get',
    params
  })
}
// 添加薅羊毛商户
export function addStream (params) {
  return request({
    url: '/merchant/market',
    method: 'post',
    jsonHeader: true,
    data: params
  })
}
// 获取薅羊毛商户列表
export function getStreamList (params) {
  return request({
    url: '/merchant/market/get_merchant_list',
    method: 'get',
    params
  })
}
// 添加薅羊毛商户
export function delStream (params) {
  return request({
    url: '/merchant/market',
    method: 'put',
    jsonHeader: true,
    data: params
  })
}
// 手动制券
export function addModel (params) {
  return request({
    url: '/merchant/market/create_voucher',
    method: 'get',
    params
  })
}
