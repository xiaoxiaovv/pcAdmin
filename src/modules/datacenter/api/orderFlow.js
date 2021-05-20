import request from '@/utils/request'
import qs from 'qs'

/**
 *获取订单列表
 */
export function getOrderFlowList (params) {
  return request({
    url: '/order/order/getOrderList',
    method: 'get',
    params
  })
}
/**
 *获取支付渠道
 */
export function getPayWayOption () {
  return request({
    url: '/order/order/find_pay_way',
    method: 'get',
    params: {}
  })
}
