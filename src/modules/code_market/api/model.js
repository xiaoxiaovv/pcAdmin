import request from '@/utils/request'
import qs from 'qs'

// 获取商户列表
export function getModelList (params) {
  return request({
    url: '/merchant/model',
    method: 'get',
    params
  })
}