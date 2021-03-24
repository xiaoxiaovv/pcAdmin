import request from '@/utils/request'
import qs from 'qs'

// 数据概览
export function getDataView (companyId) {
  console.log('this.companyId', companyId)
  return request({
    url: '/auth/running_account_new/date_view',
    method: 'get',
    params: {
      companyId
    }
  })
}

// 获取图表数据(数据统计)
export function getChartData (st, et, type, companyId) {
  return request({
    url: '/auth/running_account_new/data_statistics_left',
    method: 'get',
    params: {
      startTime: st,
      endTime: et,
      type,
      companyId
    }
  })
}
// 获取图表数据(支付通道)
export function getChartPercentData (params) {
  return request({
    url: '/auth/running_account_new/data_statistics_right',
    method: 'get',
    params
  })
}
// 支付方式饼图
export function findPaywayStatusChart (st, et) {
  return request({
    url: '/order/running_account/merchant_running_account_overview_way_pie_chart',
    method: 'get',
    params: {
      start_payTime: st,
      end_payTime: et
    }
  })
}
// 获取交易数据
export function findCountData (st, et, companyId) {
  return request({
    url: '/auth/running_account_new/date_transaction',
    method: 'get',
    params: {
      companyId,
      startTime: st,
      endTime: et
    }
  })
}

// 当前月交易流水佣金数据接口
export function findCommissionCurrentMonth (companyId) {
  return request({
    url: '/current/running_account/date_transaction_app',
    method: 'get',
    params: {
      companyId
    }
  })
}
