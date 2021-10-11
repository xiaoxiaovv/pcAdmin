import request from '@/utils/request'
import qs from 'qs'

// 获取商户列表
export function getOrderList (params) {
  return request({
    url: '/merchant/order',
    method: 'get',
    params
  })
}