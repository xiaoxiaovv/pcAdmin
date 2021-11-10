import request from '@/utils/request'
import qs from 'qs'
// 获取角色列表
export function getRole (pageNumber, pageSize) {
  return request({
    // url: '/auth/role/list',
    url: '/auth/role/re_list',
    method: 'get',
    params: {
      pageNumber,
      pageSize
    }
  })
}
// 获取别名配置--获取下级权限列表
export function getNextLevelLisst (params) {
  return request({
    url: '/auth/role/company',
    method: 'get',
    params: params
  })
}

// 获取别名配置--获取下级权限列表--权限授权提交
export function saveNextLevelList (params) {
  return request({
    url: '/auth/role',
    method: 'post',
    data: params,
    jsonHeader: true
  })
}

// 设置默认角色
export function setDefault (id, isDefault) {
  return request({
    url: '/auth/role/setDefault',
    method: 'post',
    data: qs.stringify({
      id,
      isDefault
    })
  })
}
// 添加角色
export function addRole (name, defaultRole, type, kind, level) {
  return request({
    url: '/auth/role/save',
    method: 'post',
    data: qs.stringify({
      name,
      defaultRole,
      type,
      kind,
      level
    })
  })
}
// 删除角色
export function deleteRoles (ids) {
  return request({
    url: '/auth/role/delete',
    method: 'post',
    data: qs.stringify({
      'ids': ids
    }, { indices: false }) // indices: false将数组转化为后台能接受的格式
  })
}
// 编辑角色
export function editRole (id, name) {
  return request({
    url: '/auth/role/update',
    method: 'post',
    data: qs.stringify({
      id,
      name
    })
  })
}
// 分配角色权限
export function setPermission (id, permIds) {
  return request({
    url: '/auth/role/edit_role_perm',
    method: 'post',
    data: qs.stringify({
      id,
      permIds
    }, { indices: false })
  })
}
// 角色下拉菜单
export function selectRole () {
  return request({
    url: '/auth/role/select_item',
    method: 'get'
  })
}

// 获取别名配置
export function getNameCofig () {
  return request({
    url: '/auth/level_alias',
    method: 'get'
  })
}

// 获取别名配置--保存
export function saveNameCofig (params) {
  return request({
    url: '/auth/level_alias',
    method: 'POST',
    data: qs.stringify(params)
  })
}

// 获取证件配置信息
export function getCertCofig (params) {
  return request({
    url: '/batchFeed/cert/info',
    method: 'GET'
  })
}

// 设置证件配置信息
export function setCertCofig (params) {
  return request({
    url: '/batchFeed/cert/set',
    method: 'POST',
    jsonHeader: true,
    data: params
  })
}

// 获取通道信息
export function getChanelCofig () {
  return request({
    url: '/auth/systemconfig?key=pay_chanel',
    method: 'GET'
  })
}

// 设置通道信息
export function setChanelCofig (params) {
  return request({
    url: '/auth/systemconfig/editPayChanel',
    method: 'POST',
    params: params
  })
}
