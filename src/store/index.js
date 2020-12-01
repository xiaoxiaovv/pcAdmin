import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import app from './modules/app'
import tagsView from './modules/tagsView'
import menuList from './modules/menuList'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    app,
    tagsView,
    menuList
  },
  getters
})

export default store
