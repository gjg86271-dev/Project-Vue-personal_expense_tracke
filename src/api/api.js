import axios from "axios"
import { useAuthStore } from "@/stores/useAuthStore";
const baseURL = (import.meta.env.VITE_API_URL || 'https://ant-g2-pet.tt.linkpc.net/api/v1').replace(/\/?$/, '/')

let api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }

})

const publicAuthEndpoints = [
  '/auth/forgot-password',
  '/auth/reset-password',
  '/otp/send',
  '/otp/resend',
  '/otp/verify',
]


api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const requestUrl = config.url || ''
  const isPublicAuthEndpoint = publicAuthEndpoints.some((endpoint) => requestUrl.includes(endpoint))

  if (authStore.token && !isPublicAuthEndpoint) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }

  return config
})
export default api;