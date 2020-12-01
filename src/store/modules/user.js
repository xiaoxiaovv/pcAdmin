import { login } from '@/modules/login/api/login'
const user = {
  state: {
    isReload: true
  },
  mutations: {
    setReload: (state) => {
      state.isReload = false
    }
  },
  actions: {
    /*
     * 登录
     * */
    login ({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password).then(response => {
          sessionStorage.username = userInfo.username
          sessionStorage.token = response.obj.token
          sessionStorage.companyId = response.obj.companyId
          sessionStorage.userId = response.obj.userId
          sessionStorage.userType = response.obj.userType
          sessionStorage.name = response.obj.name
          sessionStorage.level = response.obj.level
          if (response.obj.logo) {
            sessionStorage.loginLogo = response.obj.logo
          } else {
            sessionStorage.removeItem('loginLogo')
          }
          if (response.obj.levelAlias && response.obj.levelAlias.status) {
            let levelAlias = Object.assign({}, response.obj.levelAlias)
            levelAlias.oemName = levelAlias.oemName || '服务商'
            levelAlias.firstName = levelAlias.firstName || '一级代理商'
            levelAlias.secondName = levelAlias.secondName || '二级代理商'
            levelAlias.thirdName = levelAlias.thirdName || '三级代理商'
            sessionStorage.levelAlias = JSON.stringify(levelAlias)
          } else {
            let params = {
              oemName: '服务商',
              firstName: '一级代理商',
              secondName: '二级代理商',
              thirdName: '三级代理商'
            }
            sessionStorage.levelAlias = JSON.stringify(params)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    /*
     * 前端登出
     * */
    logout ({commit}) {
      return new Promise((resolve) => {
        sessionStorage.clear()
        resolve()
      })
    },
    /*
    * 首次加载路由Flag
    * */
    setReload ({commit}) {
      commit('setReload')
    }
  }
}

export default user
