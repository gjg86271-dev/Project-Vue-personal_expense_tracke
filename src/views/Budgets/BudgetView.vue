<template>
  <div class="font-costume">

    <div class="header-card">
      <div>
        <h1>ថវិកា</h1>
        <p>តាមដាន និងគ្រប់គ្រងប្រាក់បស់អ្នក</p>
      </div>
      <button class="add-btn" @click="openAddModal">បន្ថែមគម្រោងថវិកា
        <span>+</span>
      </button>
    </div>

    <div v-if="budgetStore.loading">កំពុងដំណើរការ...</div>

    <CardOverView :budgets="budgetStore.budgets" :totalexpenses="budgetStore.totalexpenses" />

    <div class="grid">
      <BaseCard v-for="item in budgetStore.budgets" :key="item.id" :budget="item" @edit-budget="openEditModal"
        @delete-budget="openDeleteModal" @view-budget="openDetailModal" />
    </div>

    <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
      <Pagination v-model:currentPage="currentPage" :total-pages="totalPages" :sibling-count="1" />
    </div>

    <BaseModal v-if="showDetailModal" title="ព័ត៌មានលម្អិតថវិកា" @close-modal="closeDetailModal">
      <template #body>
        <div v-if="detailLoading" class="detail-loading">
          កំពុងទាញទិន្នន័យ...
        </div>

        <div v-else-if="budgetDetail" class="detail-body">
          <div class="detail-category-badge">
            <span class="badge-type"
              :class="budgetDetail.category.type === 'INCOME' ? 'badge-income' : 'badge-expense'">
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

    <BaseModal v-if="showModal" :title="isEditing ? 'កែសម្រួលថវិកា' : 'បន្ថែមថវិកា'" @close-modal="closeModal">
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

    <BaseModal v-if="showDeleteModal" title="លុបថវិកា" @close-modal="closeDeleteModal">
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

    <div v-if="showMessageModal" class="message-modal-overlay">
      <div class="message-modal-box">
        <div class="message-icon" :class="messageType">
          <i v-if="messageType === 'success'" class="bi bi-check-circle-fill"></i>
          <i v-if="messageType === 'error'" class="bi bi-x-circle-fill"></i>
        </div>
        <h2 class="message-title">{{ messageTitle }}</h2>
        <p class="message-text">{{ messageText }}</p>
        <button class="message-btn" @click="closeMessageModal">យល់ព្រម</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

import { useBudgetStore } from '@/stores/budgetStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useTransactionStore } from '@/stores/transactionStore'

import BaseCard from '@/components/ui/base/BudgetCard.vue'
import CardOverView from '@/components/ui/base/OverViewCard.vue'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import Pagination from '@/components/ui/base/PaginAtion.vue'

const budgetStore      = useBudgetStore()
const categoryStore    = useCategoryStore()
const transactionStore = useTransactionStore()

const currentPage = ref(1)
const totalPages  = computed(() => budgetStore.meta?.totalPages ?? 1)

watch(currentPage, async (page) => {
  await budgetStore.fetchBudgets(page, 6)
  await budgetStore.fetchCategoryBreakdown()
})

const saveLoading   = ref(false)
const deleteLoading = ref(false)

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

const showModal       = ref(false)
const showDeleteModal = ref(false)
const isEditing       = ref(false)
const selectedBudget  = ref(null)

const form = ref({
  id:          null,
  categoryId:  '',
  limitAmount: 0,
})

onMounted(async () => {
  await budgetStore.fetchBudgets(currentPage.value, 6)
  await budgetStore.fetchCategoryBreakdown()
  await categoryStore.fetchAllCategories()
  await transactionStore.fetchTransactions()
})

const expenseCategories = computed(() =>
  categoryStore.categories.filter((c) => c.type === 'EXPENSE')
)

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('km-KH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

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

async function deleteBudget() {
  if (!selectedBudget.value) return
  deleteLoading.value = true
  try {
    await budgetStore.deleteBudget(selectedBudget.value.id)
    await budgetStore.fetchBudgets(currentPage.value, 6)
    closeDeleteModal()
    openMessageModal('ជោគជ័យ', 'លុបថវិកាជោគជ័យ', 'success')
  } catch {
    openMessageModal('បរាជ័យ', 'លុបថវិកាបរាជ័យ', 'error')
  } finally {
    deleteLoading.value = false
  }
}

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
    await budgetStore.fetchBudgets(currentPage.value, 6)
    closeModal()
  } catch {
    openMessageModal('បរាជ័យ', 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ', 'error')
  } finally {
    saveLoading.value = false
  }
}
</script>

<style scoped>
.font-costume { font-family: var(--font-khmer); }

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
.header-card p  { font-size: 12px; margin: 0; color: rgba(255,255,255,0.65); }

.add-btn {
  height: 46px; padding: 0 20px; font-size: 15px; white-space: nowrap;
  font-family: var(--font-khmer) !important;
  background: rgba(255,255,255,0.15); color: var(--text-white);
  border: 1.5px solid rgba(255,255,255,0.4); border-radius: 12px;
  cursor: pointer; transition: var(--transition);
}
.add-btn:hover { background: rgba(255,255,255,0.25); }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.save-btn-modal {
  border: none;
  background: var(--color-primary);
  color: var(--text-white);
  padding: 10px 18px; border-radius: 10px;
  cursor: pointer; font-weight: 600;
  font-family: var(--font-khmer);
  transition: var(--transition);
}
.save-btn-modal:hover:not(:disabled) { background: var(--color-primary-hover); }
.save-btn-modal:disabled { opacity: 0.6; cursor: wait; }

.cancel-btn {
  border: none;
  background: var(--bg-input);
  color: var(--text-primary);
  padding: 10px 18px; border-radius: 10px;
  cursor: pointer; font-weight: 600;
  font-family: var(--font-khmer);
  transition: var(--transition);
}
.cancel-btn:hover:not(:disabled) { background: var(--border-color); }
.cancel-btn:disabled { opacity: 0.6; cursor: wait; }

.delete-btn {
  border: none;
  background: var(--color-danger);
  color: var(--text-white);
  padding: 10px 18px; border-radius: 10px;
  cursor: pointer; font-weight: 600;
  font-family: var(--font-khmer);
  transition: var(--transition);
}
.delete-btn:hover:not(:disabled) { opacity: 0.9; }
.delete-btn:disabled { opacity: 0.6; cursor: wait; }

.form-group { margin-bottom: 18px; }
.form-group label { display: block; margin-bottom: 6px; font-weight: 600; color: var(--text-primary); }
.form-group input,
.form-select {
  width: 100%; padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-family: var(--font-khmer);
  transition: var(--transition);
}
.form-group input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent);
}

.delete-body { text-align: center; color: var(--text-primary); }
.delete-icon { font-size: 50px; margin-bottom: 10px; }

.detail-loading { text-align: center; padding: 24px; color: var(--text-secondary); }

.detail-body { display: flex; flex-direction: column; gap: 16px; }
.detail-category-badge { display: flex; justify-content: center; }

.badge-type {
  padding: 4px 16px; border-radius: 20px;
  font-size: 12px; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase;
}
.badge-income  { background: var(--color-success-light); color: var(--color-success); }
.badge-expense { background: var(--color-danger-light);  color: var(--color-danger);  }

.detail-cat-name {
  text-align: center; font-size: 22px; font-weight: 700;
  margin: 0; color: var(--text-primary);
}

.detail-rows {
  display: flex; flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 12px; overflow: hidden;
}

.detail-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
}
.detail-row:last-child { border-bottom: none; }
.detail-row:nth-child(even) { background: var(--bg-body); }

.detail-label { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
.detail-value { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.detail-value.amount { font-size: 18px; color: var(--color-primary); font-weight: 700; }

.message-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(4, 44, 131, 0.22);
  backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999; padding: 20px;
}

.message-modal-box {
  width: 100%; max-width: 380px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 30px; padding: 30px 24px;
  text-align: center;
  box-shadow: var(--shadow);
  animation: modalPop 0.3s ease;
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1);   }
}

.message-icon {
  width: 90px; height: 90px;
  margin: 0 auto 20px; border-radius: 50%;
  font-size: 42px;
  display: flex; align-items: center; justify-content: center;
}
.message-icon.success { background: var(--color-success-light); color: var(--color-success); }
.message-icon.error   { background: var(--color-danger-light);  color: var(--color-danger);  }

.message-title { font-size: 26px; font-weight: 700; margin-bottom: 10px; color: var(--text-primary); }
.message-text  { color: var(--text-secondary); margin-bottom: 24px; line-height: 1.6; }

.message-btn {
  border: none;
  background: var(--color-primary);
  color: var(--text-white);
  padding: 14px 26px; border-radius: 16px;
  cursor: pointer; font-weight: 700;
  font-family: var(--font-khmer);
  transition: var(--transition);
}
.message-btn:hover { background: var(--color-primary-hover); transform: translateY(-2px); }
</style>