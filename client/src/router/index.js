import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/StartView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/prehled',
      name: 'prehled',
      component: () => import('../views/dashboard/HomeView.vue')
    },
    {
      path: '/uzivatele',
      name: 'uzivatele',
      component: () => import('../views/dashboard/UsersView.vue')
    },
    {
      path: '/nastaveni',
      name: 'nastaveni',
      component: () => import('../views/dashboard/SettingsView.vue')
    }
  ]
})

export default router
