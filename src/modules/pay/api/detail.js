import request from '@/utils/request'
import qs from 'qs'

// 获取进件详情
export function getFeedDetail (params) {
  return request({
    url: '/merchant/mch_info/feedDetail',
    method: 'get',
    params
  })
}

// 查询微信进件状态
export function getWxcode (params) {
  return request({
    url: '/batchFeed/wx/getwxfeedstatus',
    method: 'get',
    params
  })
}

// 查询随行付进件状态
export function getSxfcode (params) {
  return request({
    url: '/batchFeed/sxf/feedInfo',
    method: 'get',
    params
  })
}

// 查询随行付进件状态
export function getLsCode (params) {
  return request({
    url: '/batchFeed/le/feedInfo',
    method: 'get',
    params
  })
}

// 查询威富通进件状态
export function getYsCode (params) {
  return request({
    url: '/batchFeed/ys/feedInfo',
    method: 'get',
    params
  })
}

// 传化-查询进件状态
export function getChCode (params) {
  return request({
    url: '/batchFeed/ch/feedInfo',
    method: 'get',
    params
  })
}

// 富友-查询进件状态
export function getFyCode (params) {
  return request({
    url: '/batchFeed/fuiou/get_fuiou_feedstatus',
    method: 'get',
    params
  })
}

// 支付宝-查询进件状态
export function getZfbCode (params) {
  return request({
    url: '/batchFeed/ali/get_ali_feedstatus',
    method: 'get',
    params
  })
}

/**
 * 手机pos&网联-查询进件状态
 * @param {*} params
 */
export function getSjPosCode(params) {
  return request({
    url: '/batchFeed/pos/get_pos_feedstatus',
    method: 'get',
    params
  })
}

/**
 * 开店宝-查询进件状态
 * @param {*} params
 */
export function getKdbCode(params) {
  return request({
    url: '/batchFeed/kdb/get_kdb_feedstatus',
    method: 'get',
    params
  })
}
/**
 * 畅捷-查询进件状态
 * @param {*} params
 */
export function getCjCode(params) {
  return request({
    url: '/batchFeed/chanpay/get_cj_feedstatus',
    method: 'get',
    params
  })
}

/**
 * 易生-查询进件状态
 * @param {*} params
 */
export function getYiSCode(params) {
  return request({
    url: '/batchFeed/yisheng/get_ys_feedstatus',
    method: 'get',
    params
  })
}
// 设置费率
export function setRate (params) {
  return request({
    url: '/merchant/mch_info/rate',
    method: 'POST',
    jsonHeader: true,
    data: params
  })
}
