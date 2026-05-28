<template>
  <div class="profile-page">

    <!-- ════════════════════════════════════════════
         PAGE LOADING SKELETON
    ═════════════════════════════════════════════ -->
    <template v-if="pageLoading">
      <!-- Hero skeleton -->
      <section>
        <div class="skeleton skeleton-hero"></div>
      </section>
      <!-- Cards skeleton -->
      <section class="mt-3">
        <div class="row g-3">
          <div class="col-md-4" v-for="n in 3" :key="n">
            <div class="skeleton skeleton-card"></div>
          </div>
        </div>
      </section>
    </template>

    <!-- ════════════════════════════════════════════
         REAL CONTENT
    ═════════════════════════════════════════════ -->
    <template v-else>

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
              <div
                class="field-input-wrap"
                :class="{
                  'field-input-wrap--active': isEditing,
                  'field-input-wrap--error': profileErrors.fullName
                }"
              >
                <i class="bi bi-person field-icon"></i>
                <input
                  v-model="form.fullName"
                  type="text"
                  class="field-input"
                  placeholder="System Admin"
                  :readonly="!isEditing"
                  @input="clearProfileError('fullName')"
                />
              </div>
              <span v-if="profileErrors.fullName" class="field-error">
                <i class="bi bi-exclamation-circle-fill"></i>
                {{ profileErrors.fullName }}
              </span>
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
              <span></span><span></span><span></span><span></span>
              <span></span><span></span><span></span><span></span>
            </div>
            <p class="idle-hint">ផ្លាស់ប្ដូរពាក្យសម្ងាត់គណនីរបស់អ្នក</p>
          </div>
          <Transition name="slide-up">
            <div v-if="showPasswordForm" class="field-stack">
              <div class="field-item" v-for="(cfg, key) in pwFields" :key="key">
                <label class="field-label">{{ cfg.label }}</label>
                <div
                  class="field-input-wrap field-input-wrap--active"
                  :class="{ 'field-input-wrap--error': passwordErrors[key] }"
                >
                  <i class="bi bi-key field-icon"></i>
                  <input
                    v-model="passwordForm[key]"
                    :type="showPasswords[key] ? 'text' : 'password'"
                    class="field-input"
                    placeholder="••••••••"
                    @input="clearPasswordError(key)"
                  />
                  <button class="eye-btn" type="button" @click="showPasswords[key] = !showPasswords[key]">
                    <i :class="showPasswords[key] ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <span v-if="passwordErrors[key]" class="field-error">
                  <i class="bi bi-exclamation-circle-fill"></i>
                  {{ passwordErrors[key] }}
                </span>
              </div>
              <div v-if="passwordForm.newPass" class="pw-strength">
                <div class="pw-strength__bars">
                  <span
                    v-for="n in 4"
                    :key="n"
                    class="pw-strength__bar"
                    :class="pwStrength.score >= n ? `pw-strength__bar--${pwStrength.level}` : ''"
                  ></span>
                </div>
                <span class="pw-strength__label" :class="`pw-strength__label--${pwStrength.level}`">
                  {{ pwStrength.label }}
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
                  <div class="field-input-wrap field-input-wrap--active" :class="{ 'field-input-wrap--error': emailErrors.newEmail }">
                    <i class="bi bi-envelope field-icon"></i>
                    <input v-model="emailForm.newEmail" type="email" class="field-input" placeholder="example@email.com" @input="clearEmailError('newEmail')" />
                  </div>
                  <span v-if="emailErrors.newEmail" class="field-error">
                    <i class="bi bi-exclamation-circle-fill"></i> {{ emailErrors.newEmail }}
                  </span>
                </div>
                <div class="field-item">
                  <label class="field-label">ពាក្យសម្ងាត់</label>
                  <div class="field-input-wrap field-input-wrap--active" :class="{ 'field-input-wrap--error': emailErrors.password }">
                    <i class="bi bi-key field-icon"></i>
                    <input v-model="emailForm.password" :type="showEmailPassword ? 'text' : 'password'" class="field-input" placeholder="••••••••" @input="clearEmailError('password')" />
                    <button class="eye-btn" type="button" @click="showEmailPassword = !showEmailPassword">
                      <i :class="showEmailPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <span v-if="emailErrors.password" class="field-error">
                    <i class="bi bi-exclamation-circle-fill"></i> {{ emailErrors.password }}
                  </span>
                </div>
                <p class="step-hint" style="margin-top: 0;">
                  <i class="bi bi-info-circle" style="color: #06b6d4;"></i>
                  លិខិតបញ្ជាក់នឹងត្រូវបានផ្ញើទៅអ៊ីមែលថ្មីរបស់អ្នក។
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
                  <p class="email-sent-desc">យើងបានផ្ញើតំណបញ្ជាក់ទៅ<br/><strong>{{ emailForm.newEmail }}</strong></p>
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
    </template>

    <!-- ════════ MODALS & TOAST (unchanged) ════════ -->

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

    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-box">
          <div class="modal-icon-wrap"><i class="bi bi-exclamation-triangle-fill"></i></div>
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

    <Transition name="modal">
      <div v-if="showEmailVerifiedModal" class="modal-overlay">
        <div class="modal-box modal-box--success">
          <div class="success-icon-wrap">
            <div class="success-icon-ring"><i class="bi bi-envelope-check-fill"></i></div>
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

    <Transition name="toast">
      <div v-if="toast.show" :class="['toast', `toast--${toast.type}`]">
        <i :class="['bi', toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill']"></i>
        {{ toast.message }}
      </div>
    </Transition>

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
import { useUserStore } from '@/stores/Userstore'

const router    = useRouter()
const userStore = useUserStore()

// ── Page loading ───────────────────────────────────────────────────────────
const pageLoading = ref(true)

// ── Toast ──────────────────────────────────────────────────────────────────
const toast = reactive({ show: false, message: '', type: 'error' })
let toastTimer = null
function showToast(message, type = 'error') {
  clearTimeout(toastTimer)
  toast.message = message
  toast.type    = type
  toast.show    = true
  toastTimer    = setTimeout(() => (toast.show = false), 3500)
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
const form     = reactive({ fullName: '', email: '', role: '', registeredAt: '' })
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
  if (file.size > 5 * 1024 * 1024)    { showToast('រូបភាពធំពេក។ សូមជ្រើសរើសរូបភាពតូចជាង 5MB។'); return }
  if (cropper) { cropper.destroy(); cropper = null }
  if (cropperImage.value.startsWith('blob:')) URL.revokeObjectURL(cropperImage.value)
  cropperImage.value  = URL.createObjectURL(file)
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
    const blob   = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    const fd     = new FormData()
    fd.append('avatar', blob, 'avatar.jpg')
    const res       = await api.put('auth/profile/avatar', fd)
    const newAvatar = res.data?.data?.avatar ?? res.data?.avatar ?? canvas.toDataURL()
    avatarUrl.value = newAvatar
    userStore.updateLocal({ avatar: newAvatar })
    showCropModal.value = false
    cropper.destroy(); cropper = null
    if (cropperImage.value.startsWith('blob:')) { URL.revokeObjectURL(cropperImage.value); cropperImage.value = '' }
    showSuccess('រូបភាពបានធ្វើបច្ចុប្បន្នភាព!', 'រូបថតប្រវត្តិរូបរបស់អ្នកត្រូវបានផ្លាស់ប្ដូររួចរាល់។', 'bi-person-check-fill')
  } catch (err) {
    showToast(err.response?.data?.message ?? err.response?.data?.error ?? 'មិនអាចផ្ទុករូបភាពបានទេ។')
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
    userStore.updateLocal({ avatar: null })
    showSuccess('រូបភាពត្រូវបានលុប!', 'រូបថតប្រវត្តិរូបត្រូវបានដកចេញដោយជោគជ័យ។', 'bi-trash3-fill')
  } catch (err) {
    showToast(err.response?.data?.message ?? 'មិនអាចលុបរូបភាពបានទេ។')
  } finally {
    loadingAvatar.value = false
  }
}

// ── Profile edit ───────────────────────────────────────────────────────────
const profileErrors = reactive({ fullName: '' })
function clearProfileError(field) { profileErrors[field] = '' }

function validateProfile() {
  profileErrors.fullName = ''
  const name = form.fullName.trim()
  if (!name)          { profileErrors.fullName = 'សូមបំពេញឈ្មោះរបស់អ្នក'; return false }
  if (name.length < 2)  { profileErrors.fullName = 'ឈ្មោះត្រូវតែមានយ៉ាងហោចណាស់ 2 តួអក្សរ'; return false }
  if (name.length > 100){ profileErrors.fullName = 'ឈ្មោះវែងពេក (អតិបរមា 100 តួអក្សរ)'; return false }
  return true
}

const isEditing = ref(false)
function startEdit()  { Object.assign(original, form); profileErrors.fullName = ''; isEditing.value = true }
function cancelEdit() { Object.assign(form, original); profileErrors.fullName = ''; isEditing.value = false }

async function saveEdit() {
  if (!validateProfile()) return
  loadingSave.value = true
  try {
    await api.put('auth/profile', { fullName: form.fullName.trim() })
    Object.assign(original, form)
    isEditing.value = false
    userStore.updateLocal({ fullName: form.fullName.trim() })
    showSuccess('ប្រវត្តិរូបបានរក្សាទុក!', `ឈ្មោះរបស់អ្នកត្រូវបានផ្លាស់ប្ដូរទៅ "${form.fullName}" ដោយជោគជ័យ។`, 'bi-person-fill-check')
  } catch (err) {
    showToast(err.response?.data?.message ?? 'មិនអាចរក្សាទុកបានទេ។')
  } finally {
    loadingSave.value = false
  }
}

// ── Password ───────────────────────────────────────────────────────────────
const showPasswordForm = ref(false)
const passwordForm     = reactive({ current: '', newPass: '', confirm: '' })
const showPasswords    = reactive({ current: false, newPass: false, confirm: false })
const passwordErrors   = reactive({ current: '', newPass: '', confirm: '' })

const pwFields = {
  current: { label: 'ពាក្យសម្ងាត់បច្ចុប្បន្ន' },
  newPass: { label: 'ពាក្យសម្ងាត់ថ្មី' },
  confirm: { label: 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី' },
}

const pwStrength = computed(() => {
  const pw = passwordForm.newPass
  if (!pw) return { score: 0, level: 'weak', label: '' }
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score = Math.min(score + 1, 4)
  score = Math.min(score, 4)
  const map = { 0: { level:'weak', label:'ខ្សោយណាស់' }, 1: { level:'weak', label:'ខ្សោយ' }, 2: { level:'fair', label:'មធ្យម' }, 3: { level:'good', label:'ល្អ' }, 4: { level:'strong', label:'ខ្លាំងណាស់' } }
  return { score, ...map[score] }
})

function clearPasswordError(field) { passwordErrors[field] = ''; if (field === 'newPass' && passwordErrors.confirm) passwordErrors.confirm = '' }

function validatePasswordForm() {
  Object.assign(passwordErrors, { current: '', newPass: '', confirm: '' })
  let valid = true
  if (!passwordForm.current)                        { passwordErrors.current = 'សូមបំពេញពាក្យសម្ងាត់បច្ចុប្បន្ន'; valid = false }
  if (!passwordForm.newPass)                        { passwordErrors.newPass = 'សូមបំពេញពាក្យសម្ងាត់ថ្មី'; valid = false }
  else if (passwordForm.newPass.length < 8)         { passwordErrors.newPass = 'ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ 8 តួអក្សរ'; valid = false }
  else if (!/[A-Z]/.test(passwordForm.newPass))     { passwordErrors.newPass = 'ត្រូវមានអក្សរធំមួយ (A–Z)'; valid = false }
  else if (!/[0-9]/.test(passwordForm.newPass))     { passwordErrors.newPass = 'ត្រូវមានលេខមួយ (0–9)'; valid = false }
  else if (passwordForm.newPass === passwordForm.current) { passwordErrors.newPass = 'ពាក្យសម្ងាត់ថ្មីត្រូវខុសពីបច្ចុប្បន្ន'; valid = false }
  if (!passwordForm.confirm)                        { passwordErrors.confirm = 'សូមបញ្ជាក់ពាក្យសម្ងាត់ថ្មី'; valid = false }
  else if (passwordForm.confirm !== passwordForm.newPass) { passwordErrors.confirm = 'ពាក្យសម្ងាត់មិនត្រូវគ្នា'; valid = false }
  return valid
}

function openPasswordForm()  { Object.assign(passwordForm, { current:'', newPass:'', confirm:'' }); Object.assign(passwordErrors, { current:'', newPass:'', confirm:'' }); showPasswordForm.value = true }
function closePasswordForm() { showPasswordForm.value = false; Object.assign(passwordErrors, { current:'', newPass:'', confirm:'' }) }

async function submitChangePassword() {
  if (!validatePasswordForm()) return
  loadingPassword.value = true
  try {
    await api.put('auth/change-password', { currentPassword: passwordForm.current, newPassword: passwordForm.newPass })
    showPasswordForm.value = false
    Object.assign(passwordForm, { current:'', newPass:'', confirm:'' })
    showSuccess('ពាក្យសម្ងាត់បានផ្លាស់ប្ដូរ!', 'ពាក្យសម្ងាត់ថ្មីរបស់អ្នកត្រូវបានរក្សាទុករួចរាល់។', 'bi-shield-fill-check')
  } catch (err) {
    const msg = err.response?.data?.message ?? 'មិនអាចផ្លាស់ប្ដូរបានទេ។'
    if (err.response?.status === 401 || msg.toLowerCase().includes('current') || msg.toLowerCase().includes('incorrect')) {
      passwordErrors.current = 'ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវ'
    } else { showToast(msg) }
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
const emailForm              = reactive({ newEmail: '', password: '', token: '' })
const emailErrors            = reactive({ newEmail: '', password: '' })
const EMAIL_PATTERN          = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clearEmailError(field) { emailErrors[field] = '' }

function validateEmailForm() {
  Object.assign(emailErrors, { newEmail: '', password: '' })
  let valid = true
  if (!emailForm.newEmail.trim())                                { emailErrors.newEmail = 'សូមបំពេញអ៊ីមែលថ្មី'; valid = false }
  else if (!EMAIL_PATTERN.test(emailForm.newEmail.trim()))       { emailErrors.newEmail = 'រូបភាពអ៊ីមែលមិនត្រឹមត្រូវ'; valid = false }
  else if (emailForm.newEmail.trim().toLowerCase() === form.email.trim().toLowerCase()) { emailErrors.newEmail = 'អ៊ីមែលថ្មីត្រូវតែខុសពីបច្ចុប្បន្ន'; valid = false }
  if (!emailForm.password) { emailErrors.password = 'សូមបំពេញពាក្យសម្ងាត់'; valid = false }
  return valid
}

function openEmailForm()  { Object.assign(emailForm, { newEmail:'', password:'', token:'' }); Object.assign(emailErrors, { newEmail:'', password:'' }); emailStep.value = 1; showEmailForm.value = true }
function closeEmailForm() { showEmailForm.value = false; Object.assign(emailErrors, { newEmail:'', password:'' }) }

async function requestChangeEmail() {
  if (emailStep.value === 1 && !validateEmailForm()) return
  loadingEmail.value = true
  try {
    await api.post('auth/change-email/request', { newEmail: emailForm.newEmail.trim(), password: emailForm.password })
    emailStep.value = 2
  } catch (err) {
    const details  = err.response?.data?.details
    const firstMsg = Array.isArray(details) && details.length > 0 ? details[0]?.message : null
    const msg      = firstMsg ?? err.response?.data?.message ?? 'មិនអាចផ្ញើបានទេ។'
    if (err.response?.status === 401 || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('ពាក្យ')) {
      emailErrors.password = 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវ'
    } else { showToast(msg) }
  } finally {
    loadingEmail.value = false
  }
}

async function handleEmailVerifyRedirect() {
  const urlParams = new URLSearchParams(window.location.search)
  const token     = urlParams.get('token')
  if (!token) return
  window.history.replaceState({}, '', window.location.pathname)
  try {
    const res      = await api.post('auth/change-email/verify', { token: token.trim() })
    const newEmail = res.data?.data?.email ?? res.data?.email ?? null
    if (newEmail) { form.email = newEmail; verifiedNewEmail.value = newEmail; userStore.updateLocal({ email: newEmail }) }
    else { await fetchProfile(); verifiedNewEmail.value = form.email }
    showEmailVerifiedModal.value = true
  } catch (err) {
    showToast(err.response?.data?.message ?? 'Token មិនត្រឹមត្រូវ ឬផុតកំណត់។')
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────
const showModal = ref(false)
async function deleteAccount() {
  loadingDelete.value = true
  try {
    await api.delete('auth/profile')
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    userStore.clearProfile()
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
    userStore.updateLocal(data)
  } catch (err) {
    showToast(err.response?.data?.message ?? 'មិនអាចទាញប្រវត្តិរូបបានទេ។')
  }
}

onMounted(async () => {
  try {
    await fetchProfile()
    handleEmailVerifyRedirect()
  } finally {
    pageLoading.value = false
  }
})
</script>

<style scoped>
.profile-page {
  font-family: 'Kantumruy Pro', 'Khmer OS', 'Hanuman', sans-serif;
  display: flex; flex-direction: column; gap: 1.5rem; padding-bottom: 3rem;
}

/* ── Skeleton (same pattern as HomeView) ─────────────────────────────── */
.skeleton {
  background: linear-gradient(90deg,
    var(--bg-input) 25%,
    var(--border-color) 50%,
    var(--bg-input) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: var(--radius);
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-hero { height: 200px; margin-bottom: 4px; }
.skeleton-card { height: 220px; }

section { background-color: transparent !important; }
.mt-3   { margin-top: 1rem; }
.row    { display: flex; flex-wrap: wrap; }
.g-3    { gap: 20px; }
.col-md-4 { flex: 1 1 calc(33.333% - 14px); min-width: 260px; }

/* ── Hero ─────────────────────────────────────────────────────────────── */
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

/* ── Cards ────────────────────────────────────────────────────────────── */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.25rem; }

.glass-card {
  background: var(--bg-card); border: 1px solid var(--border-color);
  border-radius: 18px; padding: 1.5rem; transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.glass-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.07); transform: translateY(-1px); }
.glass-card__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
.glass-card__title-group { display: flex; align-items: center; gap: 10px; }
.glass-card__icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
.glass-card__icon--blue   { background: rgba(99,102,241,0.12); color: #6366f1; }
.glass-card__icon--purple { background: rgba(139,92,246,0.12); color: #8b5cf6; }
.glass-card__icon--teal   { background: rgba(6,182,212,0.12);  color: #06b6d4; }
.glass-card__title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0; }

.field-stack { display: flex; flex-direction: column; gap: 1rem; }
.field-item  { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.06em; }
.field-input-wrap {
  display: flex; align-items: center; border: 1.5px solid var(--border-color);
  border-radius: 12px; background: var(--bg-input); padding: 0 14px; gap: 8px;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.field-input-wrap--active { border-color: #6366f1; background: var(--bg-card); box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
.field-input-wrap--error  { border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.1) !important; background: var(--bg-card) !important; }
.field-icon  { color: var(--text-secondary); font-size: 15px; flex-shrink: 0; }
.field-input { flex: 1; border: none; background: transparent; outline: none; padding: 11px 0; font-size: 14px; color: var(--text-primary); font-family: inherit; }
.field-input[readonly] { color: var(--text-secondary); cursor: default; }
.field-input::placeholder { color: var(--text-secondary); }
.field-error { font-size: 12px; color: #ef4444; display: flex; align-items: center; gap: 5px; animation: shake-in 0.2s ease; }
@keyframes shake-in { 0% { opacity:0; transform:translateX(-4px); } 100% { opacity:1; transform:translateX(0); } }
.eye-btn { background: none; border: none; cursor: pointer; color: var(--text-secondary); font-size: 16px; padding: 0; line-height: 1; transition: color 0.15s; flex-shrink: 0; }
.eye-btn:hover { color: var(--text-primary); }
.action-row { display: flex; gap: 8px; margin-top: 0.25rem; }

.pw-strength { display: flex; align-items: center; gap: 10px; }
.pw-strength__bars { display: flex; gap: 4px; flex: 1; }
.pw-strength__bar { flex: 1; height: 4px; border-radius: 999px; background: var(--border-color); transition: background 0.3s ease; }
.pw-strength__bar--weak   { background: #ef4444; }
.pw-strength__bar--fair   { background: #f59e0b; }
.pw-strength__bar--good   { background: #3b82f6; }
.pw-strength__bar--strong { background: #10b981; }
.pw-strength__label { font-size: 11px; font-weight: 700; white-space: nowrap; }
.pw-strength__label--weak   { color: #ef4444; }
.pw-strength__label--fair   { color: #f59e0b; }
.pw-strength__label--good   { color: #3b82f6; }
.pw-strength__label--strong { color: #10b981; }

.crop-modal { width: 95%; max-width: 520px; background: var(--bg-card); border-radius: 24px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 25px 60px rgba(0,0,0,0.2); }
.crop-title { font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0; }
.cropper-wrapper { width: 100%; height: 400px; position: relative; border-radius: 16px; background: #111827; overflow: hidden; }
.crop-image { max-width: 100%; display: block; }

.pill-btn { display: inline-flex; align-items: center; gap: 6px; border: none; border-radius: 999px; padding: 9px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s ease; white-space: nowrap; }
.pill-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
.pill-btn:not(:disabled):active { transform: scale(0.97); }
.pill-btn--primary { background: #6366f1; color: #fff; }
.pill-btn--primary:not(:disabled):hover { background: #4f46e5; box-shadow: 0 4px 14px rgba(99,102,241,0.35); }
.pill-btn--ghost { background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border-color); }
.pill-btn--ghost:not(:disabled):hover { background: var(--border-color); }
.pill-btn--danger { background: #ef4444; color: #fff; }
.pill-btn--danger:not(:disabled):hover { background: #dc2626; box-shadow: 0 4px 14px rgba(239,68,68,0.35); }
.pill-btn--success-ok { background: linear-gradient(135deg, #10b981, #059669); color: #fff; flex: 1; justify-content: center; }
.pill-btn--success-ok:not(:disabled):hover { background: linear-gradient(135deg, #059669, #047857); box-shadow: 0 4px 14px rgba(16,185,129,0.4); }

.success-icon-wrap { display: flex; justify-content: center; margin-bottom: 0.25rem; }
.success-icon-ring { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.2)); border: 2px solid rgba(16,185,129,0.3); display: flex; align-items: center; justify-content: center; font-size: 30px; color: #10b981; animation: pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes pop-in { from { transform:scale(0.5); opacity:0; } to { transform:scale(1); opacity:1; } }

.card-idle { padding: 0.5rem 0 0.25rem; }
.idle-dots { display: flex; gap: 5px; margin-bottom: 0.75rem; }
.idle-dots span { width: 26px; height: 10px; background: var(--border-color); border-radius: 999px; opacity: 0.6; }
.idle-hint { font-size: 13px; color: var(--text-secondary); margin: 0; }

.email-display { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: var(--bg-input); border: 1.5px solid var(--border-color); border-radius: 12px; }
.email-display__icon { color: #06b6d4; font-size: 16px; }
.email-display__text { font-size: 14px; color: var(--text-primary); font-weight: 500; }

.step-indicator { display: flex; align-items: center; gap: 8px; margin-bottom: 0.25rem; }
.step-dot { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; background: var(--border-color); color: var(--text-secondary); }
.step-dot--active { background: #6366f1; color: #fff; }
.step-dot--done   { background: #10b981; color: #fff; font-size: 14px; }
.step-line { flex: 1; height: 2px; background: var(--border-color); border-radius: 999px; }
.step-line--done { background: #10b981; }
.step-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); white-space: nowrap; }
.step-hint { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 0; display: flex; align-items: flex-start; gap: 6px; }

.email-sent-box { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1.5rem 1rem; background: linear-gradient(135deg, rgba(6,182,212,0.06), rgba(99,102,241,0.06)); border: 1.5px dashed rgba(6,182,212,0.3); border-radius: 14px; gap: 0.75rem; }
.email-sent-icon { width: 56px; height: 56px; background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(99,102,241,0.15)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #06b6d4; }
.email-sent-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0; }
.email-sent-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.7; margin: 0; }
.email-sent-desc strong { color: #06b6d4; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-box { background: var(--bg-card); border-radius: 20px; padding: 2rem; max-width: 380px; width: 90%; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.2); }
.modal-box--success { border-top: 3px solid #10b981; }
.modal-icon-wrap { width: 60px; height: 60px; background: rgba(239,68,68,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; color: #ef4444; margin-bottom: 0.25rem; }
.modal-title { font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0; }
.modal-body  { font-size: 14px; color: var(--text-secondary); margin: 0; line-height: 1.6; }
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