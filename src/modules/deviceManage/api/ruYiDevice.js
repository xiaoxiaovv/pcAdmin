import request from '@/utils/request'
import qs from 'qs'
// jsonHeader: true

/**
 *设备管理--列表获取
 */
export function deviceList (params) {
  return request({
    url: '/auth/equipment',
    method: 'get',
    // jsonHeader: true,
    params: params
  })
}

/**
 * 绑定
 * @param data
 */
export function ruYiBind(data) {
  return request({
    url: '/zfb/bind',
    method: 'post',
    // data
    data: qs.stringify(data)
  })
}
/**
 * 解绑
 * @param data
 */
export function ruYiUnbind(data) {
  return request({
    url: '/zfb/unbind',
    method: 'post',
    // data
    data: qs.stringify(data)
  })
}

// 获取商户列表
export function getMerchantList (pageNumber, pageSize, searchData, companyId) {
  return request({
    url: '/merchant/merchant/re_list_ali',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      name: searchData.name,
      contact: searchData.contact,
      companyName: searchData.companyName,
      companyId: companyId,
      isFindPayChanel: searchData.isFindPayChanel,
      isFindPayConfig: searchData.isFindPayConfig,
      deviceSn: '',
      aliStatus: ''

    }
  })
}
