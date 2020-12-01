import request from '@/utils/request'
import qs from 'qs'

// 获取{{levelAlias.secondName}}列表
export function getDistributeList(pageNumber, pageSize, searchData) {
  return request({
    url: '/auth/company/distribute/list_rewrite',
    method: 'get',
    params: {
      pageNumber,
      pageSize,
      name: searchData.name,
      contact: searchData.contact,
      status: searchData.status,
    }
  })
}

// 提交审核或审核
export function audit(id, status) {
  return request({
    url: '/auth/company/distribute/audit',
    method: 'post',
    params: {
      id: id,
      status: status,
    }
  })
}
