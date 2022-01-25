import request from '@/utils/request'
import qs from 'qs'


// 获取{{levelAlias.firstName}}对应的商户列表
export function getMerchant (pageNumber, pageSize, merchantName, isFindPayChanel) {
  return request({
    url: '/merchant/merchant/re_list',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      companyId: sessionStorage.getItem("companyId"),
      name: merchantName,
      isFindPayChanel: isFindPayChanel
    }
  })
}

// 获取商户对应的支付配置
export function findPayChannel (merchantId) {
  return request({
    url: '/pay/pay_channel/find_pay_channel',
    method: 'get',
    params: {
      merchantId
    }
  })
}


// 保存配置
export function configSave (payConfig,merchantId) {
  return request({
    url: '/pay/pay_channel/config_save',
    method: 'post',
    data: qs.stringify({
      payConfig,
      merchantId: merchantId
    }, { indices: false })
  })
}

// 获取服务商支付参数
export function findTopPayConfig () {
  return request({
    url: '/pay/pay_config/find_top_pay_config',
    method: 'get',
  })
}

// 保存服务商支付参数
export function saveTopPayConfig (form) {
  return request({
    url: '/pay/pay_config/save_top_pay_config',
    method: 'post',
    data: qs.stringify(
      form
    )
  })
}


// 商户支付参数
export function findPayConfig (merchantId) {
  return request({
    url: '/pay/pay_config/find_config',
    method: 'get',
    params: {
      merchantId
    }
  })
}

// 保存支付参数
export function savePayConfigOld (payConfig,merchantId,payWay) {
  return request({
    url: '/pay/pay_config/save',
    method: 'post',
    data: qs.stringify({
      payConfig,
      merchantId: merchantId,
      payWay: payWay
    }, { indices: false })
  })
}

// 保存支付参数--sec
export function savePayConfig (data) {
  return request({
    url: '/pay/pay_config/save',
    method: 'post',
    jsonHeader: true,
    data: data
  })
}

// 商户支付参数配置--传化--商户绑定APPID
export function updateAppid (params) {
  return request({
    url: '/pay/pay_config/update_appid',
    method: 'POST',
    data: qs.stringify(params, { indices: false })
  })
}

// 获取系统配置通道
export function getSystemCOnfig (merchantId) {
  return request({
    url: '/pay/pay_channel/find_pay_channel_system_config',
    method: 'get'
  })
}

// 获取易生签名私钥
export function getYspayPrivateSignKeyVal (params) {
  return request({
    url: '/pay/pay_channel/ys_pay_get_sign',
    method: 'get',
    params: params
  })
}
// 获取易生协议系统签名秘钥
export function getYsAgreementPrivateSignKeyVal (params) {
  return request({
    url: '/pay/pay_channel/ys_agreement_get_sign',
    method: 'get',
    params: params
  })
}

// 随行付商户信息查询
export function getSxfMerchantQuery (params) {
  return request({
    url: '/pay/pay_channel/sxf_merchant_query',
    method: 'get',
    params: params
  })
}
// 佣金提现参数保存
export function saveCommissionConfig (params) {
  // console.log('6666666666666',params.rateCash)
  return request({
    url: '/pay/pay_config/save_cash_out_config',
    method: 'post',
    jsonHeader: true,
    data: params
  })
}
// 佣金提现参数查询
export function getCommissionConfig () {
  return request({
    url: '/pay/pay_config/find_cash_out_config',
    method: 'get'
    // params: params
  })
}





// 敏付产品参数查询
export function getMfprdVers () {
  return request({
    url: '/batchFeed/mf/getMfprdVers',
    method: 'get'
    // params: params
  })
}


// 敏付产品参数保存

export function setMfprdVers (data) {
  return request({
    url: '/batchFeed/mf/setMfprdVers',
    method: 'post',
    jsonHeader: true,
    data: data
  })
}


// 拉卡拉版本参数查询
export function getlklProdRate () {
  return request({
    url: '/batchFeed/lklProdRate/findProdRateArray',
    method: 'get',
   // params: params
  })
}

// 拉卡拉版本参数查询
export function getlklRateTypeArray () {
  return request({
    url: '/batchFeed/lklProdRate/findRateTypeArray',
    method: 'get',
    // params: params
  })
}



export function savelklProdRate (data) {
  return request({
    url: '/batchFeed/lklProdRate',
    method: 'post',
    jsonHeader: true,
    data: data
  })
}

export function postBehalfData (data) {
  return request({
    url: '/behalf_config',
    method: 'post',
    data: qs.stringify(data)
  })
}
export function getBehalfData (data) {
  return request({
    url: '/behalf_config',
    method: 'get',
  })
}
