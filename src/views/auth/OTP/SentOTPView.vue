<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import AuthTimelineSidebar from '@/components/auth/AuthTimelineSidebar.vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const form = reactive({ email: '' })
const isLoading = ref(false)
const emailError = ref('')

const steps = [
  { id: 1, label: 'បង្កើតគណនី', status: 'active' },
  { id: 2, label: 'បញ្ចូលកូដOTP', status: 'pending' },
  { id: 3, label: 'ចូលប្រើប្រាស់', status: 'pending' },
]

const validateEmail = () => {
  emailError.value = ''

  if (!form.email.trim()) {
    emailError.value = 'សូមបញ្ចូលអ៊ីមែល'
  } else if (!emailPattern.test(form.email.trim())) {
    emailError.value = 'សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ'
  }

  return !emailError.value
}

const sendOtp = async () => {
  if (!validateEmail()) return

  isLoading.value = true

  try {
    const email = form.email.trim()
    await authStore.requestOtp({ email })

    await Swal.fire({
      icon: 'success',
      title: 'ផ្ញើ OTP បានជោគជ័យ',
      text: 'សូមពិនិត្យប្រអប់សំបុត្ររបស់អ្នក',
      timer: 1800,
      showConfirmButton: false,
    })

    router.push({ name: 'otp-verify', query: { email } })
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'មិនអាចផ្ញើ OTP បាន',
      text: authStore.errorMsg || 'សូមព្យាយាមម្តងទៀត។',
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="send-otp-page">
    <div class="bg-decoration" aria-hidden="true">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <section class="auth-wrapper" aria-label="Send OTP">
      <AuthTimelineSidebar :steps="steps" />

      <div class="auth-card">
        <h2>ផ្ទៀងផ្ទាត់អ្នកប្រើប្រាស់</h2>
        <p class="page-subtitle">
          បញ្ចូលអ៊ីមែលរបស់អ្នក ដើម្បីទទួលលេខកូដ OTP សម្រាប់ការផ្ទៀងផ្ទាត់
        </p>

        <form class="send-otp-form" @submit.prevent="sendOtp" novalidate>
          <div class="field-group">
            <label class="field-label" for="email">អ៊ីមែល</label>
            <div class="input-shell" :class="{ 'is-invalid': emailError }">
              <i class="bi bi-envelope field-icon" aria-hidden="true"></i>
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                autocomplete="email"
                placeholder="Example@gmail.com"
                required
                @input="emailError = ''"
              />
            </div>
            <p v-if="emailError" class="field-error">
              <i class="bi bi-exclamation-circle" aria-hidden="true"></i>
              {{ emailError }}
            </p>
          </div>

          <div class="info-note">
            <i class="bi bi-info-circle" aria-hidden="true"></i>
            <span>លេខកូដ OTP នឹងផុតកំណត់ក្នុងរយៈពេល 5 នាទី</span>
          </div>

          <button class="send-button" type="submit" :disabled="isLoading">
            <span>{{ isLoading ? 'កំពុងផ្ញើ...' : 'ផ្ញើ OTP' }}</span>
            <i :class="isLoading ? 'bi bi-arrow-repeat spin' : 'bi bi-send'" aria-hidden="true"></i>
          </button>
        </form>

        <div class="back-row">
          <RouterLink :to="{ name: 'login' }" class="back-link">
            <i class="bi bi-arrow-left" aria-hidden="true"></i>
            ត្រឡប់ទៅចូលប្រើប្រាស់
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
*, *::before, *::after {
  box-sizing: border-box;
}

.send-otp-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  overflow: hidden;
  background: #f0f4fb;
  font-family: inherit;
}

.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
}

.circle-1 {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(26, 79, 170, 0.09) 0%, transparent 70%);
  top: -160px;
  right: -120px;
}

.circle-2 {
  width: 340px;
  height: 340px;
  background: radial-gradient(circle, rgba(24, 163, 74, 0.07) 0%, transparent 70%);
  bottom: -100px;
  left: -80px;
}

.circle-3 {
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(245, 167, 0, 0.06) 0%, transparent 70%);
  top: 40%;
  left: 20%;
}

.auth-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: stretch;
  width: min(100%, 760px);
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 2px 4px rgba(26, 79, 170, 0.04),
    0 16px 48px rgba(26, 79, 170, 0.14),
    0 40px 80px rgba(26, 79, 170, 0.07);
}

.auth-card {
  flex: 1;
  padding: 40px 36px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h2 {
  margin: 0;
  color: #042c83;
  font-size: 26px;
  font-weight: 900;
  line-height: 1.2;
}

.page-subtitle {
  margin: 8px 0 24px;
  color: #7a8fae;
  font-size: 13px;
  line-height: 1.5;
}

.send-otp-form {
  display: grid;
  gap: 16px;
}

.field-label {
  display: block;
  margin-bottom: 7px;
  color: #111d35;
  font-size: 13px;
  font-weight: 600;
}

.input-shell {
  display: flex;
  align-items: center;
  height: 46px;
  border: 1.5px solid #d0ddef;
  border-radius: 50px;
  padding: 0 16px;
  background: #f7faff;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
}

.input-shell:focus-within {
  border-color: #2b65cc;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(43, 101, 204, 0.12);
}

.input-shell.is-invalid {
  border-color: #ef4444;
  background: #fee2e2;
}

.field-icon {
  color: #7a8fae;
  font-size: 15px;
  flex-shrink: 0;
}

.input-shell input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: 0;
  padding: 0 10px;
  color: #111d35;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
}

.input-shell input::placeholder {
  color: #b5c5dc;
}

.field-error {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 7px 0 0;
  color: #ef4444;
  font-size: 12px;
  line-height: 1.35;
}

.info-note {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #eef4ff;
  border: 1px solid #c8d9f7;
  color: #2b65cc;
  font-size: 12.5px;
  line-height: 1.4;
}

.send-button {
  width: 100%;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 50px;
  padding: 0 20px;
  color: #ffffff;
  background: linear-gradient(135deg, #2b65cc 0%, #1a4faa 100%);
  box-shadow: 0 4px 16px rgba(26, 79, 170, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  font-family: inherit;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
}

.send-button:hover:not(:disabled) {
  opacity: 0.93;
  transform: translateY(-1px);
  box-shadow: 0 7px 22px rgba(26, 79, 170, 0.36);
}

.send-button:disabled {
  cursor: wait;
  opacity: 0.62;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.back-row {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #edf2fb;
  display: flex;
  justify-content: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #2b65cc;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.15s;
}

.back-link:hover {
  opacity: 0.72;
}

@media (max-width: 900px) {
  .auth-wrapper {
    flex-direction: column;
    border-radius: 20px;
  }

  .auth-card {
    padding: 28px 24px;
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px 20px;
  }

  h2 {
    font-size: 24px;
  }
}
</style>
