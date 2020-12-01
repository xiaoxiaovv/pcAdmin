import request from '@/utils/request'

// 获取配置信息
export function getweOpenConfig (params) {
  return request({
    url: '/auth/wx_open_config',
    method: 'get',
    params: params,
    jsonHeader: true
  })
}
// 修改配置
export function modifyOpenConfig (params) {
  return request({
    url: '/auth/wx_open_config',
    method: 'PUT',
    data: params,
    jsonHeader: true
  })
}

// 获取小程序发布配置列表
export function getWechatConfigList () {
  return request({
    url: '/auth/wx_open_config/applet',
    method: 'GET'
  })
}

// 获取小程序发布配置列表
export function saveWechatConfigList (params) {
  return request({
    url: '/auth/wx_open_config/applet',
    method: 'PUT',
    data: params,
    jsonHeader: true
  })
}

// 获取生成动态口令
export function creatDynamicPswApi (params) {
  return request({
    url: '/merchant/admin/app/dynamic_password',
    method: 'get',
    params: params
  })
}
