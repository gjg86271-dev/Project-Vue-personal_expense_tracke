<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
// import { useAuthStore } from '@/stores/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { useValidator } from '@/composables/useValidator'
import AuthTimelineSidebar from '@/components/auth/AuthTimelineSidebar.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  acceptedTerms: false,
})

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const formError = ref('')

const { errors, clearFieldError, validateRegister } = useValidator([
  'fullName',
  'email',
  'password',
  'passwordConfirmation',
  'acceptedTerms',
])

const steps = [
  { id: 1, label: 'បង្កើតគណនី',        status: 'active'    },
  { id: 2, label: 'ផ្ទៀងផ្ទាត់ឹកូដOTP',   status: 'pending'   },
  { id: 3, label: 'ចូលប្រើប្រាស់', status: 'pending'   },
]

const submitRegister = async () => {
  formError.value = ''
  if (!validateRegister(form)) return

  isLoading.value = true
  try {
    await authStore.register({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.passwordConfirmation,

    })

    await authStore.requestOtp({ email: form.email })

    await Swal.fire({ title: 'ជោគជ័យ!', icon: 'success', draggable: true })


    router.push({ name: 'otp-verify', query: { email: form.email } })

  } catch (error) {
    const message = authStore.errorMsg || 'សូមព្យាយាមម្តងទៀត។'
    formError.value = message
    await Swal.fire({ icon: 'error', title: 'បង្កើតបរាជ័យ។', text: message })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="register-page">

    
    <div class="bg-decoration" aria-hidden="true">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="two-card-wrapper">

      <AuthTimelineSidebar :steps="steps" />

      <div class="card card-left">

        <!-- Logo -->
        <div class="logo-wrap">
          <img
            src="../../assets/img/loginLogo.png"
            alt="Expense Tracker logo"
            class="brand-logo"
          />
        </div>

        <p class="brand-sub  ">ចូលរួមជាមួយអ្នកប្រើប្រាស់ជាង ១០,០០០ នាក់</p>

  
        <div class="divider"></div>

    
        <nav class="steps" aria-label="Registration steps">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="step"
            :class="step.status"
          >
       
            <div v-if="index > 0" class="connector" :class="{
              done: steps[index - 1].status === 'completed',
              half: step.status === 'active',
            }"></div>

            <div class="step-row">
              <!-- Icon -->
              <div class="step-icon">
                <svg v-if="step.status === 'completed'" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" fill="#22c55e"/>
                  <path d="M5.5 10.5l3 3 6-6" stroke="white" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div v-else-if="step.status === 'active'" class="icon-active">
                  <span>{{ step.id }}</span>
                  <div class="pulse-ring"></div>
                </div>
                <div v-else class="icon-pending">
                  <span>{{ step.id }}</span>
                </div>
              </div>

              <!-- Label -->
              <div class="step-text">
                <span class="step-number">STEP {{ step.id }}</span>
                <span class="step-label">{{ step.label }}</span>
              </div>
            </div>
          </div>
        </nav>

        <!-- Bottom help -->
        <div class="help-row">
          <div class="help-icon">?</div>
          <div class="help-text">
            <span class="help-title">Having troubles?</span>
            <a href="#" class="help-link" @click.prevent>Contact us</a>
          </div>
        </div>

        <!-- Deco shape -->
        <div class="deco" aria-hidden="true">
          <svg viewBox="0 0 120 140" fill="none">
            <polygon points="60,10 110,40 110,100 60,130 10,100 10,40"
                     fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
            <polygon points="60,25 95,45 95,95 60,115 25,95 25,45"
                     fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>
            <polygon points="60,40 80,52 80,88 60,100 40,88 40,52"
                     fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
          </svg>
        </div>

      </div>

      <div class="card card-right">

        <h3 class="form-title">ចុះឈ្មោះគណនី</h3>
        <p class="form-subtitle">បំពេញព័ត៌មានខាងក្រោម ដើម្បីបង្កើតគណនី</p>

        <div v-if="formError" class="form-alert" role="alert">
          <i class="bi bi-exclamation-circle-fill"></i>
          {{ formError }}
        </div>

        <form @submit.prevent="submitRegister" novalidate>

          <!-- Full name -->
          <div class="field-group">
            <label class="field-label" for="full-name">ឈ្មោះពេញ</label>
            <div class="input-shell" :class="{ 'is-invalid': errors.fullName }">
              <i class="bi bi-person field-icon"></i>
              <input
                id="full-name"
                v-model.trim="form.fullName"
                type="text"
                autocomplete="name"
                placeholder="បំពេញឈ្មោះពេញ"
                required
                @input="clearFieldError('fullName')"
                @change="clearFieldError('fullName')"
                @paste="clearFieldError('fullName')"
              />
            </div>
            <p v-if="errors.fullName" class="field-error">{{ errors.fullName }}</p>
          </div>

          <div class="field-group">
            <label class="field-label" for="email">អ៊ីមែល</label>
            <div class="input-shell" :class="{ 'is-invalid': errors.email }">
              <i class="bi bi-envelope field-icon"></i>
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                placeholder="example@gmail.com"
                required
                @input="clearFieldError('email')"
              />
            </div>
            <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
          </div>

          <!-- Password + Confirm side by side -->
          <div class="password-grid">

            <div class="field-group">
              <label class="field-label" for="password">ពាក្យសម្ងាត់</label>
              <div class="input-shell" :class="{ 'is-invalid': errors.password }">
                <i class="bi bi-lock field-icon"></i>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="••••••••"
                  minlength="8"
                  required
                  @input="clearFieldError('password')"
                />
                <button class="icon-button" type="button"
                  :aria-label="showPassword ? 'Hide' : 'Show'"
                  @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                </button>
              </div>
              <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
            </div>

            <div class="field-group">
              <label class="field-label" for="password-confirm">បញ្ជាក់ពាក្យសម្ងាត់</label>
              <div class="input-shell" :class="{ 'is-invalid': errors.passwordConfirmation }">
                <i class="bi bi-lock field-icon"></i>
                <input
                  id="password-confirm"
                  v-model="form.passwordConfirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="•••••••••"
                  minlength="8"
                  required
                  @input="clearFieldError('passwordConfirmation')"
                />
                <button class="icon-button" type="button"
                  :aria-label="showConfirmPassword ? 'Hide' : 'Show'"
                  @click="showConfirmPassword = !showConfirmPassword">
                  <i :class="showConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                </button>
              </div>
              <p v-if="errors.passwordConfirmation" class="field-error">{{ errors.passwordConfirmation }}</p>
            </div>

          </div>

          <label class="terms-row" for="accepted-terms">
            <input
              id="accepted-terms"
              v-model="form.acceptedTerms"
              type="checkbox"
              @change="clearFieldError('acceptedTerms')"
            />
            <span>
              ខ្ញុំយល់ព្រមតាម
              <a href="#" @click.prevent class="terms-link">លក្ខខណ្ឌប្រើប្រាស់</a>
              និង
              <a href="#" @click.prevent class="terms-link">គោលការណ៍ឯកជនភាព</a>
            </span>
          </label>
          <p v-if="errors.acceptedTerms" class="field-error terms-error">{{ errors.acceptedTerms }}</p>

          <!-- Submit -->
          <button class="register-button" type="submit" :disabled="isLoading">
            <span>{{ isLoading ? 'កំពុងបង្កើត...' : 'បង្កើតគណនី' }}</span>
          </button>

        </form>

        <div class="login-row">
          <span class="login-hint">មានគណនីរួចហើយមែនទេ?</span>
          <RouterLink class="login-link" :to="{ name: 'login' }">ចូលប្រើប្រាស់</RouterLink>
        </div>

      </div>
    </div>
  </main>
</template>

<style scoped>

.register-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4fb;
  padding: clamp(20px, 4vw, 40px) 16px;
  overflow-x: hidden;
  overflow-y: auto;
  font-family: inherit;
}

.bg-decoration { position: absolute; inset: 0; pointer-events: none; z-index: 0; }

.circle { position: absolute; border-radius: 50%; }

.circle-1 {
  width: 480px; height: 480px;
  background: radial-gradient(circle, rgba(26,79,170,0.09) 0%, transparent 70%);
  top: -160px; right: -120px;
}
.circle-2 {
  width: 340px; height: 340px;
  background: radial-gradient(circle, rgba(24,163,74,0.07) 0%, transparent 70%);
  bottom: -100px; left: -80px;
}
.circle-3 {
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(245,167,0,0.06) 0%, transparent 70%);
  top: 40%; left: 20%;
}


.two-card-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: stretch;
  gap: 0;
  width: min(100%, 920px);
  border-radius: 24px;
  box-shadow:
    0 2px 4px rgba(26,79,170,0.04),
    0 16px 48px rgba(26,79,170,0.14),
    0 40px 80px rgba(26,79,170,0.07);
  overflow: hidden;
}

.card {
  padding: 40px 36px;
  min-width: 0;
}


.card-left {
  width: clamp(260px, 32vw, 320px);
  flex-shrink: 0;
  background: linear-gradient(160deg, #1a4faa 0%, #0d3580 55%, #0a2a68 100%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  display: none !important;
}

/* Logo */
.logo-wrap {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  transition: transform 0.2s;
  cursor: pointer;
}
.brand-logo:hover { transform: scale(1.10); }

.brand-logo {
  width: 69px;
  height: 69px;
  object-fit: contain;
}

.brand-title {
  margin: 0 0 4px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.brand-sub {
  margin: 0;
  color: rgba(255, 255, 255, 0.96);
  font-size: 16px;
  line-height: 1.5;
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(255,255,255,0.14);
  margin: 24px 0;
}


.steps {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.step { display: flex; flex-direction: column; }

.connector {
  width: 2px;
  height: 26px;
  margin-left: 9px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
}
.connector.done { background: #22c55e; }
.connector.half { background: linear-gradient(to bottom, #22c55e 50%, rgba(255,255,255,0.2) 50%); }

.step-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}
.step-icon svg { width: 20px; height: 20px; }

.icon-active {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.icon-active span {
  color: #1a4faa;
  font-size: 9px;
  font-weight: 800;
}

.pulse-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.45);
  animation: pulse 1.8s ease-out infinite;
}

@keyframes pulse {
  0%   { transform: scale(1);   opacity: 1; }
  100% { transform: scale(1.7); opacity: 0; }
}

.icon-pending {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  border: 2px solid rgba(255,255,255,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-pending span {
  color: rgba(255,255,255,0.55);
  font-size: 9px;
  font-weight: 700;
}

.step-text { display: flex; flex-direction: column; gap: 1px; }

.step-number {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
}

.step-label {
  font-size: 12.5px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}
.step.pending .step-label {
  color: rgba(255,255,255,0.45);
  font-weight: 500;
}

/* Help */
.help-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 24px;
  width: 100%;
}

.help-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.7);
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.help-text { display: flex; flex-direction: column; gap: 1px; }
.help-title { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.55); }
.help-link {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.85);
  text-decoration: none;
}
.help-link:hover { color: #fff; text-decoration: underline; }

/* Deco polygon */
.deco {
  position: absolute;
  bottom: 50px;
  right: -18px;
  width: 110px;
  pointer-events: none;
}

.card-right {
  flex: 1;
  min-width: 0;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.form-title {
  margin: 0 0 4px;
  color: #042C83;
  font-size: 24px;
  font-weight: 900;
  line-height: 1.2;
}

.form-subtitle {
  margin: 0 0 22px;
  color: #7a8fae;
  font-size: 13px;
  line-height: 1.5;
}

/* Error alert */
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
.form-alert .bi { flex-shrink: 0; font-size: 14px; }

/* Fields */
.field-group { margin-bottom: 14px; }

.field-label {
  display: block;
  margin-bottom: 6px;
  color: #111d35;
  font-size: 12.5px;
  font-weight: 600;
}

.input-shell {
  display: flex;
  align-items: center;
  height: 44px;
  border: 1.5px solid #d0ddef;
  border-radius: 50px;
  padding: 0 12px;
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

.field-icon {
  color: #7a8fae;
  font-size: 14px;
  flex-shrink: 0;
}

.input-shell input {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  padding: 0 8px;
  color: #111d35;
  background: transparent;
  font-size: 13px;
  font-family: inherit;
}

.input-shell input::placeholder { color: #b5c5dc; }

.field-error {
  margin: 5px 0 0;
  color: #ef4444;
  font-size: 11.5px;
  line-height: 1.35;
}

/* Password grid */
.password-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.password-grid .field-group {
  min-width: 0;
  margin-bottom: 0;
}

/* Eye toggle */
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  padding: 0;
  color: #7a8fae;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.15s;
  flex-shrink: 0;
}
.icon-button:hover { color: #1a4faa; }

/* Terms */
.terms-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 14px 0 6px;
  color: #60718f;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  cursor: pointer;
}

.terms-row input[type="checkbox"] {
  width: 14px;
  height: 14px;
  margin-top: 2px;
  accent-color: #2b65cc;
  cursor: pointer;
  flex-shrink: 0;
}

.terms-link {
  color: #2b65cc;
  font-weight: 700;
  text-decoration: none;
}
.terms-link:hover { text-decoration: underline; }

.terms-error { margin: 0 0 12px 22px; }

/* Submit button */
.register-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 50px;
  color: #ffffff;
  background: linear-gradient(135deg, #2b65cc 0%, #1a4faa 100%);
  box-shadow: 0 4px 16px rgba(26,79,170,0.30), inset 0 1px 0 rgba(255,255,255,0.15);
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  margin-top: 16px;
  transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
}


.register-button:hover:not(:disabled) {
  opacity: 0.93;
  transform: translateY(-1px);
  box-shadow: 0 7px 22px rgba(26,79,170,0.36);
}

.register-button:active:not(:disabled) { transform: translateY(0); }
.register-button:disabled { cursor: wait; opacity: 0.62; }

/* Login row */
.login-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #edf2fb;
}

.login-hint { color: #7a8fae; font-size: 12.5px; }

.login-link {
  color: #2b65cc;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.15s;
}
.login-link:hover { opacity: 0.75; }

@media (max-width: 900px) {
  .two-card-wrapper {
    width: min(100%, 760px);
  }

  .card {
    padding: 34px 28px;
  }

  .card-left {
    width: 260px;
  }

  .password-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}

@media (max-width: 900px) {
  .register-page {
    align-items: flex-start;
    padding: 18px 12px;
  }

  .two-card-wrapper {
    flex-direction: column;
    border-radius: 20px;
  }

  .card-left {
    width: 100%;
    min-height: 0;
    padding: 18px 20px 20px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
  }

  .logo-wrap { width: 52px; height: 52px; border-radius: 14px; margin-bottom: 0; }
  .brand-logo { width: 40px; height: 40px; }
  .brand-title { font-size: 17px; }
  .brand-sub { display: none; }
  .divider { display: none; }

  .steps {
    flex-direction: row;
    width: 100%;
    gap: 0;
    align-items: center;
    justify-content: center;
    padding: 2px 6px 0;
  }

  .step {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex: 1 1 0;
    min-width: 0;
  }

  .step-row {
    align-items: center;
    flex: 0 0 auto;
    gap: 0;
  }

  .connector {
    flex: 1 1 auto;
    height: 2px;
    width: auto;
    margin: 0 8px 0 0;
    min-width: 20px;
  }

  .step-text { display: none; }
  .help-row { display: none; }
  .deco { display: none; }

  .card-right { padding: 28px 24px; }
}

@media (max-width: 480px) {
  .register-page {
    padding: 0;
  }

  .two-card-wrapper {
    min-height: 100vh;
    border-radius: 0;
  }

  .card-left {
    padding: 16px 18px 18px;
    gap: 12px;
  }

  .steps {
    padding-inline: 0;
  }

  .step {
    flex: 1 1 0;
    min-width: 0;
  }

  .step-row {
    gap: 0;
  }

  .connector {
    min-width: 16px;
    margin: 0 6px 0 0;
  }

  .input-shell {
    height: 46px;
    padding: 0 10px;
  }

  .password-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .login-row {
    flex-wrap: wrap;
    row-gap: 4px;
    text-align: center;
  }

  .card-right { padding: 24px 20px; }
}
</style>
