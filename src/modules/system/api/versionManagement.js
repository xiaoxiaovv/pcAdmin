import request from '@/utils/request'

/**
 *获取版本列表
 */
export function versionList (params) {
  return request({
    url: '/auth/version/list',
    method: 'get',
    params: params
  })
}

/**
 *获取版本列表--新增
 */
export function versionAdd (params) {
  return request({
    url: '/auth/version/add',
    method: 'POST',
    jsonHeader: true,
    data: params
  })
}

/**
 *获取版本列表--编辑
 */
export function versionEdit (params) {
  return request({
    url: '/auth/version/edit',
    method: 'POST',
    jsonHeader: true,
    data: params
  })
}

/**
 *获取版本列表--编辑
 */
export function versionDelete (params) {
  return request({
    url: '/auth/version/delete',
    method: 'DELETE',
    jsonHeader: true,
    params: params
  })
}
