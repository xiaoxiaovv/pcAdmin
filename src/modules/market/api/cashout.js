import request from '@/utils/request'
import qs from 'qs'

// 获取列表
export function getCashList (params) {
  return request({
    url: '/merchant/market_cashOut/cash_out_pc',
    method: 'get',
    params
  })
}

// 修改状态
export function modifyStatus (params) {
  return request({
    url: '/merchant/market_cashOut/modify_status',
    method: 'post',
    jsonHeader: true,
    data: params
  })
}
