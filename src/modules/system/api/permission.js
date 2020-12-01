import request from '@/utils/request'
import qs from 'qs'

// 获取所有权限
export function getAllPermission (params) {
  return request({
    url: '/auth/permission/find_all_list_new',
    method: 'get',
    params: params
  })
}

// 添加权限
export function addPermission (data) {
  return request({
    url: '/auth/permission/save',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 删除权限
export function deletePermissions (ids) {
  return request({
    url: '/auth/permission/delete',
    method: 'post',
    data: qs.stringify({
      ids
    }, { indices: false })
  })
}

// 编辑权限
export function editPermission (data) {
  return request({
    url: '/auth/permission/update',
    method: 'post',
    data: qs.stringify(data, { indices: false })
  })
}
