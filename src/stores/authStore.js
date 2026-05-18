import { ref, computed } from "vue"
import { defineStore } from "pinia"
import api from "@/api/api"

const getApiErrorMessage = (error, fallback) => {
  const data = error.response?.data
  if (typeof data === "string" && data.trim()) return data
  if (data?.message) return data.message
  if (data?.errors && typeof data.errors === "object") {
    return Object.values(data.errors).flat().filter(Boolean).join(" ")
  }
  return fallback
}

export const useAuthStore = defineStore("auth", () => {

  // ── State ──────────────────────────────────────────────
  const token = ref(
    localStorage.getItem("token") || sessionStorage.getItem("token") || null
  )
  const user = ref(null)
  const errorMsg = ref("")
  const resetToken = ref("")
  const resetEmail = ref(sessionStorage.getItem("resetEmail") || "")

  // ── Computed ───────────────────────────────────────────
  const isLogin = computed(() => !!token.value)

  // ── Actions ────────────────────────────────────────────
  const setAuth = (data) => {
    user.value = data.user
    token.value = data.token
    localStorage.setItem("token", data.token)
  }

  const logout = () => {
    user.value = null
    token.value = null
    errorMsg.value = ""
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("resetEmail")
  }

  const login = async (data) => {
    const { rememberMe, ...loginData } = data
    try {
      const res = await api.post("/auth/login", loginData)
      token.value = res.data.data.token
      user.value = res.data.data.user ?? null

      if (rememberMe) {
        localStorage.setItem("token", res.data.data.token)
        sessionStorage.removeItem("token")
      } else {
        sessionStorage.setItem("token", res.data.data.token)
        localStorage.removeItem("token")
      }

      errorMsg.value = ""
      return res.data
    } catch (error) {
      errorMsg.value = getApiErrorMessage(
        error,
        "បញ្ចូលបរាជ័យ សូមពិនិត្យមើលអុីមែល និងពាក្យសម្ងាត់ម្ដងទៀត"
      )
      throw error
    }
  }

  const register = async (data) => {
    try {
      const res = await api.post("/auth/register", data)
      user.value = res.data.data
      errorMsg.value = ""
      return res.data
    } catch (err) {
      errorMsg.value = getApiErrorMessage(
        err,
        "បង្កើតបរាជ័យ សូមពិនិត្យព័ត៏មានម្ដងទៀត"
      )
      throw err
    }
  }

  const requestOtp = async (data) => {
    try {
      const res = await api.post("/otp/send", data)
      errorMsg.value = ""
      return res.data
    } catch (error) {
      errorMsg.value = getApiErrorMessage(error, "ផ្ញើរ OTP បានបរាជ័យ")
      throw error
    }
  }
  const sentOtp = requestOtp

  const resendOtp = async (data) => {
    try {
      const res = await api.post("/otp/resend", data)
      errorMsg.value = ""
      return res.data
    } catch (error) {
      errorMsg.value = getApiErrorMessage(error, "ផ្ញើរ OTP បានបរាជ័យ")
      throw error
    }
  }

  const verifyOtp = async (data) => {
    try {
      const res = await api.post("/otp/verify", data)
      resetToken.value = res.data?.data?.token ?? res.data?.token ?? ""
      errorMsg.value = ""
      return res.data
    } catch (error) {
      errorMsg.value = getApiErrorMessage(error, "លេខកូដ OTP មិនត្រឹមត្រូវ ឬផុតកំណត់")
      throw error
    }
  }

  const forgotPassword = async (data) => {
    try {
      const res = await api.post("/auth/forgot-password", data)
      resetEmail.value = data.email
      sessionStorage.setItem("resetEmail", data.email)
      errorMsg.value = ""
      return res.data
    } catch (error) {
      errorMsg.value = getApiErrorMessage(error, "មិនអាចផ្ញើ OTP បាន សូមព្យាយាមម្តងទៀត")
      throw error
    }
  }

  const resetPassword = async (data) => {
    try {
      const res = await api.post("/auth/reset-password", data)
      resetToken.value = ""
      resetEmail.value = ""
      sessionStorage.removeItem("resetEmail")
      errorMsg.value = ""
      return res.data
    } catch (error) {
      errorMsg.value = getApiErrorMessage(
        error,
        "មិនអាចកំណត់ពាក្យសម្ងាត់ឡើងវិញបាន សូមព្យាយាមម្តងទៀត"
      )
      throw error
    }
  }

  // ── Exports ────────────────────────────────────────────
  return {
    token, user, errorMsg, resetToken, resetEmail, isLogin,
    setAuth, logout,
    login, register,
    requestOtp, sentOtp, resendOtp, verifyOtp,
    forgotPassword, resetPassword,
  }
})