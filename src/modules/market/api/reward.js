import request from '@/utils/request'
import qs from 'qs'

// 获取商户列表
export function getdayList (params) {
  return request({
    url: '/merchant/commission_day',
    method: 'get',
    params
  })
}
//导入数据
export function importData (params) {
  return request({
    url: '/merchant/commission_day/importCommissionDay',
    method: 'post',
    params
  })
}
