const user = {
  state: {
    powerObj: {
      first: false,
      secend: false,
      third: false,
      staff: false,
      merchant: false
    }
  },
  mutations: {
    initMenuPower: (state, val) => {
      let powerObj = {
        first: false,
        secend: false,
        third: false,
        staff: false,
        merchant: false
      }
      val.forEach(item => {
        // 一级代理
        if (item.path === '/operator/views') {
          item.children.forEach(itemSec => {
            if (itemSec.path === 'operaList') {
              powerObj.first = true
            }
          })
        }
        // 二级代理
        if (item.path === '/distribute/agent/views') {
          item.children.forEach(itemSec => {
            if (itemSec.path === 'distributeList') {
              powerObj.secend = true
            }
          })
        }
        // 三级代理
        if (item.path === '/thirdAgent/views') {
          item.children.forEach(itemSec => {
            if (itemSec.path === 'distributeList') {
              powerObj.third = true
            }
          })
        }
        // 新增员工
        if (item.path === '/manager/views') {
          item.children.forEach(itemSec => {
            if (itemSec.path === 'manager') {
              powerObj.staff = true
            }
          })
        }
        // 新增商户
        if (item.path === '/merchant/top/views') {
          item.children.forEach(itemSec => {
            if (itemSec.path === 'merchant') {
              powerObj.merchant = true
            }
          })
        }
      })
      state.powerObj = powerObj
    }
  },
  actions: {
    initMenuPower ({ commit }, val) {
      commit('initMenuPower', val)
    }
  }
}

export default user
