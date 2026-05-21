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

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
      <Pagination
        v-model:currentPage="currentPage"
        :total-pages="totalPages"
        :sibling-count="1"
      />
    </div>

    <!-- ════════════════════════════════════════
         DETAIL MODAL
    ════════════════════════════════════════ -->
    <BaseModal
      v-if="showDetailModal"
      title="ព័ត៌មានលម្អិតថវិកា"
      @close-modal="closeDetailModal"
    >
      <template #body>
        <div v-if="detailLoading" class="detail-loading">
          កំពុងទាញទិន្នន័យ...
        </div>

        <div v-else-if="budgetDetail" class="detail-body">
          <div class="detail-category-badge">
            <span class="badge-type" :class="budgetDetail.category.type === 'INCOME' ? 'badge-income' : 'badge-expense'">
              {{ budgetDetail.category.type }}
            </span>
          </div>

          <h3 class="detail-cat-name">{{ budgetDetail.category.name }}</h3>

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
        <button class="save-btn-modal" @click="openEditFromDetail">កែសម្រួល</button>
      </template>
    </BaseModal>

    <!-- ════════════════════════════════════════
         ADD / EDIT MODAL
    ════════════════════════════════════════ -->
    <BaseModal
      v-if="showModal"
      :title="isEditing ? 'កែសម្រួលថវិកា' : 'បន្ថែមថវិកា'"
      @close-modal="closeModal"
    >
      <template #body>
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
        <button class="cancel-btn" @click="closeModal" :disabled="saveLoading">បោះបង់</button>
        <button class="save-btn-modal" @click="saveBudget" :disabled="saveLoading">
          <span v-if="saveLoading" class="spinner-border spinner-border-sm me-1"></span>
          {{ isEditing ? 'កែសម្រួល' : 'រក្សាទុក' }}
        </button>
      </template>
    </BaseModal>

    <!-- ════════════════════════════════════════
         DELETE MODAL
    ════════════════════════════════════════ -->
    <BaseModal
      v-if="showDeleteModal"
      title="លុបថវិកា"
      @close-modal="closeDeleteModal"
    >
      <template #body>
        <div class="delete-body">
          <div class="delete-icon">🗑️</div>
          <h3>លុបថវិកា?</h3>
          <p>
            តើអ្នកពិតជាចង់លុប
            <strong>{{ selectedBudget?.category?.name }}</strong>?
          </p>
        </div>
      </template>

      <template #footer>
        <button class="cancel-btn" @click="closeDeleteModal" :disabled="deleteLoading">បោះបង់</button>
        <button class="delete-btn" @click="deleteBudget" :disabled="deleteLoading">
          <span v-if="deleteLoading" class="spinner-border spinner-border-sm me-1"></span>
          លុប
        </button>
      </template>
    </BaseModal>

    <!-- ════════════════════════════════════════
         MESSAGE MODAL
    ════════════════════════════════════════ -->
    <div v-if="showMessageModal" class="message-modal-overlay">
      <div class="message-modal-box">
        <div class="message-icon" :class="messageType">
          <i v-if="messageType === 'success'" class="bi bi-check-circle-fill"></i>
          <i v-if="messageType === 'error'"   class="bi bi-x-circle-fill"></i>
        </div>
        <h2 class="message-title">{{ messageTitle }}</h2>
        <p  class="message-text">{{ messageText }}</p>
        <button class="message-btn" @click="closeMessageModal">យល់ព្រម</button>
      </div>
    </div>

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

/* ─── LOADING ─────────────────────────────────────────────── */
const saveLoading   = ref(false)
const deleteLoading = ref(false)

/* ─── MESSAGE MODAL ───────────────────────────────────────── */
const showMessageModal = ref(false)
const messageTitle     = ref('')
const messageText      = ref('')
const messageType      = ref('success')

function openMessageModal(title, text, type = 'success') {
  showMessageModal.value = true
  messageTitle.value     = title
  messageText.value      = text
  messageType.value      = type
}

function closeMessageModal() {
  showMessageModal.value = false
}

/* ─── DETAIL MODAL ────────────────────────────────────────── */
const showDetailModal = ref(false)
const budgetDetail    = ref(null)
const detailLoading   = ref(false)

async function openDetailModal(budget) {
  showDetailModal.value = true
  detailLoading.value   = true
  budgetDetail.value    = null

  await budgetStore.fetchBudgetById(budget.id)
  budgetDetail.value  = budgetStore.selectedBudget
  detailLoading.value = false
}

function closeDetailModal() {
  showDetailModal.value = false
  budgetDetail.value    = null
}

function openEditFromDetail() {
  const target = budgetDetail.value ?? budgetStore.selectedBudget
  closeDetailModal()
  openEditModal(target)
}

/* ─── MODALS ──────────────────────────────────────────────── */
const showModal       = ref(false)
const showDeleteModal = ref(false)
const isEditing       = ref(false)
const selectedBudget  = ref(null)

const form = ref({
  id:          null,
  categoryId:  '',
  limitAmount: 0,
})

/* ─── LIFECYCLE ───────────────────────────────────────────── */
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
  form.value      = { id: null, categoryId: '', limitAmount: 0 }
  showModal.value = true
}

function openEditModal(budget) {
  isEditing.value = true
  form.value = {
    id:          budget.id,
    categoryId:  budget.category?.id,
    limitAmount: budget.limitAmount,
  }
  showModal.value = true
}

function openDeleteModal(budget) {
  selectedBudget.value  = budget
  showDeleteModal.value = true
}

function closeModal()       { showModal.value = false }
function closeDeleteModal() { showDeleteModal.value = false; selectedBudget.value = null }

/* ─── DELETE ──────────────────────────────────────────────── */
async function deleteBudget() {
  if (!selectedBudget.value) return
  deleteLoading.value = true
  try {
    await budgetStore.deleteBudget(selectedBudget.value.id)
    await budgetStore.fetchBudgets(currentPage.value)
    closeDeleteModal()
    openMessageModal('ជោគជ័យ', 'លុបថវិកាជោគជ័យ', 'success')
  } catch {
    openMessageModal('បរាជ័យ', 'លុបថវិកាបរាជ័យ', 'error')
  } finally {
    deleteLoading.value = false
  }
}

/* ─── SAVE ────────────────────────────────────────────────── */
async function saveBudget() {
  if (!isEditing.value) {
    if (!form.value.categoryId) {
      openMessageModal('កំហុស', 'សូមជ្រើសរើសប្រភេទ', 'error')
      return
    }
    if (!form.value.limitAmount || form.value.limitAmount <= 0) {
      openMessageModal('កំហុស', 'សូមបញ្ចូលចំនួនថវិកា', 'error')
      return
    }
  }

  const payload = {
    categoryId:  form.value.categoryId,
    limitAmount: Number(form.value.limitAmount),
    month:       new Date().getMonth() + 1,
    year:        new Date().getFullYear(),
  }

  saveLoading.value = true
  try {
    if (isEditing.value) {
      await budgetStore.updateBudget(form.value.id, payload)
      openMessageModal('ជោគជ័យ', 'កែសម្រួលថវិកាជោគជ័យ', 'success')
    } else {
      await budgetStore.createBudget(payload)
      openMessageModal('ជោគជ័យ', 'បន្ថែមថវិកាជោគជ័យ', 'success')
    }
    await budgetStore.fetchBudgets(currentPage.value)
    closeModal()
  } catch {
    openMessageModal('បរាជ័យ', 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ', 'error')
  } finally {
    saveLoading.value = false
  }
}
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.container {
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top left, #eef2ff 0%, transparent 30%),
    radial-gradient(circle at bottom right, #ede9fe 0%, transparent 30%),
    linear-gradient(135deg, #f8fafc, #eef2ff);
  font-family: 'Kantumruy Pro', sans-serif;
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

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }

/* ── Buttons ── */
.add-btn {
  border: none; background: #1677ff; color: white;
  padding: 10px 18px; border-radius: 10px; cursor: pointer; font-weight: 600;
}
.save-btn-modal { border: none; background: #1677ff; color: white; padding: 10px 18px; border-radius: 10px; cursor: pointer; font-weight: 600; }
.cancel-btn     { border: none; background: #e5e7eb; padding: 10px 18px; border-radius: 10px; cursor: pointer; font-weight: 600; }
.delete-btn     { border: none; background: #ff4d4f; color: white; padding: 10px 18px; border-radius: 10px; cursor: pointer; font-weight: 600; }

/* ── Form ── */
.form-group             { margin-bottom: 18px; }
.form-group label       { display: block; margin-bottom: 6px; font-weight: 600; }
.form-group input,
.form-select            { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px; }

/* ── Delete ── */
.delete-body { text-align: center; }
.delete-icon { font-size: 50px; margin-bottom: 10px; }

/* ── Pagination ── */
.mt-4                    { margin-top: 1.5rem; }
.d-flex                  { display: flex; }
.justify-content-center  { justify-content: center; }

/* ── Detail Modal ── */
.detail-loading  { text-align: center; padding: 24px; color: #888; }
.detail-body     { display: flex; flex-direction: column; gap: 16px; }
.detail-category-badge { display: flex; justify-content: center; }
.badge-type      { padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.badge-income    { background: #e8fff1; color: #15803d; }
.badge-expense   { background: #ffeaea; color: #d90429; }
.detail-cat-name { text-align: center; font-size: 22px; font-weight: 700; margin: 0; color: #1a1a2e; }
.detail-rows     { display: flex; flex-direction: column; border: 1px solid #eee; border-radius: 12px; overflow: hidden; }
.detail-row      { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #f0f0f0; background: #fff; }
.detail-row:last-child       { border-bottom: none; }
.detail-row:nth-child(even)  { background: #fafafa; }
.detail-label    { font-size: 13px; color: #888; font-weight: 500; }
.detail-value    { font-size: 14px; font-weight: 600; color: #1a1a2e; }
.detail-value.amount { font-size: 18px; color: #1677ff; font-weight: 700; }

/* ── Message Modal ── */
.message-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.message-modal-box {
  width: 100%;
  max-width: 380px;
  background: white;
  border-radius: 30px;
  padding: 30px 24px;
  text-align: center;
  animation: modalPop 0.3s ease;
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1);   }
}

.message-icon {
  width: 90px; height: 90px;
  margin: 0 auto 20px;
  border-radius: 50%;
  font-size: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-icon.success { background: #dcfce7; color: #16a34a; }
.message-icon.error   { background: #fee2e2; color: #dc2626; }

.message-title { font-size: 26px; font-weight: 700; margin-bottom: 10px; color: #111827; }
.message-text  { color: #6b7280; margin-bottom: 24px; line-height: 1.6; }

.message-btn {
  border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 14px 26px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
  font-family: 'Kantumruy Pro', sans-serif;
  transition: 0.3s;
}

.message-btn:hover { transform: translateY(-2px); }
</style>