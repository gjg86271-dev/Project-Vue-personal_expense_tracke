import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import LayoutsDashboard from '@/components/layouts/LayoutsDashboard.vue'
import HomeView from '@/views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      component: LayoutsDashboard,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: HomeView,
          meta: {
            title: "dashboard View",
          },
        },
       
      ]
    },
  ],
})

export default router