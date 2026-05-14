import { createRouter, createWebHistory } from 'vue-router'
import LayoutsDashboard from '@/components/layouts/LayoutsDashboard.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/auth/userLoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import OTPVerifyView from '@/views/auth/OTP/OTPVerifyView.vue'
import SentOTP from '@/views/Auth/OTP/SentOTPView.vue'
import ResetPasswordView from '@/views/auth/Forget Password/ResetPasswordView.vue'
import ForgetPasswordView from '@/views/auth/Forget Password/ForgetPasswordView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/otp-verify',
      name: 'otp-verify',
      component: OTPVerifyView,
    },
    {
      path: '/sentOTP',
      name: 'sentOTP',
      component: SentOTP,
    },
    {
      path: '/reset-password/:token?',
      alias: [
        '/resetPassword/:token?',
        '/password/reset/:token?',
        '/auth/reset-password/:token?',
      ],
      name: 'reset-password',
      component: ResetPasswordView,
    },
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: ForgetPasswordView,
    },

    {
      path: '/dashboard',
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