import request from '@/utils/request'
export function getNoticeList(params) {
  return request({
    url: '/merchant/notice',
    method: 'get',
    params: params
  })
}

export function getSwiperList(params) {
  return request({
    url: '/merchant/notice/rotation_chart/list',
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

export function addSwiper(data) {
  return request({
    url: '/merchant/notice/rotation_chart/saveAndUpdate',
    method: 'post',
    params: data
  })
}

export function delNotice(id) {
  return request({
    url: '/merchant/notice/' + id,
    method: 'delete'
  })
}

export function delSwiper(id) {
  return request({
    url: '/merchant/notice/rotation_chart/delete',
    method: 'post',
    params: {
      id: id
    }
  })
}

export function getFileNameList(code) {
  return request({
    url: '/merchant/notice/' + code,
    method: 'GET'
  })
}
