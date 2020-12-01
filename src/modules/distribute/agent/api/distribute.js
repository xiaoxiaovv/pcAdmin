import request from '@/utils/request'
import qs from 'qs'

// 获取{{levelAlias.secondName}}列表
export function getDistributeList (pageNumber, pageSize, searchData) {
  return request({
    url: '/auth/company/distribute/list_rewrite',
    method: 'get',
    params: {
      pageNumber,
      pageSize,
      name: searchData.name,
      contact: searchData.contact,
      status: searchData.status
    }
  })
}

// 添加{{levelAlias.secondName}}
export function distributeAdd (data) {
  return request({
    url: '/auth/company/distribute/save_rewrite',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 修改{{levelAlias.secondName}}
export function distributeUpdate (data) {
  return request({
    url: '/auth/company/distribute/update',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 删除{{levelAlias.secondName}}
export function delDistribute (id, type) {
  return request({
    url: '/auth/company/distribute/isable',
    method: 'get',
    params: {
      id: id,
      status: type
    }
  })
}

// 设置奖励
export function setReward (data) {
  return request({
    url: '/auth/company/distribute/set_reward',
    method: 'post',
    data: qs.stringify(
      data
    )
  })
}

// 提交审核或审核
export function audit (id, status) {
  return request({
    url: '/auth/company/distribute/audit',
    method: 'post',
    params: {
      id: id,
      status: status
    }
  })
}

// 升级
export function upgradeApi (data) {
  return request({
    url: '/auth/company/opera/company_upgrade',
    method: 'post',
    jsonHeader: true,
    data: data
  })
}
