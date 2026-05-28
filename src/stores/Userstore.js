// src/stores/userStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/api'

export const useUserStore = defineStore('user', () => {
  const profile = ref(null)

  const avatarUrl   = computed(() => profile.value?.avatar ?? null)
  const displayName = computed(() => profile.value?.fullName ?? profile.value?.name ?? '')
  const email       = computed(() => profile.value?.email ?? '')
  const role        = computed(() => profile.value?.role?.name ?? profile.value?.role ?? '')

  async function fetchProfile() {
    try {
      const res  = await api.get('auth/profile')
      const data = res.data?.data ?? res.data
      profile.value = data
    } catch (e) {
      console.error('fetchProfile failed', e)
    }
  }

  /**
   * Patch local profile state instantly — no API call.
   * Used by ProfileView after any successful save so the navbar
   * (and any other consumer) updates in real-time without reload.
   */
  function updateLocal(patch) {
    if (profile.value) {
      Object.assign(profile.value, patch)
    } else {
      profile.value = { ...patch }
    }
  }

  function clearProfile() {
    profile.value = null
  }

  return {
    profile,
    avatarUrl,
    displayName,
    email,
    role,
    fetchProfile,
    updateLocal,
    clearProfile,
  }
})