<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import TotalCard from '@/components/ui/base/Totalcard.vue'
import SpendingChart from '@/components/ui/base/SpendingChart.vue'
import TrendChart from '@/components/ui/base/TrendChart.vue'
import TransactionTable2 from '@/components/ui/base/transactionTable-2.vue'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { useCategoryStore } from '@/stores/categoryStore'

const trstore       = useTransactionStore()
const categoryStore = useCategoryStore()

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
  transactionDate: '',
  file:            null,
})

const categories = computed(() =>
  Array.isArray(categoryStore.categories) ? categoryStore.categories : []
)

const filteredCategories = computed(() =>
  isEditing.value
    ? categories.value
    : form.type ? categories.value.filter(c => c.type === form.type) : []
)

function clearErrors() {
  Object.keys(errors).forEach(k => delete errors[k])
}

function validate() {
  clearErrors()
  if (!form.type && !isEditing.value)           errors.type            = 'សូមជ្រើសប្រភេទ'
  if (!form.categoryId)                         errors.categoryId      = 'សូមជ្រើសប្រភេទ'
  if (!form.amount || Number(form.amount) <= 0) errors.amount          = 'សូមបញ្ចូលចំនួនត្រឹមត្រូវ'
  if (!form.transactionDate)                    errors.transactionDate = 'សូមជ្រើសកាលបរិច្ឆេទ'
  return Object.keys(errors).length === 0
}

function selectType(type) {
  form.type       = type
  form.categoryId = ''
  delete errors.type
  delete errors.categoryId
}

function openModal(item = null) {
  clearErrors()
  showModal.value = true
  if (item) {
    isEditing.value      = true
    selectedBudget.value = item
    form.type            = item.category?.type || ''
    form.categoryId      = item.category?.id   || ''
    form.amount          = item.amount          ?? ''
    form.notes           = item.notes           ?? ''
    form.transactionDate = item.transactionDate?.split('T')[0] || ''
    form.file            = null
  } else {
    isEditing.value      = false
    selectedBudget.value = null
    form.type            = ''
    form.categoryId      = ''
    form.amount          = ''
    form.notes           = ''
    form.transactionDate = ''
    form.file            = null
  }
}

function closeModal() { showModal.value = false }

function onFileChange(e) {
  form.file = e.target.files[0] || null
}

async function saveBudget() {
  if (!validate()) return
  saveLoading.value = true
  try {
    // ← ប្រើ FormData តែមួយ (API ទទួល form-data)
    // ← categoryId មិនត្រូវ Number() ព្រោះវា UUID string
    const payload = new FormData()
    payload.append('categoryId',      form.categoryId)        // ← UUID string ដូចគ្នា
    payload.append('amount',          Number(form.amount))    // ← amount ទើបជា number
    payload.append('notes',           form.notes || '')
    payload.append('transactionDate', form.transactionDate)
    if (form.file) payload.append('file', form.file)

    if (isEditing.value && selectedBudget.value?.id) {
      await trstore.updateTransaction(selectedBudget.value.id, payload)
    } else {
      await trstore.createTransaction(payload)
    }

    closeModal()
    await trstore.fetchTransactions()
    await trstore.fetchSummary()
  } catch (err) {
    console.error('Save error:', JSON.stringify(err.response?.data, null, 2))
  } finally {
    saveLoading.value = false
  }
}

onMounted(async () => {
  await trstore.fetchSummary()
  await categoryStore.fetchAllCategories()
  await trstore.fetchTransactions()
})
</script>

<template>
  <main class="dashboard">

    <!-- HEADER -->
    <section>
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="header-card">
              <div>
                <h1>ផ្ទាំងគ្រប់គ្រង</h1>
                <p>ទិដ្ឋភាពទូទៅនៃសកម្មភាពហិរញ្ញវត្ថុ</p>
              </div>
              <button class="add-btn" @click="openModal()">
                <i class="bi bi-plus"></i> បន្ថែមប្រតិបត្តិការ
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SUMMARY -->
    <section class="mt-3">
      <div class="container">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="card-light">
              <TotalCard title="ចំណូលសរុប" :value="trstore.summary.totalIncome">
                <template #icon>
                  <div class="icon-wrap icon-wrap--income">
                    <i class="bi bi-graph-up-arrow fs-4"></i>
                  </div>
                </template>
              </TotalCard>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card-light">
              <TotalCard title="ចំណាយសរុប" :value="trstore.summary.totalExpense">
                <template #icon>
                  <div class="icon-wrap icon-wrap--expense">
                    <i class="bi bi-graph-down-arrow fs-4"></i>
                  </div>
                </template>
              </TotalCard>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card-light">
              <TotalCard title="សមតុល្យសុទ្ធ" :value="trstore.summary.netBalance">
                <template #icon>
                  <div class="icon-wrap icon-wrap--neutral">
                    <i class="bi bi-credit-card-2-back fs-4"></i>
                  </div>
                </template>
              </TotalCard>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CHARTS -->
    <section class="mt-3">
      <div class="container">
        <div class="row g-3 align-items-stretch">
          <div class="col-md-7 d-flex">
            <div class="card-light w-100">
              <SpendingChart />
            </div>
          </div>
          <div class="col-md-5 d-flex">
            <div class="card-light w-100">
              <TrendChart />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TABLE -->
    <section class="mt-3">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="card border-0 bg-transparent">
              <TransactionTable2 :transactions="trstore.transactions" />
            </div>
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

      <!-- TYPE TOGGLE (create only) -->
      <div v-if="!isEditing" class="mb-4">
        <label class="form-label fw-500">
          ប្រភេទប្រតិបត្តិការ <span class="text-danger">*</span>
        </label>
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

      <!-- CATEGORY -->
      <div class="form-group mb-3">
        <label class="form-label fw-500">
          ប្រភេទ <span class="text-danger">*</span>
        </label>
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

      <!-- NOTES -->
      <div class="form-group mb-3">
        <label class="form-label fw-500">កំណត់ចំណាំ</label>
        <input
          v-model="form.notes"
          type="text"
          class="form-control"
          placeholder="បញ្ចូលកំណត់ចំណាំ (ជាជម្រើស)"
        />
      </div>

      <!-- DATE -->
      <div class="form-group mb-3">
        <label class="form-label fw-500">
          កាលបរិច្ឆេទ <span class="text-danger">*</span>
        </label>
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

      <!-- ATTACHMENT -->
      <div class="form-group">
        <label class="form-label fw-500">ឯកសារភ្ជាប់</label>
        <input
          type="file"
          class="form-control"
          accept="image/*,.pdf"
          @change="onFileChange"
        />
        <div v-if="isEditing && selectedBudget?.attachmentUrl && !form.file" class="mt-2">
          <a :href="selectedBudget.attachmentUrl" target="_blank" class="attachment-link">
            <i class="bi bi-paperclip"></i> មើលឯកសារបច្ចុប្បន្ន
          </a>
        </div>
        <div v-if="form.file" class="mt-2 selected-file">
          <i class="bi bi-file-earmark"></i> {{ form.file.name }}
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
.dashboard {
  font-family: 'Kantumruy Pro', sans-serif;
}

.header-card {
  background: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow);
}

.header-card h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 2px 0;
  color: var(--text-white);
}

.header-card p {
  font-size: 12px;
  margin: 0;
  color: rgba(255, 255, 255, 0.65);
}

.add-btn {
  height: 46px;
  padding: 0 20px;
  font-size: 15px;
  white-space: nowrap;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
  background: rgba(255, 255, 255, 0.15);
  color: var(--text-white);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition);
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.icon-wrap {
  padding: 8px 14px;
  border-radius: 10px;
  color: var(--text-white);
}

.icon-wrap--income  { background: var(--color-success); }
.icon-wrap--expense { background: var(--color-danger);  }
.icon-wrap--neutral { background: var(--text-secondary); }

.card-light {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: var(--transition);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-light:hover { transform: translateY(-2px); }
.card-light > * { flex: 1; min-height: 0; }

section {
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
  background-color: transparent !important;
}

.type-toggle { display: flex; gap: 10px; }

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
  border: 2px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-secondary);
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  transition: var(--transition);
}

.type-btn:hover { background: var(--bg-body); }
.type-btn--income.active  { border-color: var(--color-success); background: var(--color-success-light); color: var(--color-success); }
.type-btn--expense.active { border-color: var(--color-danger);  background: var(--color-danger-light);  color: var(--color-danger);  }

.form-label {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}

.fw-500 { font-weight: 500; }

.attachment-link {
  font-size: 13px;
  color: var(--color-primary, #0d6efd);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.attachment-link:hover { text-decoration: underline; }

.selected-file {
  font-size: 13px;
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>