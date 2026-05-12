import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYjk1ZWM1Yi1kMmE1LTRmZTAtOTcxMi1kZWFkYTkyNjU4ZGMiLCJpYXQiOjE3Nzg1MDY4OTksImV4cCI6MTc3OTExMTY5OX0.Z7fo-shwGJ2eB6H52CjV5KLZOTf5QhyvZ39J_ximy0Y'
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