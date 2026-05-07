import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import LayoutsDashboard from '@/components/layouts/LayoutsDashboard.vue'
import HomeView from '@/views/HomeView.vue'
import BudgetView from '@/views/Budgets/BudgetView.vue'
import TransactionView from '@/views/Transactions/TransactionView.vue'
import GoalsView from '@/views/Goals/GoalsView.vue'
import ReportView from '@/views/Reports/ReportView.vue'
import ProfileView from '@/views/ProfileView.vue'
import LandingView from '@/views/LandingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/landing',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      component: LayoutsDashboard,
      redirect: '/dashboard', 
      children: [
        {
          path: 'dashboard', 
          name: 'dashboard',
          component: HomeView,
          meta: {
            title: 'Dashboard View',
          },
        },
        {
          path: 'budget',
          name: 'budget',
          component: BudgetView,
          meta: {
            title: 'Budget View',
          },
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: TransactionView,
          meta: {
            title: 'Transactions View',
          },
        },
        {
          path: 'goal',
          name: 'goal',
          component: GoalsView,
          meta: {
            title: 'Goal View',
          },
        },
        {
          path: 'report',
          name: 'report',
          component: ReportView,
          meta: {
            title: 'Report View',
          },
        },
         {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        title: 'Profile View',
      },
    }
      ],
    },
   
  ],
})

export default router