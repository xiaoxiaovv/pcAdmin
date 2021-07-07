import request from '@/utils/request'
import qs from 'qs'
// jsonHeader: true

// /**
//  *设备管理--列表获取
//  */
// export function deviceList (params) {
//   return request({
//     url: '/auth/equipment',
//     method: 'get',
//     // jsonHeader: true,
//     params: params
//   })
// }

/**
 * 绑定2.0
 * @param data
 */
export function ruYiBind(data) {
  return request({
    url: '/zfb/bind2',
    method: 'post',
    // data
    data: qs.stringify(data)
  })
}
/**
 * 解绑2.0
 * @param data
 */
export function ruYiUnbind(data) {
  return request({
    url: '/zfb/unbind2',
    method: 'post',
    // data
    data: qs.stringify(data)
  })
}

/**
 * 获取商户列表
 * @param {Object} pageNumber 页码
 * @param {Object} pageSize 每页条数
 * @param {Object} searchData
 */
export function getMerQrCodeList (pageNumber, pageSize, searchData) {
  return request({
    url: '/merchant/mch_qr_code/getMerQrCodeList',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      merchantName: searchData.merchantName,//商户名称
      name: searchData.name,//二维码名称
      aliDeviceSn: searchData.aliDeviceSn,//如意设备SN
      aliStatus: searchData.aliStatus//绑定状态 1未绑定 2已绑定 3已解绑
    }
  })
}
