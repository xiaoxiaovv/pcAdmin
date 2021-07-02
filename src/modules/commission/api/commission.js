import request from '@/utils/request'
// import qs from 'qs'
// jsonHeader: true

/**
 *佣金结算--列表获取
 */
export function commissionRateList (params) {
  return request({
    url: '/order/cash/out/apply_list_pc',
    method: 'get',
    // jsonHeader: true,
    params
  })
}
/**
 *佣金结算--状态修改
 */
export function commissionModifyStatus (params) {
  return request({
    url: '/order/cash/out/modify_status',
    method: 'post',
    jsonHeader: true,
    data:params
  })
}
/**
 *佣金结算--列表获取
 */
export function commissionRateList1 (params) {
  return request({
    url: '/order/cash/out/apply_list_pc',
    method: 'get',
    // jsonHeader: true,
    params
  })
}
/**
 *佣金结算--列表获取
 */
export function commissionRateList2 (params) {
  return request({
    url: '/order/cash/out/apply_list_pc',
    method: 'get',
    // jsonHeader: true,
    params
  })
}
/**
 *佣金结算--列表获取
 */
export function commissionRateList3 (params) {
  return request({
    url: '/order/cash/out/apply_list_pc',
    method: 'get',
    // jsonHeader: true,
    params
  })
}




// ==================以下是按比例结算相关的api，暂时不用=================================
/**
 *佣金结算--列表获取
 */
export function commissionList (params) {
  return request({
    url: '/order/commission/list',
    method: 'get',
    jsonHeader: true,
    params: params
  })
}
/**
 *佣金结算--数据统计
 */
export function commissionSummary (params) {
  return request({
    url: '/order/commission/summary',
    method: 'get',
    jsonHeader: true,
    params: params
  })
}
/**
 *佣金结算--结算
 */
export function commissionSettle (params) {
  return request({
    url: '/order/commission/settle',
    method: 'POST',
    jsonHeader: true,
    data: params
  })
}
/**
 *佣金结算--佣金记录
 */
export function commissionCretecomission (params) {
  return request({
    url: '/order/commission/cretecomission',
    method: 'get'
  })
}

/**
 *获取结算，未结算金额
 */
export function commissionCounts (params) {
  return request({
    url: '/order/commission/commission',
    method: 'get'
  })
}
/**
 *佣金管理--导出
 */
export function commissionListExport (params) {
  return request({
    url: '/order/commission/list/export',
    method: 'get',
    jsonHeader: true,
    apiType: 'downFile',
    responseType: 'blob',
    params: params
  })
}

/**
 * 佣金管理--导出结算报表
 */
export function commissionListExportExcel (params) {
  return request({
    url: '/order/commission/settle/export',
    method: 'get',
    jsonHeader: true,
    apiType: 'downFile',
    responseType: 'blob',
    params: params
  })
}



export function commissioncommCash (pageNumber, pageSize,params) {
  return request({
    url: '/order/cash/out/commission_cash_list_pc',
    method: 'get',
    params: {
      pageNumber:pageNumber,
      pageSize: pageSize,
      companyName: params.companyName,
      status: params.status,//结算状态
      begin: params.begin,
    }

    // url: '/order/cash/out/commission_cash_list_pc',
    // method: 'get',
    // jsonHeader: true,
    // apiType: 'downFile',
    // responseType: 'blob',
    // params: params
  })
}








