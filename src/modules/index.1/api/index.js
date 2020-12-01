import request from '@/utils/request'
import qs from 'qs'

/**
 *首页 卡片
 */
export function getStatistics (companyId) {
  return request({
    url: '/auth/running_account/home_page_statistics',
    method: 'get',
    params: {
      companyId: companyId
    }
  })
}
/**
 *首页 图表
 */
export function getMerchantChart (companyId) {
  return request({
    url: '/auth/running_account/home_page_merchant_chart',
    method: 'get',
    params: {
      companyId: companyId
    }
  })
}
/**
 *首页 图表2
 */
export function getStaffChart (companyId) {
  return request({
    url: '/auth/running_account/home_page_staff_develop',
    method: 'get',
    params: {
      companyId: companyId
    }
  })
}
