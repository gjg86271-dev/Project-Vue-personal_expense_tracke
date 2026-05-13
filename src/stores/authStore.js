import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYjk1ZWM1Yi1kMmE1LTRmZTAtOTcxMi1kZWFkYTkyNjU4ZGMiLCJpYXQiOjE3Nzg1NzEzMzQsImV4cCI6MTc3OTE3NjEzNH0.exs4p4jpTYba0-cnqMRnTFUCCTz4aWRf-6T-FeqlsH4'
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