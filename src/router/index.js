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
import LandingFtView from '@/views/landingAllpage/LandingFtView.vue'
import LandingAboutView from '@/views/landingAllpage/LandingAboutView.vue'
import LandingHomeView from '@/views/landingAllpage/LandingHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // Landing
    {
      path: '/landing',
      component: LandingView,
      redirect: '/landing/homelanding',

      children: [
        {
          path: 'homelanding',
          name: 'landing',
          component: LandingHomeView,

          meta: {
            title: 'Landing Page',
          },
        },

        {
          path: 'function',
          name: 'landingfunction',
          component: LandingFtView,

          meta: {
            title: 'Function Page',
          },
        },

        {
          path: 'about',
          name: 'landingabout',
          component: LandingAboutView,

          meta: {
            title: 'About Page',
          },
        },
      ],
    },

    // Login
    {
      path: '/login',
      name: 'login',
      component: LoginView,

      meta: {
        title: 'Login',
      },
    },

    // Dashboard
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
            title: 'Dashboard',
          },
        },

        {
          path: 'budget',
          name: 'budget',
          component: BudgetView,

          meta: {
            title: 'Budget',
          },
        },

        {
          path: 'transactions',
          name: 'transactions',
          component: TransactionView,

          meta: {
            title: 'Transactions',
          },
        },

        {
          path: 'goal',
          name: 'goal',
          component: GoalsView,

          meta: {
            title: 'Goals',
          },
        },

        {
          path: 'report',
          name: 'report',
          component: ReportView,

          meta: {
            title: 'Reports',
          },
        },

        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,

          meta: {
            title: 'Profile',
          },
        },
      ],
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/landing/homelanding',
    },
  ],
})

// Change title
router.beforeEach((to, from) => {
  document.title = to.meta.title || 'Expense Tracker'
})

export default router