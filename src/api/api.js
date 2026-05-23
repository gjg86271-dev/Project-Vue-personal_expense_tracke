import axios from "axios"
import { useAuthStore } from "@/stores/authStore"

const { VITE_API_URL } = import.meta.env

const api = axios.create({
  baseURL: VITE_API_URL,
  headers: { Accept: "application/json" },
})

// ── REQUEST interceptor ───────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const auth = useAuthStore()

  // If ADMIN token somehow in store → wipe & block request
  if (auth.isAdmin) {
    auth.logout()
    return Promise.reject(new Error("ADMIN_NOT_ALLOWED"))
  }

  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  if (
    config.data &&
    !(config.data instanceof FormData) &&
    !config.headers["Content-Type"]
  ) {
    config.headers["Content-Type"] = "application/json"
  }

  return config
})

// ── RESPONSE interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const auth   = useAuthStore()
    const status = error.response?.status

    // 401 Unauthorized or 403 Forbidden → token expired/invalid → logout USER
    if (status === 401 || status === 403) {
      auth.logout()
    }

    return Promise.reject(error)
  }
)

export default api