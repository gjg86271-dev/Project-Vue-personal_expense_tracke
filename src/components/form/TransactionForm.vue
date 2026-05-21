<template>
  <div>

    <div class="font mb-4">

      <!-- HEADER BANNER -->
      <div class="header-banner">
        <div>
          <h1>ប្រតិបត្តិការ</h1>
          <p>គ្រប់គ្រងប្រតិបត្តិការហិរញ្ញវត្ថុរបស់អ្នកទាំងអស់</p>
        </div>
        <button class="add-btn" @click="openModal()">
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
              <th>ឯកសារ</th>
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
                <template v-if="item.attachmentUrl">
                  <!-- បើជារូប → បង្ហាញ thumbnail -->
                  <a v-if="isImageUrl(item.attachmentUrl)" :href="item.attachmentUrl" target="_blank">
                    <img :src="item.attachmentUrl" class="table-thumb" alt="attachment" />
                  </a>
                  <!-- បើជា PDF/file → បង្ហាញ icon -->
                  <a v-else :href="item.attachmentUrl" target="_blank" class="attachment-link">
                    <i class="bi bi-file-earmark-pdf text-danger fs-5"></i>
                  </a>
                </template>
                <!-- អត់មានឯកសារ → បង្ហាញ placeholder icon ស្អាត -->
                <div v-else class="no-attach-icon">
                  <i class="bi bi-image"></i>
                </div>
              </td>
              <td>
                <button class="btn text-info btn-sm" @click="goToDetail(item.id)" title="មើលលម្អិត">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn text-dark btn-sm" @click="openModal(item)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn text-danger btn-sm" @click="openDeleteModal(item)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="7" class="text-center py-5 text-muted">
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
          <div class="mobile-card__left" @click="goToDetail(item.id)" style="cursor:pointer">
            <div :class="['mobile-icon', item.category?.type === 'INCOME' ? 'icon--income' : 'icon--expense']">
              <i :class="item.category?.type === 'INCOME' ? 'bi bi-graph-up-arrow' : 'bi bi-graph-down-arrow'"></i>
            </div>
            <div>
              <div class="mobile-card__category">{{ item.category?.name }}</div>
              <div class="mobile-card__note">{{ item.notes || '—' }}</div>
              <div class="mobile-card__date">
                {{ new Date(item.transactionDate).toLocaleDateString('en-GB') }}
              </div>
              <a v-if="item.attachmentUrl" :href="item.attachmentUrl" target="_blank" class="attachment-link small"
                @click.stop>
                <i class="bi bi-paperclip"></i> ឯកសារ
              </a>
            </div>
          </div>
          <div class="mobile-card__right">
            <div :class="item.category?.type === 'INCOME' ? 'amount--income' : 'amount--expense'">
              {{ item.category?.type === 'INCOME' ? '+' : '-' }}${{ item.amount }}
            </div>
            <div class="mobile-card__actions">
              <button class="btn btn-sm text-info p-1" @click="goToDetail(item.id)">
                <i class="bi bi-eye"></i>
              </button>
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

      <!-- PAGINATION -->
      <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
        <Pagination v-model:currentPage="currentPage" :total-pages="totalPages" :sibling-count="1" />
      </div>

    </div>

    <!-- CREATE / EDIT MODAL -->
    <BaseModal v-if="showModal" :title="isEditing ? 'កែប្រែប្រតិបត្តិការ' : 'បន្ថែមប្រតិបត្តិការ'"
      @close-modal="closeModal">
      <template #body>

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

        <div class="form-group mb-3">
          <label class="form-label fw-500">ប្រភេទ <span class="text-danger">*</span></label>
          <select class="form-select" :class="{ 'is-invalid': errors.categoryId }" v-model="form.categoryId"
            :disabled="!isEditing && !form.type">
            <option value="" disabled>
              {{ !isEditing && !form.type
                ? 'សូមជ្រើស ចំណូល ឬ ចំណាយ មុន'
                : filteredCategories.length === 0 ? 'គ្មានប្រភេទ' : 'ជ្រើសរើសប្រភេទ' }}
            </option>
            <option v-for="category in filteredCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <div v-if="errors.categoryId" class="invalid-feedback">
            <i class="bi bi-exclamation-circle"></i> {{ errors.categoryId }}
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="form-label fw-500">ចំនួនទឹកប្រាក់ <span class="text-danger">*</span></label>
          <div class="input-group">
            <span class="input-group-text">$</span>
            <input v-model="form.amount" type="number" class="form-control" :class="{ 'is-invalid': errors.amount }"
              placeholder="0.00" min="0" step="0.01" @input="delete errors.amount" />
            <div v-if="errors.amount" class="invalid-feedback">
              <i class="bi bi-exclamation-circle"></i> {{ errors.amount }}
            </div>
          </div>
        </div>

        <div class="form-group mb-3">
          <label class="form-label fw-500">កំណត់ចំណាំ</label>
          <input v-model="form.notes" type="text" class="form-control" placeholder="បញ្ចូលកំណត់ចំណាំ (ជាជម្រើស)" />
        </div>

        <div class="form-group mb-3">
          <label class="form-label fw-500">កាលបរិច្ឆេទ <span class="text-danger">*</span></label>
          <input v-model="form.transactionDate" type="date" class="form-control"
            :class="{ 'is-invalid': errors.transactionDate }" @change="delete errors.transactionDate" />
          <div v-if="errors.transactionDate" class="invalid-feedback">
            <i class="bi bi-exclamation-circle"></i> {{ errors.transactionDate }}
          </div>
        </div>

        <!-- ✅ ATTACHMENT FIELD WITH PREVIEW -->
        <div class="form-group">
          <label class="form-label fw-500">ឯកសារភ្ជាប់</label>
          <input type="file" class="form-control" accept="image/*,.pdf" @change="onFileChange" />

          <div class="mt-3">
            <!-- មានរូបស្រាប់ & អត់ជ្រើស file ថ្មី -->
            <template v-if="isEditing && selectedBudget?.attachmentUrl && !form.file">
              <div v-if="isImageUrl(selectedBudget.attachmentUrl)" class="attachment-preview">
                <img :src="selectedBudget.attachmentUrl" alt="ឯកសារភ្ជាប់" class="attachment-img" />
                <div class="attachment-caption">
                  <i class="bi bi-check-circle-fill text-success"></i> ឯកសារបច្ចុប្បន្ន
                </div>
              </div>
              <a v-else :href="selectedBudget.attachmentUrl" target="_blank" class="attachment-link">
                <i class="bi bi-paperclip"></i> មើលឯកសារបច្ចុប្បន្ន
              </a>
            </template>

            <!-- ជ្រើស image ថ្មី → preview -->
            <div v-else-if="form.file && form.file.type.startsWith('image/')" class="attachment-preview">
              <img :src="filePreviewUrl" alt="preview" class="attachment-img" />
              <div class="attachment-caption">
                <i class="bi bi-file-earmark-image"></i> {{ form.file.name }}
              </div>
            </div>

            <!-- ជ្រើស PDF ឬ file មិនមែនរូប -->
            <div v-else-if="form.file" class="attachment-file-badge">
              <i class="bi bi-file-earmark-pdf text-danger fs-4"></i>
              <span>{{ form.file.name }}</span>
            </div>

            <!-- អត់មានឯកសារទេ -->
            <div v-else class="no-attachment">
              <i class="bi bi-image"></i>
              <span>មិនទាន់មានឯកសារភ្ជាប់</span>
            </div>
          </div>
        </div>

      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeModal" :disabled="saveLoading">បោះបង់</button>
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
        <button class="btn btn-secondary" @click="closeDeleteModal" :disabled="deleteLoading">បោះបង់</button>
        <button class="btn btn-danger" @click="deleteBudget" :disabled="deleteLoading">
          <span v-if="deleteLoading" class="spinner-border spinner-border-sm me-1"></span>
          លុប
        </button>
      </template>
    </BaseModal>

  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] }
})
defineEmits(['deleteTransaction', 'updateTransaction', 'createTransaction'])

import { ref, reactive, computed, onMounted, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import Pagination from '@/components/ui/base/PaginAtion.vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { useTransactionStore } from '@/stores/transactionStore'
import TotalCard from '@/components/ui/base/Totalcard.vue'
import api from '@/api/api'

const router = useRouter()

// ── STORES ───────────────────────────────────────────
const categoryStore = useCategoryStore()
const trstore = useTransactionStore()

// ── NAVIGATION ───────────────────────────────────────
function goToDetail(id) {
  router.push({ name: 'transaction-detail', params: { id } })
}

// ── PAGINATION ───────────────────────────────────────
const currentPage = ref(1)
const totalPages = computed(() => trstore.meta?.totalPages ?? 1)

watch(currentPage, () => {
  trstore.fetchTransactions(currentPage.value)
})

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
  notes: '',
  file: null
})

// ── FILE PREVIEW ─────────────────────────────────────
const filePreviewUrl = ref('')

watchEffect((onCleanup) => {
  if (form.file && form.file.type.startsWith('image/')) {
    const url = URL.createObjectURL(form.file)
    filePreviewUrl.value = url
    onCleanup(() => URL.revokeObjectURL(url))
  } else {
    filePreviewUrl.value = ''
  }
})

function isImageUrl(url) {
  if (!url) return false
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)
}

function onFileChange(e) {
  form.file = e.target.files[0] || null
}

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
    form.file = null
  } else {
    isEditing.value = false
    selectedBudget.value = null
    form.type = ''
    form.categoryId = ''
    form.amount = ''
    form.notes = ''
    form.transactionDate = ''
    form.file = null
  }
}

function closeModal() { showModal.value = false }

// ── SAVE ─────────────────────────────────────────────
async function saveBudget() {
  if (!validate()) return
  saveLoading.value = true
  try {
    const payload = new FormData()
    payload.append('categoryId', form.categoryId)
    payload.append('amount', Number(form.amount))
    payload.append('notes', form.notes)
    payload.append('transactionDate', form.transactionDate)
    if (form.file) payload.append('file', form.file)

    if (isEditing.value && selectedBudget.value?.id) {
      await api.put(`transactions/${selectedBudget.value.id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    } else {
      await api.post('transactions', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    closeModal()
    await trstore.fetchTransactions(currentPage.value)
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
    await trstore.fetchTransactions(currentPage.value)
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
  await trstore.fetchTransactions(1)
  await fetchAlltotal()
})
</script>

<style scoped>
.table-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1.5px solid var(--border-color);
  transition: transform 0.15s;
  cursor: pointer;
}
.table-thumb:hover { transform: scale(1.08); }

.no-attach-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: var(--bg-input);
  border: 1.5px dashed var(--border-color);
  color: var(--text-secondary);
  font-size: 15px;
  opacity: 0.5;
  margin: auto;
}
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
  background: rgba(255, 255, 255, 0.15);
  color: var(--text-white);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  backdrop-filter: blur(4px);
  transition: var(--transition);
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.header-banner {
  background: var(--bg-sidebar);
  border-radius: var(--radius);
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow);
}

.header-banner h1 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-white);
  margin: 0 0 2px 0;
}

.header-banner p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
}

.filter-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
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
  color: var(--text-primary);
  white-space: nowrap;
}

.filter-label i {
  color: var(--color-primary);
  font-size: 16px;
}

.filter-selects {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-select {
  border: 1.5px solid var(--border-color);
  border-radius: 30px;
  font-size: 13px;
  padding: 7px 16px;
  color: var(--text-primary);
  background: var(--bg-input);
  cursor: pointer;
  outline: none;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  transition: border-color 0.15s, background 0.15s;
  min-width: 130px;
}

.filter-select:focus,
.filter-select:hover {
  border-color: var(--color-primary);
  background: var(--bg-card);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 200px;
  height: 40px;
  border: 1.5px solid var(--border-color);
  border-radius: 50px;
  padding: 0 14px;
  background: var(--bg-input);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-box.focused {
  border-color: var(--color-primary);
  background: var(--bg-card);
  box-shadow: 0 0 0 3px rgba(26, 98, 212, 0.10);
}

.search-box i {
  color: var(--text-secondary);
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
  color: var(--text-primary);
}

.search-box input::placeholder {
  color: var(--border-color);
}

.clear-btn {
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
  transition: color 0.15s;
}

.clear-btn:hover {
  color: var(--text-primary);
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1.5px solid var(--border-color);
  border-radius: 30px;
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 13px;
  padding: 7px 14px;
  cursor: pointer;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  transition: var(--transition);
  white-space: nowrap;
}

.reset-btn:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: var(--color-danger-light);
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
}

.filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--color-success-light);
  color: var(--color-primary);
  border: 1px solid var(--border-color);
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

.table-wrap {
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
}

.table {
  border-collapse: collapse;
}

.mobile-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 12px 14px;
  margin-bottom: 10px;
  box-shadow: var(--shadow);
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
  background: var(--color-success-light);
  color: var(--color-success);
}

.icon--expense {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.mobile-card__category {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.mobile-card__note {
  font-size: 12px;
  color: var(--text-secondary);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-card__date {
  font-size: 11px;
  color: var(--border-color);
  margin-top: 2px;
}

.mobile-card__right {
  text-align: right;
  flex-shrink: 0;
}

.amount--income {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-success);
}

.amount--expense {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-danger);
}

.mobile-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: 2px;
  margin-top: 4px;
}

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
  border: 2px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-secondary);
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  transition: var(--transition);
}

.type-btn:hover {
  background: var(--bg-body);
}

.type-btn--income.active {
  border-color: var(--color-success);
  background: var(--color-success-light);
  color: var(--color-success);
}

.type-btn--expense.active {
  border-color: var(--color-danger);
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.form-label {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 6px;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}

/* ── ATTACHMENT STYLES ── */
.attachment-preview {
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  padding: 8px;
  background: var(--bg-input);
  display: inline-block;
  max-width: 100%;
}

.attachment-img {
  max-width: 100%;
  max-height: 180px;
  border-radius: 8px;
  display: block;
  object-fit: contain;
}

.attachment-caption {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.attachment-file-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-input);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: var(--text-secondary);
}

.no-attachment {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 20px 0 8px;
  color: var(--text-secondary);
  font-size: 13px;
  opacity: 0.55;
}

.no-attachment i {
  font-size: 28px;
}

.attachment-link {
  font-size: 13px;
  color: var(--color-primary, #0d6efd);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.attachment-link:hover {
  text-decoration: underline;
}

.selected-file {
  font-size: 13px;
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>