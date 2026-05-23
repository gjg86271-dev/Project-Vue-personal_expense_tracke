<template>
  <div class="profile-page">

    <!-- Hero header -->
    <div class="profile-hero">
      <div class="hero-bg">
        <div class="hero-orb hero-orb--1"></div>
        <div class="hero-orb hero-orb--2"></div>
        <div class="hero-orb hero-orb--3"></div>
      </div>
      <div class="hero-content">
        <div class="avatar-ring" @click="triggerUpload">
          <div class="avatar-inner">
            <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" class="avatar-img" />
            <span v-else class="avatar-initials">{{ initials }}</span>
          </div>
          <div class="avatar-edit-badge">
            <i class="bi bi-camera-fill"></i>
          </div>
          <div class="avatar-ring-glow"></div>
        </div>
        <div class="hero-info">
          <h1 class="hero-name">{{ form.fullName || '—' }}</h1>
          <div class="hero-meta">
            <span class="hero-role-badge">
              <i class="bi bi-shield-fill-check"></i>
              {{ form.role || '—' }}
            </span>
            <span class="hero-email">{{ form.email }}</span>
          </div>
          <p class="hero-since">
            <i class="bi bi-calendar3"></i>
            ចុះឈ្មោះ {{ registeredAtFormatted }}
          </p>
        </div>
        <div class="hero-actions">
          <button class="hero-btn hero-btn--upload" @click="triggerUpload" :disabled="loadingAvatar">
            <span v-if="loadingAvatar" class="spinner"></span>
            <i v-else class="bi bi-upload"></i>
            ផ្លាស់រូប
          </button>
          <button class="hero-btn hero-btn--remove" @click="removeAvatar" :disabled="!avatarUrl || loadingAvatar">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
      <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleUpload" />
    </div>

    <!-- Cards grid -->
    <div class="cards-grid">

      <!-- Profile Info Card -->
      <div class="glass-card">
        <div class="glass-card__head">
          <div class="glass-card__title-group">
            <div class="glass-card__icon glass-card__icon--blue">
              <i class="bi bi-person-lines-fill"></i>
            </div>
            <h3 class="glass-card__title">ប្រវត្តិរូប</h3>
          </div>
          <button v-if="!isEditing" class="pill-btn pill-btn--ghost" @click="startEdit">
            <i class="bi bi-pencil"></i> កែប្រែ
          </button>
        </div>
        <div class="field-stack">
          <div class="field-item">
            <label class="field-label">ឈ្មោះពេញ</label>
            <div class="field-input-wrap" :class="{ 'field-input-wrap--active': isEditing }">
              <i class="bi bi-person field-icon"></i>
              <input v-model="form.fullName" type="text" class="field-input" placeholder="System Admin" :readonly="!isEditing" />
            </div>
          </div>
          <div class="field-item">
            <label class="field-label">តួនាទី</label>
            <div class="field-input-wrap">
              <i class="bi bi-shield-check field-icon"></i>
              <input :value="form.role" type="text" class="field-input" readonly />
            </div>
          </div>
          <div class="field-item">
            <label class="field-label">កាលបរិច្ឆេទចុះឈ្មោះ</label>
            <div class="field-input-wrap">
              <i class="bi bi-calendar3 field-icon"></i>
              <input :value="registeredAtFormatted" type="text" class="field-input" readonly />
            </div>
          </div>
        </div>
        <Transition name="slide-up">
          <div v-if="isEditing" class="action-row">
            <button class="pill-btn pill-btn--primary" @click="saveEdit" :disabled="loadingSave">
              <span v-if="loadingSave" class="spinner"></span>
              <i v-else class="bi bi-check-lg"></i>
              រក្សាទុក
            </button>
            <button class="pill-btn pill-btn--ghost" @click="cancelEdit" :disabled="loadingSave">
              <i class="bi bi-x-lg"></i> បោះបង់
            </button>
          </div>
        </Transition>
      </div>

      <!-- Password Card -->
      <div class="glass-card">
        <div class="glass-card__head">
          <div class="glass-card__title-group">
            <div class="glass-card__icon glass-card__icon--purple">
              <i class="bi bi-lock-fill"></i>
            </div>
            <h3 class="glass-card__title">ពាក្យសម្ងាត់</h3>
          </div>
          <button v-if="!showPasswordForm" class="pill-btn pill-btn--ghost" @click="openPasswordForm">
            <i class="bi bi-arrow-repeat"></i> ប្ដូរ
          </button>
          <button v-else class="pill-btn pill-btn--ghost" @click="closePasswordForm">
            <i class="bi bi-x-lg"></i> បោះបង់
          </button>
        </div>
        <div v-if="!showPasswordForm" class="card-idle">
          <div class="idle-dots">
            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
          <p class="idle-hint">ផ្លាស់ប្ដូរពាក្យសម្ងាត់គណនីរបស់អ្នក</p>
        </div>
        <Transition name="slide-up">
          <div v-if="showPasswordForm" class="field-stack">
            <div class="field-item" v-for="(cfg, key) in pwFields" :key="key">
              <label class="field-label">{{ cfg.label }}</label>
              <div class="field-input-wrap field-input-wrap--active">
                <i class="bi bi-key field-icon"></i>
                <input
                  v-model="passwordForm[key]"
                  :type="showPasswords[key] ? 'text' : 'password'"
                  class="field-input"
                  :class="{ 'field-input--error': key === 'confirm' && passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass }"
                  placeholder="••••••••"
                />
                <button class="eye-btn" type="button" @click="showPasswords[key] = !showPasswords[key]">
                  <i :class="showPasswords[key] ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <span v-if="key === 'confirm' && passwordForm.confirm && passwordForm.confirm !== passwordForm.newPass" class="field-error">
                ពាក្យសម្ងាត់មិនត្រូវគ្នា
              </span>
            </div>
            <div class="action-row">
              <button class="pill-btn pill-btn--primary" @click="submitChangePassword" :disabled="loadingPassword">
                <span v-if="loadingPassword" class="spinner"></span>
                <i v-else class="bi bi-check-lg"></i>
                រក្សាទុក
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Email Card -->
      <div class="glass-card">
        <div class="glass-card__head">
          <div class="glass-card__title-group">
            <div class="glass-card__icon glass-card__icon--teal">
              <i class="bi bi-envelope-fill"></i>
            </div>
            <h3 class="glass-card__title">អ៊ីមែល</h3>
          </div>
          <button v-if="!showEmailForm" class="pill-btn pill-btn--ghost" @click="openEmailForm">
            <i class="bi bi-arrow-repeat"></i> ប្ដូរ
          </button>
          <button v-else class="pill-btn pill-btn--ghost" @click="closeEmailForm">
            <i class="bi bi-x-lg"></i> បោះបង់
          </button>
        </div>
        <div v-if="!showEmailForm" class="card-idle">
          <div class="email-display">
            <i class="bi bi-envelope-check-fill email-display__icon"></i>
            <span class="email-display__text">{{ form.email }}</span>
          </div>
        </div>
        <Transition name="slide-up">
          <div v-if="showEmailForm">
            <div v-if="emailStep === 1" class="field-stack">
              <div class="step-indicator">
                <span class="step-dot step-dot--active">1</span>
                <span class="step-line"></span>
                <span class="step-dot">2</span>
                <span class="step-label">បញ្ចូលអ៊ីមែលថ្មី</span>
              </div>
              <div class="field-item">
                <label class="field-label">អ៊ីមែលថ្មី</label>
                <div class="field-input-wrap field-input-wrap--active">
                  <i class="bi bi-envelope field-icon"></i>
                  <input v-model="emailForm.newEmail" type="email" class="field-input" placeholder="example@email.com" />
                </div>
              </div>
              <div class="field-item">
                <label class="field-label">ពាក្យសម្ងាត់</label>
                <div class="field-input-wrap field-input-wrap--active">
                  <i class="bi bi-key field-icon"></i>
                  <input v-model="emailForm.password" :type="showEmailPassword ? 'text' : 'password'" class="field-input" placeholder="••••••••" />
                  <button class="eye-btn" type="button" @click="showEmailPassword = !showEmailPassword">
                    <i :class="showEmailPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>
              <p class="step-hint" style="margin-top: 0;">
                <i class="bi bi-info-circle" style="color: #06b6d4;"></i>
                លិខិតបញ្ជាក់នឹងត្រូវបានផ្ញើទៅអ៊ីមែលថ្មីរបស់អ្នក។ សូមចុចលើតំណនៅក្នុងអ៊ីមែលដើម្បីបញ្ជាក់។
              </p>
              <div class="action-row">
                <button class="pill-btn pill-btn--primary" @click="requestChangeEmail" :disabled="loadingEmail">
                  <span v-if="loadingEmail" class="spinner"></span>
                  <i v-else class="bi bi-send"></i>
                  ផ្ញើតំណបញ្ជាក់
                </button>
              </div>
            </div>
            <div v-else-if="emailStep === 2" class="field-stack">
              <div class="step-indicator">
                <span class="step-dot step-dot--done"><i class="bi bi-check"></i></span>
                <span class="step-line step-line--done"></span>
                <span class="step-dot step-dot--active">2</span>
                <span class="step-label">រង់ចាំការបញ្ជាក់</span>
              </div>
              <div class="email-sent-box">
                <div class="email-sent-icon"><i class="bi bi-envelope-paper-fill"></i></div>
                <p class="email-sent-title">សូមពិនិត្យអ៊ីមែលរបស់អ្នក</p>
                <p class="email-sent-desc">
                  យើងបានផ្ញើតំណបញ្ជាក់ទៅ<br/>
                  <strong>{{ emailForm.newEmail }}</strong><br/>
                  សូមចុចលើតំណនៅក្នុងអ៊ីមែលដើម្បីបញ្ចប់ការផ្លាស់ប្ដូរ។
                </p>
              </div>
              <div class="action-row">
                <button class="pill-btn pill-btn--ghost" @click="emailStep = 1" :disabled="loadingEmail">
                  <i class="bi bi-arrow-left"></i> ផ្លាស់ប្ដូរអ៊ីមែល
                </button>
                <button class="pill-btn pill-btn--ghost" @click="requestChangeEmail" :disabled="loadingEmail">
                  <span v-if="loadingEmail" class="spinner"></span>
                  <i v-else class="bi bi-arrow-clockwise"></i>
                  ផ្ញើម្ដងទៀត
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>

     
    </div>

    <!-- ── Success Alert Modal ── -->
    <Transition name="modal">
      <div v-if="successAlert.show" class="modal-overlay" @click.self="successAlert.show = false">
        <div class="modal-box modal-box--success">
          <div class="success-icon-wrap">
            <div class="success-icon-ring">
              <i :class="['bi', successAlert.icon]"></i>
            </div>
          </div>
          <h3 class="modal-title">{{ successAlert.title }}</h3>
          <p class="modal-body">{{ successAlert.message }}</p>
          <div class="modal-actions">
            <button class="pill-btn pill-btn--success-ok" @click="successAlert.show = false">
              <i class="bi bi-check-lg"></i> យល់ព្រម
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-box">
          <div class="modal-icon-wrap">
            <i class="bi bi-exclamation-triangle-fill"></i>
          </div>
          <h3 class="modal-title">Delete Account?</h3>
          <p class="modal-body">This action cannot be undone. All your data will be permanently removed.</p>
          <div class="modal-actions">
            <button class="pill-btn pill-btn--ghost" @click="showModal = false" :disabled="loadingDelete">Cancel</button>
            <button class="pill-btn pill-btn--danger" @click="deleteAccount" :disabled="loadingDelete">
              <span v-if="loadingDelete" class="spinner"></span>
              <span v-else>Yes, Delete</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Email Verified Success Modal -->
    <Transition name="modal">
      <div v-if="showEmailVerifiedModal" class="modal-overlay">
        <div class="modal-box modal-box--success">
          <div class="success-icon-wrap">
            <div class="success-icon-ring">
              <i class="bi bi-envelope-check-fill"></i>
            </div>
          </div>
          <h3 class="modal-title">អ៊ីមែលបានផ្លាស់ប្ដូរ!</h3>
          <p class="modal-body">
            អ៊ីមែលរបស់អ្នកត្រូវបានផ្លាស់ប្ដូរទៅ<br/>
            <strong style="color: #06b6d4;">{{ verifiedNewEmail }}</strong>
          </p>
          <div class="modal-actions">
            <button class="pill-btn pill-btn--success-ok" style="flex:1; justify-content:center;" @click="showEmailVerifiedModal = false">
              <i class="bi bi-check-lg"></i> យល់ព្រម
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast (errors only) -->
    <Transition name="toast">
      <div v-if="toast.show" :class="['toast', `toast--${toast.type}`]">
        <i :class="['bi', toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill']"></i>
        {{ toast.message }}
      </div>
    </Transition>

    <!-- Cropper Modal -->
    <Transition name="modal" @after-enter="initCropper">
      <div v-if="showCropModal" class="modal-overlay">
        <div class="crop-modal">
          <h3 class="crop-title">Crop Profile</h3>
          <div class="cropper-wrapper">
            <img ref="cropperElement" :src="cropperImage" alt="Crop" class="crop-image" />
          </div>
          <div class="modal-actions">
            <button class="pill-btn pill-btn--ghost" @click="cancelCrop" :disabled="loadingAvatar">Cancel</button>
            <button class="pill-btn pill-btn--primary" @click="cropAndUpload" :disabled="loadingAvatar">
              <span v-if="loadingAvatar" class="spinner"></span>
              <i v-else class="bi bi-check-lg"></i>
              Save
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import api from '@/api/api'
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const router = useRouter()

// ── Toast (for errors) ─────────────────────────────────────────────────────
const toast = reactive({ show: false, message: '', type: 'error' })
let toastTimer = null
function showToast(message, type = 'error') {
  clearTimeout(toastTimer)
  toast.message = message
  toast.type = type
  toast.show = true
  toastTimer = setTimeout(() => (toast.show = false), 3500)
}

// ── Success Alert Modal ────────────────────────────────────────────────────
const successAlert = reactive({ show: false, title: '', message: '', icon: 'bi-check-circle-fill' })
function showSuccess(title, message, icon = 'bi-check-circle-fill') {
  successAlert.title   = title
  successAlert.message = message
  successAlert.icon    = icon
  successAlert.show    = true
}

// ── Loading ────────────────────────────────────────────────────────────────
const loadingAvatar   = ref(false)
const loadingSave     = ref(false)
const loadingPassword = ref(false)
const loadingDelete   = ref(false)
const loadingEmail    = ref(false)

// ── Form ───────────────────────────────────────────────────────────────────
const form = reactive({ fullName: '', email: '', role: '', registeredAt: '' })
const original = reactive({ ...form })

// ── Avatar ─────────────────────────────────────────────────────────────────
const avatarUrl      = ref(null)
const fileInput      = ref(null)
const showCropModal  = ref(false)
const cropperImage   = ref('')
const cropperElement = ref(null)
let cropper = null

const initials = computed(() => {
  const parts = form.fullName?.trim().split(/\s+/) ?? []
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() || 'អ'
})

const registeredAtFormatted = computed(() => {
  if (!form.registeredAt) return '—'
  return new Date(form.registeredAt).toLocaleDateString('km-KH', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
})

function triggerUpload() { fileInput.value?.click() }

async function handleUpload(event) {
  const file = event.target.files[0]
  event.target.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) { showToast('សូមជ្រើសរើសរូបភាពត្រឹមត្រូវ។'); return }
  if (cropper) { cropper.destroy(); cropper = null }
  if (cropperImage.value.startsWith('blob:')) URL.revokeObjectURL(cropperImage.value)
  cropperImage.value = URL.createObjectURL(file)
  showCropModal.value = true
}

function initCropper() {
  if (!cropperElement.value) return
  if (cropper) { cropper.destroy(); cropper = null }
  cropper = new Cropper(cropperElement.value, {
    aspectRatio: 1, viewMode: 1, dragMode: 'move',
    autoCropArea: 0.8, responsive: true, background: false,
    cropBoxResizable: true, cropBoxMovable: true, guides: true, center: true, highlight: true,
  })
}

function cancelCrop() {
  showCropModal.value = false
  if (cropper) { cropper.destroy(); cropper = null }
  if (cropperImage.value.startsWith('blob:')) { URL.revokeObjectURL(cropperImage.value); cropperImage.value = '' }
}

async function cropAndUpload() {
  if (!cropper) return
  loadingAvatar.value = true
  try {
    const canvas = cropper.getCroppedCanvas({ width: 256, height: 256 })
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    const fd = new FormData()
    fd.append('avatar', blob, 'avatar.jpg')
    const res = await api.put('auth/profile/avatar', fd)
    avatarUrl.value = res.data?.data?.avatar ?? res.data?.avatar ?? canvas.toDataURL()
    showCropModal.value = false
    cropper.destroy(); cropper = null
    if (cropperImage.value.startsWith('blob:')) { URL.revokeObjectURL(cropperImage.value); cropperImage.value = '' }
    showSuccess('រូបភាពបានធ្វើបច្ចុប្បន្នភាព!', 'រូបថតប្រវត្តិរូបរបស់អ្នកត្រូវបានផ្លាស់ប្ដូររួចរាល់។', 'bi-person-check-fill')
  } catch (err) {
    const msg = err.response?.data?.message ?? err.response?.data?.error ?? 'មិនអាចផ្ទុករូបភាពបានទេ។'
    showToast(msg)
  } finally {
    loadingAvatar.value = false
  }
}

async function removeAvatar() {
  if (!avatarUrl.value) return
  loadingAvatar.value = true
  try {
    await api.delete('auth/profile/avatar')
    avatarUrl.value = null
    showSuccess('រូបភាពត្រូវបានលុប!', 'រូបថតប្រវត្តិរូបត្រូវបានដកចេញដោយជោគជ័យ។', 'bi-trash3-fill')
  } catch (err) {
    showToast(err.response?.data?.message ?? 'មិនអាចលុបរូបភាពបានទេ។')
  } finally {
    loadingAvatar.value = false
  }
}

// ── Profile edit ───────────────────────────────────────────────────────────
const isEditing = ref(false)
function startEdit()  { Object.assign(original, form); isEditing.value = true }
function cancelEdit() { Object.assign(form, original); isEditing.value = false }

async function saveEdit() {
  if (!form.fullName.trim()) { showToast('សូមបញ្ចូលឈ្មោះ។'); return }
  loadingSave.value = true
  try {
    await api.put('auth/profile', { fullName: form.fullName.trim() })
    Object.assign(original, form)
    isEditing.value = false
    showSuccess('ប្រវត្តិរូបបានរក្សាទុក!', `ឈ្មោះរបស់អ្នកត្រូវបានផ្លាស់ប្ដូរទៅ "${form.fullName}" ដោយជោគជ័យ។`, 'bi-person-fill-check')
  } catch (err) {
    showToast(err.response?.data?.message ?? 'មិនអាចរក្សាទុកបានទេ។')
  } finally {
    loadingSave.value = false
  }
}

// ── Password ───────────────────────────────────────────────────────────────
const showPasswordForm = ref(false)
const passwordForm = reactive({ current: '', newPass: '', confirm: '' })
const showPasswords = reactive({ current: false, newPass: false, confirm: false })
const pwFields = {
  current: { label: 'ពាក្យសម្ងាត់បច្ចុប្បន្ន' },
  newPass: { label: 'ពាក្យសម្ងាត់ថ្មី' },
  confirm: { label: 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី' },
}
function openPasswordForm()  { Object.assign(passwordForm, { current: '', newPass: '', confirm: '' }); showPasswordForm.value = true }
function closePasswordForm() { showPasswordForm.value = false }

async function submitChangePassword() {
  if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) { showToast('សូមបំពេញព័ត៌មានទាំងអស់។'); return }
  if (passwordForm.newPass !== passwordForm.confirm) { showToast('ពាក្យសម្ងាត់ថ្មីមិនត្រូវគ្នាទេ។'); return }
  if (passwordForm.newPass.length < 6) { showToast('ពាក្យសម្ងាត់ត្រូវមាន 6 តួអក្សរ+។'); return }
  loadingPassword.value = true
  try {
    await api.put('auth/change-password', { currentPassword: passwordForm.current, newPassword: passwordForm.newPass })
    showPasswordForm.value = false
    Object.assign(passwordForm, { current: '', newPass: '', confirm: '' })
    showSuccess('ពាក្យសម្ងាត់បានផ្លាស់ប្ដូរ!', 'ពាក្យសម្ងាត់ថ្មីរបស់អ្នកត្រូវបានរក្សាទុករួចរាល់។ សូមប្រើវានៅ login លើក​ក្រោយ។', 'bi-shield-fill-check')
  } catch (err) {
    showToast(err.response?.data?.message ?? 'មិនអាចផ្លាស់ប្ដូរបានទេ។')
  } finally {
    loadingPassword.value = false
  }
}

// ── Email ──────────────────────────────────────────────────────────────────
const showEmailForm          = ref(false)
const emailStep              = ref(1)
const showEmailPassword      = ref(false)
const showEmailVerifiedModal = ref(false)
const verifiedNewEmail       = ref('')
const emailForm = reactive({ newEmail: '', password: '', token: '' })

function openEmailForm() {
  Object.assign(emailForm, { newEmail: '', password: '', token: '' })
  emailStep.value = 1
  showEmailForm.value = true
}
function closeEmailForm() { showEmailForm.value = false }

async function requestChangeEmail() {
  if (!emailForm.newEmail || !emailForm.password) { showToast('សូមបំពេញព័ត៌មានទាំងអស់។'); return }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(emailForm.newEmail)) { showToast('អ៊ីមែលមិនត្រឹមត្រូវទម្រង់។'); return }
  if (emailForm.newEmail.trim().toLowerCase() === form.email.trim().toLowerCase()) { showToast('អ៊ីមែលថ្មីត្រូវតែខុសពីអ៊ីមែលបច្ចុប្បន្ន។'); return }
  loadingEmail.value = true
  try {
    await api.post('auth/change-email/request', {
      newEmail: emailForm.newEmail.trim(),
      password: emailForm.password,
    })
    emailStep.value = 2
  } catch (err) {
    const details = err.response?.data?.details
    const firstMsg = Array.isArray(details) && details.length > 0 ? details[0]?.message : null
    showToast(firstMsg ?? err.response?.data?.message ?? 'មិនអាចផ្ញើបានទេ។')
  } finally {
    loadingEmail.value = false
  }
}

async function handleEmailVerifyRedirect() {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  if (!token) return
  window.history.replaceState({}, '', window.location.pathname)
  try {
    const res = await api.post('auth/change-email/verify', { token: token.trim() })
    const newEmail = res.data?.data?.email ?? res.data?.email ?? null
    if (newEmail) { form.email = newEmail; verifiedNewEmail.value = newEmail }
    else { await fetchProfile(); verifiedNewEmail.value = form.email }
    showEmailVerifiedModal.value = true
  } catch (err) {
    showToast(err.response?.data?.message ?? 'Token មិនត្រឹមត្រូវ ឬផុតកំណត់។')
  }
}

// ── Danger ─────────────────────────────────────────────────────────────────
const showModal = ref(false)
function confirmDelete() { showModal.value = true }

async function deleteAccount() {
  loadingDelete.value = true
  try {
    await api.delete('auth/profile')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    showModal.value = false
    router.push('/login')
  } catch (err) {
    showModal.value = false
    showToast(err.response?.data?.message ?? 'មិនអាចលុបបានទេ។')
  } finally {
    loadingDelete.value = false
  }
}

// ── Fetch profile ──────────────────────────────────────────────────────────
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
    showToast(err.response?.data?.message ?? 'មិនអាចទាញប្រវត្តិរូបបានទេ។')
  }
}

onMounted(async () => {
  await fetchProfile()
  handleEmailVerifyRedirect()
})
</script>

<style scoped>
.profile-page {
  font-family: 'Kantumruy Pro', 'Khmer OS', 'Hanuman', sans-serif;
  display: flex; flex-direction: column; gap: 1.5rem; padding-bottom: 3rem;
}

.profile-hero {
  position: relative; border-radius: 20px; overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  padding: 2.5rem 2rem; min-height: 200px;
}
.hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.hero-orb { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.35; }
.hero-orb--1 { width: 280px; height: 280px; background: #6366f1; top: -80px; left: -60px; }
.hero-orb--2 { width: 200px; height: 200px; background: #8b5cf6; bottom: -60px; right: 10%; }
.hero-orb--3 { width: 160px; height: 160px; background: #06b6d4; top: 20%; right: 30%; }
.hero-content { position: relative; display: flex; align-items: center; gap: 2rem; flex-wrap: wrap; }

.avatar-ring { position: relative; width: 96px; height: 96px; flex-shrink: 0; cursor: pointer; }
.avatar-inner {
  width: 96px; height: 96px; border-radius: 50%; overflow: hidden;
  border: 3px solid rgba(255,255,255,0.25);
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex; align-items: center; justify-content: center; transition: border-color 0.2s;
}
.avatar-ring:hover .avatar-inner { border-color: rgba(255,255,255,0.6); }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-initials { font-size: 32px; font-weight: 700; color: #fff; letter-spacing: -0.5px; }
.avatar-edit-badge {
  position: absolute; bottom: 2px; right: 2px; width: 26px; height: 26px;
  background: #6366f1; border: 2px solid #0f172a; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 12px; color: #fff;
  transition: background 0.2s, transform 0.2s;
}
.avatar-ring:hover .avatar-edit-badge { background: #4f46e5; transform: scale(1.1); }
.avatar-ring-glow {
  position: absolute; inset: -4px; border-radius: 50%; border: 2px solid transparent;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out; mask-composite: exclude;
  opacity: 0; transition: opacity 0.2s; pointer-events: none;
}
.avatar-ring:hover .avatar-ring-glow { opacity: 1; }

.hero-info { flex: 1; min-width: 200px; }
.hero-name { font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 10px; letter-spacing: -0.3px; }
.hero-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
.hero-role-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: rgba(99,102,241,0.35); border: 1px solid rgba(99,102,241,0.5);
  color: #a5b4fc; font-size: 12px; font-weight: 600; padding: 3px 12px;
  border-radius: 999px; letter-spacing: 0.03em;
}
.hero-email { font-size: 13px; color: rgba(255,255,255,0.55); }
.hero-since { font-size: 12px; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 6px; margin: 0; }
.hero-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.hero-btn {
  display: inline-flex; align-items: center; gap: 6px; border: none; border-radius: 10px;
  padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s ease;
}
.hero-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.hero-btn--upload { background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.18); color: #fff; }
.hero-btn--upload:hover:not(:disabled) { background: rgba(255,255,255,0.2); }
.hero-btn--remove { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; padding: 9px 14px; }
.hero-btn--remove:hover:not(:disabled) { background: rgba(239,68,68,0.25); }
.hero-btn--remove:disabled { opacity: 0.3; }

.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.25rem; }

.glass-card {
  background: var(--bg-card, #ffffff); border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 18px; padding: 1.5rem; transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.glass-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.07); transform: translateY(-1px); }
.glass-card--danger { background: color-mix(in srgb, #ef4444 4%, var(--bg-card, #ffffff)); border-color: rgba(239,68,68,0.2); }
.glass-card__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
.glass-card__title-group { display: flex; align-items: center; gap: 10px; }
.glass-card__icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.glass-card__icon--blue   { background: rgba(99,102,241,0.12); color: #6366f1; }
.glass-card__icon--purple { background: rgba(139,92,246,0.12); color: #8b5cf6; }
.glass-card__icon--teal   { background: rgba(6,182,212,0.12);  color: #06b6d4; }
.glass-card__icon--red    { background: rgba(239,68,68,0.12);  color: #ef4444; }
.glass-card__title { font-size: 15px; font-weight: 700; color: var(--text-primary, #111827); margin: 0; }
.glass-card__title--danger { color: #dc2626; }

.field-stack { display: flex; flex-direction: column; gap: 1rem; }
.field-item { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 11px; font-weight: 700; color: var(--text-secondary, #6b7280); text-transform: uppercase; letter-spacing: 0.06em; }
.field-input-wrap {
  display: flex; align-items: center; border: 1.5px solid var(--border-color, #e5e7eb);
  border-radius: 12px; background: var(--bg-input, #f9fafb); padding: 0 14px; gap: 8px;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.field-input-wrap--active { border-color: #6366f1; background: var(--bg-card, #fff); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.field-icon { color: var(--text-secondary, #9ca3af); font-size: 15px; flex-shrink: 0; }
.field-input { flex: 1; border: none; background: transparent; outline: none; padding: 11px 0; font-size: 14px; color: var(--text-primary, #111827); font-family: inherit; }
.field-input[readonly] { color: var(--text-secondary, #6b7280); cursor: default; }
.field-input::placeholder { color: var(--text-secondary, #9ca3af); }
.field-input-wrap:has(.field-input--error) { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
.field-error { font-size: 12px; color: #ef4444; }
.eye-btn { background: none; border: none; cursor: pointer; color: var(--text-secondary, #9ca3af); font-size: 16px; padding: 0; line-height: 1; transition: color 0.15s; flex-shrink: 0; }
.eye-btn:hover { color: var(--text-primary, #374151); }
.action-row { display: flex; gap: 8px; margin-top: 0.25rem; }

/* Cropper */
.crop-modal {
  width: 95%; max-width: 520px; background: var(--bg-card, #ffffff);
  border-radius: 24px; padding: 1.5rem; display: flex; flex-direction: column;
  gap: 1rem; box-shadow: 0 25px 60px rgba(0,0,0,0.2);
}
.crop-title { font-size: 18px; font-weight: 700; color: var(--text-primary, #111827); margin: 0; }
.cropper-wrapper { width: 100%; height: 400px; position: relative; border-radius: 16px; background: #111827; overflow: hidden; }
.crop-image { max-width: 100%; display: block; }

.pill-btn {
  display: inline-flex; align-items: center; gap: 6px; border: none; border-radius: 999px;
  padding: 9px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
  transition: all 0.15s ease; white-space: nowrap;
}
.pill-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
.pill-btn:not(:disabled):active { transform: scale(0.97); }
.pill-btn--primary { background: #6366f1; color: #fff; }
.pill-btn--primary:not(:disabled):hover { background: #4f46e5; box-shadow: 0 4px 14px rgba(99,102,241,0.35); }
.pill-btn--ghost { background: var(--bg-input, #f3f4f6); color: var(--text-primary, #374151); border: 1px solid var(--border-color, #e5e7eb); }
.pill-btn--ghost:not(:disabled):hover { background: var(--border-color, #e5e7eb); }
.pill-btn--danger { background: #ef4444; color: #fff; }
.pill-btn--danger:not(:disabled):hover { background: #dc2626; box-shadow: 0 4px 14px rgba(239,68,68,0.35); }
.pill-btn--success-ok { background: linear-gradient(135deg, #10b981, #059669); color: #fff; flex: 1; justify-content: center; }
.pill-btn--success-ok:not(:disabled):hover { background: linear-gradient(135deg, #059669, #047857); box-shadow: 0 4px 14px rgba(16,185,129,0.4); }

/* Success icon */
.success-icon-wrap { display: flex; justify-content: center; margin-bottom: 0.25rem; }
.success-icon-ring {
  width: 72px; height: 72px; border-radius: 50%;
  background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.2));
  border: 2px solid rgba(16,185,129,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 30px; color: #10b981;
  animation: pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes pop-in { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.card-idle { padding: 0.5rem 0 0.25rem; }
.idle-dots { display: flex; gap: 5px; margin-bottom: 0.75rem; }
.idle-dots span { width: 26px; height: 10px; background: var(--border-color, #e5e7eb); border-radius: 999px; opacity: 0.6; }
.idle-hint { font-size: 13px; color: var(--text-secondary, #9ca3af); margin: 0; }

.email-display { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: var(--bg-input, #f9fafb); border: 1.5px solid var(--border-color, #e5e7eb); border-radius: 12px; }
.email-display__icon { color: #06b6d4; font-size: 16px; }
.email-display__text { font-size: 14px; color: var(--text-primary, #374151); font-weight: 500; }

.step-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 0.25rem; }
.step-dot { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; background: var(--border-color, #e5e7eb); color: var(--text-secondary, #6b7280); }
.step-dot--active { background: #6366f1; color: #fff; }
.step-dot--done   { background: #10b981; color: #fff; font-size: 14px; }
.step-line { flex: 1; height: 2px; background: var(--border-color, #e5e7eb); border-radius: 999px; }
.step-line--done { background: #10b981; }
.step-label { font-size: 12px; font-weight: 600; color: var(--text-secondary, #6b7280); white-space: nowrap; }
.step-hint { font-size: 13px; color: var(--text-secondary, #6b7280); line-height: 1.6; margin: 0; display: flex; align-items: flex-start; gap: 6px; }

.email-sent-box { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1.5rem 1rem; background: linear-gradient(135deg, rgba(6,182,212,0.06), rgba(99,102,241,0.06)); border: 1.5px dashed rgba(6,182,212,0.3); border-radius: 14px; gap: 0.75rem; }
.email-sent-icon { width: 56px; height: 56px; background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(99,102,241,0.15)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #06b6d4; }
.email-sent-title { font-size: 15px; font-weight: 700; color: var(--text-primary, #111827); margin: 0; }
.email-sent-desc { font-size: 13px; color: var(--text-secondary, #6b7280); line-height: 1.7; margin: 0; }
.email-sent-desc strong { color: #06b6d4; }

.danger-desc { font-size: 13px; color: #9b2c2c; line-height: 1.6; margin: 0 0 1.25rem; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-box { background: var(--bg-card, #ffffff); border-radius: 20px; padding: 2rem; max-width: 380px; width: 90%; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.2); }
.modal-box--success { border-top: 3px solid #10b981; }
.modal-icon-wrap { width: 60px; height: 60px; background: rgba(239,68,68,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; color: #ef4444; margin-bottom: 0.25rem; }
.modal-title { font-size: 18px; font-weight: 700; color: var(--text-primary, #111827); margin: 0; }
.modal-body  { font-size: 14px; color: var(--text-secondary, #6b7280); margin: 0; line-height: 1.6; }
.modal-actions { display: flex; gap: 10px; justify-content: center; margin-top: 0.5rem; width: 100%; }
.modal-actions .pill-btn { flex: 1; justify-content: center; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .modal-box, .modal-enter-active .crop-modal,
.modal-leave-active .modal-box, .modal-leave-active .crop-modal { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box, .modal-enter-from .crop-modal,
.modal-leave-to .modal-box, .modal-leave-to .crop-modal { transform: scale(0.88); opacity: 0; }

.toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 99999; display: flex; align-items: center; gap: 10px; padding: 12px 22px; border-radius: 999px; font-size: 14px; font-weight: 600; font-family: inherit; box-shadow: 0 8px 30px rgba(0,0,0,0.18); white-space: nowrap; }
.toast--success { background: #10b981; color: #fff; }
.toast--error   { background: #ef4444; color: #fff; }
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(12px); }

.slide-up-enter-active, .slide-up-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(-8px); }

.spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; flex-shrink: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>

<style>
@import 'cropperjs/dist/cropper.css';
.cropper-view-box, .cropper-face { border-radius: 50%; }
</style>