<template>
  <div class="profile-page">

    <!-- Section 1: Avatar -->
    <div class="profile-section">
      <h2 class="page-title">កាន់កំណត់ប្រវត្តិរូប</h2>
      <p class="page-subtitle">គ្រប់គ្រងការកំណត់គណនី និងតំឡើងប្រវត្តិរូបរបស់អ្នក</p>

      <div class="card">
        <p class="card-label">រូបភាពប្រវត្តិរូប</p>
        <div class="avatar-row">
          <div class="avatar-wrapper">
            <img v-if="avatarUrl" :src="avatarUrl" alt="Profile avatar" class="avatar-img" />
            <div v-else class="avatar-placeholder">
              <span>{{ initials }}</span>
            </div>
          </div>

          <div class="btn-group">
            <button class="btn btn-primary" @click="triggerUpload" :disabled="loadingAvatar">
              <span v-if="loadingAvatar" class="spinner"></span>
              <i v-else class="bi bi-upload"></i>
              ផ្លាស់រូបតំណាង
            </button>
            <button class="btn btn-danger" @click="removeAvatar" :disabled="!avatarUrl || loadingAvatar">
              <span v-if="loadingAvatar" class="spinner"></span>
              <i v-else class="bi bi-trash3"></i>
              លបរូបតំណាង
            </button>
          </div>

          <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="handleUpload" />
        </div>
      </div>
    </div>

    <!-- Section 2: Profile Info -->
    <div class="profile-info-section">
      <div class="card">

        <div class="card-header">
          <h3 class="card-title">តំឡើងប្រវត្តិរូប</h3>
          <button v-if="!isEditing" class="btn btn-edit" @click="startEdit">
            <i class="bi bi-pencil-square"></i>
            កែឡើង
          </button>
        </div>

        <!-- Name fields -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">ឈ្មោះ</label>
            <input
              v-model="form.fullName"
              type="text"
              class="form-input"
              :class="{ editable: isEditing }"
              placeholder="System Admin"
              :readonly="!isEditing"
            />
          </div>
          <div class="form-group">
            <label class="form-label">តួនាទី</label>
            <input
              :value="form.role"
              type="text"
              class="form-input"
              readonly
            />
          </div>
        </div>

        <!-- Registered date (read-only) -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">កាលបរិច្ឆេទចុះឈ្មោះ</label>
            <input
              :value="registeredAtFormatted"
              type="text"
              class="form-input"
              readonly
            />
          </div>
        </div>

        <Transition name="edit-actions">
          <div v-if="isEditing" class="edit-actions">
            <button class="btn btn-save" @click="saveEdit" :disabled="loadingSave">
              <span v-if="loadingSave" class="spinner"></span>
              <i v-else class="bi bi-check-lg"></i>
              រក្សាទុក
            </button>
            <button class="btn btn-cancel-edit" @click="cancelEdit" :disabled="loadingSave">
              <i class="bi bi-x-lg"></i>
              បោះបង់
            </button>
          </div>
        </Transition>

        <hr class="divider" />

        <!-- Password row -->
        <div class="info-row">
          <div class="info-left">
            <p class="info-title">ពាក្យសម្ងាត់</p>
            <p class="info-sub">ផ្លាស់ប្តូរពាក្យសម្ងាត់គណនីរបស់អ្នក</p>
          </div>
          <button class="btn btn-dark" @click="openPasswordForm" v-if="!showPasswordForm">
            <i class="bi bi-lock"></i>
            ប្តូរពាក្យសម្ងាត់
          </button>
          <button class="btn btn-cancel-edit" @click="closePasswordForm" v-else>
            <i class="bi bi-x-lg"></i>
            បោះបង់
          </button>
        </div>

        <!-- Inline password form -->
        <Transition name="edit-actions">
          <div v-if="showPasswordForm" class="password-form">
            <div class="form-group pw-field">
              <label class="form-label">ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
              <div class="input-eye">
                <input
                  v-model="passwordForm.current"
                  :type="showPasswords.current ? 'text' : 'password'"
                  class="form-input editable"
                  placeholder="••••••••"
                />
                <button class="eye-btn" @click="showPasswords.current = !showPasswords.current" type="button">
                  <i :class="showPasswords.current ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>
            <div class="form-group pw-field">
              <label class="form-label">ពាក្យសម្ងាត់ថ្មី</label>
              <div class="input-eye">
                <input
                  v-model="passwordForm.newPass"
                  :type="showPasswords.newPass ? 'text' : 'password'"
                  class="form-input editable"
                  placeholder="••••••••"
                />
                <button class="eye-btn" @click="showPasswords.newPass = !showPasswords.newPass" type="button">
                  <i :class="showPasswords.newPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>
            <div class="form-group pw-field">
              <label class="form-label">បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
              <div class="input-eye">
                <input
                  v-model="passwordForm.confirm"
                  :type="showPasswords.confirm ? 'text' : 'password'"
                  class="form-input editable"
                  :class="{ 'input-error': passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass }"
                  placeholder="••••••••"
                />
                <button class="eye-btn" @click="showPasswords.confirm = !showPasswords.confirm" type="button">
                  <i :class="showPasswords.confirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <span v-if="passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass" class="error-hint">
                ពាក្យសម្ងាត់មិនត្រូវគ្នា
              </span>
            </div>
            <button class="btn btn-save" @click="submitChangePassword" :disabled="loadingPassword">
              <span v-if="loadingPassword" class="spinner"></span>
              <i v-else class="bi bi-check-lg"></i>
              រក្សាទុក
            </button>
          </div>
        </Transition>

        <hr class="divider" />

        <!-- Email row -->
        <div class="info-row">
          <div class="info-left">
            <p class="info-title">អ៊ីមែល</p>
            <p class="info-sub">{{ form.email }}</p>
          </div>
          <button class="btn btn-primary" @click="openEmailForm" v-if="!showEmailForm">
            <i class="bi bi-envelope"></i>
            ផ្លាស់ប្តូរអ៊ីមែល
          </button>
          <button class="btn btn-cancel-edit" @click="closeEmailForm" v-else>
            <i class="bi bi-x-lg"></i>
            បោះបង់
          </button>
        </div>

        <!-- Inline change email form -->
        <Transition name="edit-actions">
          <div v-if="showEmailForm" class="password-form">

            <!-- Step 1: Request -->
            <template v-if="emailStep === 1">
              <p class="step-hint">បញ្ចូលអ៊ីមែលថ្មី និងពាក្យសម្ងាត់បច្ចុប្បន្នរបស់អ្នក</p>
              <div class="form-group pw-field">
                <label class="form-label">អ៊ីមែលថ្មី</label>
                <input
                  v-model="emailForm.newEmail"
                  type="email"
                  class="form-input editable"
                  placeholder="example@email.com"
                />
              </div>
              <div class="form-group pw-field">
                <label class="form-label">ពាក្យសម្ងាត់</label>
                <div class="input-eye">
                  <input
                    v-model="emailForm.password"
                    :type="showEmailPassword ? 'text' : 'password'"
                    class="form-input editable"
                    placeholder="••••••••"
                  />
                  <button class="eye-btn" @click="showEmailPassword = !showEmailPassword" type="button">
                    <i :class="showEmailPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>
              <button class="btn btn-save" @click="requestChangeEmail" :disabled="loadingEmail">
                <span v-if="loadingEmail" class="spinner"></span>
                <i v-else class="bi bi-send"></i>
                ផ្ញើលេខកូដផ្ទៀងផ្ទាត់
              </button>
            </template>

            <!-- Step 2: Verify OTP token -->
            <template v-else-if="emailStep === 2">
              <p class="step-hint">លេខកូដត្រូវបានផ្ញើទៅ <strong>{{ emailForm.newEmail }}</strong></p>
              <div class="form-group pw-field">
                <label class="form-label">Token ផ្ទៀងផ្ទាត់</label>
                <input
                  v-model="emailForm.token"
                  type="text"
                  class="form-input editable"
                  placeholder="បញ្ចូល token ពីអ៊ីមែល"
                />
              </div>
              <div class="edit-actions" style="margin-bottom: 0">
                <button class="btn btn-save" @click="verifyChangeEmail" :disabled="loadingEmail">
                  <span v-if="loadingEmail" class="spinner"></span>
                  <i v-else class="bi bi-check-lg"></i>
                  បញ្ជាក់
                </button>
                <button class="btn btn-cancel-edit" @click="emailStep = 1" :disabled="loadingEmail">
                  <i class="bi bi-arrow-left"></i>
                  ត្រឡប់ក្រោយ
                </button>
              </div>
            </template>

          </div>
        </Transition>

      </div>
    </div>

    <!-- Section 3: Danger Zone -->
    <div class="danger-zone-section">
      <div class="danger-card">
        <div class="danger-left">
          <p class="danger-title">Danger Zone</p>
          <p class="danger-sub">Permanently remove your account and all associated data</p>
        </div>
        <button class="btn-delete" @click="confirmDelete" :disabled="loadingDelete">
          <span v-if="loadingDelete" class="spinner spinner--dark"></span>
          <i v-else class="bi bi-trash3"></i>
          Delete Account
        </button>
      </div>
    </div>

    <!-- ── Confirm Delete Modal ── -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <div class="modal-icon">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <p class="modal-title">Delete Account?</p>
          <p class="modal-sub">This action cannot be undone. All your data will be permanently removed.</p>
          <div class="modal-actions">
            <button class="btn-modal-cancel" @click="showModal = false" :disabled="loadingDelete">Cancel</button>
            <button class="btn-modal-confirm" @click="deleteAccount" :disabled="loadingDelete">
              <span v-if="loadingDelete" class="spinner"></span>
              <span v-else>Yes, Delete</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Toast notification ── -->
    <Transition name="toast">
      <div v-if="toast.show" :class="['toast', `toast--${toast.type}`]">
        <i :class="['bi', toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill']"></i>
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import api from '@/api/api'
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ── Toast ──────────────────────────────────────────────────────────────────
const toast = reactive({ show: false, message: '', type: 'success' })
let toastTimer = null

function showToast(message, type = 'success') {
  clearTimeout(toastTimer)
  toast.message = message
  toast.type = type
  toast.show = true
  toastTimer = setTimeout(() => (toast.show = false), 3000)
}

// ── Loading states ─────────────────────────────────────────────────────────
const loadingAvatar   = ref(false)
const loadingSave     = ref(false)
const loadingPassword = ref(false)
const loadingDelete   = ref(false)
const loadingEmail    = ref(false)

// ── Form ───────────────────────────────────────────────────────────────────
const form = reactive({
  fullName: '',
  email: '',
  role: '',
  registeredAt: '',
})
const original = reactive({ ...form })

// ── Avatar ─────────────────────────────────────────────────────────────────
const avatarUrl = ref(null)
const fileInput = ref(null)

const initials = computed(() => {
  const parts = form.fullName?.trim().split(/\s+/) ?? []
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  if (parts.length === 1 && parts[0]) return parts[0][0].toUpperCase()
  return 'អ'
})

const registeredAtFormatted = computed(() => {
  if (!form.registeredAt) return '—'
  return new Date(form.registeredAt).toLocaleDateString('km-KH', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
})

function triggerUpload() {
  fileInput.value?.click()
}

// PUT /auth/profile/avatar  (multipart/form-data)
async function handleUpload(event) {
  const file = event.target.files[0]
  event.target.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    showToast('សូមជ្រើសរើសឯកសាររូបភាពត្រឹមត្រូវ។', 'error')
    return
  }
  loadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await api.put('auth/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const newAvatar = res.data?.data?.avatar ?? res.data?.avatar
    avatarUrl.value = newAvatar ?? URL.createObjectURL(file)
    showToast('រូបភាពប្រវត្តិរូបត្រូវបានធ្វើបច្ចុប្បន្នភាព!')
  } catch (err) {
    console.error('Upload avatar failed:', err)
    showToast('មិនអាចផ្ទុករូបភាពបានទេ។', 'error')
  } finally {
    loadingAvatar.value = false
  }
}

// DELETE /auth/profile/avatar
async function removeAvatar() {
  if (!avatarUrl.value) return
  loadingAvatar.value = true
  try {
    await api.delete('auth/profile/avatar')
    avatarUrl.value = null
    showToast('រូបភាពប្រវត្តិរូបត្រូវបានលុប។')
  } catch (err) {
    console.error('Delete avatar failed:', err)
    showToast('មិនអាចលុបរូបភាពបានទេ។', 'error')
  } finally {
    loadingAvatar.value = false
  }
}

// ── Profile edit ───────────────────────────────────────────────────────────
const isEditing = ref(false)

function startEdit() {
  Object.assign(original, form)
  isEditing.value = true
}

function cancelEdit() {
  Object.assign(form, original)
  isEditing.value = false
}

// PUT /auth/profile
async function saveEdit() {
  if (!form.fullName.trim()) {
    showToast('សូមបញ្ចូលឈ្មោះ។', 'error')
    return
  }
  loadingSave.value = true
  try {
    await api.put('auth/profile', { fullName: form.fullName.trim() })
    Object.assign(original, form)
    isEditing.value = false
    showToast('ព័ត៌មានប្រវត្តិរូបត្រូវបានរក្សាទុក!')
  } catch (err) {
    console.error('Update profile failed:', err)
    showToast('មិនអាចរក្សាទុកបានទេ។', 'error')
  } finally {
    loadingSave.value = false
  }
}

// ── Change password (inline form) ──────────────────────────────────────────
const showPasswordForm = ref(false)
const passwordForm = reactive({ current: '', newPass: '', confirm: '' })
const showPasswords = reactive({ current: false, newPass: false, confirm: false })

function openPasswordForm() {
  Object.assign(passwordForm, { current: '', newPass: '', confirm: '' })
  Object.assign(showPasswords, { current: false, newPass: false, confirm: false })
  showPasswordForm.value = true
}

function closePasswordForm() {
  showPasswordForm.value = false
}

// PUT /auth/change-password
async function submitChangePassword() {
  if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
    showToast('សូមបំពេញព័ត៌មានទាំងអស់។', 'error')
    return
  }
  if (passwordForm.newPass !== passwordForm.confirm) {
    showToast('ពាក្យសម្ងាត់ថ្មីមិនត្រូវគ្នាទេ។', 'error')
    return
  }
  if (passwordForm.newPass.length < 6) {
    showToast('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 6 តួអក្សរ។', 'error')
    return
  }
  loadingPassword.value = true
  try {
    await api.put('auth/change-password', {
      currentPassword: passwordForm.current,
      newPassword:     passwordForm.newPass,
    })
    showPasswordForm.value = false
    showToast('ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរ!')
  } catch (err) {
    console.error('Change password failed:', err)
    const msg = err.response?.data?.message ?? 'មិនអាចផ្លាស់ប្តូរពាក្យសម្ងាត់បានទេ។'
    showToast(msg, 'error')
  } finally {
    loadingPassword.value = false
  }
}

// ── Change email (2-step: request → verify) ────────────────────────────────
const showEmailForm   = ref(false)
const emailStep       = ref(1)   // 1 = request, 2 = verify
const showEmailPassword = ref(false)
const emailForm = reactive({ newEmail: '', password: '', token: '' })

function openEmailForm() {
  Object.assign(emailForm, { newEmail: '', password: '', token: '' })
  showEmailPassword.value = false
  emailStep.value = 1
  showEmailForm.value = true
}

function closeEmailForm() {
  showEmailForm.value = false
}

// POST /auth/change-email/request  { newEmail, password }
async function requestChangeEmail() {
  if (!emailForm.newEmail || !emailForm.password) {
    showToast('សូមបំពេញព័ត៌មានទាំងអស់។', 'error')
    return
  }
  loadingEmail.value = true
  try {
    await api.post('auth/change-email/request', {
      newEmail: emailForm.newEmail,
      password: emailForm.password,
    })
    emailStep.value = 2
    showToast('លេខកូដផ្ទៀងផ្ទាត់ត្រូវបានផ្ញើ!')
  } catch (err) {
    console.error('Request change email failed:', err)
    const msg = err.response?.data?.message ?? 'មិនអាចផ្ញើលេខកូដបានទេ។'
    showToast(msg, 'error')
  } finally {
    loadingEmail.value = false
  }
}

// POST /auth/change-email/verify  { token }
async function verifyChangeEmail() {
  if (!emailForm.token) {
    showToast('សូមបញ្ចូល token ផ្ទៀងផ្ទាត់។', 'error')
    return
  }
  loadingEmail.value = true
  try {
    await api.post('auth/change-email/verify', { token: emailForm.token })
    form.email = emailForm.newEmail
    showEmailForm.value = false
    showToast('អ៊ីមែលត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!')
  } catch (err) {
    console.error('Verify change email failed:', err)
    const msg = err.response?.data?.message ?? 'Token មិនត្រឹមត្រូវ ឬផុតកំណត់ហើយ។'
    showToast(msg, 'error')
  } finally {
    loadingEmail.value = false
  }
}

// ── Danger zone ────────────────────────────────────────────────────────────
const showModal = ref(false)

function confirmDelete() {
  showModal.value = true
}

// DELETE /auth/profile  →  clear token  →  redirect /login
async function deleteAccount() {
  loadingDelete.value = true
  try {
    await api.delete('auth/profile')
    localStorage.removeItem('token')
    showModal.value = false
    router.push('/login')
  } catch (err) {
    console.error('Delete account failed:', err)
    showModal.value = false
    const msg = err.response?.data?.message ?? 'មិនអាចលុបគណនីបានទេ។'
    showToast(msg, 'error')
  } finally {
    loadingDelete.value = false
  }
}

// ── Fetch profile on mount ─────────────────────────────────────────────────
async function fetchProfile() {
  try {
    const res  = await api.get('auth/profile')
    const data = res.data?.data ?? res.data

    form.fullName     = data.fullName     ?? ''
    form.email        = data.email        ?? ''
    form.role         = data.role?.name   ?? ''
    form.registeredAt = data.registeredAt ?? ''

    if (data.avatar) avatarUrl.value = data.avatar
  } catch (err) {
    console.error('Failed to fetch profile:', err)
    showToast('មិនអាចទាញយកទិន្នន័យប្រវត្តិរូបបានទេ។', 'error')
  }
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile-page {
  font-family: 'Kantumruy Pro', 'Khmer OS', 'Hanuman', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
}

/* ── Section 1 ── */
.profile-section {
  padding: 1.5rem 0 0;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* ── Shared Card ── */
.card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.5rem 1.75rem;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.card-label {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 1rem;
}

/* ── Avatar ── */
.avatar-row {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.avatar-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e5e7eb;
  flex-shrink: 0;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.avatar-wrapper:hover {
  border-color: #1a6ef7;
  transform: scale(1.04);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.avatar-wrapper:hover .avatar-img {
  transform: scale(1.06);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #1d4ed8;
}

.btn-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* ── Section 2 ── */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
}

.form-row {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 200px;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.form-input {
  border: 1.5px solid #d1d5db;
  border-radius: 999px;
  padding: 10px 18px;
  font-size: 14px;
  font-family: inherit;
  color: #1a1a2e;
  background: #f9fafb;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.form-input[readonly] {
  color: #6b7280;
  cursor: default;
}

.form-input.editable {
  background: #ffffff;
  color: #1a1a2e;
  border-color: #1a6ef7;
  box-shadow: 0 0 0 3px rgba(26, 110, 247, 0.12);
}

.form-input:not([readonly]):focus {
  border-color: #1a6ef7;
  box-shadow: 0 0 0 3px rgba(26, 110, 247, 0.12);
}

/* Edit actions with transition */
.edit-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 1.25rem;
}

.edit-actions-enter-active,
.edit-actions-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.edit-actions-enter-from,
.edit-actions-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.25rem 0;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-left {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
}

.info-sub {
  font-size: 13px;
  color: #6b7280;
}

/* Step hint inside email form */
.step-hint {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 0.25rem;
  line-height: 1.6;
}

/* ── Section 3: Danger Zone ── */
.danger-card {
  background: #fff5f5;
  border: 1.5px solid #fed7d7;
  border-radius: 14px;
  padding: 1.25rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  transition: box-shadow 0.2s ease;
}

.danger-card:hover {
  box-shadow: 0 4px 16px rgba(229, 62, 62, 0.08);
}

.danger-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.danger-title {
  font-size: 16px;
  font-weight: 700;
  color: #c53030;
  margin: 0;
}

.danger-sub {
  font-size: 13px;
  color: #9b2c2c;
  margin: 0;
}

.btn-delete {
  background: #e53e3e;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 11px 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.2s ease;
  white-space: nowrap;
}

.btn-delete:hover:not(:disabled) {
  background: #c53030;
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.35);
}

.btn-delete:active:not(:disabled) {
  transform: scale(0.97);
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

.modal {
  background: #ffffff;
  border-radius: 18px;
  padding: 2rem;
  max-width: 380px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.modal-icon {
  width: 56px;
  height: 56px;
  background: #fff5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #e53e3e;
  margin-bottom: 0.25rem;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.modal-sub {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 0.5rem;
  width: 100%;
}

.btn-modal-cancel {
  flex: 1;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 999px;
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-modal-confirm {
  flex: 1;
  background: #e53e3e;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 100px;
}

.btn-modal-cancel:hover:not(:disabled)  { background: #e5e7eb; }
.btn-modal-confirm:hover:not(:disabled) { background: #c53030; }
.btn-modal-cancel:disabled,
.btn-modal-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.88);
  opacity: 0;
}

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
}

.toast--success {
  background: #1a6ef7;
  color: #ffffff;
}

.toast--error {
  background: #e53e3e;
  color: #ffffff;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}

/* ── Shared Buttons ── */
.btn {
  border: none;
  border-radius: 999px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: opacity 0.15s ease, transform 0.1s ease, box-shadow 0.2s ease;
  white-space: nowrap;
}

.btn:hover:not(:disabled)  { opacity: 0.88; }
.btn:active:not(:disabled) { transform: scale(0.97); }

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.btn-primary { background: #1a6ef7; color: #ffffff; }
.btn-primary:hover:not(:disabled) { box-shadow: 0 4px 12px rgba(26, 110, 247, 0.35); opacity: 1; }

.btn-danger  { background: #e53e3e; color: #ffffff; }
.btn-dark    { background: #4b5563; color: #ffffff; }
.btn-edit    { background: #e5e7eb; color: #374151; }
.btn-save    { background: #1a6ef7; color: #ffffff; }

.btn-cancel-edit {
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 999px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: background 0.15s ease;
}
.btn-cancel-edit:hover:not(:disabled) { background: #e5e7eb; }

/* ── Spinner ── */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}

.spinner--dark {
  border-color: rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Inline password / email form ── */
.password-form {
  margin-top: 1rem;
  padding: 1.25rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pw-field {
  min-width: unset;
  flex: unset;
}

/* Eye-toggle input wrapper */
.input-eye {
  position: relative;
  display: flex;
  align-items: center;
}

.input-eye .form-input {
  width: 100%;
  padding-right: 44px;
  box-sizing: border-box;
}

.eye-btn {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  font-size: 16px;
  padding: 0;
  line-height: 1;
  transition: color 0.15s ease;
}

.eye-btn:hover { color: #374151; }

/* Error state on confirm field */
.form-input.input-error {
  border-color: #e53e3e !important;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.12) !important;
}

.error-hint {
  font-size: 12px;
  color: #e53e3e;
  margin-top: 2px;
}
</style>