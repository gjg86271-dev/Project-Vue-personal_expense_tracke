<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import TotalCard         from '@/components/ui/base/Totalcard.vue'
import SpendingChart     from '@/components/ui/base/SpendingChart.vue'
import TrendChart        from '@/components/ui/base/TrendChart.vue'
import TransactionTable2 from '@/components/ui/base/transactionTable-2.vue'
import BaseModal         from '@/components/ui/base/BaseModal.vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { useCategoryStore }    from '@/stores/categoryStore'

const trstore       = useTransactionStore()
const categoryStore = useCategoryStore()

const pageLoading    = ref(true)
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
    const payload = new FormData()
    payload.append('categoryId',      form.categoryId)
    payload.append('amount',          Number(form.amount))
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
  try {
    await Promise.all([
      trstore.fetchSummary(),
      categoryStore.fetchAllCategories(),
      trstore.fetchTransactions(),
    ])
  } finally {
    pageLoading.value = false
  }
})
</script>

<template>
  <main class="dashboard">

    <template v-if="pageLoading">
      <section>
        <div class="skeleton skeleton-header"></div>
      </section>
      <section class="mt-3">
        <div class="row g-3">
          <div class="col-md-4" v-for="n in 3" :key="n">
            <div class="skeleton skeleton-card"></div>
          </div>
        </div>
      </section>
      <section class="mt-3">
        <div class="row g-3">
          <div class="col-md-7"><div class="skeleton skeleton-chart"></div></div>
          <div class="col-md-5"><div class="skeleton skeleton-chart"></div></div>
        </div>
      </section>
      <section class="mt-3">
        <div class="skeleton skeleton-table"></div>
      </section>
    </template>

    <template v-else>

      <!-- HEADER -->
      <section>
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
      </section>

      <!-- SUMMARY -->
      <section class="mt-3">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="card-light">
              <TotalCard title="ចំណូលសរុប" :value="trstore.summary.totalIncome">
                <template #icon>
                  <div class="icon-wrap icon-wrap--income"><i class="bi bi-graph-up-arrow fs-4"></i></div>
                </template>
              </TotalCard>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card-light">
              <TotalCard title="ចំណាយសរុប" :value="trstore.summary.totalExpense">
                <template #icon>
                  <div class="icon-wrap icon-wrap--expense"><i class="bi bi-graph-down-arrow fs-4"></i></div>
                </template>
              </TotalCard>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card-light">
              <TotalCard title="សមតុល្យសុទ្ធ" :value="trstore.summary.netBalance">
                <template #icon>
                  <div class="icon-wrap icon-wrap--neutral"><i class="bi bi-credit-card-2-back fs-4"></i></div>
                </template>
              </TotalCard>
            </div>
          </div>
        </div>
      </section>

      <!-- CHARTS -->
      <section class="mt-3">
        <div class="row g-3 align-items-stretch">
          <div class="col-md-7 d-flex">
            <div class="card-light w-100"><SpendingChart /></div>
          </div>
          <div class="col-md-5 d-flex">
            <div class="card-light w-100"><TrendChart /></div>
          </div>
        </div>
      </section>

      <!-- TABLE -->
      <section class="mt-3">
        <div class="row">
          <div class="col-12">
            <div class="card border-0 bg-transparent">
              <TransactionTable2 />
            </div>
          </div>
        </div>
      </section>

    </template>
  </main>

  <!-- ════════════════════════════════════════════
       ADD / EDIT MODAL
  ═════════════════════════════════════════════ -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="showModal" class="swal-overlay" @click.self="closeModal">
        <div class="swal-box">

          <!-- Header -->
          <div class="swal-header">
            <div class="swal-header__icon" :class="isEditing ? 'icon-edit' : 'icon-create'">
              <i :class="isEditing ? 'bi bi-pencil-square' : 'bi bi-plus-circle-fill'"></i>
            </div>
            <div>
              <h3 class="swal-title">
                {{ isEditing ? 'កែប្រែប្រតិបត្តិការ' : 'បន្ថែមប្រតិបត្តិការ' }}
              </h3>
              <p class="swal-desc">
                {{ isEditing ? 'កែប្រែព័ត៌មានប្រតិបត្តិការ' : 'បំពេញព័ត៌មានប្រតិបត្តិការថ្មី' }}
              </p>
            </div>
            <button class="swal-close" @click="closeModal" :disabled="saveLoading">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="swal-body" style="position: relative;">

            <div v-if="saveLoading" class="form-loading-overlay">
              <div class="form-spinner"></div>
              <span>កំពុងរក្សាទុក...</span>
            </div>

            <!-- Type toggle -->
            <div v-if="!isEditing" class="field-group">
              <label class="field-label">
                ប្រភេទប្រតិបត្តិការ <span class="required">*</span>
              </label>
              <div class="type-toggle">
                <button
                  :class="['type-btn type-btn--income', { active: form.type === 'INCOME' }]"
                  @click="selectType('INCOME')" type="button" :disabled="saveLoading">
                  <i class="bi bi-graph-up-arrow"></i> ចំណូល
                </button>
                <button
                  :class="['type-btn type-btn--expense', { active: form.type === 'EXPENSE' }]"
                  @click="selectType('EXPENSE')" type="button" :disabled="saveLoading">
                  <i class="bi bi-graph-down-arrow"></i> ចំណាយ
                </button>
              </div>
              <div v-if="errors.type" class="field-error">
                <i class="bi bi-exclamation-circle"></i> {{ errors.type }}
              </div>
            </div>

            <!-- Category -->
            <div class="field-group">
              <label class="field-label">ប្រភេទ <span class="required">*</span></label>
              <div class="input-shell input-shell--select" :class="{ 'is-invalid': errors.categoryId }">
                <i class="bi bi-tag-fill field-icon"></i>
                <select
                  v-model="form.categoryId"
                  :disabled="saveLoading || (!isEditing && !form.type)"
                  @change="delete errors.categoryId"
                >
                  <option value="" disabled>
                    {{ !isEditing && !form.type
                      ? 'សូមជ្រើស ចំណូល ឬ ចំណាយ មុន'
                      : filteredCategories.length === 0 ? 'គ្មានប្រភេទ' : 'ជ្រើសរើសប្រភេទ' }}
                  </option>
                  <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>
              <div v-if="errors.categoryId" class="field-error">
                <i class="bi bi-exclamation-circle"></i> {{ errors.categoryId }}
              </div>
            </div>

            <!-- Amount -->
            <div class="field-group">
              <label class="field-label">ចំនួនទឹកប្រាក់ <span class="required">*</span></label>
              <div class="input-shell" :class="{ 'is-invalid': errors.amount }">
                <span class="field-icon dollar-sign">$</span>
                <input
                  v-model="form.amount" type="number"
                  placeholder="0.00" min="0" step="0.01"
                  :disabled="saveLoading"
                  @input="delete errors.amount"
                />
              </div>
              <div v-if="errors.amount" class="field-error">
                <i class="bi bi-exclamation-circle"></i> {{ errors.amount }}
              </div>
            </div>

            <!-- Notes -->
            <div class="field-group">
              <label class="field-label">កំណត់ចំណាំ</label>
              <div class="input-shell">
                <i class="bi bi-pencil field-icon"></i>
                <input
                  v-model="form.notes" type="text"
                  placeholder="បញ្ចូលកំណត់ចំណាំ (ជាជម្រើស)"
                  :disabled="saveLoading"
                />
              </div>
            </div>

            <!-- Date -->
            <div class="field-group">
              <label class="field-label">កាលបរិច្ឆេទ <span class="required">*</span></label>
              <div class="input-shell" :class="{ 'is-invalid': errors.transactionDate }">
                <i class="bi bi-calendar3 field-icon"></i>
                <input
                  v-model="form.transactionDate" type="date"
                  :disabled="saveLoading"
                  @change="delete errors.transactionDate"
                />
              </div>
              <div v-if="errors.transactionDate" class="field-error">
                <i class="bi bi-exclamation-circle"></i> {{ errors.transactionDate }}
              </div>
            </div>

            <!-- File -->
            <div class="field-group" style="margin-bottom: 0;">
              <label class="field-label">ឯកសារភ្ជាប់</label>
              <div class="input-shell file-shell">
                <i class="bi bi-paperclip field-icon"></i>
                <input type="file" accept="image/*,.pdf" :disabled="saveLoading" @change="onFileChange" />
              </div>
              <div v-if="isEditing && selectedBudget?.attachmentUrl && !form.file" class="mt-2">
                <a :href="selectedBudget.attachmentUrl" target="_blank" class="attachment-link">
                  <i class="bi bi-paperclip"></i> មើលឯកសារបច្ចុប្បន្ន
                </a>
              </div>
              <div v-if="form.file" class="selected-file mt-2">
                <i class="bi bi-file-earmark"></i> {{ form.file.name }}
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="swal-footer">
            <button class="swal-btn swal-btn--cancel" @click="closeModal" :disabled="saveLoading">
              បោះបង់
            </button>
            <button class="swal-btn swal-btn--confirm" @click="saveBudget" :disabled="saveLoading">
              <span v-if="saveLoading" class="btn-spinner btn-spinner--white"></span>
              <i v-else :class="isEditing ? 'bi bi-check-lg' : 'bi bi-plus-lg'"></i>
              {{ saveLoading ? 'កំពុងរក្សាទុក...' : isEditing ? 'កែប្រែ' : 'រក្សាទុក' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Skeleton ─────────────────────────────────────────────────────────── */
.skeleton {
  background: linear-gradient(90deg, var(--bg-input) 25%, var(--border-color) 50%, var(--bg-input) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: var(--radius);
}
@keyframes shimmer {
  0%   { background-position: 200% 0 }
  100% { background-position: -200% 0 }
}
.skeleton-header { height: 80px; }
.skeleton-card   { height: 110px; }
.skeleton-chart  { height: 320px; }
.skeleton-table  { height: 280px; }

/* ── Dashboard ────────────────────────────────────────────────────────── */
.dashboard { font-family: 'Kantumruy Pro', sans-serif; }

section {
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
  background-color: transparent !important;
}

/* ── Header card ──────────────────────────────────────────────────────── */
.header-card {
  background: var(--bg-sidebar); border: 1px solid var(--border-color);
  border-radius: var(--radius); padding: 18px 24px;
  display: flex; justify-content: space-between; align-items: center;
  box-shadow: var(--shadow);
}
.header-card h1 { font-size: 20px; font-weight: 700; margin: 0 0 2px; color: var(--text-white); }
.header-card p  { font-size: 12px; margin: 0; color: rgba(255,255,255,0.65); }

.add-btn {
  height: 46px; padding: 0 20px; font-size: 15px; white-space: nowrap;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
  background: rgba(255,255,255,0.15); color: var(--text-white);
  border: 1.5px solid rgba(255,255,255,0.4); border-radius: 12px;
  cursor: pointer; transition: var(--transition);
}
.add-btn:hover { background: rgba(255,255,255,0.25); }

/* ── Icon wraps ───────────────────────────────────────────────────────── */
.icon-wrap { padding: 8px 14px; border-radius: 10px; color: var(--text-white); }
.icon-wrap--income  { background: var(--color-success); }
.icon-wrap--expense { background: var(--color-danger); }
.icon-wrap--neutral { background: var(--text-secondary); }

/* ── Card light ───────────────────────────────────────────────────────── */
.card-light {
  background: var(--bg-card); border-radius: var(--radius);
  box-shadow: var(--shadow); transition: var(--transition);
  height: 100%; display: flex; flex-direction: column;
}
.card-light:hover { transform: translateY(-2px); }
.card-light > * { flex: 1; min-height: 0; }

/* ══════════════════════════════════════════════
   MODAL  (matches BudgetView / CategoryView)
══════════════════════════════════════════════ */
.swal-overlay {
  position: fixed; inset: 0;
  background: rgba(4, 44, 131, 0.22); backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1050; padding: 16px;
}

.swal-box {
  background: var(--bg-card); border-radius: 24px;
  width: 100%; max-width: 460px; max-height: 90vh;
  display: flex; flex-direction: column;
  box-shadow: var(--shadow); overflow: hidden;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  border: 1px solid var(--border-color);
}

/* Header */
.swal-header {
  display: flex; align-items: center; gap: 14px;
  padding: 22px 24px 16px; border-bottom: 1px solid var(--border-color);
  position: relative; flex-shrink: 0;
}
.swal-header__icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.icon-create { background: var(--bg-input);           color: var(--color-primary); }
.icon-edit   { background: var(--color-danger-light); color: var(--color-danger); }

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
.swal-body { padding: 20px 24px; overflow-y: auto; flex: 1; }

/* Footer */
.swal-footer {
  display: flex; gap: 10px;
  padding: 16px 24px 22px; border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.swal-btn {
  flex: 1; height: 46px; border-radius: 50px; border: none;
  font-size: 14px; font-weight: 700; cursor: pointer;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  display: flex; align-items: center; justify-content: center;
  gap: 7px; transition: var(--transition);
}
.swal-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.swal-btn--cancel {
  background: var(--bg-input); color: var(--text-secondary);
}
.swal-btn--cancel:hover:not(:disabled) { background: var(--bg-body); color: var(--text-primary); }

.swal-btn--confirm {
  flex: 2;
  background: var(--color-primary); color: var(--text-white);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
.swal-btn--confirm:hover:not(:disabled) { background: var(--color-primary-hover); transform: translateY(-1px); }

/* Form loading overlay */
.form-loading-overlay {
  position: absolute; inset: 0; z-index: 10;
  background: color-mix(in srgb, var(--bg-card) 85%, transparent);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; font-size: 13px; color: var(--text-secondary);
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}
.form-spinner {
  width: 32px; height: 32px;
  border: 3px solid color-mix(in srgb, var(--color-primary) 25%, transparent);
  border-top-color: var(--color-primary);
  border-radius: 50%; animation: spin 0.7s linear infinite;
}

/* ── Field group ──────────────────────────────────────────────────────── */
.field-group { margin-bottom: 18px; }

.field-label {
  display: block; margin-bottom: 8px;
  font-size: 13px; font-weight: 600; color: var(--text-primary);
}
.required { color: var(--color-danger); }

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
.dollar-sign { font-weight: 700; font-size: 15px; }

.input-shell input,
.input-shell select {
  flex: 1; height: 100%; border: 0; outline: 0;
  background: transparent; font-size: 14px;
  color: var(--text-primary);
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}
.input-shell input::placeholder { color: var(--border-color); }
.input-shell input:disabled,
.input-shell select:disabled { opacity: 0.6; }
.input-shell select { cursor: pointer; }

/* file input inside shell */
.file-shell { cursor: pointer; }
.file-shell input[type="file"] {
  flex: 1; height: 100%; border: 0; outline: 0;
  background: transparent; font-size: 13px;
  color: var(--text-primary);
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  cursor: pointer;
}

.field-error {
  font-size: 12px; color: var(--color-danger);
  margin-top: 4px; display: flex; align-items: center; gap: 4px;
}

/* ── Type toggle ──────────────────────────────────────────────────────── */
.type-toggle { display: flex; gap: 10px; }
.type-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
  height: 46px; border-radius: 12px; border: 2px solid var(--border-color);
  background: var(--bg-input); color: var(--text-secondary);
  font-size: 14px; font-weight: 700; cursor: pointer;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  transition: var(--transition);
}
.type-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.type-btn--income.active  { border-color: var(--color-success); background: var(--color-success-light); color: var(--color-success); }
.type-btn--expense.active { border-color: var(--color-danger);  background: var(--color-danger-light);  color: var(--color-danger); }

/* ── Attachment / file helpers ────────────────────────────────────────── */
.attachment-link {
  font-size: 13px; color: var(--color-primary);
  text-decoration: none; display: inline-flex; align-items: center; gap: 4px;
}
.attachment-link:hover { text-decoration: underline; }

.selected-file {
  font-size: 13px; color: var(--text-secondary);
  display: inline-flex; align-items: center; gap: 4px;
}

/* ── Spinner ──────────────────────────────────────────────────────────── */
.btn-spinner {
  width: 16px; height: 16px; flex-shrink: 0;
  border: 2px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
  border-top-color: var(--color-primary);
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.btn-spinner--white {
  border-color: rgba(255,255,255,0.35);
  border-top-color: var(--text-white);
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Modal transition ─────────────────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }
.modal-fade-enter-from .swal-box,
.modal-fade-leave-to .swal-box { transform: scale(0.94) translateY(12px); }
.modal-fade-enter-active .swal-box,
.modal-fade-leave-active .swal-box { transition: transform 0.25s ease; }
</style>