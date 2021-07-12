import request from '@/utils/request'
import qs from 'qs'

/**
 *获取授权小程序的用户列表
 */
export function getList (pageNumber, pageSize, searchData) {
  return request({
    url: '/zfb/getAliUserList',
    method: 'get',
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      userId: searchData.userId,//ali用户id
      authStatus: searchData.authStatus,//状态1已授权0未授权
      nickName: searchData.nickName,//昵称
      userInfo: searchData.userInfo,//上传状态1已上传 2未上传
    }
  })
}
