<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import AuthTimelineSidebar from '@/components/auth/AuthTimelineSidebar.vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const sidebarSteps = [
  { id: 1, label: 'បំពេញអុីមែល', status: 'active' },
  { id: 2, label: 'ទទួលការផ្ញើសារ​ ឬToken', status: 'pending' },
  { id: 3, label: 'បំពេញពាក្យសម្ងាត់ថ្មី', status: 'pending' },
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const form = reactive({
  email: '',
})

const errors = reactive({
  email: '',
})

const loading = ref(false)
const apiError = ref('')

const validateEmail = () => {
  errors.email = ''

  if (!form.email.trim()) {
    errors.email = 'សូមបញ្ចូលអ៊ីមែលរបស់អ្នក។'
  } else if (!emailPattern.test(form.email.trim())) {
    errors.email = 'សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ។'
  }

  return !errors.email
}

const handleForgetPassword = async () => {
  apiError.value = ''
  if (!validateEmail()) return

  loading.value = true

  try {
    await authStore.forgotPassword({
      email: form.email.trim(),
    })

    await Swal.fire({
      icon: 'success',
      title: 'ផ្ញើបានជោគជ័យ',
      text: 'សូមបន្តកំណត់ពាក្យសម្ងាត់ថ្មី',
      timer: 1500,
      showConfirmButton: false,
    })

  } catch (error) {
    apiError.value =
      authStore.errorMsg ||
      error?.response?.data?.message ||
      error?.message ||
      'មិនអាចផ្ញើ Token បានទេ។ សូមព្យាយាមម្តងទៀត។'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-centered">
    <section class="auth-wrapper" aria-label="Forgot password">
      <AuthTimelineSidebar :steps="sidebarSteps" />

      <div class="auth-card">
      <div class="icon-circle">
        <i class="bi bi-envelope-check" aria-hidden="true"></i>
      </div>

      <h1 class="auth-title">ភ្លេចពាក្យសម្ងាត់?</h1>
      <p class="auth-subtitle  fw-semibold">
        បញ្ចូលអ៊ីមែលរបស់អ្នក ដើម្បីទទួល Token សម្រាប់កំណត់ពាក្យសម្ងាត់ថ្មី
      </p>

      <form class="auth-form" @submit.prevent="handleForgetPassword" novalidate>
        <div v-if="apiError" class="api-error-alert" role="alert">
          {{ apiError }}
        </div>

        <div class="form-group">
          <label class="form-label-custom" for="email">អ៊ីមែល</label>
          <div class="input-group" :class="{ 'is-invalid': errors.email }">
            <span class="input-icon-left">
              <i class="bi bi-envelope" aria-hidden="true"></i>
            </span>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              class="form-control-glass"
              autocomplete="email"
              placeholder="example@gmail.com"
              :disabled="loading"
              @input="errors.email = ''"
            />
          </div>
          <small v-if="errors.email" class="error-text">{{ errors.email }}</small>
        </div>

        <button type="submit" class="btn-primary-custom" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status"></span>
          <span v-else>ផ្ញើសារចូលអុីមែល</span>
        </button>
      </form>

      <p class="back-text">
        <RouterLink :to="{ name: 'login' }" class="back-link">
          <i class="bi bi-arrow-left" aria-hidden="true"></i>
          ត្រឡប់ទៅបង្កើតគណនី
        </RouterLink>
      </p>
      </div>
    </section>
  </main>
</template>

<style scoped>

.auth-centered {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  background: #eef3fa;
  font-family: inherit;
}

.auth-wrapper {
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


.icon-circle {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  border-radius: 50%;
  color: #16a34a;
  background: #eaf8ef;
  border: 1px solid #bde8cb;
  font-size: 20px;
}

.auth-title {
  margin: 0;
  color: #151a2d;
  font-size: 24px;
  font-weight: 900;
  line-height: 1.25;
  text-align: center;
}

.auth-subtitle {
  margin: 8px 0 22px;
  color: #8b9bb0;
  font-size: 10.5px;
  line-height: 1.55;
  text-align: center;
}

.auth-form {
  display: grid;
  gap: 14px;
  text-align: left;
}

.api-error-alert {
  padding: 9px 12px;
  border: 1px solid #fecdd3;
  border-radius: 10px;
  color: #be123c;
  background: #fff1f2;
  font-size: 12px;
  line-height: 1.4;
}

.form-label-custom {
  display: block;
  margin: 0 0 7px 2px;
  color: #64748b;
  font-size: 10px;
  font-weight: 600;
}

.input-group {
  display: flex;
  align-items: center;
  height: 38px;
  border: 1.5px solid #657996;
  border-radius: 999px;
  padding: 0 13px;
  background: #ffffff;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
}

.input-group:focus-within {
  border-color: #2d57b7;
  box-shadow: 0 0 0 3px rgba(45, 87, 183, 0.13);
}

.input-group.is-invalid {
  border-color: #ef4444;
  background: #fff7f7;
}

.input-icon-left {
  flex-shrink: 0;
  color: #9aacbf;
  font-size: 13px;
}

.form-control-glass {
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

.form-control-glass::placeholder {
  color: #b7c3d3;
}

.form-control-glass:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.error-text {
  display: block;
  margin: 5px 0 0 2px;
  color: #ef4444;
  font-size: 10px;
  line-height: 1.35;
}

.btn-primary-custom {
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


.btn-primary-custom:hover:not(:disabled) {
  opacity: 0.93;
  transform: translateY(-1px);
  box-shadow: 0 7px 22px rgba(26,79,170,0.36);
}

.btn-primary-custom:active:not(:disabled) { transform: translateY(0); }
.btn-primary-custom:disabled { cursor: wait; opacity: 0.62; }




.back-text {
  margin: 18px 0 0;
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #657996;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  color: #2d57b7;
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
  .auth-centered {
    padding: 24px 14px;
  }

  .auth-card {
    padding: 24px 20px;
  }
}
</style>
