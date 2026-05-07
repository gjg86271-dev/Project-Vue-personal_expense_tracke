import axios from "axios"
import { useAuthStore } from "@/stores/authStore"

const { VITE_API_URL } = import.meta.env

const api = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()

  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})

export default api