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

// ✅ decode JWT payload ដោយមិនចាំបាច់ library
const decodeJwtRole = (jwtToken) => {
  try {
    const payload = JSON.parse(atob(jwtToken.split(".")[1]))
    return (
      payload.role ??
      payload.roles?.[0] ??
      payload.authorities?.[0]?.replace("ROLE_", "") ??
      null
    )
  } catch {
    return null
  }
}

export const useAuthStore = defineStore("auth", () => {

  // ── State ──────────────────────────────────────────────
  const token = ref(
    localStorage.getItem("token") || sessionStorage.getItem("token") || null
  )
  const user = ref(null)
  const role = ref(
    localStorage.getItem("role") || sessionStorage.getItem("role") || null
  )
  const errorMsg = ref("")
  const resetToken = ref("")
  const resetEmail = ref(sessionStorage.getItem("resetEmail") || "")

  // ── Computed ───────────────────────────────────────────
  const isLogin = computed(() => !!token.value)
  const isAdmin = computed(() => role.value?.toUpperCase() === "ADMIN")
  const isUser  = computed(() => role.value?.toUpperCase() === "USER")

  // ── Helpers ────────────────────────────────────────────
  const saveToken = (tokenValue) => {
    token.value = tokenValue
    localStorage.setItem("token", tokenValue)
    sessionStorage.removeItem("token")
  }

  const saveRole = (roleValue) => {
    role.value = roleValue ?? null
    if (!roleValue) return
    localStorage.setItem("role", roleValue)
    sessionStorage.removeItem("role")
  }

  // ── Actions ────────────────────────────────────────────
  const setAuth = (data) => {
    user.value = data.user ?? null
    saveToken(data.token)
    saveRole(data.role ?? null)
  }

  const logout = () => {
    user.value     = null
    token.value    = null
    role.value     = null
    errorMsg.value = ""
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("role")
    sessionStorage.removeItem("resetEmail")
  }

  const login = async (data) => {
    const { rememberMe, ...loginData } = data
    try {
      const res = await api.post("/auth/login", loginData)
      const resData = res.data.data

      saveToken(resData.token)
      user.value = resData.user ?? null

      let resolvedRole =
        resData.role ??
        resData.user?.role ??
        resData.user?.role?.name ??
        decodeJwtRole(resData.token) ??
        null

      if (resolvedRole) {
        saveRole(resolvedRole)
      }

      // ✅ Block ADMIN (case-insensitive: "admin", "Admin", "ADMIN" ទាំងអស់ block)
      if (resolvedRole?.toUpperCase() === "ADMIN") {
        logout()
        errorMsg.value = "អ្នកគ្រប់គ្រងមិនអាចចូលប្រើប្រព័ន្ធនេះបានទេ"
        throw new Error("ADMIN_NOT_ALLOWED")
      }

      errorMsg.value = ""
      return res.data
    } catch (error) {
      if (error.message !== "ADMIN_NOT_ALLOWED") {
        errorMsg.value = getApiErrorMessage(
          error,
          "បញ្ចូលបរាជ័យ សូមពិនិត្យមើលអុីមែល និងពាក្យសម្ងាត់ម្ដងទៀត"
        )
      }
      throw error
    }
  }

  const register = async (data) => {
    try {
      const res = await api.post("auth/register", data)
      user.value = res.data.data ?? null
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
    token, user, role, errorMsg, resetToken, resetEmail,
    isLogin, isAdmin, isUser,
    setAuth, logout,
    login, register,
    requestOtp, sentOtp, resendOtp, verifyOtp,
    forgotPassword, resetPassword,
  }
})