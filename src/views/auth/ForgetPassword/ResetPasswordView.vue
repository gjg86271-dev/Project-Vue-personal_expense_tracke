<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/authStore'
import AuthTimelineSidebar from '@/components/auth/AuthTimelineSidebar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarSteps = [
  { id: 1, label: 'អ៊ីមែល', status: 'completed' },
  { id: 2, label: 'ផ្ទៀងផ្ទាត់', status: 'completed' },
  { id: 3, label: 'ពាក្យសម្ងាត់ថ្មី', status: 'active' },
]

const firstQueryValue = (...values) => {
  const value = values.find((item) => Array.isArray(item) ? item[0] : item)
  return Array.isArray(value) ? value[0] : value
}

const token = String(
  firstQueryValue(
    route.query.token,
    route.query.reset_token,
    route.query.resetToken,
    route.params.token,
    authStore.resetToken,
  ) || ''
)


if (!token) {
  router.replace({ name: 'forgetPassword' })
}

const form = reactive({
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

const clearError = (field) => {
  errors[field] = ''
}

const validateForm = () => {
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.password) {
    errors.password = 'សូមបញ្ចូលពាក្យសម្ងាត់ថ្មី'
  } else if (form.password.length < 8) {
    errors.password = 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 8 តួអក្សរ'
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'សូមបញ្ជាក់ពាក្យសម្ងាត់'
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'ពាក្យសម្ងាត់មិនត្រូវគ្នា'
  }

  return !errors.password && !errors.confirmPassword
}

const submitResetPassword = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    const resetPayload = {
      token,
      newPassword: form.password,
    }

    await authStore.resetPassword(resetPayload)

    await Swal.fire({
      icon: 'success',
      title: 'កំណត់ពាក្យសម្ងាត់បានជោគជ័យ',
      text: 'សូមចូលប្រើប្រាស់ដោយប្រើពាក្យសម្ងាត់ថ្មីរបស់អ្នក',
      timer: 1800,
      showConfirmButton: false,
    })

    router.push({ name: 'login' })
  } catch (error) {
    const message =
      authStore.errorMsg ||
      error?.response?.data?.message ||
      'សូមព្យាយាមម្តងទៀត។'

    await Swal.fire({
      icon: 'error',
      title: 'មិនអាចកំណត់ពាក្យសម្ងាត់បាន',
      text: message,
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="reset-page">
    <section class="reset-wrapper" aria-label="Reset password">
      <AuthTimelineSidebar :steps="sidebarSteps" />

      <div class="reset-card">
        <div class="icon-circle">
          <i class="bi bi-lock" aria-hidden="true"></i>
        </div>
    

        <h1 class="" >ភ្លេចពាក្យសម្ងាត់?</h1>
        <p class="subtitle ​">បង្កើតពាក្យសម្ងាត់ថ្មីសម្រាប់គណនីរបស់អ្នក</p>


        <form class="reset-form" @submit.prevent="submitResetPassword" novalidate>
          <div class="field-group">
            <label class="field-label" for="new-password">ពាក្យសម្ងាត់ថ្មី</label>
            <div class="input-shell" :class="{ 'is-invalid': errors.password }">
              <i class="bi bi-lock field-icon" aria-hidden="true"></i>
              <input
                id="new-password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="***************"
                :disabled="isLoading"
                @input="clearError('password')"
              />
              <button
                class="eye-button"
                type="button"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :disabled="isLoading"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" aria-hidden="true"></i>
              </button>
            </div>
            <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
          </div>

          <div class="field-group">
            <label class="field-label" for="confirm-password">បញ្ជាក់ពាក្យសម្ងាត់</label>
            <div class="input-shell" :class="{ 'is-invalid': errors.confirmPassword }">
              <i class="bi bi-lock field-icon" aria-hidden="true"></i>
              <input
                id="confirm-password"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="***************"
                :disabled="isLoading"
                @input="clearError('confirmPassword')"
              />
              <button
                class="eye-button"
                type="button"
                :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                :disabled="isLoading"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'" aria-hidden="true"></i>
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</p>
          </div>

          <RouterLink class="login-help" :to="{ name: 'login' }">
            ចងចាំពាក្យសម្ងាត់ចាស់មែនទេ?
          </RouterLink>

          <button class="primary-button" type="submit" :disabled="isLoading">
            <span>{{ isLoading ? 'កំពុងរក្សាទុក...' : 'ត្រឡប់ទៅ​ចូលប្រើប្រាស់' }}</span>
      
          </button>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.reset-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  background: #eef3fa;
  font-family: inherit;
}

.reset-wrapper {
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

.reset-card {
  flex: 1;
  min-width: 0;
  padding: 40px 36px;
  background: #ffffff;
}

.icon-circle {
  position: relative;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  border-radius: 50%;
  color: #ffffff;
  background:
    radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.42), transparent 34%),
    linear-gradient(135deg, #22c55e 0%, #2b65cc 72%, #1746a2 100%);
  box-shadow:
    0 14px 30px rgba(43, 101, 204, 0.28),
    0 0 0 8px rgba(43, 101, 204, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}


.icon-circle::before {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: inherit;
  border: 1px solid rgba(43, 101, 204, 0.18);
}

.icon-circle::after {
  content: '';
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 12px;
  height: 12px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.35);
}

.icon-circle .bi {
  position: relative;
  z-index: 1;
  font-size: 29px;
  line-height: 1;
}


h1 {
  margin: 0;
  color: #151a2d;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.25;
  text-align: center;
}

.subtitle {
  margin: 7px 0 21px;
  color: #9aa7bb;
  font-size: 9.5px;
  line-height: 1.5;
  text-align: center;
}

.reset-form {
  display: grid;
  gap: 13px;
}

.field-group {
  min-width: 0;
}

.field-label {
  display: block;
  margin: 0 0 7px 2px;
  color: #64748b;
  font-size: 10px;
  font-weight: 600;
}

.input-shell {
  display: flex;
  align-items: center;
  height: 38px;
  border: 1.5px solid #657996;
  border-radius: 999px;
  padding: 0 13px;
  background: #ffffff;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
}

.input-shell:focus-within {
  border-color: #2d57b7;
  box-shadow: 0 0 0 3px rgba(45, 87, 183, 0.13);
}

.input-shell.is-invalid {
  border-color: #ef4444;
  background: #fff7f7;
}

.field-icon {
  flex-shrink: 0;
  color: #9aacbf;
  font-size: 13px;
}

.input-shell input {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  padding: 0 10px;
  color: #1d2740;
  background: transparent;
  font-family: inherit;
  font-size: 11px;
}

.input-shell input::placeholder {
  color: #b7c3d3;
}

.input-shell input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.eye-button {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  color: #9aacbf;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.15s;
}

.eye-button:hover:not(:disabled) {
  color: #2d57b7;
}

.eye-button:disabled {
  cursor: not-allowed;
}

.field-error {
  margin: 5px 0 0 2px;
  color: #ef4444;
  font-size: 10px;
  line-height: 1.35;
}

.login-help {
  width: max-content;
  max-width: 100%;
  color: #657996;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.4;
  text-decoration: none;
}

.login-help:hover {
  color: #2d57b7;
}

.primary-button {
  width: 100%;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  border: 0;
  border-radius: 999px;
  padding: 0 20px;
  color: #ffffff;
  background: #2857bd;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.1);
  font-family: inherit;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
}

.primary-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow:
    inset 0 -2px 0 rgba(0, 0, 0, 0.1),
    0 7px 18px rgba(40, 87, 189, 0.25);
}

.primary-button:disabled {
  cursor: wait;
  opacity: 0.66;
}

.primary-button i {
  font-size: 14px;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .reset-page {
    align-items: flex-start;
    padding: 18px 12px;
  }

  .reset-wrapper {
    flex-direction: column;
    border-radius: 20px;
  }

  .reset-card {
    padding: 28px 24px 25px;
  }
}

@media (max-width: 480px) {
  .reset-page {
    padding: 0;
  }

  .reset-wrapper {
    min-height: 100vh;
    border-radius: 0;
  }

  .reset-card {
    padding: 24px 20px 25px;
  }
}
</style>
