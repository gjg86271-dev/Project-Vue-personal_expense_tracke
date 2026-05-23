import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import ForgetPasswordView from '@/views/auth/ForgetPassword/ForgetPasswordView.vue'
import ResetPasswordView from '@/views/auth/ForgetPassword/ResetPasswordView.vue'
import OtpVerifyView from '@/views/auth/OTP/OTPVerifyView.vue'
import SentOtpView from '@/views/auth/OTP/SentOTPView.vue'

import LayoutsDashboard from '@/components/layouts/LayoutsDashboard.vue'

import HomeView from '@/views/HomeView.vue'
import BudgetView from '@/views/Budgets/BudgetView.vue'
import TransactionView from '@/views/Transactions/TransactionView.vue'
import GoalsView from '@/views/Goals/GoalsView.vue'
import ReportView from '@/views/Reports/ReportView.vue'
import ProfileView from '@/views/ProfileView.vue'
import CategoryView from '@/views/Category/CategoryView.vue'

import LandingView from '@/views/LandingView.vue'
import LandingFtView from '@/views/landingAllpage/LandingFtView.vue'
import LandingAboutView from '@/views/landingAllpage/LandingAboutView.vue'
import LandingHomeView from '@/views/landingAllpage/LandingHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/landing/homelanding',
    },

    // Landing — guestOnly
    {
      path: '/landing',
      component: LandingView,
      redirect: '/landing/homelanding',
      meta: { guestOnly: true },
      children: [
        {
          path: 'homelanding',
          name: 'landing',
          component: LandingHomeView,
          meta: { title: 'Landing Page', guestOnly: true },
        },
        {
          path: 'function',
          name: 'landingfunction',
          component: LandingFtView,
          meta: { title: 'Function Page', guestOnly: true },
        },
        {
          path: 'about',
          name: 'landingabout',
          component: LandingAboutView,
          meta: { title: 'About Page', guestOnly: true },
        },
      ],
    },

    // Auth — guestOnly
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: 'Login', guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: 'Register', guestOnly: true },
    },
    {
      path: '/otp-verify',
      name: 'otp-verify',
      component: OtpVerifyView,
      meta: { title: 'OTP Verify', guestOnly: true },
    },
    {
      path: '/sent-otp',
      name: 'sent-otp',
      component: SentOtpView,
      meta: { title: 'Sent OTP', guestOnly: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgetPasswordView,
      meta: { title: 'Forgot Password', guestOnly: true },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
      meta: { title: 'Reset Password', guestOnly: true },
    },

    // Dashboard — requiresAuth + userOnly (ADMIN blocked)
    {
      path: '/dashboard',
      component: LayoutsDashboard,
      redirect: '/dashboard/home',
      meta: { requiresAuth: true, userOnly: true },
      children: [
        {
          path: 'home',
          name: 'dashboard',
          component: HomeView,
          meta: { title: 'Dashboard', requiresAuth: true, userOnly: true },
        },
        {
          path: 'budget',
          name: 'budget',
          component: BudgetView,
          meta: { title: 'Budget', requiresAuth: true, userOnly: true },
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: TransactionView,
          meta: { title: 'Transactions', requiresAuth: true, userOnly: true },
        },
        {
          path: 'transactions/detail/:id',
          name: 'transaction-detail',
          component: () => import('@/views/Transactions/TransactionDetailView.vue'),
          meta: { title: 'Transaction Detail', requiresAuth: true, userOnly: true },
        },
        {
          path: 'goal',
          name: 'goal',
          component: GoalsView,
          meta: { title: 'Goals', requiresAuth: true, userOnly: true },
        },
        {
          path: 'report',
          name: 'report',
          component: ReportView,
          meta: { title: 'Reports', requiresAuth: true, userOnly: true },
        },
        {
          path: 'profile',
          name: 'profile',
          component: ProfileView,
          meta: { title: 'Profile', requiresAuth: true, userOnly: true },
        },
        {
          path: 'category',
          name: 'category',
          component: CategoryView,
          meta: { title: 'Categories', requiresAuth: true, userOnly: true },
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

// ── Navigation Guard ────────────────────────────────────────────────────────
router.beforeEach(async (to) => {
  document.title = to.meta.title || 'Expense Tracker'

  const isAuthenticated =
    !!localStorage.getItem('token') || !!sessionStorage.getItem('token')

  const getRole = () =>
    localStorage.getItem('role') || sessionStorage.getItem('role')

  // ── Email change token redirect ──────────────────────────────────────────
  // Backend sends email link to /landing/homelanding?token=xxx
  // We intercept here and redirect to /dashboard/profile?token=xxx
  const emailToken = to.query.token
  if (emailToken && to.path.startsWith('/landing')) {
    if (isAuthenticated) {
      // User is logged in → go straight to profile with token
      return { name: 'profile', query: { token: emailToken } }
    } else {
      // User is not logged in → save token then go to login
      sessionStorage.setItem('pendingEmailToken', emailToken)
      return { name: 'login' }
    }
  }

  // 1. Route requires auth but not logged in → go to landing
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'landing' }
  }

  // 2. Guest-only route but already logged in
  if (to.meta.guestOnly && isAuthenticated) {
    const role = getRole()

    // ADMIN ចូល login/register page → ត្រលប់ landing
    if (role?.toUpperCase() === 'ADMIN') {
      return { name: 'landing' }
    }

    // ✅ FIX: check pendingEmailToken — redirect ទៅ profile ជាមួយ token
    const pendingToken = sessionStorage.getItem('pendingEmailToken')
    if (pendingToken) {
      sessionStorage.removeItem('pendingEmailToken')
      return { name: 'profile', query: { token: pendingToken } }
    }

    return { name: 'dashboard' }
  }

  // 3. Route is userOnly — block ADMIN
  if (to.meta.userOnly && isAuthenticated) {
    let role = getRole()

    // Role មិនទាន់មាននៅ storage → fetch ពី profile
    if (!role) {
      try {
        const { useAuthStore } = await import('@/stores/authStore')
        const auth = useAuthStore()
        const res = await auth.fetchRole()
        role = res
      } catch {
        role = null
      }
    }

    if (role?.toUpperCase() === 'ADMIN') {
      const { useAuthStore } = await import('@/stores/authStore')
      const auth = useAuthStore()
      auth.logout()
      return { name: 'login' }
    }
  }
})

export default router