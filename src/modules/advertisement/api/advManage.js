import request from '@/utils/request'

/**
 *广告管理--列表获取
 */
// export function advertiseList (pageNumber, pageSize, pageSort, pageOrder, title, status) {
export function advertiseList (params) {
  return request({
    url: '/advertise/advertise/list',
    method: 'get',
    params: params
  })
}

/**
 *获取广告详情
 */
export function getAdDetail (params) {
  return request({
    url: `/advertise/advertise/${params}`,
    method: 'GET'
  })
}

/**
 *广告管理--新增广告
 */
export function advertiseAdd (params) {
  return request({
    url: '/advertise/advertise/save',
    method: 'POST',
    data: params,
    jsonHeader: true
  })
}

/**
 *广告管理--禁用/启用
 */
export function advertiseIsable (params) {
  return request({
    url: '/advertise/advertise/isable',
    method: 'PUT',
    data: params,
    jsonHeader: true
  })
}

/**
 *广告管理--删除
 */
export function advertiseDelete (params) {
  return request({
    url: '/advertise/advertise/delete',
    method: 'DELETE',
    data: params,
    jsonHeader: true
  })
}

/**
 *点击/曝光列表
 */
export function advertiseExposureOrClick (params) {
  return request({
    url: '/advertise/advertise/view/list',
    method: 'GET',
    params: params
  })
}

/**
 *城市列表
 */
export function advertiseCityList (params) {
  return request({
    url: '/advertise/advertise/city/list',
    method: 'GET',
    params: params,
    jsonHeader: true
  })
}

/**
 *获取是否可以添加会员
 */
export function showMemberPay (params) {
  return request({
    url: '/merchant/admin/third/showMemberPay',
    method: 'GET'
  })
}
