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
              <span>អ</span>
            </div>
          </div>

          <div class="btn-group">
            <button class="btn btn-primary" @click="triggerUpload">
              ផ្លាស់រូបតំណាង
            </button>
            <button class="btn btn-danger" @click="removeAvatar">
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
            កែឡើង
          </button>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">នោះ</label>
            <input
              v-model="form.firstName"
              type="text"
              class="form-input"
              :class="{ editable: isEditing }"
              placeholder="Chea"
              :readonly="!isEditing"
            />
          </div>
          <div class="form-group">
            <label class="form-label">នាម ត្រកូល</label>
            <input
              v-model="form.lastName"
              type="text"
              class="form-input"
              :class="{ editable: isEditing }"
              placeholder="Phing"
              :readonly="!isEditing"
            />
          </div>
        </div>

        <div v-if="isEditing" class="edit-actions">
          <button class="btn btn-save" @click="saveEdit">រក្សាទុក</button>
          <button class="btn btn-cancel-edit" @click="cancelEdit">បោះបង់</button>
        </div>

        <hr class="divider" />

        <div class="info-row">
          <div class="info-left">
            <p class="info-title">ពាក្យសម្ងាត់</p>
            <p class="info-sub">បានធ្លាស់ប្តូរក្រោយ 3 ខែមុន</p>
          </div>
          <button class="btn btn-dark" @click="changePassword">
            ប្តូរពាក្យសម្ងាត់
          </button>
        </div>

        <hr class="divider" />

        <div class="info-row">
          <div class="info-left">
            <p class="info-title">អ៊ីមែល</p>
            <p class="info-sub">{{ form.email }}</p>
          </div>
          <button class="btn btn-primary" @click="changeEmail">
            ផ្លាស់ប្តូរអ៊ីមែល
          </button>
        </div>

      </div>
    </div>

    <!-- Section 3: Danger Zone -->
    <div class="danger-zone-section">
      <div class="danger-card">
        <div class="danger-left">
          <p class="danger-title">Danger Zone</p>
          <p class="danger-sub">Manage your account settings and profile information</p>
        </div>
        <button class="btn-delete" @click="confirmDelete">
          Delete Account
        </button>
      </div>

      <!-- Confirm Modal -->
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <p class="modal-title">Delete Account?</p>
          <p class="modal-sub">This action cannot be undone. All your data will be permanently removed.</p>
          <div class="modal-actions">
            <button class="btn-modal-cancel" @click="showModal = false">Cancel</button>
            <button class="btn-modal-confirm" @click="deleteAccount">Yes, Delete</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// ── Section 1: Avatar ──
const avatarUrl = ref(null)
const fileInput = ref(null)

function triggerUpload() {
  fileInput.value?.click()
}

function handleUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
  event.target.value = ''
}

function removeAvatar() {
  avatarUrl.value = null
}

// ── Section 2: Profile Info ──
const isEditing = ref(false)

const form = reactive({
  firstName: 'Chea',
  lastName: 'Phing',
  email: 'cheaphing32@gmail.com',
})

const original = reactive({ ...form })

function startEdit() {
  Object.assign(original, form)
  isEditing.value = true
}

function saveEdit() {
  isEditing.value = false
}

function cancelEdit() {
  Object.assign(form, original)
  isEditing.value = false
}

function changePassword() {
  // navigate or emit to parent
}

function changeEmail() {
  // navigate or emit to parent
}

// ── Section 3: Danger Zone ──
const showModal = ref(false)

function confirmDelete() {
  showModal.value = true
}

function deleteAccount() {
  showModal.value = false
  // emit('delete') or call your API here
}
</script>

<style scoped>
.profile-page {
  font-family: 'Kantumruy Pro', 'Khmer OS', 'Hanuman', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  color: #1d4ed8;
}

.btn-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* ── Section 2 ── */
.profile-info-section {
  padding-bottom: 0;
}

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
  transition: border-color 0.15s;
}

.form-input[readonly] {
  color: #6b7280;
  cursor: default;
}

.form-input.editable {
  background: #ffffff;
  color: #1a1a2e;
  border-color: #1a6ef7;
}

.form-input:not([readonly]):focus {
  border-color: #1a6ef7;
}

.edit-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 1.25rem;
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

/* ── Section 3: Danger Zone ── */
.danger-zone-section {
  padding-bottom: 1.5rem;
}

.danger-card {
  background: #e8e8e8;
  border: 1px solid #d9d9d9;
  border-radius: 14px;
  padding: 1.25rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.danger-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.danger-title {
  font-size: 16px;
  font-weight: 700;
  color: #e53e3e;
  margin: 0;
}

.danger-sub {
  font-size: 13px;
  color: #c0392b;
  opacity: 0.75;
  margin: 0;
}

.btn-delete {
  background: #e53e3e;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s, transform 0.1s;
  white-space: nowrap;
}

.btn-delete:hover  { opacity: 0.88; }
.btn-delete:active { transform: scale(0.97); }

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #ffffff;
  border-radius: 14px;
  padding: 2rem;
  max-width: 380px;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #e53e3e;
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
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.btn-modal-cancel {
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 999px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}

.btn-modal-confirm {
  background: #e53e3e;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}

.btn-modal-cancel:hover,
.btn-modal-confirm:hover { opacity: 0.88; }

/* ── Shared Buttons ── */
.btn {
  border: none;
  border-radius: 999px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s, transform 0.1s;
  white-space: nowrap;
}

.btn:hover  { opacity: 0.88; }
.btn:active { transform: scale(0.97); }

.btn-primary     { background: #1a6ef7; color: #ffffff; }
.btn-danger      { background: #e53e3e; color: #ffffff; }
.btn-dark        { background: #4b5563; color: #ffffff; }
.btn-edit        { background: #e5e7eb; color: #374151; }
.btn-save        { background: #1a6ef7; color: #ffffff; }
.btn-cancel-edit { background: #f3f4f6; color: #374151; }
</style>