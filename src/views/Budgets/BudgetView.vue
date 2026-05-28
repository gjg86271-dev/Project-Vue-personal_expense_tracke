<template>
  <div class="font-costume">

    <!-- ════════════════════════════════════════════
         PAGE LOADING SKELETON
    ═════════════════════════════════════════════ -->
    <template v-if="pageLoading">
      <section>
        <div class="skeleton skeleton-header"></div>
      </section>
      <section class="mt-3">
        <div class="skeleton skeleton-overview"></div>
      </section>
      <section class="mt-3">
        <div class="row g-3">
          <div class="col-md-4" v-for="n in 6" :key="n">
            <div class="skeleton skeleton-card"></div>
          </div>
        </div>
      </section>
    </template>

    <!-- ════════════════════════════════════════════
         REAL CONTENT
    ═════════════════════════════════════════════ -->
    <template v-else>

      <div class="header-card">
        <div>
          <h1>ថវិកា</h1>
          <p>តាមដាន និងគ្រប់គ្រងប្រាក់បស់អ្នក</p>
        </div>
        <button class="add-btn" @click="openAddModal">បន្ថែមគម្រោងថវិកា
          <span>+</span>
        </button>
      </div>

      <CardOverView :budgets="budgetStore.budgets" :totalexpenses="budgetStore.totalexpenses" />

      <div class="grid">
        <BaseCard v-for="item in budgetStore.budgets" :key="item.id" :budget="item" @edit-budget="openEditModal"
          @delete-budget="openDeleteModal" @view-budget="openDetailModal" />
      </div>

      <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
        <Pagination v-model:currentPage="currentPage" :total-pages="totalPages" :sibling-count="1" />
      </div>

    </template>

    <!-- ════════════════════════════════════════════
         DETAIL MODAL
    ═════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showDetailModal" class="swal-overlay" @click.self="closeDetailModal">
          <div class="swal-box swal-box--detail">

            <div class="swal-header">
              <div class="swal-header__icon icon-detail">
                <i class="bi bi-eye-fill"></i>
              </div>
              <div>
                <h3 class="swal-title">ព័ត៌មានលម្អិតថវិកា</h3>
                <p class="swal-desc">ព័ត៌មានលម្អិតនៃថវិកាដែលបានជ្រើស</p>
              </div>
              <button class="swal-close" @click="closeDetailModal">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="swal-body">
              <div v-if="detailLoading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="text-muted mt-2 mb-0" style="font-size:13px">កំពុងទាញទិន្នន័យ...</p>
              </div>

              <div v-else-if="budgetDetail">
                <div class="detail-banner"
                  :class="budgetDetail.category.type === 'INCOME' ? 'banner--income' : 'banner--expense'">
                  <div class="detail-banner__icon">
                    <i :class="budgetDetail.category.type === 'INCOME' ? 'bi bi-graph-up-arrow' : 'bi bi-graph-down-arrow'"></i>
                  </div>
                  <div>
                    <div class="detail-banner__name">{{ budgetDetail.category.name }}</div>
                    <div class="detail-banner__type">
                      {{ budgetDetail.category.type === 'INCOME' ? 'ប្រភេទចំណូល' : 'ប្រភេទចំណាយ' }}
                    </div>
                  </div>
                </div>

                <div class="detail-rows">
                  <div class="detail-row">
                    <span class="detail-row__label"><i class="bi bi-cash-stack"></i> ថវិកា</span>
                    <span class="detail-row__value amount">${{ budgetDetail.limitAmount.toLocaleString() }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-row__label"><i class="bi bi-calendar3"></i> ខែ / ឆ្នាំ</span>
                    <span class="detail-row__value">{{ budgetDetail.month }} / {{ budgetDetail.year }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-row__label"><i class="bi bi-bar-chart-fill"></i> ប្រភេទ</span>
                    <span :class="budgetDetail.category.type === 'INCOME'
                      ? 'badge bg-success-subtle text-success'
                      : 'badge bg-danger-subtle text-danger'">
                      <i :class="budgetDetail.category.type === 'INCOME' ? 'bi bi-graph-up-arrow' : 'bi bi-graph-down-arrow'"></i>
                      {{ budgetDetail.category.type }}
                    </span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-row__label"><i class="bi bi-shield-fill"></i> System</span>
                    <span v-if="budgetDetail.category.isSystem" class="badge bg-primary-subtle text-primary">
                      <i class="bi bi-shield-fill"></i> Yes
                    </span>
                    <span v-else class="badge bg-secondary-subtle text-secondary">No</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-row__label"><i class="bi bi-clock-history"></i> បានបង្កើត</span>
                    <span class="detail-row__value">{{ formatDate(budgetDetail.createdAt) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-row__label"><i class="bi bi-arrow-repeat"></i> បានកែ</span>
                    <span class="detail-row__value">{{ formatDate(budgetDetail.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="swal-footer">
              <button class="swal-btn swal-btn--cancel" @click="closeDetailModal">បិទ</button>
              <button class="swal-btn swal-btn--confirm" @click="openEditFromDetail">
                <i class="bi bi-pencil-square"></i> កែសម្រួល
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ════════════════════════════════════════════
         ADD / EDIT MODAL
    ═════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showModal" class="swal-overlay" @click.self="closeModal">
          <div class="swal-box">

            <div class="swal-header">
              <div class="swal-header__icon" :class="isEditing ? 'icon-edit' : 'icon-create'">
                <i :class="isEditing ? 'bi bi-pencil-square' : 'bi bi-plus-circle-fill'"></i>
              </div>
              <div>
                <h3 class="swal-title">{{ isEditing ? 'កែសម្រួលថវិកា' : 'បន្ថែមថវិកា' }}</h3>
                <p class="swal-desc">{{ isEditing ? 'កែសម្រួលថវិការបស់អ្នក' : 'បង្កើតគម្រោងថវិកាថ្មី' }}</p>
              </div>
              <button class="swal-close" @click="closeModal" :disabled="saveLoading">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="swal-body" style="position: relative;">

              <div v-if="saveLoading" class="form-loading-overlay">
                <div class="form-spinner"></div>
                <span>កំពុងរក្សាទុក...</span>
              </div>

              <!-- Category -->
              <div class="field-group">
                <label class="field-label">ឈ្មោះប្រភេទ <span class="required">*</span></label>
                <div class="input-shell input-shell--select" :class="{ 'is-invalid': formErrors.categoryId }">
                  <i class="bi bi-tag-fill field-icon"></i>
                  <select v-model="form.categoryId" :disabled="saveLoading"
                    @change="clearError('categoryId')">
                    <option disabled value="">ជ្រើសរើសប្រភេទ</option>
                    <option
                      v-for="category in expenseCategories"
                      :key="category.id"
                      :value="category.id"
                      :disabled="!isEditing && isCategoryUsed(category.id)"
                    >
                      {{ category.name }}{{ !isEditing && isCategoryUsed(category.id) ? ' (មានរួចហើយ)' : '' }}
                    </option>
                  </select>
                </div>
                <div v-if="formErrors.categoryId" class="field-error">
                  <i class="bi bi-exclamation-circle"></i> {{ formErrors.categoryId }}
                </div>
              </div>

              <!-- Amount -->
              <div class="field-group">
                <label class="field-label">ចំនួនទឹកប្រាក់ <span class="required">*</span></label>
                <div class="input-shell" :class="{ 'is-invalid': formErrors.limitAmount }">
                  <span class="field-icon" style="font-weight:700; font-size:15px;">$</span>
                  <input v-model="form.limitAmount" type="number" placeholder="0.00" min="1" step="0.01"
                    :disabled="saveLoading" @input="clearError('limitAmount')" />
                </div>
                <div v-if="formErrors.limitAmount" class="field-error">
                  <i class="bi bi-exclamation-circle"></i> {{ formErrors.limitAmount }}
                </div>
              </div>

            </div>

            <div class="swal-footer">
              <button class="swal-btn swal-btn--cancel" @click="closeModal" :disabled="saveLoading">បោះបង់</button>
              <!-- ✅ disabled when saveLoading is true to prevent double submit -->
              <button class="swal-btn swal-btn--confirm" @click="saveBudget" :disabled="saveLoading">
                <span v-if="saveLoading" class="btn-spinner btn-spinner--white"></span>
                <i v-else :class="isEditing ? 'bi bi-check-lg' : 'bi bi-plus-lg'"></i>
                {{ saveLoading ? 'កំពុងរក្សាទុក...' : isEditing ? 'កែសម្រួល' : 'រក្សាទុក' }}
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
              <div class="delete-icon-wrap">
                <i class="bi bi-trash3-fill"></i>
              </div>
            </div>

            <div class="swal-body swal-body--center">
              <h3 class="swal-title">លុបថវិកា?</h3>
              <p class="delete-desc">
                តើអ្នកពិតជាចង់លុប
                <strong class="text-danger">{{ selectedBudget?.category?.name }}</strong> មែនទេ?
              </p>
              <div class="delete-warning">
                <i class="bi bi-exclamation-triangle-fill"></i>
                ការលុបនេះ នឹងបាត់បង់ទិន្នន័យទាំងអស់ដែលផ្សារភ្ជាប់នឹងថវិកានេះ។ វានឹងមិនអាចត្រឡប់វិញបានទេ
              </div>
            </div>

            <div class="swal-footer">
              <button class="swal-btn swal-btn--cancel" @click="closeDeleteModal" :disabled="deleteLoading">បោះបង់</button>
              <button class="swal-btn swal-btn--delete" @click="deleteBudget" :disabled="deleteLoading">
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
         TOAST
    ═════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="toast-slide">
        <div v-if="toast.show" class="toast-wrap" :class="`toast-wrap--${toast.type}`">
          <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
          <span>{{ toast.message }}</span>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

import { useBudgetStore } from '@/stores/budgetStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useTransactionStore } from '@/stores/transactionStore'

import BaseCard from '@/components/ui/base/BudgetCard.vue'
import CardOverView from '@/components/ui/base/OverViewCard.vue'
import Pagination from '@/components/ui/base/PaginAtion.vue'

const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const transactionStore = useTransactionStore()

// ── Page loading ───────────────────────────────────────────────────────────
const pageLoading = ref(true)

// ── Pagination ─────────────────────────────────────────────────────────────
const currentPage = ref(1)
const totalPages = computed(() => budgetStore.meta?.totalPages ?? 1)

watch(currentPage, async (page) => {
  await budgetStore.fetchBudgets(page, 6)
  await budgetStore.fetchCategoryBreakdown()
})

// ── Action loading states ──────────────────────────────────────────────────
const saveLoading = ref(false)
const deleteLoading = ref(false)

// ── Toast ──────────────────────────────────────────────────────────────────
const toast = reactive({ show: false, type: 'success', message: '' })
let toastTimer = null

function showToast(message, type = 'success') {
  clearTimeout(toastTimer)
  toast.message = message
  toast.type = type
  toast.show = true
  toastTimer = setTimeout(() => { toast.show = false }, 3000)
}

// ── Detail modal ───────────────────────────────────────────────────────────
const showDetailModal = ref(false)
const budgetDetail = ref(null)
const detailLoading = ref(false)

async function openDetailModal(budget) {
  showDetailModal.value = true
  detailLoading.value = true
  budgetDetail.value = null
  try {
    await budgetStore.fetchBudgetById(budget.id)
    budgetDetail.value = budgetStore.selectedBudget
  } catch {
    showToast('មិនអាចទាញព័ត៌មានថវិកាបានទេ', 'error')
    closeDetailModal()
  } finally {
    detailLoading.value = false
  }
}

function closeDetailModal() {
  showDetailModal.value = false
  budgetDetail.value = null
}

function openEditFromDetail() {
  const target = budgetDetail.value ?? budgetStore.selectedBudget
  closeDetailModal()
  openEditModal(target)
}

// ── Add / Edit modal ───────────────────────────────────────────────────────
const showModal = ref(false)
const isEditing = ref(false)
const selectedBudget = ref(null)

const form = ref({
  id: null,
  categoryId: '',
  limitAmount: '',
})

const formErrors = reactive({
  categoryId: '',
  limitAmount: '',
})

function clearError(field) { formErrors[field] = '' }

function validateForm() {
  formErrors.categoryId = ''
  formErrors.limitAmount = ''
  let ok = true

  if (!form.value.categoryId) {
    formErrors.categoryId = 'សូមជ្រើសរើសប្រភេទថវិកា'
    ok = false
  }

  const amt = Number(form.value.limitAmount)
  if (form.value.limitAmount === '' || form.value.limitAmount === null) {
    formErrors.limitAmount = 'សូមបញ្ចូលបរិមាណថវិកា'
    ok = false
  } else if (isNaN(amt) || amt <= 0) {
    formErrors.limitAmount = 'បរិមាណថវិកាត្រូវតែធំជាង 0'
    ok = false
  } else if (amt > 10_000_000) {
    formErrors.limitAmount = 'បរិមាណថវិកាធំពេក (អតិបរមា $10,000,000)'
    ok = false
  }

  return ok
}

function resetFormErrors() {
  formErrors.categoryId = ''
  formErrors.limitAmount = ''
}

function openAddModal() {
  isEditing.value = false
  form.value = { id: null, categoryId: '', limitAmount: '' }
  resetFormErrors()
  showModal.value = true
}

function openEditModal(budget) {
  isEditing.value = true
  selectedBudget.value = budget
  form.value = {
    id: budget.id,
    categoryId: budget.category?.id ?? '',
    limitAmount: budget.limitAmount,
  }
  resetFormErrors()
  showModal.value = true
}

function closeModal() {
  if (saveLoading.value) return
  showModal.value = false
  form.value = { id: null, categoryId: '', limitAmount: '' }
  resetFormErrors()
}

// ── Delete modal ───────────────────────────────────────────────────────────
const showDeleteModal = ref(false)

function openDeleteModal(budget) {
  selectedBudget.value = budget
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedBudget.value = null
}

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    await Promise.all([
      budgetStore.fetchBudgets(currentPage.value, 6),
      budgetStore.fetchCategoryBreakdown(),
      categoryStore.fetchAllCategories(),
      transactionStore.fetchTransactions(),
    ])
  } finally {
    pageLoading.value = false
  }
})

// ── Computed ───────────────────────────────────────────────────────────────
const expenseCategories = computed(() =>
  categoryStore.categories.filter((c) => c.type === 'EXPENSE')
)

// ✅ Returns true if this category already has a budget in the current month/year
const usedCategoryIds = computed(() => {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  return new Set(
    budgetStore.budgets
      .filter((b) => b.month === month && b.year === year)
      .map((b) => b.category?.id)
  )
})

function isCategoryUsed(categoryId) {
  return usedCategoryIds.value.has(categoryId)
}

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('km-KH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Actions ────────────────────────────────────────────────────────────────
async function deleteBudget() {
  if (!selectedBudget.value) return

  // ✅ Guard: prevent double-click during delete
  if (deleteLoading.value) return

  deleteLoading.value = true
  try {
    await budgetStore.deleteBudget(selectedBudget.value.id)
    await budgetStore.fetchBudgets(currentPage.value, 6)
    closeDeleteModal()
    showToast('លុបថវិកាជោគជ័យ', 'success')
  } catch (error) {
    const msg = error?.response?.data?.message ?? 'លុបថវិកាបរាជ័យ'
    showToast(msg, 'error')
  } finally {
    deleteLoading.value = false
  }
}

async function saveBudget() {
  // ✅ Guard 1: prevent double-click while a save is already running
  if (saveLoading.value) return

  // ✅ Guard 2: validate before hitting the API
  if (!validateForm()) return

  // ✅ Guard 3: prevent duplicate — same category cannot have more than one budget
  if (!isEditing.value) {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const duplicate = budgetStore.budgets.find(
      (b) =>
        b.category?.id === form.value.categoryId &&
        b.month === currentMonth &&
        b.year === currentYear,
    )

    if (duplicate) {
      formErrors.categoryId = `ថវិកាសម្រាប់ប្រភេទ "${duplicate.category?.name}" មានរួចហើយក្នុងខែនេះ`
      return
    }
  }

  const payload = {
    categoryId: form.value.categoryId,
    limitAmount: Number(form.value.limitAmount),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  }

  saveLoading.value = true
  try {
    if (isEditing.value) {
      await budgetStore.updateBudget(form.value.id, payload)
      showToast('កែសម្រួលថវិកាជោគជ័យ', 'success')
    } else {
      await budgetStore.createBudget(payload)
      showToast('បន្ថែមថវិកាជោគជ័យ', 'success')
    }
    await budgetStore.fetchBudgets(currentPage.value, 6)
    closeModal()
  } catch (error) {
    const msg = error?.response?.data?.message ?? 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ'
    showToast(msg, 'error')
  } finally {
    // ✅ Guard 4: always reset flag so button re-enables after success or failure
    saveLoading.value = false
  }
}
</script>

<style scoped>
.font-costume {
  font-family: var(--font-khmer);
}

/* ── Skeleton ────────────────────────────────────────────────────────── */
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

.skeleton-header  { height: 80px;  margin-bottom: 20px; }
.skeleton-overview{ height: 120px; margin-bottom: 20px; }
.skeleton-card    { height: 180px; }

section { background-color: transparent !important; }
.mt-3   { margin-top: 1rem; }
.row    { display: flex; flex-wrap: wrap; }
.g-3    { gap: 20px; }
.col-md-4 { flex: 1 1 calc(33.333% - 14px); min-width: 260px; }

/* ── Header card ─────────────────────────────────────────────────────── */
.header-card {
  background: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
}

.header-card h1 { font-size: 20px; font-weight: 700; margin: 0 0 2px; color: var(--text-white); }
.header-card p  { font-size: 12px; margin: 0; color: rgba(255, 255, 255, 0.65); }

.add-btn {
  height: 46px; padding: 0 20px; font-size: 15px; white-space: nowrap;
  font-family: var(--font-khmer) !important;
  background: rgba(255, 255, 255, 0.15); color: var(--text-white);
  border: 1.5px solid rgba(255, 255, 255, 0.4); border-radius: 12px;
  cursor: pointer; transition: var(--transition);
  display: inline-flex; align-items: center; gap: 6px;
}
.add-btn:hover { background: rgba(255, 255, 255, 0.25); }

/* ── Grid ────────────────────────────────────────────────────────────── */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* ══════════════════════════════════════════════
   SHARED MODAL STYLES
══════════════════════════════════════════════ */
.swal-overlay {
  position: fixed; inset: 0;
  background: rgba(4, 44, 131, 0.22); backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1050; padding: 16px;
}

.swal-box {
  background: var(--bg-card); border-radius: 24px;
  width: 100%; max-width: 460px;
  box-shadow: var(--shadow); overflow: hidden;
  font-family: var(--font-khmer); border: 1px solid var(--border-color);
}
.swal-box--delete { max-width: 400px; }
.swal-box--detail { max-width: 480px; }

/* Header */
.swal-header {
  display: flex; align-items: center; gap: 14px;
  padding: 22px 24px 16px; border-bottom: 1px solid var(--border-color);
  position: relative;
}
.swal-header--center {
  flex-direction: column; align-items: center;
  border-bottom: none; padding-bottom: 0;
}

.swal-header__icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.icon-create { background: var(--bg-input);           color: var(--color-primary); }
.icon-edit   { background: var(--color-danger-light); color: var(--color-danger); }
.icon-detail { background: var(--color-success-light);color: var(--color-success); }

.swal-title { margin: 0 0 2px; font-size: 17px; font-weight: 800; color: var(--text-primary); }
.swal-desc  { margin: 0; font-size: 12px; color: var(--text-secondary); }

.swal-close {
  position: absolute; top: 18px; right: 18px;
  width: 32px; height: 32px; border-radius: 8px;
  border: none; background: var(--bg-input); color: var(--text-secondary);
  font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: var(--transition);
}
.swal-close:hover:not(:disabled) { background: var(--color-danger); color: var(--text-white); }
.swal-close:disabled { opacity: 0.4; cursor: not-allowed; }

/* Body */
.swal-body        { padding: 20px 24px; }
.swal-body--center{ text-align: center; }

/* Footer */
.swal-footer {
  display: flex; gap: 10px;
  padding: 16px 24px 22px; border-top: 1px solid var(--border-color);
}

.swal-btn {
  flex: 1; height: 46px; border-radius: 50px; border: none;
  font-size: 14px; font-weight: 700; cursor: pointer;
  font-family: var(--font-khmer);
  display: flex; align-items: center; justify-content: center;
  gap: 7px; transition: var(--transition);
}
.swal-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.swal-btn--cancel {
  background: var(--bg-input); color: var(--text-secondary);
}
.swal-btn--cancel:hover:not(:disabled) {
  background: var(--bg-body); color: var(--text-primary);
}

.swal-btn--confirm {
  flex: 2;
  background: var(--color-primary); color: var(--text-white);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
.swal-btn--confirm:hover:not(:disabled) {
  background: var(--color-primary-hover); transform: translateY(-1px);
}

.swal-btn--delete {
  flex: 2;
  background: var(--color-danger); color: var(--text-white);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--color-danger) 30%, transparent);
}
.swal-btn--delete:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }

/* Form loading overlay */
.form-loading-overlay {
  position: absolute; inset: 0; z-index: 10;
  background: color-mix(in srgb, var(--bg-card) 85%, transparent);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; font-size: 13px; color: var(--text-secondary);
  font-family: var(--font-khmer);
}
.form-spinner {
  width: 32px; height: 32px;
  border: 3px solid color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-top-color: var(--color-primary);
  border-radius: 50%; animation: spin 0.7s linear infinite;
}

/* Field group */
.field-group    { margin-bottom: 18px; }
.field-label    { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: var(--text-primary); }
.required       { color: var(--color-danger); }

.input-shell {
  display: flex; align-items: center; height: 46px;
  border: 1.5px solid var(--border-color); border-radius: 50px;
  padding: 0 16px; background: var(--bg-input); transition: var(--transition);
}
.input-shell:focus-within {
  border-color: var(--color-primary); background: var(--bg-card);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent);
}
.input-shell.is-invalid {
  border-color: var(--color-danger); background: var(--color-danger-light);
}
.input-shell--select { padding-right: 8px; }

.field-icon { color: var(--text-secondary); font-size: 14px; flex-shrink: 0; margin-right: 8px; }

.input-shell input,
.input-shell select {
  flex: 1; height: 100%; border: 0; outline: 0;
  background: transparent; font-size: 14px;
  color: var(--text-primary); font-family: var(--font-khmer);
}
.input-shell input::placeholder { color: var(--border-color); }
.input-shell input:disabled,
.input-shell select:disabled { opacity: 0.6; }
.input-shell select { cursor: pointer; }

.field-error {
  font-size: 12px; color: var(--color-danger);
  margin-top: 4px; display: flex; align-items: center; gap: 4px;
}

/* Delete modal specifics */
.delete-icon-wrap {
  width: 72px; height: 72px; border-radius: 50%;
  background: var(--color-danger-light);
  display: flex; align-items: center; justify-content: center;
  font-size: 30px; color: var(--color-danger); margin-bottom: 8px;
}
.delete-desc {
  font-size: 15px; color: var(--text-primary);
  margin: 8px 0 14px; line-height: 1.6;
}
.delete-warning {
  display: flex; align-items: flex-start; gap: 8px;
  background: var(--color-danger-light); border: 1px solid var(--color-danger);
  border-radius: 10px; color: var(--color-danger);
  font-size: 12px; padding: 10px 12px;
  text-align: left; line-height: 1.5; opacity: 0.85;
}
.delete-warning i { flex-shrink: 0; margin-top: 1px; }

/* Detail modal specifics */
.detail-banner {
  display: flex; align-items: center; gap: 14px;
  border-radius: 14px; padding: 16px 18px; margin-bottom: 18px;
}
.banner--income  { background: var(--color-success-light); border: 1px solid var(--color-success); }
.banner--expense { background: var(--color-danger-light);  border: 1px solid var(--color-danger); }

.detail-banner__icon {
  width: 50px; height: 50px; border-radius: 14px;
  background: rgba(255,255,255,0.5);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.banner--income  .detail-banner__icon { color: var(--color-success); }
.banner--expense .detail-banner__icon { color: var(--color-danger); }

.detail-banner__name { font-size: 18px; font-weight: 800; color: var(--text-primary); line-height: 1.3; }
.detail-banner__type { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

.detail-rows {
  display: flex; flex-direction: column;
  border: 1px solid var(--border-color); border-radius: 14px; overflow: hidden;
}
.detail-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 12px 16px;
  border-bottom: 1px solid var(--border-color); font-size: 13.5px;
}
.detail-row:last-child { border-bottom: none; }
.detail-row:nth-child(even) { background: var(--bg-body); }

.detail-row__label {
  display: flex; align-items: center; gap: 7px;
  color: var(--text-secondary); font-size: 13px; white-space: nowrap; flex-shrink: 0;
}
.detail-row__value { color: var(--text-primary); text-align: right; font-weight: 600; }
.detail-row__value.amount {
  font-size: 18px; color: var(--color-primary); font-weight: 700;
}

/* Spinner */
.btn-spinner {
  width: 16px; height: 16px; flex-shrink: 0;
  border: 2px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
  border-top-color: var(--color-primary);
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.btn-spinner--white {
  border-color: rgba(255, 255, 255, 0.35);
  border-top-color: var(--text-white);
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Modal transition */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }
.modal-fade-enter-from .swal-box,
.modal-fade-leave-to .swal-box { transform: scale(0.94) translateY(12px); }
.modal-fade-enter-active .swal-box,
.modal-fade-leave-active .swal-box { transition: transform 0.25s ease; }

/* Toast */
.toast-wrap {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 10px;
  padding: 12px 22px; border-radius: 50px;
  font-size: 14px; font-weight: 600; font-family: var(--font-khmer);
  box-shadow: var(--shadow); z-index: 2000; white-space: nowrap;
}
.toast-wrap--success { background: var(--text-primary); color: var(--bg-card); }
.toast-wrap--error   { background: var(--color-danger);  color: var(--text-white); }

.toast-slide-enter-active,
.toast-slide-leave-active { transition: all 0.3s ease; }
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}
</style>