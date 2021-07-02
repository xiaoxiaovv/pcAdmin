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

/**
 * 获取ali物流公司
 */
export function getAliLogisticsList (name) {
  return request({
    url: '/ali/ignore/getAliLogisticsList',
    method: 'get',
    params: {
      name: name,//物流公司名称 模糊查询
    }
  })
}

/**
 * 签约用户发货，并调用支付宝订单数据同步
 */
export function updateAliWithhold (updateAliWithholdForm) {
  return request({
    url: '/zfb/updateAliWithhold',
    method: 'post',
    params: {
      id:updateAliWithholdForm.id,//签约信息id
      logisticsNum:updateAliWithholdForm.logisticsNum,//物流单号
      logisticsName:updateAliWithholdForm.logisticsName,//物流名称
      logisticsCode:updateAliWithholdForm.logisticsCode,//物流编号
    }
  })
}

/**
 * 解约发送验证码
 */
export function sendSms () {
  return request({
    url: '/zfb/send_sms',
    method: 'post',
    params: {}
  })
}

/**
 * 解约确认
 */
export function verifyCode (form) {
  return request({
    url: '/zfb/verify_code',
    method: 'post',
    params: {
      code:form.code,//短信验证码
      agreementNo:form.agreementNo,//协议编号
    },
  })
}
