<template>
  <!-- ✅ SINGLE ROOT NODE fixes the fragment/inheritance warnings -->
  <div>

    <div class="font mb-4">

      <!-- HEADER -->
      <div
        class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h1 class="fw-bold mb-1">ប្រតិបត្តិការ</h1>
          <p class="text-secondary mb-0">គ្រប់គ្រងប្រតិបត្តិការហិរញ្ញវត្ថុរបស់អ្នកទាំងអស់</p>
        </div>
        <button class="btn btn-primary rounded-5 add-btn" @click="openModal()">
          <i class="bi bi-plus"></i> បន្ថែមប្រតិបត្តិការ
        </button>
      </div>

      <!-- TOTAL CARDS -->
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-4">
         <TotalCard title="ប្រតិបត្តិការសរុប" :value="totalTransactions">
            <template #icon>
              <div class="bg-secondary px-3 py-2 rounded-3 text-white">
                <i class="bi bi-wallet2 fs-4"></i>
              </div>
            </template>
          </TotalCard>
        </div>
        <div class="col-12 col-md-4">
          <TotalCard title="ចំណូលសរុប" :value="all_total.totalIncome">
            <template #icon>
              <div class="bg-success px-3 py-2 rounded-3 text-white">
                <i class="bi bi-graph-up-arrow fs-4"></i>
              </div>
            </template>
          </TotalCard>
        </div>
        <div class="col-12 col-md-4">
          <TotalCard title="ចំណាយសរុប" :value="all_total.totalExpense">
            <template #icon>
              <div class="bg-danger px-3 py-2 rounded-3 text-white">
                <i class="bi bi-graph-down-arrow fs-4"></i>
              </div>
            </template>
          </TotalCard>
        </div>
      </div>

      <!-- FILTER BAR -->
      <div class="filter-card mb-4">
        <div class="filter-bar">
          <div class="filter-label">
            <i class="bi bi-funnel-fill"></i>
            <span>តម្រង</span>
          </div>
          <div class="filter-selects">
            <select class="filter-select" v-model="filterType">
              <option value="">ប្រភេទទាំងអស់</option>
              <option value="INCOME">ចំណូល</option>
              <option value="EXPENSE">ចំណាយ</option>
            </select>
            <select class="filter-select" v-model="filterCategory">
              <option value="">ប្រភេទទាំងអស់</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="search-box" :class="{ focused: searchFocused }">
            <i class="bi bi-search"></i>
            <input v-model="searchQuery" type="search" placeholder="ស្វែងរក..." @focus="searchFocused = true"
              @blur="searchFocused = false" />
            <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <button v-if="hasFilter" class="reset-btn" @click="resetFilters">
            <i class="bi bi-arrow-counterclockwise"></i>
            <span class="d-none d-sm-inline">លុបតម្រង</span>
          </button>
        </div>

        <!-- ACTIVE BADGES -->
        <div v-if="hasFilter" class="active-filters">
          <span v-if="filterType" class="filter-badge">
            {{ filterType === 'INCOME' ? 'ចំណូល' : 'ចំណាយ' }}
            <i class="bi bi-x" @click="filterType = ''"></i>
          </span>
          <span v-if="filterCategory" class="filter-badge">
            {{categories.find(c => c.id === filterCategory)?.name}}
            <i class="bi bi-x" @click="filterCategory = ''"></i>
          </span>
          <span v-if="searchQuery" class="filter-badge">
            "{{ searchQuery }}"
            <i class="bi bi-x" @click="searchQuery = ''"></i>
          </span>
        </div>
      </div>

      <!-- DESKTOP TABLE -->
      <div class="table-wrap d-none d-md-block">
        <table class="table mb-0 font">
          <thead class="table-secondary">
            <tr class="text-center">
              <th>កាលបរិច្ឆេទ</th>
              <th>ការពិពណ៌នា</th>
              <th>ប្រភេទទូទៅ</th>
              <th>លក្ខណៈ</th>
              <th>ចំនួនទឹកប្រាក់</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-center" v-for="item in filteredItems" :key="item.id">
              <td>{{ new Date(item.transactionDate).toLocaleDateString('en-GB') }}</td>
              <td>{{ item.notes }}</td>
              <td>{{ item.category?.name }}</td>
              <td>
                <span :class="item.category?.type === 'INCOME'
                  ? 'badge bg-success-subtle text-success'
                  : 'badge bg-danger-subtle text-danger'">
                  {{ item.category?.type === 'INCOME' ? 'ចំណូល' : 'ចំណាយ' }}
                </span>
              </td>
              <td :class="item.category?.type === 'INCOME' ? 'text-success fw-semibold' : 'text-danger fw-semibold'">
                {{ item.category?.type === 'INCOME' ? '+' : '-' }}${{ item.amount }}
              </td>
              <td>
                <button class="btn text-dark btn-sm" @click="openModal(item)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn text-danger btn-sm" @click="openDeleteModal(item)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="6" class="text-center py-5 text-muted">
                <i class="bi bi-inbox fs-2 d-block mb-2"></i>
                គ្មានទិន្នន័យ
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- MOBILE CARDS -->
      <div class="d-md-none">
        <div v-if="filteredItems.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-inbox fs-1 d-block mb-2"></i>
          គ្មានទិន្នន័យ
        </div>
        <div v-for="item in filteredItems" :key="item.id" class="mobile-card">
          <div class="mobile-card__left">
            <div :class="['mobile-icon', item.category?.type === 'INCOME' ? 'icon--income' : 'icon--expense']">
              <i :class="item.category?.type === 'INCOME' ? 'bi bi-graph-up-arrow' : 'bi bi-graph-down-arrow'"></i>
            </div>
            <div>
              <div class="mobile-card__category">{{ item.category?.name }}</div>
              <div class="mobile-card__note">{{ item.notes || '—' }}</div>
              <div class="mobile-card__date">
                {{ new Date(item.transactionDate).toLocaleDateString('en-GB') }}
              </div>
            </div>
          </div>
          <div class="mobile-card__right">
            <div :class="item.category?.type === 'INCOME' ? 'amount--income' : 'amount--expense'">
              {{ item.category?.type === 'INCOME' ? '+' : '-' }}${{ item.amount }}
            </div>
            <div class="mobile-card__actions">
              <button class="btn btn-sm text-dark p-1" @click="openModal(item)">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-sm text-danger p-1" @click="openDeleteModal(item)">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- CREATE / EDIT MODAL -->
    <BaseModal v-if="showModal" :title="isEditing ? 'កែប្រែប្រតិបត្តិការ' : 'បន្ថែមប្រតិបត្តិការ'"
      @close-modal="closeModal">
      <template #body>

        <!-- TYPE TOGGLE (create only) -->
        <div v-if="!isEditing" class="mb-4">
          <label class="form-label fw-500">
            ប្រភេទប្រតិបត្តិការ <span class="text-danger">*</span>
          </label>
          <div class="type-toggle">
            <button :class="['type-btn type-btn--income', { active: form.type === 'INCOME' }]"
              @click="selectType('INCOME')" type="button">
              <i class="bi bi-graph-up-arrow"></i> ចំណូល
            </button>
            <button :class="['type-btn type-btn--expense', { active: form.type === 'EXPENSE' }]"
              @click="selectType('EXPENSE')" type="button">
              <i class="bi bi-graph-down-arrow"></i> ចំណាយ
            </button>
          </div>
          <div v-if="errors.type" class="text-danger small mt-1">
            <i class="bi bi-exclamation-circle"></i> {{ errors.type }}
          </div>
        </div>

        <!-- CATEGORY -->
        <div class="form-group mb-3">
          <label class="form-label fw-500">
            ប្រភេទ <span class="text-danger">*</span>
          </label>
          <select class="form-select" :class="{ 'is-invalid': errors.categoryId }" v-model="form.categoryId"
            :disabled="!isEditing && !form.type">
            <option value="" disabled>
              {{ !isEditing && !form.type
                ? 'សូមជ្រើស ចំណូល ឬ ចំណាយ មុន'
                : filteredCategories.length === 0
                  ? 'គ្មានប្រភេទ'
                  : 'ជ្រើសរើសប្រភេទ' }}
            </option>
            <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <div v-if="errors.categoryId" class="invalid-feedback">
            <i class="bi bi-exclamation-circle"></i> {{ errors.categoryId }}
          </div>
        </div>

        <!-- AMOUNT -->
        <div class="form-group mb-3">
          <label class="form-label fw-500">
            ចំនួនទឹកប្រាក់ <span class="text-danger">*</span>
          </label>
          <div class="input-group">
            <span class="input-group-text">$</span>
            <input v-model="form.amount" type="number" class="form-control" :class="{ 'is-invalid': errors.amount }"
              placeholder="0.00" min="0" step="0.01" @input="delete errors.amount" />
            <div v-if="errors.amount" class="invalid-feedback">
              <i class="bi bi-exclamation-circle"></i> {{ errors.amount }}
            </div>
          </div>
        </div>

        <!-- NOTES -->
        <div class="form-group mb-3">
          <label class="form-label fw-500">កំណត់ចំណាំ</label>
          <input v-model="form.notes" type="text" class="form-control" placeholder="បញ្ចូលកំណត់ចំណាំ (ជាជម្រើស)" />
        </div>

        <!-- DATE -->
        <div class="form-group">
          <label class="form-label fw-500">
            កាលបរិច្ឆេទ <span class="text-danger">*</span>
          </label>
          <input v-model="form.transactionDate" type="date" class="form-control"
            :class="{ 'is-invalid': errors.transactionDate }" @change="delete errors.transactionDate" />
          <div v-if="errors.transactionDate" class="invalid-feedback">
            <i class="bi bi-exclamation-circle"></i> {{ errors.transactionDate }}
          </div>
        </div>

      </template>

      <template #footer>
        <button class="btn btn-secondary" @click="closeModal" :disabled="saveLoading">
          បោះបង់
        </button>
        <button class="btn btn-primary" @click="saveBudget" :disabled="saveLoading">
          <span v-if="saveLoading" class="spinner-border spinner-border-sm me-1"></span>
          {{ isEditing ? 'កែប្រែ' : 'រក្សាទុក' }}
        </button>
      </template>
    </BaseModal>

    <!-- DELETE MODAL -->
    <BaseModal v-if="showDeleteModal" title="លុបប្រតិបត្តិការ" @close-modal="closeDeleteModal">
      <template #body>
        <div class="text-center">
          <div class="fs-1 mb-3">🗑️</div>
          <h4 class="fw-bold">លុបប្រតិបត្តិការ?</h4>
          <p>តើអ្នកពិតជាចង់លុប
            <strong>{{ selectedBudget?.category?.name }}</strong> មែនទេ?
          </p>
        </div>
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeDeleteModal" :disabled="deleteLoading">
          បោះបង់
        </button>
        <button class="btn btn-danger" @click="deleteBudget" :disabled="deleteLoading">
          <span v-if="deleteLoading" class="spinner-border spinner-border-sm me-1"></span>
          លុប
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
// ✅ defineProps & defineEmits declared to absorb what the parent passes
// (so Vue doesn't complain about "extraneous" attrs/events)
defineProps({
  items: { type: Array, default: () => [] }
})

defineEmits(['deleteTransaction', 'updateTransaction', 'createTransaction'])

import { ref, reactive, computed, onMounted } from 'vue'
import BaseModal from '../ui/base/BaseModal.vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { useTransactionStore } from '@/stores/transactionStore'
import TotalCard from '@/components/ui/base/Totalcard.vue'
import api from '@/api/api'

// ── STORES ───────────────────────────────────────────
const categoryStore = useCategoryStore()
const trstore = useTransactionStore()

// ── LOADING ──────────────────────────────────────────
const saveLoading = ref(false)
const deleteLoading = ref(false)

// ── ERRORS ───────────────────────────────────────────
const errors = reactive({})

// ── TOTALS ───────────────────────────────────────────
const totalTransactions = computed(() =>
  trstore.meta?.totalItems ?? trstore.transactions?.length ?? 0
)
const all_total = ref({ totalIncome: 0, totalExpense: 0 })

const fetchAlltotal = async () => {
  try {
    const res = await api.get('analytics/dashboard-summary')
    const data = res.data?.data
    all_total.value = {
      totalIncome: data?.totalIncome || 0,
      totalExpense: data?.totalExpense || 0,
    }
  } catch (err) {
    console.error('API Error:', err)
  }
}

// ── CATEGORIES ───────────────────────────────────────
const categories = computed(() =>
  Array.isArray(categoryStore.categories) ? categoryStore.categories : []
)

const filteredCategories = computed(() => {
  if (isEditing.value) return categories.value
  if (!form.type) return []
  return categories.value.filter(cat => cat.type === form.type)
})

// ── TRANSACTIONS ─────────────────────────────────────
const allTransactions = computed(() =>
  Array.isArray(trstore.transactions) ? trstore.transactions : []
)

// ── FILTER ───────────────────────────────────────────
const filterType = ref('')
const filterCategory = ref('')
const searchQuery = ref('')
const searchFocused = ref(false)

const hasFilter = computed(() =>
  filterType.value || filterCategory.value || searchQuery.value
)

function resetFilters() {
  filterType.value = ''
  filterCategory.value = ''
  searchQuery.value = ''
}

const filteredItems = computed(() => {
  return allTransactions.value.filter(item => {
    const matchType = !filterType.value || item.category?.type === filterType.value
    const matchCat = !filterCategory.value || item.category?.id === filterCategory.value
    const matchSearch = !searchQuery.value ||
      item.notes?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.category?.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchType && matchCat && matchSearch
  })
})

// ── MODAL STATE ──────────────────────────────────────
const showModal = ref(false)
const isEditing = ref(false)
const showDeleteModal = ref(false)
const selectedBudget = ref(null)

// ── FORM ─────────────────────────────────────────────
const form = reactive({
  type: '',
  categoryId: '',
  amount: '',
  transactionDate: '',
  notes: ''
})

// ── VALIDATION ───────────────────────────────────────
function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!isEditing.value && !form.type) errors.type = 'សូមជ្រើសប្រភេទប្រតិបត្តិការ'
  if (!form.categoryId) errors.categoryId = 'សូមជ្រើសប្រភេទ'
  if (!form.amount || form.amount <= 0) errors.amount = 'សូមបញ្ចូលចំនួនទឹកប្រាក់'
  if (!form.transactionDate) errors.transactionDate = 'សូមជ្រើសកាលបរិច្ឆេទ'
  return Object.keys(errors).length === 0
}

// ── TYPE TOGGLE ──────────────────────────────────────
function selectType(type) {
  form.type = type
  form.categoryId = ''
  delete errors.type
  delete errors.categoryId
}

// ── OPEN / CLOSE MODAL ───────────────────────────────
function openModal(item = null) {
  Object.keys(errors).forEach(k => delete errors[k])
  showModal.value = true
  if (item) {
    isEditing.value = true
    selectedBudget.value = item
    form.type = item.category?.type || ''
    form.categoryId = item.category?.id || ''
    form.amount = item.amount || ''
    form.notes = item.notes || ''
    form.transactionDate = item.transactionDate?.split('T')[0] || ''
  } else {
    isEditing.value = false
    selectedBudget.value = null
    form.type = ''
    form.categoryId = ''
    form.amount = ''
    form.notes = ''
    form.transactionDate = ''
  }
}

function closeModal() { showModal.value = false }

// ── SAVE ─────────────────────────────────────────────
async function saveBudget() {
  if (!validate()) return
  saveLoading.value = true
  try {
    const payload = {
      categoryId: form.categoryId,
      amount: Number(form.amount),
      notes: form.notes,
      transactionDate: form.transactionDate
    }
    if (isEditing.value && selectedBudget.value?.id) {
      await api.put(`transactions/${selectedBudget.value.id}`, payload)
    } else {
      await api.post('transactions', payload)
    }
    closeModal()
    await trstore.fetchTransactions()
    await fetchAlltotal()
  } catch (err) {
    console.error('Save error:', err)
  } finally {
    saveLoading.value = false
  }
}

// ── DELETE ───────────────────────────────────────────
function openDeleteModal(item) {
  selectedBudget.value = item
  showDeleteModal.value = true
}

function closeDeleteModal() { showDeleteModal.value = false }

async function deleteBudget() {
  if (!selectedBudget.value?.id) return
  deleteLoading.value = true
  try {
    await api.delete(`transactions/${selectedBudget.value.id}`)
    closeDeleteModal()
    await trstore.fetchTransactions()
    await fetchAlltotal()
  } catch (err) {
    console.error('Delete error:', err)
  } finally {
    deleteLoading.value = false
  }
}

// ── LIFECYCLE ────────────────────────────────────────
onMounted(async () => {
  await categoryStore.fetchAllCategories()
  await trstore.fetchTransactions()
  await fetchAlltotal()
})
</script>

<style scoped>
.font {
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
}

.fw-500 {
  font-weight: 500;
}

.add-btn {
  height: 46px;
  padding: 0 20px;
  font-size: 15px;
  white-space: nowrap;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
}

/* ── FILTER CARD ──────────────────────────────────── */
.filter-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.07);
  padding: 14px 18px;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.filter-label i {
  color: #1e3a8a;
  font-size: 16px;
}

.filter-selects {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-select {
  border: 1.5px solid #e5e7eb;
  border-radius: 30px;
  font-size: 13px;
  padding: 7px 16px;
  color: #374151;
  background: #f9fafb;
  cursor: pointer;
  outline: none;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  transition: border-color 0.15s, background 0.15s;
  min-width: 130px;
}

.filter-select:focus,
.filter-select:hover {
  border-color: #1e3a8a;
  background: #fff;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 200px;
  height: 40px;
  border: 1.5px solid #e5e7eb;
  border-radius: 50px;
  padding: 0 14px;
  background: #f9fafb;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box.focused {
  border-color: #1e3a8a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.08);
}

.search-box i {
  color: #9ca3af;
  font-size: 14px;
  flex-shrink: 0;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  width: 100%;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  color: #111827;
}

.search-box input::placeholder {
  color: #d1d5db;
}

.clear-btn {
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
  transition: color 0.15s;
}

.clear-btn:hover {
  color: #374151;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid #e5e7eb;
  border-radius: 30px;
  background: #fff;
  color: #6b7280;
  font-size: 13px;
  padding: 7px 14px;
  cursor: pointer;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  transition: all 0.15s;
  white-space: nowrap;
}

.reset-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
  background: #fff5f5;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f3f4f6;
}

.filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #eff6ff;
  color: #1e3a8a;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  font-size: 12px;
  padding: 3px 10px;
}

.filter-badge i {
  cursor: pointer;
  font-size: 13px;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.filter-badge i:hover {
  opacity: 1;
}

/* ── DESKTOP TABLE ────────────────────────────────── */
.table-wrap {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07);
}

.table {
  border-collapse: collapse;
}

/* ── MOBILE CARD ──────────────────────────────────── */
.mobile-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 10px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08);
}

.mobile-card__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 16px;
  flex-shrink: 0;
}

.icon--income {
  background: #dcfce7;
  color: #16a34a;
}

.icon--expense {
  background: #fee2e2;
  color: #dc2626;
}

.mobile-card__category {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
}

.mobile-card__note {
  font-size: 12px;
  color: #9ca3af;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-card__date {
  font-size: 11px;
  color: #d1d5db;
  margin-top: 2px;
}

.mobile-card__right {
  text-align: right;
  flex-shrink: 0;
}

.amount--income {
  font-size: 15px;
  font-weight: 700;
  color: #16a34a;
}

.amount--expense {
  font-size: 15px;
  font-weight: 700;
  color: #dc2626;
}

.mobile-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: 2px;
  margin-top: 4px;
}

/* ── TYPE TOGGLE ──────────────────────────────────── */
.type-toggle {
  display: flex;
  gap: 10px;
}

.type-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  transition: all 0.15s;
}

.type-btn:hover {
  background: #f3f4f6;
}

.type-btn--income.active {
  border-color: #16a34a;
  background: #dcfce7;
  color: #16a34a;
}

.type-btn--expense.active {
  border-color: #dc2626;
  background: #fee2e2;
  color: #dc2626;
}

.form-label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}
</style>