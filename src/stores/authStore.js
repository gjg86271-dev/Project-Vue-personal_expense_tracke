import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMjRjZDBmZC1iZjFkLTQ5YWQtYjdmZS1kZGIyYjY5NWUyYTAiLCJpYXQiOjE3Nzc4OTA4ODAsImV4cCI6MTc3ODQ5NTY4MH0.RHvJWA_pqyr3fFmvFVcX91CYcG8FB33sPYKacf8gXFk'
  }),

  actions: {
    setAuth(data) {
      this.user = data.user
      this.token = data.token
    },

    logout() {
      this.user = null
      this.token = null
    }
  },

  persist: true // (optional) save in localStorage
})