<template>
  <div class="container">

    <!-- Header -->
    <div class="top-bar">
      <h2 class="title">ថវិការបស់ខ្ញុំ</h2>
      <button class="add-btn" @click="openAddModal">បន្ថែមគម្រោងថវិកា</button>
    </div>

    <!-- Loading -->
    <div v-if="budgetStore.loading">កំពុងដំណើរការ...</div>

    <!-- Overview -->
    <CardOverView
      :budgets="budgetStore.budgets"
      :totalexpenses="budgetStore.totalexpenses"
    />

    <!-- Budget Cards -->
    <div class="grid">
      <BaseCard
        v-for="item in budgetStore.budgets"
        :key="item.id"
        :budget="item"
        @edit-budget="openEditModal"
        @delete-budget="openDeleteModal"
        @view-budget="openDetailModal"
      />
    </div>

    <!-- ✅ Pagination -->
    <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
      <Pagination
        v-model:currentPage="currentPage"
        :total-pages="totalPages"
        :sibling-count="1"
      />
    </div>

    <!-- ════════════════════════════════════════
         ✅ DETAIL MODAL
    ════════════════════════════════════════ -->
    <BaseModal
      v-if="showDetailModal"
      title="ព័ត៌មានលម្អិតថវិកា"
      @close-modal="closeDetailModal"
    >
      <template #body>
        <!-- Loading detail -->
        <div v-if="detailLoading" class="detail-loading">
          កំពុងទាញទិន្នន័យ...
        </div>

        <!-- Detail content -->
        <div v-else-if="budgetDetail" class="detail-body">

          <!-- Category badge -->
          <div class="detail-category-badge">
            <span class="badge-type" :class="budgetDetail.category.type === 'INCOME' ? 'badge-income' : 'badge-expense'">
              {{ budgetDetail.category.type }}
            </span>
          </div>

          <!-- Category name -->
          <h3 class="detail-cat-name">{{ budgetDetail.category.name }}</h3>

          <!-- Info rows -->
          <div class="detail-rows">

            <div class="detail-row">
              <span class="detail-label">💰 ថវិកា</span>
              <span class="detail-value amount">${{ budgetDetail.limitAmount.toLocaleString() }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">📅 ខែ / ឆ្នាំ</span>
              <span class="detail-value">{{ budgetDetail.month }} / {{ budgetDetail.year }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">🏷️ ប្រភេទ</span>
              <span class="detail-value">{{ budgetDetail.category.type }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">🔖 System</span>
              <span class="detail-value">{{ budgetDetail.category.isSystem ? 'Yes' : 'No' }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">🕐 បានបង្កើត</span>
              <span class="detail-value">{{ formatDate(budgetDetail.createdAt) }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">🔄 បានកែ</span>
              <span class="detail-value">{{ formatDate(budgetDetail.updatedAt) }}</span>
            </div>

          </div>
        </div>
      </template>

      <template #footer>
        <button class="cancel-btn" @click="closeDetailModal">បិទ</button>
        <button class="save-btn" @click="openEditFromDetail">កែសម្រួល</button>
      </template>
    </BaseModal>

    <!-- ADD / EDIT MODAL -->
    <BaseModal
      v-if="showModal"
      :title="isEditing ? 'កែសម្រួលថវិកា' : 'បន្ថែមថវិកា'"
      @close-modal="closeModal"
    >
      <template #body>
        <div v-if="errorMessage" class="error-box">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-box">{{ successMessage }}</div>

        <div class="form-group">
          <label>ឈ្មោះប្រភេទ</label>
          <select class="form-select" v-model="form.categoryId">
            <option disabled value="">ជ្រើសរើសប្រភេទ</option>
            <option v-for="category in expenseCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>បរិមាណថវិកា</label>
          <input v-model="form.limitAmount" type="number" placeholder="Enter amount" />
        </div>
      </template>

      <template #footer>
        <button class="cancel-btn" @click="closeModal">បោះបង់</button>
        <button class="save-btn" @click="saveBudget">
          {{ isEditing ? "Update" : "Save" }}
        </button>
      </template>
    </BaseModal>

    <!-- DELETE MODAL -->
    <BaseModal
      v-if="showDeleteModal"
      title="Delete Budget"
      @close-modal="closeDeleteModal"
    >
      <template #body>
        <div class="delete-body">
          <div class="delete-icon">🗑️</div>
          <h3>លុបថវិកា?</h3>
          <p>
            តើអ្នកប្រាកដថាចង់លុប
            <strong>{{ selectedBudget?.category?.name }}</strong>?
          </p>
        </div>
      </template>

      <template #footer>
        <button class="cancel-btn" @click="closeDeleteModal">បោះបង់</button>
        <button class="delete-btn" @click="deleteBudget">លុប</button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

import { useBudgetStore }      from '@/stores/budgetStore'
import { useCategoryStore }    from '@/stores/categoryStore'
import { useTransactionStore } from '@/stores/transactionStore'

import BaseCard     from '@/components/ui/base/BudgetCard.vue'
import CardOverView from '@/components/ui/base/OverViewCard.vue'
import BaseModal    from '@/components/ui/base/BaseModal.vue'
import Pagination   from '@/components/ui/base/PaginAtion.vue'

/* ─── STORES ──────────────────────────────────────────────── */
const budgetStore      = useBudgetStore()
const categoryStore    = useCategoryStore()
const transactionStore = useTransactionStore()

/* ─── PAGINATION ──────────────────────────────────────────── */
const currentPage = ref(1)
const totalPages  = computed(() => budgetStore.meta?.totalPages ?? 1)

watch(currentPage, (page) => {
  budgetStore.fetchBudgets(page)
})

/* ─── DETAIL MODAL STATE ──────────────────────────────────── */
const showDetailModal = ref(false)
const budgetDetail    = ref(null)
const detailLoading   = ref(false)

async function openDetailModal(budget) {
  showDetailModal.value = true
  detailLoading.value   = true
  budgetDetail.value    = null

  await budgetStore.fetchBudgetById(budget.id)   // ✅ fetch /budgets/:id
  budgetDetail.value  = budgetStore.selectedBudget
  detailLoading.value = false
}

function closeDetailModal() {
  showDetailModal.value = false
  budgetDetail.value    = null
}

// ✅ Edit ចេញពី detail modal
function openEditFromDetail() {
  closeDetailModal()
  openEditModal(budgetDetail.value ?? budgetStore.selectedBudget)
}

/* ─── MODALS ──────────────────────────────────────────────── */
const showModal       = ref(false)
const showDeleteModal = ref(false)
const isEditing       = ref(false)
const errorMessage    = ref('')
const successMessage  = ref('')
const selectedBudget  = ref(null)

const form = ref({
  id: null,
  categoryId: '',
  limitAmount: 0,
})

/* TOAST */
const toast = ref({
  show: false,
  message: "",
  type: "success",
});

function showToast(message, type = "success") {
  toast.value.show = false;

  setTimeout(() => {
    toast.value.message = message;
    toast.value.type = type;
    toast.value.show = true;

    setTimeout(() => {
      toast.value.show = false;
    }, 3000);
  }, 100);
}

/* FETCH */
onMounted(async () => {
  await budgetStore.fetchBudgets(currentPage.value)
  await budgetStore.fetchCategoryBreakdown()
  await categoryStore.fetchAllCategories()
  await transactionStore.fetchTransactions()
})

/* ─── COMPUTED ────────────────────────────────────────────── */
const expenseCategories = computed(() =>
  categoryStore.categories.filter((c) => c.type === 'EXPENSE')
)

/* ─── DATE HELPER ─────────────────────────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('km-KH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/* ─── MODAL HANDLERS ──────────────────────────────────────── */
function openAddModal() {
  isEditing.value = false
  form.value = { id: null, categoryId: '', limitAmount: 0 }
  showModal.value = true
}

function openEditModal(budget) {
  isEditing.value = true
  form.value = {
    id: budget.id,
    categoryId: budget.category?.id,
    limitAmount: budget.limitAmount,
  }
  showModal.value = true
}

function openDeleteModal(budget) {
  selectedBudget.value = budget
  showDeleteModal.value = true
}

function closeModal()       { showModal.value = false }
function closeDeleteModal() { showDeleteModal.value = false; selectedBudget.value = null }

/* ─── DELETE ──────────────────────────────────────────────── */
async function deleteBudget() {
  if (!selectedBudget.value) return
  await budgetStore.deleteBudget(selectedBudget.value.id)
  await budgetStore.fetchBudgets(currentPage.value)
  closeDeleteModal()
}

/* ─── SAVE ────────────────────────────────────────────────── */
async function saveBudget() {
  errorMessage.value   = ''
  successMessage.value = ''

  if (!isEditing.value) {
    if (!form.value.categoryId) { errorMessage.value = 'សូមជ្រើសរើសប្រភេទ'; return }
    if (!form.value.limitAmount || form.value.limitAmount <= 0) { errorMessage.value = 'សូមបញ្ចូលចំនួនថវិកា'; return }
  }

  const payload = {
    categoryId:  form.value.categoryId,
    limitAmount: Number(form.value.limitAmount),
    month:       new Date().getMonth() + 1,
    year:        new Date().getFullYear(),
  }

  try {
    if (isEditing.value) {
      await budgetStore.updateBudget(form.value.id, payload)
      successMessage.value = 'កែសម្រួលថវិកាជោគជ័យ'
    } else {
      await budgetStore.createBudget(payload)
      successMessage.value = 'បន្ថែមថវិកាជោគជ័យ'
    }
    await budgetStore.fetchBudgets(currentPage.value)
    setTimeout(() => { closeModal(); successMessage.value = '' }, 1000)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ'
  }
}
</script>

<style scoped>
/* =========================================
   MODERN BUDGET DASHBOARD UI
========================================= */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top left, #eef2ff 0%, transparent 30%),
    radial-gradient(circle at bottom right, #ede9fe 0%, transparent 30%),
    linear-gradient(135deg, #f8fafc, #eef2ff);
  font-family: "Kantumruy Pro", sans-serif;
  position: relative;
  overflow-x: hidden;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 34px;
  gap: 20px;
  flex-wrap: wrap;
}
.title { font-size: 28px; font-weight: 700; }
.grid  { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }

/* buttons */
.add-btn, .save-btn, .cancel-btn, .delete-btn {
  border: none; padding: 10px 18px; border-radius: 10px; cursor: pointer; font-weight: 600;
}
.add-btn, .save-btn { background: #1677ff; color: white; }
.cancel-btn          { background: #e5e7eb; }
.delete-btn          { background: #ff4d4f; color: white; }

/* form */
.form-group       { margin-bottom: 18px; }
.form-group label { display: block; margin-bottom: 6px; font-weight: 600; }
.form-group input,
.form-select      { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; }

/* delete */
.delete-body { text-align: center; }
.delete-icon { font-size: 50px; margin-bottom: 10px; }

/* messages */
.error-box {
  background: #ffeaea; color: #d90429;
  padding: 10px; border-radius: 8px; margin-bottom: 15px; font-weight: 600;
}
.success-box {
  background: #e8fff1; color: #15803d;
  padding: 10px; border-radius: 8px; margin-bottom: 15px; font-weight: 600;
}

/* pagination */
.mt-4                   { margin-top: 1.5rem; }
.d-flex                 { display: flex; }
.justify-content-center { justify-content: center; }

/* ── Detail Modal ── */
.detail-loading {
  text-align: center;
  padding: 24px;
  color: #888;
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-category-badge {
  display: flex;
  justify-content: center;
}

.badge-type {
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.badge-income  { background: #e8fff1; color: #15803d; }
.badge-expense { background: #ffeaea; color: #d90429; }

.detail-cat-name {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #1a1a2e;
}

.detail-rows {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.detail-row:last-child { border-bottom: none; }
.detail-row:nth-child(even) { background: #fafafa; }

.detail-label {
  font-size: 13px;
  color: #888;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
}

.detail-value.amount {
  font-size: 18px;
  color: #1677ff;
  font-weight: 700;
}
</style>