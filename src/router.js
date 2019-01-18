import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/Layouts/Layout'),
      meta: { title: 'Home' },
      children: [
        {
          path: '/',
          name: 'home',
          meta: { title: 'Home' },
          component: () => import('@/views/Home')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register')
    }
  ]
})
