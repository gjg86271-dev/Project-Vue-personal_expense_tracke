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

import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/landing/homelanding',
    },

    {
      path: '/landing',
      component: LandingView,
      redirect: '/landing/homelanding',
      children: [
        {
          path: 'homelanding',
          name: 'landing',
          component: LandingHomeView,
          meta: { title: 'Landing Page' },
        },
        {
          path: 'function',
          name: 'landingfunction',
          component: LandingFtView,
          meta: { title: 'Function Page' },
        },
        {
          path: 'about',
          name: 'landingabout',
          component: LandingAboutView,
          meta: { title: 'About Page' },
        },
      ],
    },

    // ── Email change verification redirect ─────────────────────────────────
    // Backend sends link to /verify-change-email?token=xxx
    // This route catches it and redirects to /dashboard/profile?token=xxx
    {
      path: '/verify-change-email',
      name: 'verify-change-email',
      component: () => import('@/views/auth/VerifyChangeEmailView.vue'),
      meta: { title: 'Verify Email Change' },
    },

    // Auth — guestOnly (login, register, etc.)
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
      name: 'not-found',
      component: NotFoundView,
      meta: { title: 'Page Not Found' },
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
  // Handles token arriving on ANY route (landing, verify-change-email, etc.)
  // but skip if already heading to profile (avoid infinite loop)
  const emailToken = to.query.token
  const isVerifyRoute = to.name === 'verify-change-email'
  const isProfileRoute = to.name === 'profile'

  if (emailToken && !isProfileRoute && !isVerifyRoute) {
    if (isAuthenticated) {
      return { name: 'profile', query: { token: emailToken } }
    } else {
      sessionStorage.setItem('pendingEmailToken', emailToken)
      return { name: 'login' }
    }
  }

  // ── verify-change-email route guard ─────────────────────────────────────
  // VerifyChangeEmailView handles its own redirect via onMounted,
  // but if user is not authenticated we save the token and send to login first
  if (isVerifyRoute && !isAuthenticated) {
    const token = to.query.token
    if (token) {
      sessionStorage.setItem('pendingEmailToken', token)
    }
    return { name: 'login' }
  }

  // 1. Route requires auth but not logged in → go to landing
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'landing' }
  }

  // 2. Guest-only route (login/register/etc.) but already logged in
  if (to.meta.guestOnly && isAuthenticated) {
    const role = getRole()

    if (role?.toUpperCase() === 'ADMIN') {
      // Admin has no dashboard, send them to landing (which is now public — no loop)
      return { name: 'landing' }
    }

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