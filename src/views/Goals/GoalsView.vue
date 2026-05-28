<template>
  <div class="dashboard bg-transparent">

    <!-- SKELETON -->
    <template v-if="pageLoading">
      <section><div class="skeleton skeleton-header"></div></section>
      <section class="mt-3">
        <div class="row g-3">
          <div class="col-md-4" v-for="n in 3" :key="n"><div class="skeleton skeleton-card"></div></div>
        </div>
      </section>
      <section class="mt-3"><div class="skeleton skeleton-goal"></div></section>
      <section class="mt-3"><div class="skeleton skeleton-goal"></div></section>
    </template>

    <!-- REAL CONTENT -->
    <template v-else>

      <div class="header-card">
        <div>
          <h1>គោលដៅសន្សំ</h1>
          <p>តាមដាន និងគ្រប់គ្រងគោលដៅសន្សំប្រាក់របស់អ្នក</p>
        </div>
        <button class="add-btn fonts" @click="openCreateModal">បន្ថែមគោលដៅថ្មី <span>+</span></button>
      </div>

      <div class="stats-grid">
        <div class="stat-card"><h4 class="fonts">គោលដៅសរុប</h4><h2 class="fonts">{{ goals.length }}</h2></div>
        <div class="stat-card"><h4 class="fonts">ប្រាក់សន្សំសរុប</h4><h2 class="fonts">${{ totalSaved.toLocaleString() }}</h2></div>
        <div class="stat-card"><h4 class="fonts">ទឹកប្រាក់នៅសល់</h4><h2 class="fonts">${{ totalRemaining.toLocaleString() }}</h2></div>
      </div>

      <div v-if="goals.length === 0" class="empty-state">
        <div class="empty-icon"><i class="bi bi-bullseye"></i></div>
        <h3 class="fonts">មិនទាន់មានគោលដៅ</h3>
        <p class="fonts">ចាប់ផ្ដើមបន្ថែមគោលដៅសន្សំប្រាក់ដំបូងរបស់អ្នក</p>
        <button class="add-btn fonts" @click="openCreateModal" style="margin-top:1rem;">បន្ថែមគោលដៅ <span>+</span></button>
      </div>

      <div class="goal-card" v-for="goal in goals" :key="goal.id">
        <div class="goal-top">
          <div>
            <div class="title-row">
              <h3 class="fonts">{{ goal.name }}</h3>
              <span class="status" :class="statusClass(goal.progress)">{{ goal.progress }}%</span>
            </div>
            <p class="fonts deadline-text"><i class="bi bi-calendar3"></i> ថ្ងៃកំណត់: {{ formatDate(goal.deadline) }}</p>
          </div>
          <div class="actions">
            <span @click="openEditModal(goal)" title="កែសម្រួល"><i class="bi bi-pencil-square"></i></span>
            <span @click="openDeleteModal(goal.id)" class="delete-action" title="លុប"><i class="bi bi-trash3"></i></span>
          </div>
        </div>
        <div class="progress-section">
          <div class="progress-label">
            <span class="fonts">សម្រេចបាន {{ goal.progress }}%</span>
            <span class="fonts progress-target">គោលដៅ: ${{ goal.targetAmount.toLocaleString() }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: goal.progress + '%', background: goal.color }"></div>
          </div>
        </div>
        <div class="goal-bottom">
          <div><h2 class="fonts">${{ goal.saved.toLocaleString() }}</h2><p class="fonts">បានសន្សំ</p></div>
          <div class="remaining"><h2 class="fonts">${{ Math.max(goal.remaining,0).toLocaleString() }}</h2><p class="fonts">នៅសល់</p></div>
        </div>
        <button class="save-btn fonts" @click="openProgressModal(goal)" :disabled="goal.progress >= 100">
          <i class="bi" :class="goal.progress >= 100 ? 'bi-check-circle-fill' : 'bi-plus-circle'"></i>
          {{ goal.progress >= 100 ? 'បានបញ្ចប់គោលដៅ 🎉' : 'បន្ថែមប្រាក់សន្សំ' }}
        </button>
      </div>

    </template>

    <!-- ════════════════════════════════════════════
         CREATE MODAL
    ═════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showModal" class="swal-overlay" @click.self="closeModal">
          <div class="swal-box">
            <div class="swal-header">
              <div class="swal-header__icon icon-create"><i class="bi bi-plus-circle-fill"></i></div>
              <div>
                <h3 class="swal-title">បន្ថែមគោលដៅថ្មី</h3>
                <p class="swal-desc">បំពេញព័ត៌មានគោលដៅសន្សំប្រាក់</p>
              </div>
              <button class="swal-close" @click="closeModal" :disabled="createLoading"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="swal-body" style="position:relative;">
              <div v-if="createLoading" class="form-loading-overlay">
                <div class="form-spinner"></div><span>កំពុងរក្សាទុក...</span>
              </div>
              <div class="field-group">
                <label class="field-label">ឈ្មោះគោលដៅ <span class="required">*</span></label>
                <div class="input-shell" :class="{ 'is-invalid': formErrors.name }">
                  <i class="bi bi-bullseye field-icon"></i>
                  <input type="text" v-model="form.name" placeholder="ឧ. ទិញម៉ូតូ" :disabled="createLoading" @input="clearError('name')" />
                </div>
                <div v-if="formErrors.name" class="field-error"><i class="bi bi-exclamation-circle"></i> {{ formErrors.name }}</div>
              </div>
              <div class="field-group">
                <label class="field-label">ចំនួនទឹកប្រាក់គោលដៅ <span class="required">*</span></label>
                <div class="input-shell" :class="{ 'is-invalid': formErrors.targetAmount }">
                  <span class="field-icon dollar-sign">$</span>
                  <input type="number" v-model="form.targetAmount" placeholder="0.00" min="1" step="0.01" :disabled="createLoading" @input="clearError('targetAmount')" />
                </div>
                <div v-if="formErrors.targetAmount" class="field-error"><i class="bi bi-exclamation-circle"></i> {{ formErrors.targetAmount }}</div>
              </div>
              <div class="field-group" style="margin-bottom:0;">
                <label class="field-label">កាលបរិច្ឆេទកំណត់ <span class="required">*</span></label>
                <div class="input-shell" :class="{ 'is-invalid': formErrors.deadline }">
                  <i class="bi bi-calendar3 field-icon"></i>
                  <input type="date" v-model="form.deadline" :min="todayStr" :disabled="createLoading" @change="clearError('deadline')" />
                </div>
                <div v-if="formErrors.deadline" class="field-error"><i class="bi bi-exclamation-circle"></i> {{ formErrors.deadline }}</div>
              </div>
            </div>
            <div class="swal-footer">
              <button class="swal-btn swal-btn--cancel" @click="closeModal" :disabled="createLoading">បោះបង់</button>
              <button class="swal-btn swal-btn--confirm" @click="createGoal" :disabled="createLoading">
                <span v-if="createLoading" class="btn-spinner btn-spinner--white"></span>
                <i v-else class="bi bi-plus-lg"></i>
                {{ createLoading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ════════════════════════════════════════════
         EDIT MODAL
    ═════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showEditModal" class="swal-overlay" @click.self="closeEditModal">
          <div class="swal-box">
            <div class="swal-header">
              <div class="swal-header__icon icon-edit"><i class="bi bi-pencil-square"></i></div>
              <div>
                <h3 class="swal-title">កែសម្រួលគោលដៅ</h3>
                <p class="swal-desc">កែប្រែព័ត៌មានគោលដៅសន្សំប្រាក់</p>
              </div>
              <button class="swal-close" @click="closeEditModal" :disabled="editLoading"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="swal-body" style="position:relative;">
              <div v-if="editLoading" class="form-loading-overlay">
                <div class="form-spinner"></div><span>កំពុងរក្សាទុក...</span>
              </div>
              <div class="field-group">
                <label class="field-label">ឈ្មោះគោលដៅ <span class="required">*</span></label>
                <div class="input-shell" :class="{ 'is-invalid': editErrors.name }">
                  <i class="bi bi-bullseye field-icon"></i>
                  <input type="text" v-model="editForm.name" :disabled="editLoading" @input="clearEditError('name')" />
                </div>
                <div v-if="editErrors.name" class="field-error"><i class="bi bi-exclamation-circle"></i> {{ editErrors.name }}</div>
              </div>
              <div class="field-group">
                <label class="field-label">ចំនួនទឹកប្រាក់គោលដៅ <span class="required">*</span></label>
                <div class="input-shell" :class="{ 'is-invalid': editErrors.targetAmount }">
                  <span class="field-icon dollar-sign">$</span>
                  <input type="number" v-model="editForm.targetAmount" min="1" step="0.01" :disabled="editLoading" @input="clearEditError('targetAmount')" />
                </div>
                <div v-if="editErrors.targetAmount" class="field-error"><i class="bi bi-exclamation-circle"></i> {{ editErrors.targetAmount }}</div>
              </div>
              <div class="field-group" style="margin-bottom:0;">
                <label class="field-label">កាលបរិច្ឆេទកំណត់ <span class="required">*</span></label>
                <div class="input-shell" :class="{ 'is-invalid': editErrors.deadline }">
                  <i class="bi bi-calendar3 field-icon"></i>
                  <input type="date" v-model="editForm.deadline" :disabled="editLoading" @change="clearEditError('deadline')" />
                </div>
                <div v-if="editErrors.deadline" class="field-error"><i class="bi bi-exclamation-circle"></i> {{ editErrors.deadline }}</div>
              </div>
            </div>
            <div class="swal-footer">
              <button class="swal-btn swal-btn--cancel" @click="closeEditModal" :disabled="editLoading">បោះបង់</button>
              <button class="swal-btn swal-btn--confirm" @click="updateGoal" :disabled="editLoading">
                <span v-if="editLoading" class="btn-spinner btn-spinner--white"></span>
                <i v-else class="bi bi-check-lg"></i>
                {{ editLoading ? 'កំពុងរក្សាទុក...' : 'ធ្វើបច្ចុប្បន្នភាព' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ════════════════════════════════════════════
         PROGRESS MODAL
    ═════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showProgressModal" class="swal-overlay" @click.self="closeProgressModal">
          <div class="swal-box">
            <div class="swal-header">
              <div class="swal-header__icon icon-progress"><i class="bi bi-piggy-bank-fill"></i></div>
              <div>
                <h3 class="swal-title">បន្ថែមប្រាក់សន្សំ</h3>
                <p class="swal-desc">{{ selectedGoal?.name }}</p>
              </div>
              <button class="swal-close" @click="closeProgressModal" :disabled="progressLoading"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="swal-body" style="position:relative;">
              <div v-if="progressLoading" class="form-loading-overlay">
                <div class="form-spinner"></div><span>កំពុងរក្សាទុក...</span>
              </div>
              <div v-if="selectedGoal" class="goal-info-strip">
                <div class="goal-info-name">{{ selectedGoal.name }}</div>
                <div class="goal-info-meta">
                  <span>បានសន្សំ: ${{ selectedGoal.saved.toLocaleString() }}</span>
                  <span>នៅសល់: ${{ Math.max(selectedGoal.remaining,0).toLocaleString() }}</span>
                </div>
                <div class="mini-progress-bar">
                  <div class="mini-progress-fill" :style="{ width: selectedGoal.progress + '%', background: selectedGoal.color }"></div>
                </div>
              </div>
              <div class="field-group" style="margin-bottom:0;">
                <label class="field-label">ចំនួនទឹកប្រាក់ដែលត្រូវបន្ថែម <span class="required">*</span></label>
                <div class="input-shell" :class="{ 'is-invalid': progressError }">
                  <span class="field-icon dollar-sign">$</span>
                  <input type="number" v-model="progressAmount" placeholder="0.00" min="0.01" step="0.01" :disabled="progressLoading" @input="progressError = ''" />
                </div>
                <div v-if="progressError" class="field-error"><i class="bi bi-exclamation-circle"></i> {{ progressError }}</div>
              </div>
            </div>
            <div class="swal-footer">
              <button class="swal-btn swal-btn--cancel" @click="closeProgressModal" :disabled="progressLoading">បោះបង់</button>
              <button class="swal-btn swal-btn--confirm" @click="submitGoalProgress" :disabled="progressLoading">
                <span v-if="progressLoading" class="btn-spinner btn-spinner--white"></span>
                <i v-else class="bi bi-check-lg"></i>
                {{ progressLoading ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ════════════════════════════════════════════
         DELETE MODAL
    ═════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showDeleteModal" class="swal-overlay" @click.self="closeDeleteModal">
          <div class="swal-box swal-box--delete">
            <div class="swal-header swal-header--center">
              <div class="delete-icon-wrap"><i class="bi bi-trash3-fill"></i></div>
            </div>
            <div class="swal-body swal-body--center">
              <h3 class="swal-title">លុបគោលដៅ?</h3>
              <p class="delete-desc">តើអ្នកពិតជាចង់លុបគោលដៅនេះមែនទេ?</p>
              <div class="delete-warning">
                <i class="bi bi-exclamation-triangle-fill"></i>
                ទិន្នន័យនឹងបាត់ទៅជាអចិន្ត្រៃយ៍ ហើយមិនអាចត្រឡប់វិញបានទេ
              </div>
            </div>
            <div class="swal-footer">
              <button class="swal-btn swal-btn--cancel" @click="closeDeleteModal" :disabled="deleteLoading">បោះបង់</button>
              <button class="swal-btn swal-btn--delete" @click="removeGoal" :disabled="deleteLoading">
                <span v-if="deleteLoading" class="btn-spinner btn-spinner--white"></span>
                <i v-else class="bi bi-trash3-fill"></i>
                {{ deleteLoading ? 'កំពុងលុប...' : 'លុប' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ════════════════════════════════════════════
         MESSAGE MODAL
    ═════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showMessageModal" class="swal-overlay">
          <div class="swal-box swal-box--delete">
            <div class="swal-header swal-header--center">
              <div class="message-icon-wrap" :class="messageType === 'success' ? 'icon-success' : 'icon-error'">
                <i :class="messageType === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
              </div>
            </div>
            <div class="swal-body swal-body--center">
              <h3 class="swal-title">{{ messageTitle }}</h3>
              <p class="delete-desc">{{ messageText }}</p>
            </div>
            <div class="swal-footer">
              <button class="swal-btn swal-btn--confirm" @click="closeMessageModal">យល់ព្រម</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useGoalsStore } from '@/stores/goalStore'

const goalStore = useGoalsStore()

const pageLoading     = ref(true)
const createLoading   = ref(false)
const editLoading     = ref(false)
const deleteLoading   = ref(false)
const progressLoading = ref(false)

const showModal         = ref(false)
const showEditModal     = ref(false)
const showProgressModal = ref(false)
const showDeleteModal   = ref(false)
const showMessageModal  = ref(false)

const messageTitle = ref('')
const messageText  = ref('')
const messageType  = ref('success')

function openMessageModal(title, text, type = 'success') {
  messageTitle.value = title; messageText.value = text; messageType.value = type
  showMessageModal.value = true
}
function closeMessageModal() { showMessageModal.value = false }

const form       = ref({ name: '', targetAmount: '', deadline: '' })
const formErrors = reactive({ name: '', targetAmount: '', deadline: '' })
function clearError(field) { formErrors[field] = '' }

function validateCreate() {
  formErrors.name = ''; formErrors.targetAmount = ''; formErrors.deadline = ''
  let ok = true
  if (!form.value.name.trim()) { formErrors.name = 'សូមបញ្ចូលឈ្មោះគោលដៅ'; ok = false }
  else if (form.value.name.trim().length < 2) { formErrors.name = 'ឈ្មោះត្រូវមានយ៉ាងហោចណាស់ 2 តួអក្សរ'; ok = false }
  const amt = Number(form.value.targetAmount)
  if (!form.value.targetAmount) { formErrors.targetAmount = 'សូមបញ្ចូលចំនួនទឹកប្រាក់'; ok = false }
  else if (isNaN(amt) || amt <= 0) { formErrors.targetAmount = 'ចំនួនទឹកប្រាក់ត្រូវតែធំជាង 0'; ok = false }
  else if (amt > 10_000_000) { formErrors.targetAmount = 'ចំនួនទឹកប្រាក់ធំពេក (អតិបរមា $10,000,000)'; ok = false }
  if (!form.value.deadline) { formErrors.deadline = 'សូមជ្រើសកាលបរិច្ឆេទ'; ok = false }
  else if (new Date(form.value.deadline) <= new Date(todayStr.value)) { formErrors.deadline = 'កាលបរិច្ឆេទត្រូវតែជាអនាគត'; ok = false }
  return ok
}

const editForm   = ref({ id: '', name: '', targetAmount: '', deadline: '' })
const editErrors = reactive({ name: '', targetAmount: '', deadline: '' })
function clearEditError(field) { editErrors[field] = '' }

function validateEdit() {
  editErrors.name = ''; editErrors.targetAmount = ''; editErrors.deadline = ''
  let ok = true
  if (!editForm.value.name.trim()) { editErrors.name = 'សូមបញ្ចូលឈ្មោះគោលដៅ'; ok = false }
  else if (editForm.value.name.trim().length < 2) { editErrors.name = 'ឈ្មោះត្រូវមានយ៉ាងហោចណាស់ 2 តួអក្សរ'; ok = false }
  const amt = Number(editForm.value.targetAmount)
  if (!editForm.value.targetAmount) { editErrors.targetAmount = 'សូមបញ្ចូលចំនួនទឹកប្រាក់'; ok = false }
  else if (isNaN(amt) || amt <= 0) { editErrors.targetAmount = 'ចំនួនទឹកប្រាក់ត្រូវតែធំជាង 0'; ok = false }
  else if (amt > 10_000_000) { editErrors.targetAmount = 'ចំនួនទឹកប្រាក់ធំពេក (អតិបរមា $10,000,000)'; ok = false }
  if (!editForm.value.deadline) { editErrors.deadline = 'សូមជ្រើសកាលបរិច្ឆេទ'; ok = false }
  return ok
}

const selectedGoalId  = ref('')
const selectedGoal    = ref(null)
const progressAmount  = ref('')
const progressError   = ref('')
const deleteGoalId    = ref(null)
const todayStr = computed(() => new Date().toISOString().split('T')[0])

function statusClass(p) {
  if (p >= 100) return 'status--complete'
  if (p >= 70)  return 'status--good'
  if (p >= 30)  return 'status--mid'
  return 'status--low'
}

const goals = computed(() =>
  goalStore.goals.map((goal) => {
    const saved    = goal.currentAmount || 0
    const target   = goal.targetAmount  || 0
    const progress = target > 0 ? Math.min(Math.round((saved / target) * 100), 100) : 0
    return { ...goal, saved, remaining: target - saved, progress,
      color: progress >= 100 ? '#7c3aed' : progress >= 70 ? '#16a34a' : progress >= 30 ? '#ff7a00' : '#ef4444' }
  })
)
const totalSaved     = computed(() => goals.value.reduce((t, g) => t + g.saved, 0))
const totalRemaining = computed(() => goals.value.reduce((t, g) => t + Math.max(g.remaining, 0), 0))

onMounted(async () => { try { await goalStore.fetchAllGoals() } finally { pageLoading.value = false } })

function openCreateModal() {
  form.value = { name: '', targetAmount: '', deadline: '' }
  formErrors.name = ''; formErrors.targetAmount = ''; formErrors.deadline = ''
  showModal.value = true
}
async function createGoal() {
  if (!validateCreate()) return
  createLoading.value = true
  try {
    await goalStore.createGoal({ name: form.value.name.trim(), targetAmount: Number(form.value.targetAmount), deadline: form.value.deadline })
    await goalStore.fetchAllGoals()
    openMessageModal('ជោគជ័យ', 'បង្កើតគោលដៅជោគជ័យ', 'success')
    closeModal()
  } catch (e) { openMessageModal('បរាជ័យ', e?.response?.data?.message ?? 'បង្កើតគោលដៅបរាជ័យ', 'error') }
  finally { createLoading.value = false }
}
function closeModal() { showModal.value = false; form.value = { name: '', targetAmount: '', deadline: '' }; formErrors.name = ''; formErrors.targetAmount = ''; formErrors.deadline = '' }

function openEditModal(goal) {
  editErrors.name = ''; editErrors.targetAmount = ''; editErrors.deadline = ''
  editForm.value = { id: goal.id, name: goal.name, targetAmount: goal.targetAmount, deadline: goal.deadline?.split('T')[0] ?? '' }
  showEditModal.value = true
}
async function updateGoal() {
  if (!validateEdit()) return
  editLoading.value = true
  try {
    await goalStore.updateGoal(editForm.value.id, { name: editForm.value.name.trim(), targetAmount: Number(editForm.value.targetAmount), deadline: editForm.value.deadline })
    await goalStore.fetchAllGoals()
    openMessageModal('ជោគជ័យ', 'កែសម្រួលជោគជ័យ', 'success')
    closeEditModal()
  } catch (e) { openMessageModal('បរាជ័យ', e?.response?.data?.message ?? 'កែសម្រួលបរាជ័យ', 'error') }
  finally { editLoading.value = false }
}
function closeEditModal() { showEditModal.value = false; editErrors.name = ''; editErrors.targetAmount = ''; editErrors.deadline = '' }

function openDeleteModal(id)  { deleteGoalId.value = id; showDeleteModal.value = true }
function closeDeleteModal()   { showDeleteModal.value = false; deleteGoalId.value = null }
async function removeGoal() {
  deleteLoading.value = true
  try {
    await goalStore.deleteGoal(deleteGoalId.value)
    await goalStore.fetchAllGoals()
    openMessageModal('ជោគជ័យ', 'លុបគោលដៅជោគជ័យ', 'success')
    closeDeleteModal()
  } catch (e) { openMessageModal('បរាជ័យ', e?.response?.data?.message ?? 'លុបគោលដៅបរាជ័យ', 'error') }
  finally { deleteLoading.value = false }
}

function openProgressModal(goal) { selectedGoalId.value = goal.id; selectedGoal.value = goal; progressAmount.value = ''; progressError.value = ''; showProgressModal.value = true }
function closeProgressModal()    { showProgressModal.value = false; progressAmount.value = ''; progressError.value = ''; selectedGoalId.value = ''; selectedGoal.value = null }

async function submitGoalProgress() {
  progressError.value = ''
  const amt = Number(progressAmount.value)
  if (!progressAmount.value) { progressError.value = 'សូមបញ្ចូលចំនួនទឹកប្រាក់'; return }
  if (isNaN(amt) || amt <= 0) { progressError.value = 'ចំនួនទឹកប្រាក់ត្រូវតែធំជាង 0'; return }
  if (selectedGoal.value && amt > Math.max(selectedGoal.value.remaining, 0)) {
    progressError.value = `ចំនួនទឹកប្រាក់ច្រើនជាគោលដៅ (នៅសល់ $${Math.max(selectedGoal.value.remaining,0).toLocaleString()})`; return
  }
  progressLoading.value = true
  try {
    await goalStore.addGoalProgress(selectedGoalId.value, progressAmount.value)
    await goalStore.fetchAllGoals()
    openMessageModal('ជោគជ័យ', 'បន្ថែមប្រាក់សន្សំជោគជ័យ', 'success')
    closeProgressModal()
  } catch (e) { openMessageModal('បរាជ័យ', e?.response?.data?.message ?? 'បន្ថែមប្រាក់សន្សំបរាជ័យ', 'error') }
  finally { progressLoading.value = false }
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('km-KH', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.skeleton { background: linear-gradient(90deg, var(--bg-input) 25%, var(--border-color) 50%, var(--bg-input) 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; border-radius: var(--radius); }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.skeleton-header { height: 80px; } .skeleton-card { height: 110px; } .skeleton-goal { height: 260px; margin-bottom: 16px; }
section { font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important; background-color: transparent !important; }

.dashboard { font-family: 'Kantumruy Pro', sans-serif; }
.fonts { font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important; }

.header-card { background: var(--bg-sidebar); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow); margin-bottom: 20px; }
.header-card h1 { font-size: 20px; font-weight: 700; margin: 0 0 2px; color: var(--text-white); }
.header-card p  { font-size: 12px; margin: 0; color: rgba(255,255,255,0.65); }
.add-btn { height: 46px; padding: 0 20px; font-size: 15px; white-space: nowrap; font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important; background: rgba(255,255,255,0.15); color: var(--text-white); border: 1.5px solid rgba(255,255,255,0.4); border-radius: 12px; cursor: pointer; transition: var(--transition); display: inline-flex; align-items: center; gap: 6px; }
.add-btn:hover { background: rgba(255,255,255,0.25); }

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 24px; }
.stat-card { background: var(--bg-card); padding: 24px; border-radius: 16px; box-shadow: var(--shadow); }
.stat-card h4 { color: var(--text-secondary); margin-bottom: 10px; font-size: 13px; }
.stat-card h2 { font-size: 32px; color: var(--text-primary); }

.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; background: var(--bg-card); border-radius: 16px; box-shadow: var(--shadow); text-align: center; margin-bottom: 24px; }
.empty-icon { width: 80px; height: 80px; background: var(--bg-input); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; color: var(--text-secondary); margin-bottom: 16px; }
.empty-state h3 { font-size: 20px; color: var(--text-primary); margin-bottom: 8px; }
.empty-state p  { font-size: 14px; color: var(--text-secondary); }

.goal-card { background: var(--bg-card); padding: 24px; border-radius: 12px; margin-bottom: 24px; box-shadow: var(--shadow); transition: var(--transition); }
.goal-card:hover { transform: translateY(-2px); }
.goal-top { display: flex; justify-content: space-between; margin-bottom: 24px; }
.title-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.title-row h3 { font-size: 22px; color: var(--text-primary); }
.deadline-text { font-size: 13px; color: var(--text-secondary); margin-top: 6px; display: flex; align-items: center; gap: 6px; }
.status { padding: 5px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; }
.status--complete { background: rgba(124,58,237,0.15); color: #7c3aed; }
.status--good     { background: rgba(22,163,74,0.15);  color: #16a34a; }
.status--mid      { background: rgba(255,122,0,0.15);  color: #ff7a00; }
.status--low      { background: rgba(239,68,68,0.15);  color: #ef4444; }
.actions { display: flex; gap: 12px; }
.actions span { width: 42px; height: 42px; background: var(--bg-input); border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; color: var(--text-primary); font-size: 16px; }
.actions span:hover { transform: scale(1.08); background: var(--border-color); }
.delete-action { color: var(--color-danger) !important; }
.progress-section { margin-bottom: 20px; }
.progress-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 13px; }
.progress-target { color: var(--text-secondary); }
.progress-bar  { width: 100%; height: 12px; background: var(--border-color); border-radius: 999px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 999px; transition: width 0.6s ease; }
.goal-bottom { display: flex; justify-content: space-between; margin-bottom: 20px; }
.goal-bottom h2 { font-size: 28px; color: var(--text-primary); }
.goal-bottom p  { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
.remaining h2 { color: var(--color-danger); }
.save-btn { width: 100%; border: none; background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover)); color: var(--text-white); padding: 16px; border-radius: 18px; cursor: pointer; font-weight: 700; font-size: 15px; font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
.save-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* ══════════════════════════════════════════════
   SHARED MODAL STYLES
══════════════════════════════════════════════ */
.swal-overlay { position: fixed; inset: 0; background: rgba(4,44,131,0.22); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 16px; }
.swal-box { background: var(--bg-card); border-radius: 24px; width: 100%; max-width: 460px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: var(--shadow); overflow: hidden; font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif; border: 1px solid var(--border-color); }
.swal-box--delete { max-width: 400px; }

.swal-header { display: flex; align-items: center; gap: 14px; padding: 22px 24px 16px; border-bottom: 1px solid var(--border-color); position: relative; flex-shrink: 0; }
.swal-header--center { flex-direction: column; align-items: center; border-bottom: none; padding-bottom: 0; }
.swal-header__icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.icon-create   { background: var(--bg-input);           color: var(--color-primary); }
.icon-edit     { background: var(--color-danger-light); color: var(--color-danger); }
.icon-progress { background: var(--color-success-light);color: var(--color-success); }
.swal-title { margin: 0 0 2px; font-size: 17px; font-weight: 800; color: var(--text-primary); }
.swal-desc  { margin: 0; font-size: 12px; color: var(--text-secondary); }
.swal-close { position: absolute; top: 18px; right: 18px; width: 32px; height: 32px; border-radius: 8px; border: none; background: var(--bg-input); color: var(--text-secondary); font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
.swal-close:hover:not(:disabled) { background: var(--color-danger); color: var(--text-white); }
.swal-close:disabled { opacity: 0.4; cursor: not-allowed; }

.swal-body { padding: 20px 24px; overflow-y: auto; flex: 1; }
.swal-body--center { text-align: center; }
.swal-footer { display: flex; gap: 10px; padding: 16px 24px 22px; border-top: 1px solid var(--border-color); flex-shrink: 0; }
.swal-btn { flex: 1; height: 46px; border-radius: 50px; border: none; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif; display: flex; align-items: center; justify-content: center; gap: 7px; transition: var(--transition); }
.swal-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.swal-btn--cancel  { background: var(--bg-input); color: var(--text-secondary); }
.swal-btn--cancel:hover:not(:disabled) { background: var(--bg-body); color: var(--text-primary); }
.swal-btn--confirm { flex: 2; background: var(--color-primary); color: var(--text-white); box-shadow: 0 4px 14px color-mix(in srgb, var(--color-primary) 30%, transparent); }
.swal-btn--confirm:hover:not(:disabled) { background: var(--color-primary-hover); transform: translateY(-1px); }
.swal-btn--delete  { flex: 2; background: var(--color-danger); color: var(--text-white); box-shadow: 0 4px 14px color-mix(in srgb, var(--color-danger) 30%, transparent); }
.swal-btn--delete:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }

.form-loading-overlay { position: absolute; inset: 0; z-index: 10; background: color-mix(in srgb, var(--bg-card) 85%, transparent); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; font-size: 13px; color: var(--text-secondary); font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif; }
.form-spinner { width: 32px; height: 32px; border: 3px solid color-mix(in srgb, var(--color-primary) 25%, transparent); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.7s linear infinite; }

.field-group { margin-bottom: 18px; }
.field-label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: var(--text-primary); }
.required { color: var(--color-danger); }
.input-shell { display: flex; align-items: center; height: 46px; border: 1.5px solid var(--border-color); border-radius: 50px; padding: 0 16px; background: var(--bg-input); transition: var(--transition); }
.input-shell:focus-within { border-color: var(--color-primary); background: var(--bg-card); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent); }
.input-shell.is-invalid { border-color: var(--color-danger); background: var(--color-danger-light); }
.field-icon { color: var(--text-secondary); font-size: 14px; flex-shrink: 0; margin-right: 8px; }
.dollar-sign { font-weight: 700; font-size: 15px; }
.input-shell input { flex: 1; height: 100%; border: 0; outline: 0; background: transparent; font-size: 14px; color: var(--text-primary); font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif; }
.input-shell input::placeholder { color: var(--border-color); }
.input-shell input:disabled { opacity: 0.6; }
.field-error { font-size: 12px; color: var(--color-danger); margin-top: 4px; display: flex; align-items: center; gap: 4px; }

.goal-info-strip { background: var(--bg-input); border-radius: 14px; padding: 14px 16px; margin-bottom: 18px; }
.goal-info-name { font-weight: 700; font-size: 15px; color: var(--text-primary); margin-bottom: 6px; }
.goal-info-meta { display: flex; gap: 16px; font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; }
.mini-progress-bar  { height: 6px; background: var(--border-color); border-radius: 999px; overflow: hidden; }
.mini-progress-fill { height: 100%; border-radius: 999px; transition: width 0.4s; }

.delete-icon-wrap { width: 72px; height: 72px; border-radius: 50%; background: var(--color-danger-light); display: flex; align-items: center; justify-content: center; font-size: 30px; color: var(--color-danger); margin-bottom: 8px; }
.delete-desc { font-size: 15px; color: var(--text-primary); margin: 8px 0 14px; line-height: 1.6; }
.delete-warning { display: flex; align-items: flex-start; gap: 8px; background: var(--color-danger-light); border: 1px solid var(--color-danger); border-radius: 10px; color: var(--color-danger); font-size: 12px; padding: 10px 12px; text-align: left; line-height: 1.5; opacity: 0.85; }
.delete-warning i { flex-shrink: 0; margin-top: 1px; }

.message-icon-wrap { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; margin-bottom: 8px; }
.icon-success { background: var(--color-success-light); color: var(--color-success); }
.icon-error   { background: var(--color-danger-light);  color: var(--color-danger); }

.btn-spinner { width: 16px; height: 16px; flex-shrink: 0; border: 2px solid color-mix(in srgb, var(--color-primary) 30%, transparent); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.7s linear infinite; }
.btn-spinner--white { border-color: rgba(255,255,255,0.35); border-top-color: var(--text-white); }
@keyframes spin { to { transform: rotate(360deg); } }

.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .swal-box, .modal-fade-leave-to .swal-box { transform: scale(0.94) translateY(12px); }
.modal-fade-enter-active .swal-box, .modal-fade-leave-active .swal-box { transition: transform 0.25s ease; }

@media (max-width: 768px) {
  .goal-top, .goal-bottom { flex-direction: column; gap: 18px; }
  .header-card { flex-direction: column; align-items: flex-start; gap: 12px; }
  .header-card .add-btn { width: 100%; justify-content: center; }
}
</style>