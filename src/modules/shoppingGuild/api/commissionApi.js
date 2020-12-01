import request from '@/utils/request'
import qs from 'qs'

// 获取超级后台分佣统计列表
export function getStatisList (params) {
  return request({
    url: '/auth/daogou/order/super/statis',
    method: 'get',
    jsonHeader: true,
    params
  })
}
// 获取贴牌商分佣统计列表
export function getCompanyStatisList (params) {
  return request({
    url: '/auth/daogou/order/company/statis',
    method: 'get',
    jsonHeader: true,
    params
  })
}
// 获取贴牌商订单列表
export function getCompanyOrderList (params) {
  return request({
    url: '/auth/daogou/order',
    method: 'get',
    jsonHeader: true,
    params
  })
}
// 审核佣金
export function setAudit (params) {
  return request({
    url: '/auth/daogou/order/audit',
    method: 'post',
    data: qs.stringify(
      params
    )
  })
}
