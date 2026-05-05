import axios from "axios"
import { useAuthStore } from "@/stores/authStore";
let api = axios.create({
  baseURL: VITE_API_URL,
  headers: {
    'Content-type': 'application/json',
    Accept: "application/json"
  }

})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config
})
export default api;