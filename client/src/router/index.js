import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/prehled',
      name: 'prehled',
      component: () => import('../views/dashboard/HomeView.vue')
    },
    {
      path: '/rozvrh',
      name: 'rozvrh',
      component: () => import('../views/dashboard/ScheduleView.vue')
    },
    {
      path: '/uzivatele',
      name: 'uzivatele',
      component: () => import('../views/dashboard/UsersView.vue')
    },
  ]
})

export default router
