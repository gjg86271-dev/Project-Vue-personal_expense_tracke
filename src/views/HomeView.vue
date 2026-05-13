<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import TotalCard from '@/components/ui/base/Totalcard.vue'
import api from '@/api/api'
import SpendingChart from '@/components/ui/base/SpendingChart.vue'
import TrendChart from '@/components/ui/base/TrendChart.vue'
import TransactionTable2 from '@/components/ui/base/transactionTable-2.vue'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { useCategoryStore } from '@/stores/categoryStore'

const showModal      = ref(false)
const isEditing      = ref(false)
const selectedBudget = ref(null)
const saveLoading    = ref(false)
const errors         = reactive({})

const form = reactive({
  type:            '',
  categoryId:      '',
  amount:          '',
  notes:           '',
  transactionDate: ''
})

const loading      = ref(true)
const trstore      = useTransactionStore()
const categoryStore = useCategoryStore()

const all_total = ref({
  totalIncome:  0,
  totalExpense: 0,
  netBalance:   0
})

// ── categories from store (always an array) ───────
const categories = computed(() =>
  Array.isArray(categoryStore.categories) ? categoryStore.categories : []
)

// ── filter category តាម type ──────────────────────
const filteredCategories = computed(() => {
  if (!form.type) return []
  return categories.value.filter(c => c.type === form.type)
})

// ── validation ────────────────────────────────────
function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.type && !isEditing.value)   errors.type            = 'សូមជ្រើសប្រភេទ'
  if (!form.categoryId)                 errors.categoryId      = 'សូមជ្រើសប្រភេទ'
  if (!form.amount || form.amount <= 0) errors.amount          = 'សូមបញ្ចូលចំនួនទឹកប្រាក់'
  if (!form.transactionDate)            errors.transactionDate = 'សូមជ្រើសកាលបរិច្ឆេទ'
  return Object.keys(errors).length === 0
}

// ── type toggle ───────────────────────────────────
function selectType(type) {
  form.type       = type
  form.categoryId = ''
  delete errors.type
  delete errors.categoryId
}

// ── modal open/close ──────────────────────────────
function openModal(item = null) {
  Object.keys(errors).forEach(k => delete errors[k])
  showModal.value = true
  if (item) {
    isEditing.value      = true
    selectedBudget.value = item
    form.type            = item.category?.type || ''
    form.categoryId      = item.category?.id   || ''
    form.amount          = item.amount          || ''
    form.notes           = item.notes           || ''
    form.transactionDate = item.transactionDate?.split('T')[0] || ''
  } else {
    isEditing.value      = false
    selectedBudget.value = null
    form.type            = ''
    form.categoryId      = ''
    form.amount          = ''
    form.notes           = ''
    form.transactionDate = ''
  }
}

function closeModal() { showModal.value = false }

// ── save ──────────────────────────────────────────
const saveBudget = async () => {
  if (!validate()) return
  saveLoading.value = true
  try {
    const payload = {
      categoryId:      form.categoryId,
      amount:          Number(form.amount),
      notes:           form.notes,
      transactionDate: form.transactionDate
    }
    if (isEditing.value && selectedBudget.value?.id) {
      await api.put(`transactions/${selectedBudget.value.id}`, payload)
    } else {
      await api.post('transactions', payload)
    }
    closeModal()
    await fetchAlltotal()
    await trstore.fetchTransactions()
  } catch (err) {
    console.error('Save error:', err)
  } finally {
    saveLoading.value = false
  }
}

// ── fetch totals ──────────────────────────────────
const fetchAlltotal = async () => {
  try {
    const res  = await api.get('analytics/dashboard-summary')
    const data = res.data?.data
    all_total.value = {
      totalIncome:  data?.totalIncome  || 0,
      totalExpense: data?.totalExpense || 0,
      netBalance:   data?.netBalance   || 0
    }
  } catch (err) {
    console.error('API Error:', err)
  } finally {
    loading.value = false
  }
}

defineProps({
  transactions: { type: Array, default: () => [] }
})

onMounted(async () => {
  await fetchAlltotal()
  await categoryStore.fetchAllCategories()
  await trstore.fetchTransactions()
})
</script>

<template>
  <main class="dashboard">

    <!-- SUMMARY CARDS -->
    <section>
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>
      <div v-else class="container">
        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div>
            <h1 class="fw-bold mb-1">ផ្ទាំងគ្រប់គ្រង</h1>
            <p class="text-secondary mb-0">ទិដ្ឋភាពទូទៅនៃសកម្មភាពហិរញ្ញវត្ថុរបស់អ្នក</p>
          </div>
          <button class="btn btn-primary rounded-5 add-btn" @click="openModal()">
            <i class="bi bi-plus"></i> បន្ថែមប្រតិបត្តិការ
          </button>
        </div>
        <div class="row g-4">
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
          <div class="col-12 col-md-4">
            <TotalCard title="សមតុល្យសុទ្ធ" :value="all_total.netBalance">
              <template #icon>
                <div class="bg-secondary px-3 py-2 rounded-3 text-white">
                  <i class="bi bi-wallet2 fs-4"></i>
                </div>
              </template>
            </TotalCard>
          </div>
        </div>
      </div>
    </section>

    <!-- CHARTS -->
    <section class="mt-3">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-6">
            <SpendingChart class="chart-height" />
          </div>
          <div class="col-md-6">
            <TrendChart class="chart-height" />
          </div>
        </div>
      </div>
    </section>

    <!-- TRANSACTION TABLE -->
    <section class="mt-3">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-12">
            <TransactionTable2 :transactions="trstore.transactions" />
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- MODAL -->
  <BaseModal
    v-if="showModal"
    :title="isEditing ? 'កែប្រែប្រតិបត្តិការ' : 'បន្ថែមប្រតិបត្តិការ'"
    @close-modal="closeModal"
  >
    <template #body>

      <div v-if="!isEditing" class="mb-4">
        <label class="form-label">ប្រភេទប្រតិបត្តិការ <span class="text-danger">*</span></label>
        <div class="type-toggle">
          <button
            :class="['type-btn type-btn--income', { active: form.type === 'INCOME' }]"
            @click="selectType('INCOME')"
            type="button"
          >
            <i class="bi bi-graph-up-arrow"></i> ចំណូល
          </button>
          <button
            :class="['type-btn type-btn--expense', { active: form.type === 'EXPENSE' }]"
            @click="selectType('EXPENSE')"
            type="button"
          >
            <i class="bi bi-graph-down-arrow"></i> ចំណាយ
          </button>
        </div>
        <div v-if="errors.type" class="text-danger small mt-1">
          <i class="bi bi-exclamation-circle"></i> {{ errors.type }}
        </div>
      </div>

      <div class="form-group mb-3">
        <label class="form-label">ប្រភេទ <span class="text-danger">*</span></label>
        <select
          class="form-select"
          :class="{ 'is-invalid': errors.categoryId }"
          v-model="form.categoryId"
          :disabled="!isEditing && !form.type"
        >
          <option value="" disabled>
            {{ !isEditing && !form.type
              ? 'សូមជ្រើស ចំណូល ឬ ចំណាយ មុន'
              : filteredCategories.length === 0
                ? 'គ្មានប្រភេទ'
                : 'ជ្រើសរើសប្រភេទ' }}
          </option>
          <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <div v-if="errors.categoryId" class="invalid-feedback">
          <i class="bi bi-exclamation-circle"></i> {{ errors.categoryId }}
        </div>
      </div>

      <div class="form-group mb-3">
        <label class="form-label">ចំនួនទឹកប្រាក់ <span class="text-danger">*</span></label>
        <div class="input-group">
          <span class="input-group-text">$</span>
          <input
            v-model="form.amount"
            type="number"
            class="form-control"
            :class="{ 'is-invalid': errors.amount }"
            placeholder="0.00"
            min="0"
            step="0.01"
            @input="delete errors.amount"
          />
          <div v-if="errors.amount" class="invalid-feedback">
            <i class="bi bi-exclamation-circle"></i> {{ errors.amount }}
          </div>
        </div>
      </div>

      <div class="form-group mb-3">
        <label class="form-label">កំណត់ចំណាំ</label>
        <input
          v-model="form.notes"
          type="text"
          class="form-control"
          placeholder="បញ្ចូលកំណត់ចំណាំ (ជាជម្រើស)"
        />
      </div>

      <div class="form-group">
        <label class="form-label">កាលបរិច្ឆេទ <span class="text-danger">*</span></label>
        <input
          v-model="form.transactionDate"
          type="date"
          class="form-control"
          :class="{ 'is-invalid': errors.transactionDate }"
          @change="delete errors.transactionDate"
        />
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
</template>

<style scoped>
.dashboard,
.dashboard * {
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
}

.chart-height { height: 360px; }

.add-btn {
  height: 46px;
  padding: 0 20px;
  font-size: 15px;
  white-space: nowrap;
}

.type-toggle { display: flex; gap: 10px; }

.type-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  transition: all 0.15s;
}

.type-btn:hover { background: #f3f4f6; }

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