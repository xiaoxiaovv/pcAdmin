import request from '@/utils/request'
import qs from 'qs'

// 获取审核状态
export function getAuditstatus () {
  return request({
    url: '/merchant/mch_info/findCheck',
    method: 'get'
  })
}

// 设置审核状态
export function setAutoCheck (params) {
  return request({
    url: '/merchant/mch_info/setAutoCheck',
    method: 'POST',
    data: qs.stringify(
      params
    )
  })
}

// 审核通过
export function auditPass (params) {
  return request({
    url: '/merchant/mch_info/setCheck',
    method: 'GET',
    params: params
  })
}
