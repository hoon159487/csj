import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    // 1. 로그인 페이지
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "user" */ '../views/Login.vue')
  },
  {
    // 1-1. 회원가입 페이지
    path: '/join',
    name: 'Join',
    component: () => import(/* webpackChunkName: "user" */ '../views/Join.vue')
  },
  {
    // 2-1. 마이페이지(메인)
    path: '/',
    name: 'Mypage',
    component: () => import(/* webpackChunkName: "user" */ '../views/Mypage.vue')
  },
  {
    // 2-2. 정보수정 페이지(헤더)
    path: '/myinfo',
    name: 'MyInfo',
    component: () => import(/* webpackChunkName: "user" */ '../views/Myinfo.vue')
  },

  {
    // 3-1. 대국 일정(큐) 목록
    path: '/queue_list',
    name: 'QueueList',
    component: () => import(/* webpackChunkName: "poi" */ '../views/QueueList.vue')
  },
  {
    // 3-2. 대국 일정(큐) 추가
    path: '/queue_create',
    name: 'QueueCreate',
    component: () => import(/* webpackChunkName: "poi" */ '../views/QueueCreate.vue')
  },

  {
    // 4-1. 도미니언
    path: '/dominion',
    name: 'Dominion',
    component: () => import(/* webpackChunkName: "poi" */ '../views/Dominion.vue')
  },
  {
    // 4-2. 도미니언 방
    path: '/dominion_view/:queue_no',
    name: 'DominionView',
    component: () => import(/* webpackChunkName: "poi" */ '../views/DominionView.vue')
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
