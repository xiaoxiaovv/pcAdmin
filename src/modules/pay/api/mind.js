import request from '@/utils/request'
import qs from 'qs'

// 添加薅羊毛商户
export function addStream (params) {
  return request({
    url: '/pay/pay_channel/save_channel_market',
    method: 'post',
    jsonHeader: true,
    data: params
  })
}
// 获取薅羊毛商户列表
export function getStreamList () {
  return request({
    url: '/pay/pay_channel/channel_market_list',
    method: 'get',
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
// 获取通道信息
export function getChanelCofig () {
  return request({
    url: '/auth/systemconfig?key=pay_chanel',
    method: 'GET'
  })
}
