import request from '@/utils/request'
import qs from 'qs'

// 获取商户列表
export function updateStatus (params) {
  return request({
    url: '/merchant/merchant/update',
    method: 'post',
    params
  })
}

// 获取商户列表
export function getMerchantList (pageNumber, pageSize, searchData, companyId) {
  return request({
    url: '/merchant/merchant/re_list',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      name: searchData.name,
      contact: searchData.contact,
      companyName: searchData.companyName,
      companyId: companyId,
      isFindPayChanel: searchData.isFindPayChanel,
      isFindPayConfig: searchData.isFindPayConfig
    }
  })
}

// 获取商户详情
export function getMerchantDetail (merchantId) {
  return request({
    url: '/merchant/merchant/find_one',
    method: 'get',
    params: {
      merchantId: merchantId
    }
  })
}

// 获取小程序参数配置
export function getAppletConfig (merchantId) {
  return request({
    url: '/merchant/merchant/find_applet_config',
    method: 'get',
    params: { merchantId }
  })
}

// 注销
export function cancle (merchantId, status) {
  return request({
    url: '/merchant/merchant/cancle',
    method: 'post',
    params: {
      merchantId: merchantId,
      status: status
    }
  })
}

// 配置小程序参数
export function saveAppletConfig (appletConfig) {
  return request({
    url: '/merchant/merchant/save_applet_config',
    method: 'post',
    params: {
      merchantId: appletConfig.merchantId,
      appId: appletConfig.appId,
      appKey: appletConfig.appKey
    }
  })
}

// 重置密码
export function resetPwd (username) {
  return request({
    url: '/merchant/merchant/default/reset_password',
    method: 'post',
    params: {
      username: username
    }
  })
}

// 获取小程序参数配置
export function turnToWechatConfig (params) {
  return request({
    url: 'http://openwx.vmajy.com/wechat_open_auth/web_auth_url',
    method: 'get',
    params: params
  })
}

// 获取小程序发布
export function deployWechatApi (params) {
  return request({
    url: `/merchant/wx_mini/release/${params}`,
    method: 'get'
  })
}

// 获取小程序体验
export function experienceWechatApi (params) {
  return request({
    url: `/mini/v1.0/code/get_qrcode`,
    method: 'get',
    params: params
  })
}

// 获取小程序--审核状态
export function auditstatuseWechatApi (params) {
  return request({
    url: `/mini/v1.0/code/get_latest_auditstatus`,
    method: 'get',
    params: params
  })
}

// 添加商户
export function addMerchant(data) {
  return request({
    url: '/merchant/merchant/save_rewrite',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 修改商户
export function editMerchant(data) {
  return request({
    url: '/merchant/merchant/update',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 生成佣金
export function createComission(data) {
  return request({
    url: '/order/commission/cretecomission',
    method: 'post',
    data: data,
    jsonHeader: true
  })
}

// 生成佣金
export function getComissionStatus (data) {
  return request({
    url: '/order/commission/cretecomission/status',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 特约商户配置-关注配置
export function addrecommendconf (data) {
  return request({
    url: `/pay/pay/face/addrecommendconf`,
    method: 'POST',
    jsonHeader: true,
    data: data
  })
}
// 查询支付宝生活号申请信息
export function getAliLifeStatus (params) {
  return request({
    url: `/auth/alilife/send_ali_life_service_create_query`,
    method: 'get',
    params: params
  })
}
// 获取支付宝生活号信息
export function getAliLifeInfo (params) {
  return request({
    url: `/auth/alilife/get_ali_life_service_info`,
    method: 'get',
    params: params
  })
}

// 获取支付宝生活号信息树
export function getAliLifeCateTree (params) {
  return request({
    url: `/auth/alilife/get_ali_life_mcctree`,
    method: 'get',
    params: params
  })
}

// 编辑支付宝生活号信息
export function editComissionStatus (data) {
  return request({
    url: '/auth/alilife/edit_ali_life_service_info',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 获取商户支付宝生活号配置信息
export function getAliConfig (params) {
  return request({
    url: `/auth/alilife/get_ali_life_service_merchant_config`,
    method: 'get',
    params: params
  })
}

// 修改商户支付宝生活号配置信息
export function editAliConfig (params) {
  return request({
    url: `/auth/alilife/edit_ali_life_service_merchant_config`,
    method: 'get',
    params: params
  })
}

// 修改商户支付宝生活号配置信息
export function openAliApply (params) {
  return request({
    url: `/auth/alilife/send_ali_life_service_create_request`,
    method: 'get',
    params: params
  })
}
// 获取高德秘钥
export function getGaoDeKey (serviceId) {
  return request({
    url: '/auth/gaode_map_config',
    method: 'get',
    params: {
      companyId:serviceId
    }
  })
}

// 聪明付插件开户
export function createMerchant (merchantId) {
  return request({
    url: '/cmf/ignore/createMerchant/'+merchantId,
    method: 'post',
    params: {
    }
  })
}
