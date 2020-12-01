import request from '@/utils/request'
import qs from 'qs'

// 点击详情获取{{levelAlias.firstName}}列表
export function getOperatorList (pageNumber, pageSize, managerId) {
  return request({
    url: '/auth/company/opera/list',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      managerId: managerId
    }
  })
}

// 点击详情获取{{levelAlias.secondName}}列表
export function getDistributeList (pageNumber, pageSize, managerId) {
  return request({
    url: '/auth/company/distribute/list_rewrite',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      managerId: managerId
    }
  })
}

// 点击详情获取{{levelAlias.thirdName}}列表
export function getDistributeThirdList (pageNumber, pageSize, managerId) {
  return request({
    url: '/auth/company/third_agent/list_rewrite',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      managerId: managerId
    }
  })
}

// 点击详情获取商户列表
export function getMerchantList (pageNumber, pageSize, managerId, companyId, userId) {
  let params = {
    pageNumber: pageNumber,
    pageSize: pageSize,
    managerId: managerId,
    companyId: companyId
  }
  if (userId) {
    params.userId = userId
  }
  return request({
    url: '/merchant/merchant/re_list',
    method: 'get',
    params: params
  })
}

// 获取商户详情
export function getManagerDetail (id) {
  return request({
    url: '/auth/user/detail',
    method: 'get',
    params: {
      id: id
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
