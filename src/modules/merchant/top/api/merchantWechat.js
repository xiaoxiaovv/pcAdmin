import request from '@/utils/requestWechat'

// 获取小程序参数配置
export function turnToWechatConfig (params) {
  return request({
    url: '/wechat_open_auth/web_auth_url',
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

// 获取小程序体验
export function experienceWechatApi (params) {
  return request({
    url: `/mini/v1.0/code/get_qrcode`,
    method: 'get',
    params: params
  })
}

// 获取小程序体验
export function releaseWechatApi (params) {
  return request({
    url: `/mini/v1.0/code/release?appid=${params}`,
    method: 'post'
  })
}
