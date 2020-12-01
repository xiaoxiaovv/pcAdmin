import request from '@/utils/request'
import qs from 'qs'

/**
 *获取省市区树结构
 */
export function getProviceTree (params) {
  return request({
    url: '/common/province/tree',
    method: 'GET',
    params: params,
    jsonHeader: true
  })
}

/**
 *获取省市区树结构--微信进件
 */
export function getProviceTreeIncomeWx (params) {
  return request({
    url: '/common/province/tree_new',
    method: 'GET',
    params: params,
    jsonHeader: true
  })
}

// 获取代理商升级信息
export function getUpgradeInfo (params) {
  return request({
    url: '/auth/company/service_provider/get_upgrade_company_info',
    method: 'GET',
    params: params
  })
}

// 代理商升级
export function saveUpgradeInfo (params) {
  return request({
    url: '/auth/company/service_provider/company_upgrade',
    method: 'GET',
    params: params
  })
}

// 获取代理商升级信息
export function getChangeUpgradeInfo (params) {
  return request({
    url: '/auth/company/service_provider/get_change_company_info',
    method: 'GET',
    params: params
  })
}

// 代理商变更上级
export function changeUpgradeCompanyInfo (params) {
  return request({
    url: '/auth/company/service_provider/change_superior_company',
    method: 'GET',
    params: params
  })
}
