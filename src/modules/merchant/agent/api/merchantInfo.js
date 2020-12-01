import request from '@/utils/request'
import qs from 'qs'

// 提交进件
export function addMchInfo (data) {
  return request({
    url: '/merchant/mch_info/update',
    method: 'post',
    data: qs.stringify(data)
  })
}

// 获取进件列表
export function getMchInfoList (pageNumber, pageSize) {
  return request({
    url: '/merchant/mch_info/list_rewrite',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      companyId: sessionStorage.getItem('companyId')
    }
  })
}

// 获取进件列表
export function getMchInfoListByFuwushang (pageNumber, pageSize, companyName, name, status) {
  return request({
    url: '/merchant/mch_info/find_by_fuwushang',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      companyName: companyName,
      name: name,
      status: status
    }
  })
}

// 查看详情
export function detail (id) {
  return request({
    url: '/merchant/mch_info/detail',
    method: 'get',
    params: {
      id: id
    }
  })
}

// 签约
export function sign (params) {
  return request({
    url: '/merchant/mch_info/change_status',
    method: 'get',
    params: params
  })
}
