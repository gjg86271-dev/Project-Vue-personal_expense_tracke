<template>

  <template v-if="isLoading">
    <div class="font mb-4">
      <div class="skeleton skeleton-header mb-4"></div>
      <div class="row g-3 mb-4">
        <div class="col-12 col-md-4" v-for="n in 3" :key="'sk-card-' + n">
          <div class="skeleton skeleton-card"></div>
        </div>
      </div>
      <div class="skeleton skeleton-filter mb-4"></div>
      <div class="skeleton skeleton-table"></div>
    </div>
  </template>

  <template v-else>
    <div class="font mb-4">

      <!-- HEADER -->
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
              <div class="icon-wrap icon-wrap--neutral"><i class="bi bi-wallet2 fs-4"></i></div>
            </template>
          </TotalCard>
        </div>
        <div class="col-12 col-md-4">
          <TotalCard title="ចំណូលសរុប" :value="all_total.totalIncome">
            <template #icon>
              <div class="icon-wrap icon-wrap--income"><i class="bi bi-graph-up-arrow fs-4"></i></div>
            </template>
          </TotalCard>
        </div>
        <div class="col-12 col-md-4">
          <TotalCard title="ចំណាយសរុប" :value="all_total.totalExpense">
            <template #icon>
              <div class="icon-wrap icon-wrap--expense"><i class="bi bi-graph-down-arrow fs-4"></i></div>
            </template>
          </TotalCard>
        </div>
      </div>

      <!-- FILTER -->
      <div class="filter-card mb-4">
        <div class="filter-bar">
          <div class="filter-label"><i class="bi bi-funnel-fill"></i><span>តម្រង</span></div>
          <div class="filter-selects">
            <select class="filter-select" v-model="filterType" @change="onFilterChange">
              <option value="">ប្រភេទទាំងអស់</option>
              <option value="INCOME">ចំណូល</option>
              <option value="EXPENSE">ចំណាយ</option>
            </select>
            <select class="filter-select" v-model="filterCategory" @change="onFilterChange">
              <option :value="null">ប្រភេទទាំងអស់</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="search-box" :class="{ focused: searchFocused }">
            <i class="bi bi-search"></i>
            <input v-model="searchQuery" type="search" placeholder="ស្វែងរក..."
              @focus="searchFocused = true" @blur="searchFocused = false" @input="onSearchInput" />
            <button v-if="searchQuery" class="clear-btn" @click="clearSearch"><i class="bi bi-x"></i></button>
          </div>
          <button v-if="hasFilter" class="reset-btn" @click="resetFilters">
            <i class="bi bi-arrow-counterclockwise"></i>
            <span class="d-none d-sm-inline">លុបតម្រង</span>
          </button>
        </div>
        <div v-if="hasFilter" class="active-filters">
          <span v-if="filterType" class="filter-badge">
            {{ filterType === 'INCOME' ? 'ចំណូល' : 'ចំណាយ' }}
            <i class="bi bi-x" @click="removeFilter('type')"></i>
          </span>
          <span v-if="filterCategory" class="filter-badge">
            {{ categories.find(c => c.id === filterCategory)?.name }}
            <i class="bi bi-x" @click="removeFilter('category')"></i>
          </span>
          <span v-if="searchQuery" class="filter-badge">
            "{{ searchQuery }}" <i class="bi bi-x" @click="clearSearch"></i>
          </span>
        </div>
      </div>

      <!-- DESKTOP TABLE -->
      <div class="table-wrap d-none d-md-block">
        <table class="table mb-0 font">
          <thead class="table-secondary">
            <tr class="text-center">
              <th>កាលបរិច្ឆេទ</th><th>ការពិពណ៌នា</th><th>ប្រភេទទូទៅ</th>
              <th>លក្ខណៈ</th><th>ចំនួនទឹកប្រាក់</th><th>ឯកសារ</th><th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="trstore.loading">
              <tr v-for="n in 5" :key="'sk-' + n">
                <td colspan="7" class="py-2 px-3"><div class="skeleton-row"></div></td>
              </tr>
            </template>
            <template v-else>
              <tr class="text-center" v-for="item in allTransactions" :key="item.id">
                <td>{{ new Date(item.transactionDate).toLocaleDateString('en-GB') }}</td>
                <td>{{ item.notes || '—' }}</td>
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
                    <a v-if="isImageUrl(item.attachmentUrl)" :href="item.attachmentUrl" target="_blank">
                      <img :src="item.attachmentUrl" class="table-thumb" alt="attachment" />
                    </a>
                    <a v-else :href="item.attachmentUrl" target="_blank" class="attachment-link">
                      <i class="bi bi-file-earmark-pdf text-danger fs-5"></i>
                    </a>
                  </template>
                  <div v-else class="no-attach-icon"><i class="bi bi-image"></i></div>
                </td>
                <td>
                  <button class="btn text-info btn-sm" @click="goToDetail(item.id)"><i class="bi bi-eye"></i></button>
                  <button class="btn btn-sm btn-color" @click="openModal(item)"><i class="bi bi-pencil-square"></i></button>
                  <button class="btn text-danger btn-sm" @click="openDeleteModal(item)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr v-if="allTransactions.length === 0">
                <td colspan="7" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox fs-2 d-block mb-2"></i> គ្មានទិន្នន័យ
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- MOBILE CARDS -->
      <div class="d-md-none">
        <template v-if="trstore.loading">
          <div v-for="n in 4" :key="'msk-' + n" class="mobile-card-skeleton"></div>
        </template>
        <template v-else>
          <div v-if="allTransactions.length === 0" class="text-center py-5 text-muted">
            <i class="bi bi-inbox fs-1 d-block mb-2"></i> គ្មានទិន្នន័យ
          </div>
          <div v-for="item in allTransactions" :key="item.id" class="mobile-card">
            <div class="mobile-card__left" @click="goToDetail(item.id)" style="cursor:pointer">
              <div :class="['mobile-icon', item.category?.type === 'INCOME' ? 'icon--income' : 'icon--expense']">
                <i :class="item.category?.type === 'INCOME' ? 'bi bi-graph-up-arrow' : 'bi bi-graph-down-arrow'"></i>
              </div>
              <div>
                <div class="mobile-card__category">{{ item.category?.name }}</div>
                <div class="mobile-card__note">{{ item.notes || '—' }}</div>
                <div class="mobile-card__date">{{ new Date(item.transactionDate).toLocaleDateString('en-GB') }}</div>
                <a v-if="item.attachmentUrl" :href="item.attachmentUrl" target="_blank"
                  class="attachment-link small" @click.stop>
                  <i class="bi bi-paperclip"></i> ឯកសារ
                </a>
              </div>
            </div>
            <div class="mobile-card__right">
              <div :class="item.category?.type === 'INCOME' ? 'amount--income' : 'amount--expense'">
                {{ item.category?.type === 'INCOME' ? '+' : '-' }}${{ item.amount }}
              </div>
              <div class="mobile-card__actions">
                <button class="btn btn-sm text-info p-1" @click="goToDetail(item.id)"><i class="bi bi-eye"></i></button>
                <button class="btn btn-sm p-1 btn-color" @click="openModal(item)"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-sm text-danger p-1" @click="openDeleteModal(item)"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- PAGINATION -->
      <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
        <Pagination v-model:currentPage="currentPage" :total-pages="totalPages" :sibling-count="1" />
      </div>

    </div>
  </template>

  <!-- ════════════════════════════════════════════
       CREATE / EDIT MODAL
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
              <h3 class="swal-title">{{ isEditing ? 'កែប្រែប្រតិបត្តិការ' : 'បន្ថែមប្រតិបត្តិការ' }}</h3>
              <p class="swal-desc">{{ isEditing ? 'កែប្រែព័ត៌មានប្រតិបត្តិការ' : 'បំពេញព័ត៌មានប្រតិបត្តិការថ្មី' }}</p>
            </div>
            <button class="swal-close" @click="closeModal" :disabled="saveLoading">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="swal-body" style="position:relative;">
            <div v-if="saveLoading" class="form-loading-overlay">
              <div class="form-spinner"></div>
              <span>កំពុងរក្សាទុក...</span>
            </div>

            <!-- Type toggle -->
            <div v-if="!isEditing" class="field-group">
              <label class="field-label">ប្រភេទប្រតិបត្តិការ <span class="required">*</span></label>
              <div class="type-toggle">
                <button :class="['type-btn type-btn--income', { active: form.type === 'INCOME' }]"
                  @click="selectType('INCOME')" type="button" :disabled="saveLoading">
                  <i class="bi bi-graph-up-arrow"></i> ចំណូល
                </button>
                <button :class="['type-btn type-btn--expense', { active: form.type === 'EXPENSE' }]"
                  @click="selectType('EXPENSE')" type="button" :disabled="saveLoading">
                  <i class="bi bi-graph-down-arrow"></i> ចំណាយ
                </button>
              </div>
              <div v-if="errors.type" class="field-error"><i class="bi bi-exclamation-circle"></i> {{ errors.type }}</div>
            </div>

            <!-- Category -->
            <div class="field-group">
              <label class="field-label">ប្រភេទ <span class="required">*</span></label>
              <div class="input-shell input-shell--select" :class="{ 'is-invalid': errors.categoryId }">
                <i class="bi bi-tag-fill field-icon"></i>
                <select v-model="form.categoryId" :disabled="saveLoading || (!isEditing && !form.type)"
                  @change="delete errors.categoryId">
                  <option value="" disabled>
                    {{ !isEditing && !form.type ? 'សូមជ្រើស ចំណូល ឬ ចំណាយ មុន'
                      : filteredCategories.length === 0 ? 'គ្មានប្រភេទ' : 'ជ្រើសរើសប្រភេទ' }}
                  </option>
                  <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div v-if="errors.categoryId" class="field-error"><i class="bi bi-exclamation-circle"></i> {{ errors.categoryId }}</div>
            </div>

            <!-- Amount -->
            <div class="field-group">
              <label class="field-label">ចំនួនទឹកប្រាក់ <span class="required">*</span></label>
              <div class="input-shell" :class="{ 'is-invalid': errors.amount }">
                <span class="field-icon dollar-sign">$</span>
                <input v-model="form.amount" type="number" placeholder="0.00" min="0" step="0.01"
                  :disabled="saveLoading" @input="delete errors.amount" />
              </div>
              <div v-if="errors.amount" class="field-error"><i class="bi bi-exclamation-circle"></i> {{ errors.amount }}</div>
            </div>

            <!-- Notes -->
            <div class="field-group">
              <label class="field-label">កំណត់ចំណាំ</label>
              <div class="input-shell">
                <i class="bi bi-pencil field-icon"></i>
                <input v-model="form.notes" type="text" placeholder="បញ្ចូលកំណត់ចំណាំ (ជាជម្រើស)" :disabled="saveLoading" />
              </div>
            </div>

            <!-- Date -->
            <div class="field-group">
              <label class="field-label">កាលបរិច្ឆេទ <span class="required">*</span></label>
              <div class="input-shell" :class="{ 'is-invalid': errors.transactionDate }">
                <i class="bi bi-calendar3 field-icon"></i>
                <input v-model="form.transactionDate" type="date" :disabled="saveLoading"
                  @change="delete errors.transactionDate" />
              </div>
              <div v-if="errors.transactionDate" class="field-error"><i class="bi bi-exclamation-circle"></i> {{ errors.transactionDate }}</div>
            </div>

            <!-- File -->
            <div class="field-group" style="margin-bottom:0;">
              <label class="field-label">ឯកសារភ្ជាប់</label>
              <div class="input-shell file-shell">
                <i class="bi bi-paperclip field-icon"></i>
                <input type="file" accept="image/*,.pdf" :disabled="saveLoading" @change="onFileChange" />
              </div>
              <div class="mt-3">
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
                <div v-else-if="form.file && form.file.type.startsWith('image/')" class="attachment-preview">
                  <img :src="filePreviewUrl" alt="preview" class="attachment-img" />
                  <div class="attachment-caption"><i class="bi bi-file-earmark-image"></i> {{ form.file.name }}</div>
                </div>
                <div v-else-if="form.file" class="attachment-file-badge">
                  <i class="bi bi-file-earmark-pdf text-danger fs-4"></i>
                  <span>{{ form.file.name }}</span>
                </div>
                <div v-else class="no-attachment">
                  <i class="bi bi-image"></i><span>មិនទាន់មានឯកសារភ្ជាប់</span>
                </div>
              </div>
            </div>
          </div>

          <div class="swal-footer">
            <button class="swal-btn swal-btn--cancel" @click="closeModal" :disabled="saveLoading">បោះបង់</button>
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
            <h3 class="swal-title">លុបប្រតិបត្តិការ?</h3>
            <p class="delete-desc">
              តើអ្នកពិតជាចង់លុប
              <strong class="text-danger">{{ selectedBudget?.category?.name }}</strong> មែនទេ?
            </p>
            <div class="delete-warning">
              <i class="bi bi-exclamation-triangle-fill"></i>
              ការលុបនេះ នឹងបាត់បង់ទិន្នន័យទាំងអស់ ហើយមិនអាចត្រឡប់វិញបានទេ
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

</template>

<script setup>
defineProps({ items: { type: Array, default: () => [] } })
defineEmits(['deleteTransaction', 'updateTransaction', 'createTransaction'])

import { ref, reactive, computed, onMounted, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/ui/base/PaginAtion.vue'
import TotalCard  from '@/components/ui/base/Totalcard.vue'
import { useCategoryStore }    from '@/stores/categoryStore'
import { useTransactionStore } from '@/stores/transactionStore'

const router        = useRouter()
const categoryStore = useCategoryStore()
const trstore       = useTransactionStore()

const isLoading = ref(true)

function goToDetail(id) { router.push({ name: 'transaction-detail', params: { id } }) }

const filterType     = ref('')
const filterCategory = ref(null)
const searchQuery    = ref('')
const searchFocused  = ref(false)
let   searchTimer    = null

const hasFilter = computed(() => filterType.value || filterCategory.value !== null || searchQuery.value)

const currentPage = ref(1)
const totalPages  = computed(() => trstore.meta?.totalPages ?? 1)
let _skipPageWatch = false

function fetchData(page = 1) {
  _skipPageWatch    = true
  currentPage.value = page
  _skipPageWatch    = false
  trstore.fetchTransactions(page, {
    type:       filterType.value        || undefined,
    categoryId: filterCategory.value    ?? undefined,
    search:     searchQuery.value.trim() || undefined,
  })
}

function onFilterChange() { fetchData(1) }
function onSearchInput() { clearTimeout(searchTimer); searchTimer = setTimeout(() => fetchData(1), 400) }
function clearSearch()   { searchQuery.value = ''; fetchData(1) }
function removeFilter(which) {
  if (which === 'type')     filterType.value     = ''
  if (which === 'category') filterCategory.value = null
  fetchData(1)
}
function resetFilters() {
  filterType.value = ''; filterCategory.value = null; searchQuery.value = ''
  fetchData(1)
}

watch(currentPage, (page) => { if (_skipPageWatch) return; fetchData(page) })

const allTransactions   = computed(() => Array.isArray(trstore.transactions) ? trstore.transactions : [])
const totalTransactions = computed(() => trstore.meta?.totalItems ?? 0)
const all_total = computed(() => ({
  totalIncome:  trstore.summary?.totalIncome  ?? 0,
  totalExpense: trstore.summary?.totalExpense ?? 0,
}))

const categories = computed(() => Array.isArray(categoryStore.categories) ? categoryStore.categories : [])
const filteredCategories = computed(() => {
  if (isEditing.value) return categories.value
  if (!form.type) return []
  return categories.value.filter(cat => cat.type === form.type)
})

const showModal       = ref(false)
const isEditing       = ref(false)
const showDeleteModal = ref(false)
const selectedBudget  = ref(null)
const saveLoading     = ref(false)
const deleteLoading   = ref(false)
const errors          = reactive({})

const form = reactive({ type: '', categoryId: '', amount: '', transactionDate: '', notes: '', file: null })

const filePreviewUrl = ref('')
watchEffect((onCleanup) => {
  if (form.file?.type.startsWith('image/')) {
    const url = URL.createObjectURL(form.file)
    filePreviewUrl.value = url
    onCleanup(() => URL.revokeObjectURL(url))
  } else {
    filePreviewUrl.value = ''
  }
})

function isImageUrl(url) { return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url || '') }
function onFileChange(e) { form.file = e.target.files[0] || null }

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!isEditing.value && !form.type)   errors.type            = 'សូមជ្រើសប្រភេទប្រតិបត្តិការ'
  if (!form.categoryId)                 errors.categoryId      = 'សូមជ្រើសប្រភេទ'
  if (!form.amount || form.amount <= 0) errors.amount          = 'សូមបញ្ចូលចំនួនទឹកប្រាក់'
  if (!form.transactionDate)            errors.transactionDate = 'សូមជ្រើសកាលបរិច្ឆេទ'
  return Object.keys(errors).length === 0
}

function selectType(type) { form.type = type; form.categoryId = ''; delete errors.type; delete errors.categoryId }

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
    form.file            = null
  } else {
    isEditing.value = false; selectedBudget.value = null
    form.type = ''; form.categoryId = ''; form.amount = ''
    form.notes = ''; form.transactionDate = ''; form.file = null
  }
}

function closeModal() { showModal.value = false }

async function saveBudget() {
  if (!validate()) return
  saveLoading.value = true
  try {
    const payload = new FormData()
    payload.append('categoryId',      form.categoryId)
    payload.append('amount',          Number(form.amount))
    payload.append('notes',           form.notes)
    payload.append('transactionDate', form.transactionDate)
    if (form.file) payload.append('file', form.file)
    if (isEditing.value && selectedBudget.value?.id) {
      await trstore.updateTransaction(selectedBudget.value.id, payload)
    } else {
      await trstore.createTransaction(payload)
    }
    closeModal()
    fetchData(currentPage.value)
    await trstore.fetchSummary()
  } catch (err) {
    console.error('Save error:', err)
  } finally {
    saveLoading.value = false
  }
}

function openDeleteModal(item)  { selectedBudget.value = item; showDeleteModal.value = true }
function closeDeleteModal()     { showDeleteModal.value = false }

async function deleteBudget() {
  if (!selectedBudget.value?.id) return
  deleteLoading.value = true
  try {
    await trstore.deleteTransaction(selectedBudget.value.id)
    closeDeleteModal()
    const remaining = allTransactions.value.length - 1
    fetchData(remaining === 0 && currentPage.value > 1 ? currentPage.value - 1 : currentPage.value)
    await trstore.fetchSummary()
  } catch (err) {
    console.error('Delete error:', err)
  } finally {
    deleteLoading.value = false
  }
}

onMounted(async () => {
  try {
    await Promise.all([categoryStore.fetchAllCategories(), trstore.fetchSummary()])
    fetchData(1)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* ── Skeleton ─────────────────────────────────────────────────────────── */
.skeleton {
  background: linear-gradient(90deg, var(--bg-input) 25%, var(--border-color) 50%, var(--bg-input) 75%);
  background-size: 200% 100%; animation: shimmer 1.2s infinite; border-radius: var(--radius);
}
.skeleton-header { height: 80px; } .skeleton-card { height: 110px; }
.skeleton-filter { height: 60px; } .skeleton-table { height: 380px; }
.skeleton-row { height: 20px; border-radius: 6px; background: linear-gradient(90deg, var(--bg-input) 25%, var(--border-color) 50%, var(--bg-input) 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; }
.mobile-card-skeleton { height: 72px; border-radius: var(--radius); background: linear-gradient(90deg, var(--bg-input) 25%, var(--border-color) 50%, var(--bg-input) 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; margin-bottom: 10px; }
@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }

/* ── General ──────────────────────────────────────────────────────────── */
.font { font-family: var(--font-khmer) !important; }
.icon-wrap { padding: 8px 14px; border-radius: 10px; color: var(--text-white); }
.icon-wrap--neutral { background: var(--text-secondary); }
.icon-wrap--income  { background: var(--color-success); }
.icon-wrap--expense { background: var(--color-danger); }

/* ── Header banner ────────────────────────────────────────────────────── */
.header-banner {
  background: var(--bg-sidebar); border-radius: var(--radius);
  padding: 18px 24px; display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1.5rem; box-shadow: var(--shadow);
}
.header-banner h1 { font-size: 20px; font-weight: 700; color: var(--text-white); margin: 0 0 2px; }
.header-banner p  { font-size: 12px; color: rgba(255,255,255,0.65); margin: 0; }

.add-btn {
  height: 46px; padding: 0 20px; font-size: 15px; white-space: nowrap;
  font-family: var(--font-khmer) !important;
  background: rgba(255,255,255,0.15); color: var(--text-white);
  border: 1.5px solid rgba(255,255,255,0.4); border-radius: 12px;
  cursor: pointer; transition: var(--transition);
}
.add-btn:hover { background: rgba(255,255,255,0.25); }

/* ── Filter ───────────────────────────────────────────────────────────── */
.filter-card { background: var(--bg-card); border-radius: var(--radius); box-shadow: var(--shadow); border: 1px solid var(--border-color); padding: 14px 18px; }
.filter-bar  { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.filter-label { display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 600; color: var(--text-primary); white-space: nowrap; }
.filter-label i { color: var(--color-primary); font-size: 16px; }
.filter-selects { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-select { border: 1.5px solid var(--border-color); border-radius: 30px; font-size: 13px; padding: 7px 16px; color: var(--text-primary); background: var(--bg-input); cursor: pointer; outline: none; font-family: var(--font-khmer); transition: border-color 0.15s; min-width: 130px; }
.filter-select:focus, .filter-select:hover { border-color: var(--color-primary); background: var(--bg-card); }
.search-box { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 200px; height: 40px; border: 1.5px solid var(--border-color); border-radius: 50px; padding: 0 14px; background: var(--bg-input); transition: border-color 0.2s, box-shadow 0.2s; }
.search-box.focused { border-color: var(--color-primary); background: var(--bg-card); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent); }
.search-box i { color: var(--text-secondary); font-size: 14px; flex-shrink: 0; }
.search-box input { border: none; outline: none; background: transparent; font-size: 14px; width: 100%; font-family: var(--font-khmer); color: var(--text-primary); }
.search-box input::placeholder { color: var(--border-color); }
.clear-btn { border: none; background: none; color: var(--text-secondary); cursor: pointer; padding: 0; font-size: 16px; line-height: 1; flex-shrink: 0; }
.clear-btn:hover { color: var(--text-primary); }
.reset-btn { display: flex; align-items: center; gap: 6px; border: 1.5px solid var(--border-color); border-radius: 30px; background: var(--bg-card); color: var(--text-secondary); font-size: 13px; padding: 7px 14px; cursor: pointer; font-family: var(--font-khmer); transition: var(--transition); white-space: nowrap; }
.reset-btn:hover { border-color: var(--color-danger); color: var(--color-danger); background: var(--color-danger-light); }
.active-filters { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color); }
.filter-badge { display: inline-flex; align-items: center; gap: 5px; background: var(--bg-input); color: var(--color-primary); border: 1px solid var(--color-primary); border-radius: 20px; font-size: 12px; padding: 3px 10px; }
.filter-badge i { cursor: pointer; font-size: 13px; opacity: 0.6; }
.filter-badge i:hover { opacity: 1; }

/* ── Table ────────────────────────────────────────────────────────────── */
.table-wrap { border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); border: 1px solid var(--border-color); background-color: var(--bg-card); }
.table { border-collapse: collapse; font-family: var(--font-khmer); background-color: var(--bg-card); width: 100%; }
.table :deep(thead.table-secondary th) { background-color: var(--bg-input) !important; color: var(--text-primary); border-color: var(--border-color); }
.table :deep(tbody tr) { background-color: var(--bg-card) !important; color: var(--text-primary); }
.table :deep(tbody td) { background-color: var(--bg-card) !important; color: var(--text-primary); border-color: var(--border-color); }
.table-thumb { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1.5px solid var(--border-color); transition: transform 0.15s; cursor: pointer; }
.table-thumb:hover { transform: scale(1.08); }
.no-attach-icon { display: inline-flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 8px; background: var(--bg-input); border: 1.5px dashed var(--border-color); color: var(--text-secondary); font-size: 15px; opacity: 0.5; margin: auto; }
.btn-color { color: var(--text-primary); }

/* ── Mobile cards ─────────────────────────────────────────────────────── */
.mobile-card { display: flex; align-items: center; justify-content: space-between; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 12px 14px; margin-bottom: 10px; box-shadow: var(--shadow); }
.mobile-card__left { display: flex; align-items: center; gap: 12px; }
.mobile-icon { width: 42px; height: 42px; border-radius: 12px; display: grid; place-items: center; font-size: 16px; flex-shrink: 0; }
.icon--income  { background: var(--color-success-light); color: var(--color-success); }
.icon--expense { background: var(--color-danger-light);  color: var(--color-danger); }
.mobile-card__category { font-size: 14px; font-weight: 600; color: var(--text-primary); line-height: 1.3; }
.mobile-card__note { font-size: 12px; color: var(--text-secondary); max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mobile-card__date { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }
.mobile-card__right { text-align: right; flex-shrink: 0; }
.amount--income  { font-size: 15px; font-weight: 700; color: var(--color-success); }
.amount--expense { font-size: 15px; font-weight: 700; color: var(--color-danger); }
.mobile-card__actions { display: flex; justify-content: flex-end; gap: 2px; margin-top: 4px; }

/* ══════════════════════════════════════════════
   SHARED MODAL STYLES (identical to BudgetView)
══════════════════════════════════════════════ */
.swal-overlay { position: fixed; inset: 0; background: rgba(4,44,131,0.22); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 16px; }
.swal-box { background: var(--bg-card); border-radius: 24px; width: 100%; max-width: 460px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: var(--shadow); overflow: hidden; font-family: var(--font-khmer); border: 1px solid var(--border-color); }
.swal-box--delete { max-width: 400px; }

.swal-header { display: flex; align-items: center; gap: 14px; padding: 22px 24px 16px; border-bottom: 1px solid var(--border-color); position: relative; flex-shrink: 0; }
.swal-header--center { flex-direction: column; align-items: center; border-bottom: none; padding-bottom: 0; }
.swal-header__icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.icon-create { background: var(--bg-input);           color: var(--color-primary); }
.icon-edit   { background: var(--color-danger-light); color: var(--color-danger); }
.swal-title { margin: 0 0 2px; font-size: 17px; font-weight: 800; color: var(--text-primary); }
.swal-desc  { margin: 0; font-size: 12px; color: var(--text-secondary); }
.swal-close { position: absolute; top: 18px; right: 18px; width: 32px; height: 32px; border-radius: 8px; border: none; background: var(--bg-input); color: var(--text-secondary); font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
.swal-close:hover:not(:disabled) { background: var(--color-danger); color: var(--text-white); }
.swal-close:disabled { opacity: 0.4; cursor: not-allowed; }

.swal-body { padding: 20px 24px; overflow-y: auto; flex: 1; }
.swal-body--center { text-align: center; }

.swal-footer { display: flex; gap: 10px; padding: 16px 24px 22px; border-top: 1px solid var(--border-color); flex-shrink: 0; }
.swal-btn { flex: 1; height: 46px; border-radius: 50px; border: none; font-size: 14px; font-weight: 700; cursor: pointer; font-family: var(--font-khmer); display: flex; align-items: center; justify-content: center; gap: 7px; transition: var(--transition); }
.swal-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.swal-btn--cancel  { background: var(--bg-input); color: var(--text-secondary); }
.swal-btn--cancel:hover:not(:disabled) { background: var(--bg-body); color: var(--text-primary); }
.swal-btn--confirm { flex: 2; background: var(--color-primary); color: var(--text-white); box-shadow: 0 4px 14px color-mix(in srgb, var(--color-primary) 30%, transparent); }
.swal-btn--confirm:hover:not(:disabled) { background: var(--color-primary-hover); transform: translateY(-1px); }
.swal-btn--delete  { flex: 2; background: var(--color-danger); color: var(--text-white); box-shadow: 0 4px 14px color-mix(in srgb, var(--color-danger) 30%, transparent); }
.swal-btn--delete:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }

.form-loading-overlay { position: absolute; inset: 0; z-index: 10; background: color-mix(in srgb, var(--bg-card) 85%, transparent); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; font-size: 13px; color: var(--text-secondary); font-family: var(--font-khmer); }
.form-spinner { width: 32px; height: 32px; border: 3px solid color-mix(in srgb, var(--color-primary) 25%, transparent); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.7s linear infinite; }

/* ── Field group ──────────────────────────────────────────────────────── */
.field-group { margin-bottom: 18px; }
.field-label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: var(--text-primary); }
.required { color: var(--color-danger); }
.input-shell { display: flex; align-items: center; height: 46px; border: 1.5px solid var(--border-color); border-radius: 50px; padding: 0 16px; background: var(--bg-input); transition: var(--transition); }
.input-shell:focus-within { border-color: var(--color-primary); background: var(--bg-card); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent); }
.input-shell.is-invalid { border-color: var(--color-danger); background: var(--color-danger-light); }
.input-shell--select { padding-right: 8px; }
.field-icon { color: var(--text-secondary); font-size: 14px; flex-shrink: 0; margin-right: 8px; }
.dollar-sign { font-weight: 700; font-size: 15px; }
.input-shell input, .input-shell select { flex: 1; height: 100%; border: 0; outline: 0; background: transparent; font-size: 14px; color: var(--text-primary); font-family: var(--font-khmer); }
.input-shell input::placeholder { color: var(--border-color); }
.input-shell input:disabled, .input-shell select:disabled { opacity: 0.6; }
.input-shell select { cursor: pointer; }
.file-shell { cursor: pointer; }
.file-shell input[type="file"] { flex: 1; height: 100%; border: 0; outline: 0; background: transparent; font-size: 13px; color: var(--text-primary); font-family: var(--font-khmer); cursor: pointer; }
.field-error { font-size: 12px; color: var(--color-danger); margin-top: 4px; display: flex; align-items: center; gap: 4px; }

/* ── Type toggle ──────────────────────────────────────────────────────── */
.type-toggle { display: flex; gap: 10px; }
.type-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; height: 46px; border-radius: 12px; border: 2px solid var(--border-color); background: var(--bg-input); color: var(--text-secondary); font-size: 14px; font-weight: 700; cursor: pointer; font-family: var(--font-khmer); transition: var(--transition); }
.type-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.type-btn--income.active  { border-color: var(--color-success); background: var(--color-success-light); color: var(--color-success); }
.type-btn--expense.active { border-color: var(--color-danger);  background: var(--color-danger-light);  color: var(--color-danger); }

/* ── Attachment ───────────────────────────────────────────────────────── */
.attachment-preview { border: 1.5px solid var(--border-color); border-radius: 10px; padding: 8px; background: var(--bg-input); display: inline-block; max-width: 100%; }
.attachment-img { max-width: 100%; max-height: 180px; border-radius: 8px; display: block; object-fit: contain; }
.attachment-caption { font-size: 12px; color: var(--text-secondary); margin-top: 6px; display: flex; align-items: center; gap: 5px; }
.attachment-file-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--bg-input); border: 1.5px solid var(--border-color); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: var(--text-secondary); }
.no-attachment { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 20px 0 8px; color: var(--text-secondary); font-size: 13px; opacity: 0.55; }
.no-attachment i { font-size: 28px; }
.attachment-link { font-size: 13px; color: var(--color-primary); text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
.attachment-link:hover { text-decoration: underline; }

/* ── Delete modal ─────────────────────────────────────────────────────── */
.delete-icon-wrap { width: 72px; height: 72px; border-radius: 50%; background: var(--color-danger-light); display: flex; align-items: center; justify-content: center; font-size: 30px; color: var(--color-danger); margin-bottom: 8px; }
.delete-desc { font-size: 15px; color: var(--text-primary); margin: 8px 0 14px; line-height: 1.6; }
.delete-warning { display: flex; align-items: flex-start; gap: 8px; background: var(--color-danger-light); border: 1px solid var(--color-danger); border-radius: 10px; color: var(--color-danger); font-size: 12px; padding: 10px 12px; text-align: left; line-height: 1.5; opacity: 0.85; }
.delete-warning i { flex-shrink: 0; margin-top: 1px; }

/* ── Spinner ──────────────────────────────────────────────────────────── */
.btn-spinner { width: 16px; height: 16px; flex-shrink: 0; border: 2px solid color-mix(in srgb, var(--color-primary) 30%, transparent); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.7s linear infinite; }
.btn-spinner--white { border-color: rgba(255,255,255,0.35); border-top-color: var(--text-white); }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Modal transition ─────────────────────────────────────────────────── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .swal-box, .modal-fade-leave-to .swal-box { transform: scale(0.94) translateY(12px); }
.modal-fade-enter-active .swal-box, .modal-fade-leave-active .swal-box { transition: transform 0.25s ease; }
</style>