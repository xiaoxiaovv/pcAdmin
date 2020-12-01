import request from '@/utils/request'
import qs from 'qs'

// 获取{{levelAlias.oemName}}列表
export function getProviderList (pageNumber, pageSize, searchData) {
  return request({
    url: '/auth/company/service_provider/list_rewrite',
    method: 'get',
    params: {
      pageNumber,
      pageSize,
      name: searchData.name,
      contact: searchData.contact,
      status: searchData.status,
      phone: searchData.phone,
      isFree: searchData.isFree
    }
  })
}

// 添加{{levelAlias.oemName}}
export function providerAdd (data) {
  return request({
    url: '/auth/company/service_provider/save_rewrite',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 修改{{levelAlias.oemName}}
export function providerUpdate (data) {
  return request({
    url: '/auth/company/service_provider/update',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 提交审核或审核
export function updateStatus (id, status) {
  return request({
    url: '/auth/company/service_provider/update_status',
    method: 'post',
    params: {
      id: id,
      status: status
    }
  })
}

// 重置密码
export function resetPassword (id, password) {
  return request({
    url: '/auth/user/reset_password',
    method: 'post',
    params: {
      id: id,
      password: password
    }
  })
}

// 获取详情
export function findDetail (id) {
  return request({
    url: '/auth/company/site_info/detail',
    method: 'get',
    params: {
      serviceProviderId: id
    }
  })
}

// 录入获取详情
export function findEntryDetail (id) {
  return request({
    url: '/auth/company/site_info/entry',
    method: 'get',
    params: {
      serviceProviderId: id
    }
  })
}

// 提交录入详情
export function submitDetail (data) {
  return request({
    url: '/auth/company/site_info/update',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 提交录入详情
export function checkDomain (data) {
  return request({
    url: '/fms/domain/save_rewrite',
    method: 'get',
    params: data
  })
}
