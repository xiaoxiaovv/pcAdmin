import request from '@/utils/request'
import qs from 'qs'

// 获取商户列表
export function getRuleList () {
  return request({
    url: '/merchant/market_rule/get_rule_list',
    method: 'get',
  })
}
export function editRule (params) {
  return request({
    url: '/merchant/market_rule',
    method: 'post',
    jsonHeader: true,
    data: params
  })
}
export function doRule (params) {
  return request({
    url: '/merchant/market_rule',
    method: 'put',
    jsonHeader: true,
    data: params
  })
}
