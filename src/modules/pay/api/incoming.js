import request from '@/utils/request'
import qs from 'qs'

// 随行付进件--经营类目
export function findMccCdTree () {
  return request({
    url: '/batchFeed/sxf/findMccCdTree',
    method: 'get'
  })
}

// 随行付进件--开户总行银行编码
export function findBankCode () {
  return request({
    url: '/batchFeed/sxf/findBankCode',
    method: 'get'
  })
}

// 随行付进件--开户总行银行编码
export function findBankProviceCode () {
  return request({
    url: '/batchFeed/sxf/findBankCode',
    method: 'get'
  })
}

// 随行付进件--开户支行编码
export function findBankBranchCode (params) {
  return request({
    url: '/batchFeed/sxf/findBankBranchCode',
    method: 'get',
    params: params
  })
}

// 随行付进件--获取银行省市树
export function findBankAreaTree () {
  return request({
    url: '/batchFeed/sxf/findBankAreaTree',
    method: 'get'
  })
}

// 随行付进件--获取--保存
export function sxfSave (params) {
  return request({
    url: '/batchFeed/sxf/save',
    method: 'POST',
    data: qs.stringify(
      params
    )
  })
}

// 随行付进件--获取--获取详情
export function sxfDetail (params) {
  return request({
    url: '/batchFeed/sxf/detail',
    method: 'get',
    params: params
  })
}

// 微信--获取商户经营主体
export function organizationtype (params) {
  return request({
    url: '/batchFeed/wx/getorganizationtype',
    method: 'get',
    params: params
  })
}

// 微信--获取商户经营类目
export function getproductdesc (params) {
  return request({
    url: '/batchFeed/wx/getproductdesc',
    method: 'get',
    params: params
  })
}

// 微信--获取商户经营所在行业
export function getbusiness (params) {
  return request({
    url: '/batchFeed/wx/getbusiness',
    method: 'get',
    params: params
  })
}

// 微信--添加微信额外进件信息
export function wxfeedsupplementadd (params) {
  return request({
    url: '/batchFeed/wx/wxfeedsupplementadd',
    method: 'post',
    jsonHeader: true,
    data: params
  })
}
// 微信--添加微信额外进件信息
export function wechatDetail (params) {
  return request({
    url: '/batchFeed/wx/getwxfeedsupplementdetail',
    method: 'get',
    params: params
  })
}

// 微信--获取微信直连银行信息
export function getdirectbank (params) {
  return request({
    url: '/batchFeed/wx/getdirectbank',
    method: 'GET'
  })
}

// 微信--获取银行开户名完整提示
export function getsubbankname (params) {
  return request({
    url: '/batchFeed/wx/getsubbankname',
    method: 'GET',
    params: params
  })
}
