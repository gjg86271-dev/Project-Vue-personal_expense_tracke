<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import AuthTimelineSidebar from '@/components/auth/AuthTimelineSidebar.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const otpLength = 6

const form = reactive({
  email: String(route.query.email || ''),
  otp: Array.from({ length: otpLength }, () => ''),
})

const step = ref(form.email ? 'otp' : 'email')
const isLoading = ref(false)
const resendSeconds = ref(0)
const emailError = ref('')
const otpError = ref('')
const otpInputs = ref([])
let resendTimer = null

const sidebarSteps = computed(() => [
  { id: 1, label: 'បង្កើកគណនី', status: step.value === 'email' ? 'active' : 'completed' },
  { id: 2, label: 'បញ្ចូលកូដOTP', status: step.value === 'otp' ? 'active' : 'pending' },
  { id: 3, label: 'ចូលប្រើប្រាស់', status: 'pending' },
])

const maskedEmail = computed(() => {
  const [name = '', domain = ''] = form.email.split('@')
  if (!name || !domain) return form.email

  const visible = name.slice(0, Math.min(2, name.length))
  return `${visible}${'*'.repeat(Math.max(name.length - visible.length, 2))}@${domain}`
})

const otpCode = computed(() => form.otp.join(''))
const canSubmitOtp = computed(() => otpCode.value.length === otpLength)

const validateEmail = () => {
  emailError.value = ''

  if (!form.email.trim()) {
    emailError.value = 'សូមបញ្ចូលអ៊ីមែល'
  } else if (!emailPattern.test(form.email.trim())) {
    emailError.value = 'សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ'
  }

  return !emailError.value
}

const clearTimer = () => {
  if (resendTimer) {
    window.clearInterval(resendTimer)
    resendTimer = null
  }
}

const startResendTimer = () => {
  clearTimer()
  resendSeconds.value = 60
  resendTimer = window.setInterval(() => {
    resendSeconds.value -= 1
    if (resendSeconds.value <= 0) {
      clearTimer()
    }
  }, 1000)
}

const resetOtp = async () => {
  form.otp = Array.from({ length: otpLength }, () => '')
  otpInputs.value.forEach((el) => {
    if (el) el.value = ''
  })
  await nextTick()
}

const sentOtp = async () => {
  if (!validateEmail()) return

  isLoading.value = true
  otpError.value = ''

  try {
    await authStore.requestOtp({ email: form.email.trim() })
    step.value = 'otp'
    startResendTimer()
    await resetOtp()
    otpInputs.value[0]?.focus()
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

const resendOtp = async () => {
  if (resendSeconds.value > 0 || isLoading.value) return
  await sentOtp()
}

const setOtpInput = (index, event) => {
  const value = event.target.value.replace(/\D/g, '').slice(-1)
  form.otp[index] = value
  event.target.value = value

  if (value && index < otpLength - 1) {
    otpInputs.value[index + 1]?.focus()
  }

  otpError.value = ''
}

const pasteOtp = (event) => {
  const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpLength)
  if (!digits) return

  event.preventDefault()
  digits.split('').forEach((digit, index) => {
    form.otp[index] = digit
    if (otpInputs.value[index]) {
      otpInputs.value[index].value = digit
    }
  })

  const nextIndex = Math.min(digits.length, otpLength - 1)
  otpInputs.value[nextIndex]?.focus()
  otpError.value = ''
}

const moveOtpFocus = (index, event) => {
  if (event.key === 'Backspace') {
    if (form.otp[index]) {
      form.otp[index] = ''
      if (otpInputs.value[index]) {
        otpInputs.value[index].value = ''
      }
    } else if (index > 0) {
      otpInputs.value[index - 1]?.focus()
    }
    otpError.value = ''
  }
}

const submitOtp = async () => {
  otpError.value = ''

  if (!canSubmitOtp.value) {
    otpError.value = 'សូមបញ្ចូលលេខកូដ OTP 6 ខ្ទង់'
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.verifyOtp({
      email: form.email.trim(),
      code: otpCode.value,
    })

    const token = result?.data?.token ?? result?.token ?? authStore.resetToken

    await Swal.fire({
      icon: 'success',
      title: 'ផ្ទៀងផ្ទាត់បានជោគជ័យ',
      timer: 1400,
      showConfirmButton: false,
    })

    router.push({
      name: 'login',
      query: {
        email: form.email.trim(),
        token,
      },
    })
  } catch (error) {
    otpError.value = authStore.errorMsg || 'លេខកូដ OTP មិនត្រឹមត្រូវ'
    await resetOtp()
    otpInputs.value[0]?.focus()
  } finally {
    isLoading.value = false
  }
}

const changeEmail = async () => {
  step.value = 'email'
  await resetOtp()
  otpError.value = ''
  clearTimer()
}

onBeforeUnmount(clearTimer)
</script>

<template>
  <main class="otp-page">
    <div class="bg-decoration" aria-hidden="true">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <section class="auth-wrapper" aria-label="OTP verification">
      <AuthTimelineSidebar :steps="sidebarSteps" />

      <div class="auth-card">
        <template v-if="step === 'email'">
          <h2>ផ្ទៀងផ្ទាត់ OTP របស់អ្នក</h2>
          <p class="otp-subtitle">
            បញ្ចូលអ៊ីមែលរបស់អ្នក ដើម្បីទទួលលេខកូដសម្ងាត់ម្តងប្រើ
          </p>

          <form class="otp-form" @submit.prevent="sentOtp" novalidate>
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
              <p v-if="emailError" class="field-error">{{ emailError }}</p>
            </div>

            <div class="info-note">
              <i class="bi bi-info-circle" aria-hidden="true"></i>
              <span>ជំហានបន្ទាប់គឺបញ្ចូលលេខកូដ 6 ខ្ទង់ដែលយើងផ្ញើទៅអ៊ីមែលនេះ</span>
            </div>

            <button class="otp-button" type="submit" :disabled="isLoading">
              <span>{{ isLoading ? 'កំពុងផ្ញើ...' : 'បន្ត' }}</span>
            </button>
          </form>
        </template>

        <template v-else>
          <h2>បញ្ចូលលេខកូដ OTP</h2>
          <p class="otp-subtitle">យើងបានផ្ញើលេខកូដ 6 ខ្ទង់ទៅកាន់ {{ maskedEmail }}</p>

          <form class="otp-form" @submit.prevent="submitOtp" novalidate>
            <div class="otp-inputs" @paste="pasteOtp">
              <input
                v-for="(_, index) in form.otp"
                :key="index"
                :ref="(el) => (otpInputs[index] = el)"
                :value="form.otp[index]"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="1"
                aria-label="OTP digit"
                @input="setOtpInput(index, $event)"
                @keydown="moveOtpFocus(index, $event)"
              />
            </div>

            <p v-if="otpError" class="field-error otp-error">{{ otpError }}</p>

            <button class="otp-button" type="submit" :disabled="isLoading || !canSubmitOtp">
              <span>{{ isLoading ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ផ្ទៀងផ្ទាត់' }}</span>
            </button>
          </form>

          <div class="otp-actions">
            <button class="text-button" type="button" @click="changeEmail">ប្តូរអ៊ីមែល</button>
            <button
              class="text-button"
              type="button"
              :disabled="resendSeconds > 0 || isLoading"
              @click="resendOtp"
            >
              {{ resendSeconds > 0 ? `ផ្ញើម្តងទៀត (${resendSeconds}s)` : 'ផ្ញើ OTP ម្តងទៀត' }}
            </button>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>

<style scoped>
*, *::before, *::after {
  box-sizing: border-box;
}

.otp-page {
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

.otp-subtitle {
  margin: 8px 0 20px;
  color: #7a8fae;
  font-size: 13px;
  line-height: 1.5;
}

.otp-form {
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
  flex-shrink: 0;
  color: #7a8fae;
  font-size: 15px;
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

.otp-inputs {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}

.otp-inputs input {
  width: 100%;
  aspect-ratio: 1;
  border: 1.5px solid #d0ddef;
  border-radius: 12px;
  outline: 0;
  color: #101b33;
  background: #f8fbff;
  font-family: inherit;
  font-size: 22px;
  font-weight: 800;
  text-align: center;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
}

.otp-inputs input:focus {
  border-color: #2b65cc;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(43, 101, 204, 0.12);
}

.otp-error {
  margin-top: -8px;
  text-align: center;
}

.otp-button {
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

.otp-button:hover:not(:disabled) {
  opacity: 0.93;
  transform: translateY(-1px);
  box-shadow: 0 7px 22px rgba(26, 79, 170, 0.36);
}

.otp-button:disabled {
  cursor: wait;
  opacity: 0.62;
}

.otp-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #edf2fb;
}

.text-button {
  border: 0;
  padding: 0;
  color: #2b65cc;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
}

.text-button:hover:not(:disabled) {
  opacity: 0.72;
}

.text-button:disabled {
  color: #7a8fae;
  cursor: wait;
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
