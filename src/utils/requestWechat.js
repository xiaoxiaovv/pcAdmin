import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'

// export const url = window.location.protocol+"//"+window.location.host
// export const url = 'http://192.168.1.150'
export const url = window.serverUrl || window.location.protocol + '//' + window.location.host

const instance = axios.create({
  baseURL: url,
  timeout: 30000,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
  },
  withCredentials: false
})

// 添加请求拦截器
instance.interceptors.request.use((config) => {
  let url = window.location.hash
  let hashUrl = url.slice(1).split('?')
  hashUrl = hashUrl[0]
  config.headers['page-Url'] = hashUrl
  if (sessionStorage.token) {
    config.headers['authorized'] = sessionStorage.token
  }
  if (config.jsonHeader) {
    config.headers['Content-type'] = 'application/json; charset=utf-8'
  } else {
    config.headers['Content-type'] = 'application/x-www-form-urlencoded; charset=utf-8'
  }
  return config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(response => {
  // 对返回的数据进行预处理
  if (response.headers.accesstoken) {
    sessionStorage.token = response.headers.authorized
  }
  const res = response.data
  if (res.code) {
    if (res.code !== 200) {
      if (res.code === 401 || res.code == 422) {
        MessageBox.alert('您尚未登录', '', {
          confirmButtonText: '前往登录',
          callback: action => {
            sessionStorage.clear()
            location.reload()
          }
        })
      } else if (res.code == 432) {
        Message({
          type: 'error',
          message: res.msg
        })
        setTimeout(() => {
          if (sessionStorage.token) {
            sessionStorage.clear()
            location.reload()
          }
        }, 1500)
      } else {
        Message({
          type: 'error',
          message: res.msg
        })
      }
      // 返回 resolved 或者 rejected状态，供后续操作
      return Promise.reject(new Error('error'))
    } else {
      return res
    }
  } else {
    return res
  }
}, error => {
  if (error.config.url.indexOf('mini/v1.0/code/get_qrcode') > -1) {
    // 获取小程序提样吗
    let msg = error.response.data.message
    Message({
      message: msg,
      type: 'error'
    })
  } else {
    if (error.response) {
      let msg = error.response.data.message
      Message({
        message: msg,
        type: 'error'
      })
    } else {
      // 响应错误
      if (error.request) {
        Message({
          message: '请求超时',
          type: 'error'
        })
      } else {
        Message({
          message: error.message,
          type: 'error'
        })
      }
    }
  }
  // 响应错误
  return Promise.reject(error)
})

export default instance
