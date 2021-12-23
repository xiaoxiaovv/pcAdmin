import request from '@/utils/request'

import qs from 'qs'

/**
 *流水页面
 */
export function flowCard (companyId, startTime, endTime, type) {
  return request({
    url: '/auth/running_account/count_data',
    method: 'get',
    params: {
      companyId: companyId,
      startTime: startTime,
      endTime: endTime,
      type: type
    }
  })
}

/**
 * 订单曲线
 */
export function orderChart (companyId, startTime, endTime, type) {
  return request({
    url: '/auth/running_account/order_line_chart_all',
    method: 'get',
    params: {
      companyId: companyId,
      startTime: startTime,
      endTime: endTime,
      type: type
    }
  })
}

/**
 * 退款曲线
 */
export function refundChart (companyId, startTime, endTime, type) {
  return request({
    url: '/auth/running_account/refund_line_chart_all',
    method: 'get',
    params: {
      companyId: companyId,
      startTime: startTime,
      endTime: endTime,
      type: type
    }
  })
}

/**
 * 佣金曲线
 */
export function commissionChart (companyId, startTime, endTime, type) {
  return request({
    url: '/auth/running_account/commission_line_chart_all',
    method: 'get',
    params: {
      companyId: companyId,
      startTime: startTime,
      endTime: endTime,
      type: type
    }
  })
}

/**
 * 支付方式
 */
export function payType (companyId, type) {
  return request({
    url: '/auth/running_account/pay_type_pie_chart_all',
    method: 'get',
    params: {
      companyId: companyId,
      // startTime: startTime,
      // endTime: endTime,
      type: type
    }
  })
}

/**
 * 终端比例
 */
export function terminal (companyId, type) {
  return request({
    url: '/auth/running_account/terminal_ratio_pie_chart_all',
    method: 'get',
    params: {
      companyId: companyId,
      // startTime: startTime,
      // endTime: endTime,
      type: type
    }
  })
}

/**
 *获取表格
 */
export function merchantList (pageNum, pageSize, companyId, type,merchantName,agentName) {
  return request({
    url: '/auth/running_account/merchant_count_list',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      companyId: companyId,
      type: type,
      merchantName: merchantName,
      agentName: agentName
    }
  })
}

//*********************************************************************************************************
// flowDetail
/**
 *获取支付渠道
 */
export function getPayWayOption () {
  return request({
    url: '/order/order/find_pay_way',
    method: 'get',
    params: {}
  })
}

/**
 *获取列表
 */
export function getMerchantList (pageNum, pageSize, companyId, startTime, endTime, type, merchantId, payWay) {
  return request({
    url: '/auth/running_account/merchant_count_detail',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      companyId: companyId,
      startTime: startTime,
      endTime: endTime,
      type: type,
      merchantId: merchantId,
      payWay: payWay,
    }
  })
}



