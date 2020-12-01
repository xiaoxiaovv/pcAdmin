import request from '@/utils/request'
import qs from 'qs'

// 获取{{levelAlias.firstName}}列表
export function getOperatorList (pageNumber, pageSize, searchData) {
  return request({
    url: '/auth/company/opera/list_rewrite',
    method: 'get',
    params: {
      pageNumber,
      pageSize,
      name: searchData.name,
      contact: searchData.contact,
      status: searchData.status,
      parentId: sessionStorage.getItem('companyId')
    }
  })
}

// 添加{{levelAlias.firstName}}
export function operaAdd (data) {
  return request({
    url: '/auth/company/opera/save_rewrite',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 修改{{levelAlias.firstName}}
export function operaUpdate (data) {
  return request({
    url: '/auth/company/opera/update',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 删除{{levelAlias.firstName}}
export function delOperator (id, status) {
  return request({
    url: '/auth/company/opera/isable',
    method: 'get',
    params: {
      id: id,
      status: status
    }
  })
}

// 提交审核或审核
export function audit (id, status) {
  return request({
    url: '/auth/company/opera/audit',
    method: 'post',
    params: {
      id: id,
      status: status
    }
  })
}

// 分润配置（一级）
export function rateSet (params) {
  return request({
    url: '/auth/company/opera/rate_set',
    method: 'post',
    jsonHeader: true,
    data: params
  })
}
// 分润配置（二级）
export function rateSetTwo (params) {
  return request({
    url: '/auth/company/distribute/rate_set',
    method: 'post',
    jsonHeader: true,
    data: params
  })
}
// 分润配置（三级）
export function rateSetThree (params) {
  return request({
    url: '/auth/company/third_agent/rate_set',
    method: 'post',
    jsonHeader: true,
    data: params
  })
}
// 分润详情（一级）
export function rateDetail (params) {
  return request({
    url: '/auth/company/opera/rate',
    method: 'get',
    params: params
  })
}
// 分润详情（二级）
export function rateDetailTwo (params) {
  return request({
    url: '/auth/company/distribute/rate',
    method: 'get',
    params: params
  })
}
// 分润详情（三级）
export function rateDetailThree (params) {
  return request({
    url: '/auth/company/third_agent/rate',
    method: 'get',
    params: params
  })
}
