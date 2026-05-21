<template>
  <div class="font detail-page">

    <!-- BACK BUTTON -->
    <button class="back-btn" @click="router.back()">
      <i class="bi bi-arrow-left"></i>
      <span>ត្រឡប់ក្រោយ</span>
    </button>

    <!-- LOADING -->
    <div v-if="loading" class="state-box">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-3 text-secondary">កំពុងផ្ទុក...</p>
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="state-box">
      <div class="fs-1 mb-3">⚠️</div>
      <h5 class="fw-bold text-danger">{{ error }}</h5>

      <button
        class="btn btn-outline-primary mt-3"
        @click="fetchDetail"
      >
        ព្យាយាមម្ដងទៀត
      </button>
    </div>

    <!-- CONTENT -->
    <div v-else-if="transaction" class="detail-layout">

      <!-- LEFT -->
      <div
        class="hero-card"
        :class="isIncome ? 'hero--income' : 'hero--expense'"
      >
        <div class="hero-icon">
          <i
            :class="isIncome
              ? 'bi bi-graph-up-arrow'
              : 'bi bi-graph-down-arrow'"
          ></i>
        </div>

        <div
          class="hero-badge"
          :class="isIncome ? 'badge--income' : 'badge--expense'"
        >
          {{ isIncome ? 'ចំណូល' : 'ចំណាយ' }}
        </div>

        <div
          class="hero-amount"
          :class="isIncome ? 'amount--income' : 'amount--expense'"
        >
          {{ isIncome ? '+' : '-' }}
          ${{ Number(transaction.amount).toLocaleString('en-US', {
            minimumFractionDigits: 2
          }) }}
        </div>

        <div class="hero-category">
          {{ transaction.category?.name }}
        </div>

        <div class="hero-date">
          <i class="bi bi-calendar3"></i>
          {{ formatDate(transaction.transactionDate) }}
        </div>

        <!-- HERO IMAGE -->
        <div class="mt-3">

          <img
            v-if="
              transaction?.attachmentUrl &&
              (
                transaction.attachmentUrl.includes('.jpg') ||
                transaction.attachmentUrl.includes('.jpeg') ||
                transaction.attachmentUrl.includes('.png') ||
                transaction.attachmentUrl.includes('.webp')
              )
            "
            :src="transaction.attachmentUrl"
            class="hero-preview"
            alt="attachment"
          />

          <a
            v-else-if="transaction?.attachmentUrl"
            :href="transaction.attachmentUrl"
            target="_blank"
            class="hero-attachment"
          >
            <i class="bi bi-paperclip"></i>
            មើលឯកសារ
          </a>

          <div v-else class="empty-image hero-empty">
            <i class="bi bi-image"></i>
            <span>មិនមានឯកសារ</span>
          </div>

        </div>
      </div>

      <!-- RIGHT -->
      <div class="detail-right">

        <!-- HEADER -->
        <div class="detail-header">
          <div>
            <h2 class="detail-title">
              លម្អិតប្រតិបត្តិការ
            </h2>

            <p class="detail-subtitle">
              ព័ត៌មានលម្អិតអំពីប្រតិបត្តិការ
            </p>
          </div>

          <div class="detail-actions">
            <button
              class="action-btn action-btn--edit"
              @click="openEditModal"
            >
              <i class="bi bi-pencil-square"></i>
            </button>

            <button
              class="action-btn action-btn--delete"
              @click="showDeleteModal = true"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <!-- INFO -->
        <div class="info-grid">

          <div class="info-row">
            <div class="info-label">
              <i class="bi bi-tag"></i>
              ប្រភេទ
            </div>

            <div class="info-value">
              {{ transaction.category?.name || '—' }}
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">
              <i class="bi bi-cash-coin"></i>
              ចំនួនទឹកប្រាក់
            </div>

            <div
              class="info-value fw-bold"
              :class="isIncome ? 'text-success' : 'text-danger'"
            >
              {{ isIncome ? '+' : '-' }}
              ${{ Number(transaction.amount).toLocaleString('en-US', {
                minimumFractionDigits: 2
              }) }}
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">
              <i class="bi bi-calendar3"></i>
              កាលបរិច្ឆេទ
            </div>

            <div class="info-value">
              {{ formatDate(transaction.transactionDate) }}
            </div>
          </div>

          <div class="info-row">
            <div class="info-label">
              <i class="bi bi-chat-left-text"></i>
              កំណត់ចំណាំ
            </div>

            <div class="info-value notes-value">
              {{ transaction.notes || '—' }}
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <BaseModal
      v-if="showModal"
      title="កែប្រែប្រតិបត្តិការ"
      @close-modal="showModal = false"
    >

      <template #body>

        <!-- CATEGORY -->
        <div class="form-group mb-3">
          <label class="form-label fw-500">
            ប្រភេទ
          </label>

          <select
            class="form-select"
            v-model="form.categoryId"
          >
            <option value="" disabled>
              ជ្រើសរើសប្រភេទ
            </option>

            <option
              v-for="cat in categories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- AMOUNT -->
        <div class="form-group mb-3">
          <label class="form-label fw-500">
            ចំនួនទឹកប្រាក់
          </label>

          <div class="input-group">
            <span class="input-group-text">$</span>

            <input
              v-model="form.amount"
              type="number"
              class="form-control"
            />
          </div>
        </div>

        <!-- NOTES -->
        <div class="form-group mb-3">
          <label class="form-label fw-500">
            កំណត់ចំណាំ
          </label>

          <input
            v-model="form.notes"
            type="text"
            class="form-control"
          />
        </div>

        <!-- DATE -->
        <div class="form-group mb-3">
          <label class="form-label fw-500">
            កាលបរិច្ឆេទ
          </label>

          <input
            v-model="form.transactionDate"
            type="date"
            class="form-control"
          />
        </div>

        <!-- FILE -->
        <div class="form-group">

          <label class="form-label fw-500">
            ឯកសារភ្ជាប់
          </label>

          <input
            type="file"
            class="form-control"
            accept="image/*,.pdf"
            @change="onFileChange"
          />

          <!-- PREVIEW -->
          <div class="mt-3">

            <!-- NEW FILE -->
            <template v-if="form.file">

              <img
                v-if="form.file.type.startsWith('image/')"
                :src="URL.createObjectURL(form.file)"
                class="attachment-preview"
                alt="preview"
              />

              <div v-else class="pdf-preview">
                <i class="bi bi-file-earmark-pdf"></i>
                <span>{{ form.file.name }}</span>
              </div>

            </template>

            <!-- OLD FILE -->
            <template v-else-if="transaction?.attachmentUrl">

              <img
                v-if="
                  transaction.attachmentUrl.includes('.jpg') ||
                  transaction.attachmentUrl.includes('.jpeg') ||
                  transaction.attachmentUrl.includes('.png') ||
                  transaction.attachmentUrl.includes('.webp')
                "
                :src="transaction.attachmentUrl"
                class="attachment-preview"
                alt="attachment"
              />

              <a
                v-else
                :href="transaction.attachmentUrl"
                target="_blank"
                class="pdf-preview text-decoration-none"
              >
                <i class="bi bi-file-earmark-pdf"></i>
                <span>មើល PDF</span>
              </a>

            </template>

            <!-- EMPTY -->
            <div v-else class="empty-image">
              <i class="bi bi-image"></i>
              <span>មិនមានឯកសារភ្ជាប់</span>
            </div>

          </div>
        </div>

      </template>

      <template #footer>

        <button
          class="btn btn-secondary"
          @click="showModal = false"
        >
          បោះបង់
        </button>

        <button
          class="btn btn-primary"
          @click="saveEdit"
        >
          កែប្រែ
        </button>

      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/api'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import { useCategoryStore } from '@/stores/categoryStore'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()

const transaction = ref(null)
const loading = ref(true)
const error = ref('')
const showModal = ref(false)

const form = reactive({
  categoryId: '',
  amount: '',
  transactionDate: '',
  notes: '',
  file: null,
})

const categories = computed(() =>
  Array.isArray(categoryStore.categories)
    ? categoryStore.categories
    : []
)

const isIncome = computed(() =>
  transaction.value?.category?.type === 'INCOME'
)

function onFileChange(e) {
  form.file = e.target.files[0] || null
}

async function fetchDetail() {
  loading.value = true

  try {
    const res = await api.get(
      `transactions/${route.params.id}`
    )

    transaction.value =
      res.data?.data ?? res.data

  } catch (err) {
    error.value = 'Load failed'
    console.error(err)

  } finally {
    loading.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'

  return new Date(dateStr).toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
  )
}

function openEditModal() {
  const t = transaction.value

  form.categoryId = t.category?.id || ''
  form.amount = t.amount || ''
  form.notes = t.notes || ''
  form.transactionDate =
    t.transactionDate?.split('T')[0] || ''

  form.file = null

  showModal.value = true
}

async function saveEdit() {
  try {
    const payload = new FormData()

    payload.append('categoryId', form.categoryId)
    payload.append('amount', Number(form.amount))
    payload.append('notes', form.notes)
    payload.append('transactionDate', form.transactionDate)

    if (form.file) {
      payload.append('file', form.file)
    }

    const res = await api.put(
      `transactions/${route.params.id}`,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    transaction.value =
      res.data?.data ?? res.data

    showModal.value = false

  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  await categoryStore.fetchAllCategories()
  await fetchDetail()
})
</script>

<style>
/* ───────────────── PAGE ───────────────── */
.detail-page {
  padding: 24px;
  background: #f6f8fb;
  min-height: 100vh;
}

.font {
  font-family: 'Kantumruy Pro', sans-serif;
}

/* ───────────────── BACK BUTTON ───────────────── */
.back-btn {
  border: none;
  background: white;
  padding: 10px 18px;
  border-radius: 14px;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 600;

  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  transition: 0.25s;
}

.back-btn:hover {
  transform: translateY(-2px);
  background: #f0f4ff;
  color: #0d6efd;
}

/* ───────────────── LAYOUT ───────────────── */
.detail-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 24px;
  margin-top: 20px;
}

@media (max-width: 900px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
}

/* ───────────────── HERO CARD ───────────────── */
.hero-card {
  background: white;
  border-radius: 24px;
  padding: 28px;

  box-shadow:
    0 10px 30px rgba(0,0,0,0.05);

  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 5px;
}

.hero--income::before {
  background: linear-gradient(
    90deg,
    #16c47f,
    #65d6a6
  );
}

.hero--expense::before {
  background: linear-gradient(
    90deg,
    #ff4d6d,
    #ff758f
  );
}

/* ───────────────── ICON ───────────────── */
.hero-icon {
  width: 80px;
  height: 80px;
  border-radius: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 32px;
  margin-bottom: 18px;
}

.hero--income .hero-icon {
  background: rgba(22,196,127,0.12);
  color: #16c47f;
}

.hero--expense .hero-icon {
  background: rgba(255,77,109,0.12);
  color: #ff4d6d;
}

/* ───────────────── BADGE ───────────────── */
.hero-badge {
  padding: 6px 16px;
  border-radius: 999px;

  font-size: 13px;
  font-weight: 700;

  margin-bottom: 14px;
}

.badge--income {
  background: rgba(22,196,127,0.12);
  color: #16c47f;
}

.badge--expense {
  background: rgba(255,77,109,0.12);
  color: #ff4d6d;
}

/* ───────────────── AMOUNT ───────────────── */
.hero-amount {
  font-size: 38px;
  font-weight: 800;
  margin-bottom: 10px;
}

.amount--income {
  color: #16c47f;
}

.amount--expense {
  color: #ff4d6d;
}

.hero-category {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.hero-date {
  color: #6c757d;
  font-size: 14px;

  display: flex;
  align-items: center;
  gap: 6px;
}

/* ───────────────── HERO IMAGE ───────────────── */
.hero-preview {
  width: 100%;
  height: 220px;

  object-fit: cover;

  border-radius: 18px;
  margin-top: 18px;

  border: 1px solid #eee;
}

/* ───────────────── RIGHT CARD ───────────────── */
.detail-right {
  background: white;
  border-radius: 24px;
  padding: 28px;

  box-shadow:
    0 10px 30px rgba(0,0,0,0.05);
}

/* ───────────────── HEADER ───────────────── */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 24px;
}

.detail-title {
  font-size: 24px;
  font-weight: 800;
  margin: 0;
}

.detail-subtitle {
  color: #6c757d;
  margin-top: 4px;
}

/* ───────────────── ACTION BUTTON ───────────────── */
.detail-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  width: 42px;
  height: 42px;

  border: none;
  border-radius: 14px;

  background: #f5f7fb;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.25s;
}

.action-btn i {
  font-size: 18px;
}

.action-btn--edit:hover {
  background: #e7f1ff;
  color: #0d6efd;
}

.action-btn--delete:hover {
  background: #ffe5ea;
  color: #ff4d6d;
}

/* ───────────────── INFO GRID ───────────────── */
.info-grid {
  border-top: 1px solid #eee;
}

.info-row {
  display: flex;
  gap: 24px;

  padding: 18px 0;
  border-bottom: 1px solid #eee;
}

.info-label {
  width: 180px;
  flex-shrink: 0;

  font-weight: 700;
  color: #495057;

  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label i {
  color: #0d6efd;
}

.info-value {
  flex: 1;
  color: #212529;
}

.notes-value {
  white-space: pre-wrap;
  line-height: 1.7;
}

/* ───────────────── TYPE CHIP ───────────────── */
.type-chip {
  padding: 6px 14px;
  border-radius: 999px;

  font-size: 13px;
  font-weight: 700;

  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.chip--income {
  background: rgba(22,196,127,0.12);
  color: #16c47f;
}

.chip--expense {
  background: rgba(255,77,109,0.12);
  color: #ff4d6d;
}

/* ───────────────── ATTACHMENT PREVIEW ───────────────── */
.attachment-preview {
  width: 240px;
  height: 170px;

  object-fit: cover;

  border-radius: 18px;
  border: 1px solid #e9ecef;

  background: white;

  display: block;
  margin-top: 10px;

  transition: 0.3s;
}

.attachment-preview:hover {
  transform: scale(1.02);
}

/* ───────────────── EMPTY IMAGE ───────────────── */
.empty-image {
  width: 240px;
  height: 170px;

  border: 2px dashed #d6dbe3;
  border-radius: 18px;

  background: #fafcff;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  gap: 10px;

  color: #8a94a6;

  margin-top: 10px;
}

.empty-image i {
  font-size: 42px;
}

/* ───────────────── PDF ───────────────── */
.pdf-preview {
  width: 240px;
  height: 170px;

  border-radius: 18px;
  border: 1px solid #eee;

  background: white;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  gap: 12px;

  margin-top: 10px;

  color: #dc3545;
  font-weight: 700;

  transition: 0.25s;
}

.pdf-preview:hover {
  background: #fff5f5;
}

.pdf-preview i {
  font-size: 52px;
}

/* ───────────────── FORM ───────────────── */
.form-label {
  font-weight: 700;
  margin-bottom: 8px;
}

.form-control,
.form-select {
  border-radius: 14px;
  min-height: 48px;
  border: 1px solid #dee2e6;
}

.form-control:focus,
.form-select:focus {
  box-shadow: 0 0 0 4px rgba(13,110,253,0.12);
  border-color: #0d6efd;
}

/* ───────────────── STATE BOX ───────────────── */
.state-box {
  min-height: 60vh;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>