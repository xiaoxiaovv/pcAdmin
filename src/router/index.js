import Vue from 'vue'
import Router from 'vue-router'

import layout from '@/modules/layout/layout'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      // webpack动态import语法
      component: () => import('@/modules/login')
    },
    {
      path: '/fogot',
      name: '找回密码',
      // webpack动态import语法
      component: () => import('@/modules/fogot')
    },
    {
      path: '/',
      component: layout,
      redirect: '/index/index',
      children: [
        {
          name: '首页',
          path: 'index/index',
          component: () => import('@/modules/index/index')
        }
      ]
    },
    { path: '/404', name: '404', component: () => import('@/modules/404') }
  ]
})
