import { createRouter, createWebHistory } from 'vue-router'
import LayoutsDashboard from '@/components/layouts/LayoutsDashboard.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
})

export default router
