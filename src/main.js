// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/css'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import eachOwn from './utils/eachOwn.js'
import * as filters from './filters'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'
import '../theme/index.css'

import './icons'
import './permission'

import echarts from 'echarts'

Vue.use(ElementUI)

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

// 注册全局过滤器
eachOwn(filters, (filter, name) => {
  Vue.filter(name, filter)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
