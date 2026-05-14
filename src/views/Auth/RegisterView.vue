<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/useAuthStore'
import { useValidator } from '@/composables/useValidator'
import AuthTimelineSidebar from '@/components/auth/AuthTimelineSidebar.vue'

const { errors, clearFieldError, validateLogin } = useValidator(['email', 'password'])

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const isLoading = ref(false)
const showPassword = ref(false)
const formError = ref('')

const steps = [
  { id: 1, label: 'បង្កើតគណនី', status: 'completed' },
  { id: 2, label: 'ផ្ទៀងផ្ទាត់កូដOTP', status: 'completed' },
  { id: 3, label: 'ចូលប្រើប្រាស់', status: 'active' },
]

const submitLogin = async () => {
  formError.value = ''

  if (!validateLogin(form)) {
    return
  }

  isLoading.value = true

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
      rememberMe: form.rememberMe,
    })

    await Swal.fire({
      title: 'ជោគជ័យ!',
      icon: 'success',
      draggable: true,
    })

    router.push({ name: 'home' })
  } catch (error) {
    const message = authStore.errorMsg || 'Login failed. Please check your email and password.'

    await Swal.fire({
      icon: 'error',
      title: 'សូមពិនិត្យមើលលេខកូដអ៊ីមែលរបស់អ្នកនិងពាក្យសម្ងាត់របស់អ្នក។',
      text: message,
    })
  } finally {
    isLoading.value = false
  }
}



</script>

<template>
  <main class="login-page">
    <div class="bg-decoration" aria-hidden="true">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <section class="login-frame" aria-label="login">
      <div class="login-wrapper">
        <AuthTimelineSidebar :steps="steps" />

        <div class="login-card">

        <h2 > ស្វាគមន៍ <span style="color:#22C55E">ការត្រឡប់មកវិញ! </span></h2>
        <p class="login-subtitle h2">សូមបញ្ចូលព័ត៌មានរបស់អ្នក ដើម្បីចូលប្រើប្រាស់</p>

        <div v-if="formError" class="form-alert" role="alert">
          <i class="bi bi-exclamation-circle-fill"></i>
          {{ formError }}
        </div>

        <form @submit.prevent="submitLogin" novalidate>
          <div class="field-group">
            <label class="field-label ​" for="email">អ៊ីមែល</label>
            <div class="input-shell" :class="{ 'is-invalid': errors.email }">
              <i class="bi bi-envelope field-icon" aria-hidden="true"></i>
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                autocomplete="email"
                placeholder="សូមបញ្ចូលអ៊ីមែល"
                required
                @input="clearFieldError('email')"
                @change="clearFieldError('email')"
                @paste="clearFieldError('email')"
              />
            </div>
            <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
          </div>

          <div class="field-group">
            <label class="field-label" for="password">ពាក្យសម្ងាត់</label>
            <div class="input-shell" :class="{ 'is-invalid': errors.password }">
              <i class="bi bi-lock field-icon" aria-hidden="true"></i>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="សូមបញ្ចូលពាក្យសម្ងាត់"
                required
                @input="clearFieldError('password')"
              />
              <button
                class="icon-button"
                type="button"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
              </button>
            </div>
            <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
          </div>

          <div class="login-options">
            <label class="remember-row" for="remember-me">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
              />
              <span style="font-wight: 500 !important">ចងចាំខ្ញុំ</span>
            </label>
            <RouterLink class="forgot-link" :to=" { name: 'forgetPassword'}"> ភ្លេចពាក្យសម្ងាត់?</RouterLink>
          </div>

          <button class="login-button" type="submit" :disabled="isLoading">
            <span class="button-text">{{ isLoading ? 'កំពុងចូល...' : 'ចូលប្រើ' }}</span>
          </button>
        </form>

        <div class="register-row">
          <span class="register-hint">មិនទាន់មានគណនី?</span>
          <RouterLink class="register-link" :to="{ name: 'register' }">បង្កើតគណនី</RouterLink>
        </div>

        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>

.login-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4fb;
  padding: 32px 16px;
  overflow: hidden;
  font-family: inherit;
}

/* Background circles */
.bg-decoration { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.circle { position: absolute; border-radius: 50%; }
.circle-1 {
  width: 420px; height: 420px;
  background: radial-gradient(circle, rgba(26,79,170,0.09) 0%, transparent 70%);
  top: -140px; right: -100px;
}
.circle-2 {
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(24,163,74,0.07) 0%, transparent 70%);
  bottom: -100px; left: -80px;
}
.circle-3 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(245,167,0,0.06) 0%, transparent 70%);
  top: 40%; left: 20%;
}

.login-frame {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-wrapper {
  display: flex;
  align-items: stretch;
  width: min(100%, 820px);
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 2px 4px rgba(26,79,170,0.04),
    0 16px 48px rgba(26,79,170,0.14),
    0 40px 80px rgba(26,79,170,0.07);
}

.login-card {
  flex: 1;
  min-width: 0;
  padding: 36px 32px 28px;
  background: #ffffff;
}

.brand-title {
  margin: 0 0 4px;
  font-size: 28px;
  font-weight: 900;
  line-height: 1.2;
}
.brand-sub {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #7a8fae;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #d0ddef, transparent);
  margin-bottom: 16px;
}

.login-subtitle {
  margin: 0 0 20px;
  color: #7a8fae;
  font-size: 13px;
  text-align: center;
  line-height: 1.5;
}

.form-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  border-radius: 10px;
  padding: 10px 14px;
  color: #9f1239;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  font-size: 13px;
  line-height: 1.4;
}
.form-alert .bi { 
  flex-shrink: 0;
  font-size: 14px; 
  }


.field-group { 
  margin-bottom: 16px;
  }

.field-label {
  display: block;
  margin-bottom: 7px;
  color: #111d35;
  font-size: 13px;
  font-weight: 500;
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
  box-shadow: 0 0 0 3px rgba(43,101,204,0.12);
}

.input-shell.is-invalid {
  border-color: #ef4444;
  background: #fee2e2;
}

.input-shell.is-invalid:focus-within {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.14);
}

.field-error {
  margin: 7px 0 0;
  color: #ef4444;
  font-size: 12px;
  line-height: 1.35;
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
  border: 0; outline: 0;
  padding: 0 10px;
  color: #111d35;
  background: transparent;
  font-size: 14px;
  font-family: inherit;
}
.input-shell input::placeholder { color: #b5c5dc; }

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px; height: 26px;
  border: 0; padding: 0;
  color: #7a8fae;
  background: transparent;
  font-size: 15px;
  cursor: pointer;
  transition: color 0.15s;
}
.icon-button:hover { color: #1a4faa; }

/* Login options */
.login-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin: -6px 0 18px;
}

.remember-row {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  color: #60718f;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
}

.remember-row input {
  width: 14px;
  height: 14px;
  margin: 0;
  accent-color: #2b65cc;
  cursor: pointer;
}

.forgot-link {
  color: #2b65cc;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.15s;
}
.forgot-link:hover { opacity: 0.72; }

/* Login button */
.login-button {
  text-align: center;
  margin-right: 16px;
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 50px;
  padding: 0 20px;
  color: #ffffff;
  background: linear-gradient(135deg, #2b65cc 0%, #1a4faa 100%);
  box-shadow: 0 4px 16px rgba(26,79,170,0.30), inset 0 1px 0 rgba(255,255,255,0.15);
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
  font-family: inherit;
}
.login-button:hover:not(:disabled) {
  opacity: 0.93;
  transform: translateY(-1px);
  box-shadow: 0 7px 22px rgba(26,79,170,0.36);
}
.login-button:active:not(:disabled) { transform: translateY(0); }
.login-button:disabled { cursor: wait; opacity: 0.62; }
.login-button i { font-size: 20px; }

/* Register */
.register-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #edf2fb;
}
.register-hint { 
  color: #7a8fae;
  font-size: 13px;
  }

.register-link {
  color: #2b65cc;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.15s;
}
.register-link:hover { opacity: 0.72; }

/* Responsive */
@media (max-width: 900px) {
  .login-page {
    align-items: flex-start;
    padding: 18px 12px;
  }

  .login-wrapper {
    flex-direction: column;
    width: min(100%, 760px);
    border-radius: 20px;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 0;
  }

  .login-wrapper {
    min-height: 100vh;
    border-radius: 0;
  }

  .login-card { 
    padding: 28px 20px 22px; 
  }
  .brand-title { 
    font-size: 24px; 
    }
}
</style>
