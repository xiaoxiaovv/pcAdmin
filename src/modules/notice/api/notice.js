import request from '@/utils/request'
export function getNoticeList(params) {
  return request({
    url: '/merchant/notice',
    method: 'get',
    params: params
  })
}

export function addNotice(data) {
  return request({
    url: '/merchant/notice',
    method: 'post',
    data: data,
    jsonHeader: true
  })
}

export function delNotice(id) {
  return request({
    url: '/merchant/notice/' + id,
    method: 'delete'
  })
}

export function getFileNameList(code) {
  return request({
    url: '/merchant/notice/' + code,
    method: 'GET'
  })
}
