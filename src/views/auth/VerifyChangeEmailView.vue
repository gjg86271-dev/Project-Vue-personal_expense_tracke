<template>
  <div class="verify-redirect">
    <div class="verify-spinner"></div>
    <p>កំពុងផ្ទៀងផ្ទាត់...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route  = useRoute()

onMounted(() => {
  const token = route.query.token
  if (token) {
    router.replace({ name: 'profile', query: { token } })
  } else {
    router.replace({ name: 'dashboard' })
  }
})
</script>

<style scoped>
.verify-redirect {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: var(--bg-base, #0f172a);
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  font-size: 14px;
}

.verify-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(99, 102, 241, 0.25);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>