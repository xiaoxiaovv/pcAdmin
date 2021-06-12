import request from '@/utils/request'
import qs from 'qs'

/**
 *获取签约周期扣款的用户列表
 */
export function getList (pageNumber, pageSize, searchData) {
  return request({
    url: '/zfb/getSignList',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      username: searchData.username,//真实姓名
      status: searchData.status,//状态
      phone: searchData.phone,//手机号
      aliAccount: searchData.aliAccount,//支付宝账号
    }
  })
}
