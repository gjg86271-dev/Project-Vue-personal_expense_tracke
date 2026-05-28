<template>
  <div class="font-costume">

    <!-- ═══════════════════════════════════════════════
         PAGE LOADING SKELETON (ដូច CategoryView)
    ════════════════════════════════════════════════ -->
    <template v-if="pageLoading">
      <div class="skeleton skeleton-header mb-4"></div>
      <div class="row g-3 mb-5">
        <div class="col-md-3 col-6" v-for="n in 4" :key="n">
          <div class="skeleton skeleton-card"></div>
        </div>
      </div>
      <div class="skeleton skeleton-chart mb-5"></div>
      <div class="skeleton skeleton-chart mb-5"></div>
      <div class="row g-3">
        <div class="col-md-4 col-12" v-for="n in 3" :key="n">
          <div class="skeleton skeleton-export-card"></div>
        </div>
      </div>
    </template>

    <!-- ═══════════════════════════════════════════════
         REAL CONTENT
    ════════════════════════════════════════════════ -->
    <template v-else>

      <!-- HEADER -->
      <div class="header-card mb-4">
        <div>
          <h1 class="fw-bold">របាយការណ៍ និងការវិភាគ</h1>
          <p>ការយល់ដឹងលម្អិតអំពីសកម្មភាពហិរញ្ញវត្ថុរបស់អ្នក</p>
        </div>
        <div class="d-flex gap-2 flex-wrap">

          <!-- Period Dropdown -->
          <div class="dropdown">
            <button
              type="button"
              class="btn btn-primary rounded-4 dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style="height:46px; padding:0 20px;"
            >
              <i class="bi bi-calendar me-1"></i> {{ periodLabel }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow rounded-4 border-0 mt-2">
              <li>
                <span class="dropdown-header small text-muted px-3 pt-2">ជ្រើសរើសរយៈពេល</span>
              </li>
              <li><hr class="dropdown-divider mx-3 my-1" /></li>
              <li v-for="opt in periodOptions" :key="opt.value">
                <a
                  class="dropdown-item px-3 py-2 d-flex align-items-center gap-2"
                  :class="{ active: selectedPeriod === opt.value }"
                  href="#"
                  @click.prevent="setPeriod(opt.value, opt.label)"
                >
                  <i :class="opt.icon" class="fs-6"></i>
                  <span>{{ opt.label }}</span>
                  <i v-if="selectedPeriod === opt.value" class="bi bi-check2 ms-auto text-primary"></i>
                </a>
              </li>
            </ul>
          </div>

          <!-- Download CSV Button -->
          <button class="btn add-btn rounded-4" type="button" @click="downloadCSV" :disabled="downloading">
            <span v-if="downloading" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-download me-1"></i>
            {{ downloading ? 'កំពុងទាញ...' : 'ទាញយករបាយការណ៍' }}
          </button>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════
           SUMMARY CARDS  (style ដូច CategoryView TotalCard)
      ═══════════════════════════════════════════════ -->
      <div class="row g-3 mb-5">

        <!-- avg income -->
        <div class="col-md-3 col-6">
          <div class="stat-card">
            <div class="stat-card__body">
              <div>
                <p class="stat-card__label">ចំណូលជាមធ្យម/ខែ</p>
                <p class="stat-card__sub">ប្រាក់ចំណូល</p>
                <p class="stat-card__value">${{ formatNum(summary.avgIncome) }}</p>
              </div>
              <div class="icon-wrap icon-wrap--income">
                <i class="bi bi-graph-up-arrow fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- avg expense -->
        <div class="col-md-3 col-6">
          <div class="stat-card">
            <div class="stat-card__body">
              <div>
                <p class="stat-card__label">ចំណាយជាមធ្យម/ខែ</p>
                <p class="stat-card__sub">ប្រាក់ចំណាយ</p>
                <p class="stat-card__value">${{ formatNum(summary.avgExpense) }}</p>
              </div>
              <div class="icon-wrap icon-wrap--expense">
                <i class="bi bi-graph-down-arrow fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- avg savings -->
        <div class="col-md-3 col-6">
          <div class="stat-card">
            <div class="stat-card__body">
              <div>
                <p class="stat-card__label">សន្សំជាមធ្យម/ខែ</p>
                <p class="stat-card__sub">ការសន្សំ</p>
                <p class="stat-card__value">${{ formatNum(summary.avgSavings) }}</p>
              </div>
              <div class="icon-wrap icon-wrap--savings">
                <i class="bi bi-piggy-bank fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- saving rate -->
        <div class="col-md-3 col-6">
          <div class="stat-card">
            <div class="stat-card__body">
              <div>
                <p class="stat-card__label">អត្រាសន្សំ</p>
                <p class="stat-card__value">{{ summary.savingRate }}%</p>
                <p class="stat-card__sub">នៃប្រាក់ចំណូលសរុប</p>
              </div>
              <div class="icon-wrap icon-wrap--rate">
                <i class="bi bi-pie-chart fs-4"></i>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ══════════════════════════════════════════════
           BAR CHART
      ═══════════════════════════════════════════════ -->
      <div class="col-12 mb-5">
        <div class="card border-0 rounded-4 shadow p-4">
          <p class="fs-5 fw-bold mb-3">ប្រាក់ចំណូលធៀប និងចំណាយ</p>

          <div v-if="loadingChart" class="text-center py-5 text-muted">
            <div class="spinner-border spinner-border-sm me-2"></div>កំពុងផ្ទុក...
          </div>
          <div v-else-if="!financeData.length" class="empty-state-inline">
            <i class="bi bi-bar-chart fs-1 d-block mb-2"></i>
            <p class="mb-0">មិនមានទិន្នន័យ</p>
          </div>
          <div v-else class="chart-container">
            <div class="chart-wrapper">
              <div class="y-axis">
                <span v-for="(val, i) in yAxisValues" :key="i">{{ val.toLocaleString() }}</span>
              </div>
              <div class="chart">
                <div v-for="(item, index) in financeData" :key="index" class="month-group">
                  <div class="bar income"   :style="{ height: barHeight(item.income)   + 'px' }" :title="`ចំណូល: $${formatNum(item.income)}`"></div>
                  <div class="bar expenses" :style="{ height: barHeight(item.expenses) + 'px' }" :title="`ចំណាយ: $${formatNum(item.expenses)}`"></div>
                  <div class="bar savings"  :style="{ height: barHeight(item.savings)  + 'px' }" :title="`សន្សំ: $${formatNum(item.savings)}`"></div>
                  <span class="month">{{ item.month }}</span>
                </div>
              </div>
            </div>
            <div class="legend">
              <div class="legend-item"><span class="color income"></span><p class="mb-0">ប្រាក់ចំណូល</p></div>
              <div class="legend-item"><span class="color expenses"></span><p class="mb-0">ប្រាក់ចំណាយ</p></div>
              <div class="legend-item"><span class="color savings"></span><p class="mb-0">ប្រាក់សន្សំ</p></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════
           BUDGET PROGRESS
      ═══════════════════════════════════════════════ -->
      <div class="col-12 mb-5">
        <div class="card shadow border-0 rounded-4 p-4">
          <p class="fs-5 fw-bold mb-3">ការចំណាយតាមប្រភេទ</p>

          <div v-if="loadingBudget" class="text-center py-4 text-muted">
            <div class="spinner-border spinner-border-sm me-2"></div>កំពុងផ្ទុក...
          </div>
          <div v-else-if="!budgets.length" class="empty-state-inline">
            <i class="bi bi-inbox fs-1 d-block mb-2"></i>
            <p class="mb-0">មិនមានទិន្នន័យ</p>
          </div>
          <div v-else class="budget-card">
            <div v-for="(item, index) in budgets" :key="index" class="budget-item">
              <div class="budget-header">
                <p class="mb-1">{{ item.name }}</p>
                <span>${{ formatNum(item.amount) }} ({{ item.percent }}%)</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: item.percent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════
           EXPORT CARDS
      ═══════════════════════════════════════════════ -->
      <div class="row g-3">
        <div class="col-md-4 col-12">
          <div class="export-card" @click="downloadCSV">
            <div class="export-card__icon icon-wrap--income">
              <i class="bi bi-filetype-csv fs-2"></i>
            </div>
            <h5 class="fw-bold mt-3 mb-1">CSV Export</h5>
            <p class="text-muted small mb-0">ទាញយកប្រតិបត្តិការជាសន្លឹកកិច្ចការ (Spreadsheet)</p>
          </div>
        </div>
        <div class="col-md-4 col-12">
          <div class="export-card" @click="downloadPDF">
            <div class="export-card__icon icon-wrap--expense">
              <span v-if="downloadingPDF" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi bi-file-earmark-pdf fs-2"></i>
            </div>
            <h5 class="fw-bold mt-3 mb-1">PDF Report</h5>
            <p class="text-muted small mb-0">{{ downloadingPDF ? 'កំពុងបង្កើត PDF...' : 'បង្កើតរបាយការណ៍ហិរញ្ញវត្ថុលម្អិត' }}</p>
          </div>
        </div>
        <div class="col-md-4 col-12">
          <div class="export-card" @click="openTaxModal">
            <div class="export-card__icon icon-wrap--rate">
              <i class="bi bi-receipt-cutoff fs-2"></i>
            </div>
            <h5 class="fw-bold mt-3 mb-1">Tax Summary</h5>
            <p class="text-muted small mb-0">នាំចេញសម្រាប់គោលបំណងបំពេញបែបបទពន្ធ</p>
          </div>
        </div>
      </div>

    </template><!-- end v-else -->

    <!-- ═══════════════════════════════════════════════
         TAX MODAL  (style ដូច CategoryView modal)
    ════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="showTaxModal" class="swal-overlay" @click.self="showTaxModal = false">
          <div class="swal-box swal-box--tax">

            <!-- header -->
            <div class="swal-header">
              <div class="swal-header__icon icon-tax">
                <i class="bi bi-receipt-cutoff"></i>
              </div>
              <div>
                <h3 class="swal-title">Tax Summary</h3>
                <p class="swal-desc">ឆ្នាំ {{ currentYear }} · ព័ត៌មានសម្រាប់ការបំពេញបែបបទពន្ធ</p>
              </div>
              <button class="swal-close" @click="showTaxModal = false">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <!-- body -->
            <div class="swal-body">

              <!-- summary rows -->
              <div class="tax-row income-row mb-2">
                <span>💰 ចំណូលសរុប</span>
                <strong class="text-success">${{ formatNum(taxData.totalIncome) }}</strong>
              </div>
              <div class="tax-row expense-row mb-2">
                <span>💸 ចំណាយសរុប</span>
                <strong class="text-danger">${{ formatNum(taxData.totalExpense) }}</strong>
              </div>
              <div class="tax-row saving-row mb-4">
                <span>🏦 ចំណេញសុទ្ធ (Net)</span>
                <strong :class="taxData.net >= 0 ? 'text-success' : 'text-danger'">
                  ${{ formatNum(taxData.net) }}
                </strong>
              </div>

              <hr />

              <p class="fw-bold mb-3">ចំណូល-ចំណាយ តាមខែ</p>

              <!-- loading state inside modal -->
              <div v-if="loadingChart" class="text-center py-3 text-muted">
                <div class="spinner-border spinner-border-sm me-1"></div> កំពុងផ្ទុក...
              </div>
              <div v-else-if="!financeData.length" class="text-center py-3 text-muted">
                មិនមានទិន្នន័យ
              </div>
              <div v-else class="tax-month-table">
                <div class="tax-month-header">
                  <span>ខែ</span><span>ចំណូល</span><span>ចំណាយ</span><span>ចំណេញ</span>
                </div>
                <div v-for="(row, i) in financeData" :key="i" class="tax-month-row">
                  <span>{{ row.month }}</span>
                  <span class="text-success">${{ formatNum(row.income) }}</span>
                  <span class="text-danger">${{ formatNum(row.expenses) }}</span>
                  <span :class="row.savings >= 0 ? 'text-success' : 'text-danger'">${{ formatNum(row.savings) }}</span>
                </div>
              </div>

              <p class="text-muted small mt-4 mb-0">
                * ទិន្នន័យនេះគឺជាការប៉ាន់ស្មាន។ សូមពិគ្រោះជាមួយអ្នកជំនាញពន្ធ។
              </p>
            </div>

            <!-- footer -->
            <div class="swal-footer">
              <button class="swal-btn swal-btn--cancel" @click="showTaxModal = false">បិទ</button>
              <button class="swal-btn swal-btn--confirm" @click="downloadPDF">
                <i class="bi bi-file-earmark-pdf"></i> Export PDF
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- TOAST -->
    <Teleport to="body">
      <Transition name="toast-slide">
        <div v-if="toast.show" class="toast-wrap" :class="`toast-wrap--${toast.type}`">
          <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
          <span>{{ toast.message }}</span>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import api from '@/api/api'

// ── State ──────────────────────────────────────────────
const financeData    = ref([])
const budgets        = ref([])
const pageLoading    = ref(false)   // initial full-page skeleton
const loadingChart   = ref(false)
const loadingBudget  = ref(false)
const downloading    = ref(false)
const downloadingPDF = ref(false)
const showTaxModal   = ref(false)
const currentYear    = new Date().getFullYear()

// ── Toast ──────────────────────────────────────────────
const toast = reactive({ show: false, type: 'success', message: '' })
let toastTimer = null
function showToast(message, type = 'success') {
  clearTimeout(toastTimer)
  Object.assign(toast, { show: true, type, message })
  toastTimer = setTimeout(() => { toast.show = false }, 3000)
}

// ── Period ─────────────────────────────────────────────
const selectedPeriod = ref('6m')
const periodLabel    = ref('៦ ខែចុងក្រោយ')

const periodOptions = [
  { value: '1m',  label: '១ ខែចុងក្រោយ',  icon: 'bi bi-calendar-week' },
  { value: '3m',  label: '៣ ខែចុងក្រោយ',  icon: 'bi bi-calendar-month' },
  { value: '6m',  label: '៦ ខែចុងក្រោយ',  icon: 'bi bi-calendar2-range' },
  { value: '1y',  label: '១ ឆ្នាំចុងក្រោយ', icon: 'bi bi-calendar-check' },
  { value: 'all', label: 'ទាំងអស់',         icon: 'bi bi-infinity' },
]

const setPeriod = (value, label) => {
  selectedPeriod.value = value
  periodLabel.value    = label
  fetchReport()
  fetchBudgets()
}

// ── Helpers ────────────────────────────────────────────
const formatNum = (val) =>
  Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// ── Chart computed ─────────────────────────────────────
const maxValue = computed(() => {
  if (!financeData.value.length) return 1
  return Math.max(...financeData.value.flatMap(i => [i.income, i.expenses, Math.max(i.savings, 0)])) || 1
})
const barHeight  = (val) => Math.max((Math.max(val, 0) / maxValue.value) * 300, 0)
const yAxisValues = computed(() => {
  const step = Math.ceil(maxValue.value / 4)
  return [step * 4, step * 3, step * 2, step, 0]
})

// ── Summary computed ───────────────────────────────────
const summary = computed(() => {
  if (!financeData.value.length)
    return { avgIncome: 0, avgExpense: 0, avgSavings: 0, savingRate: 0 }
  const len        = financeData.value.length
  const avgIncome  = financeData.value.reduce((s, i) => s + i.income,   0) / len
  const avgExpense = financeData.value.reduce((s, i) => s + i.expenses, 0) / len
  const avgSavings = financeData.value.reduce((s, i) => s + i.savings,  0) / len
  const totalIncome  = financeData.value.reduce((s, i) => s + i.income,  0)
  const totalSavings = financeData.value.reduce((s, i) => s + i.savings, 0)
  const savingRate   = totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : 0
  return { avgIncome, avgExpense, avgSavings, savingRate }
})

// ── Tax computed ───────────────────────────────────────
const taxData = computed(() => {
  const totalIncome  = financeData.value.reduce((s, i) => s + i.income,   0)
  const totalExpense = financeData.value.reduce((s, i) => s + i.expenses, 0)
  return { totalIncome, totalExpense, net: totalIncome - totalExpense }
})

// ── Period → params ────────────────────────────────────
const getPeriodParams = () => {
  const now = new Date()
  const end = now.toISOString().slice(0, 10)
  let start
  switch (selectedPeriod.value) {
    case '1m': start = new Date(now.getFullYear(), now.getMonth() - 1,  now.getDate()).toISOString().slice(0, 10); break
    case '3m': start = new Date(now.getFullYear(), now.getMonth() - 3,  now.getDate()).toISOString().slice(0, 10); break
    case '6m': start = new Date(now.getFullYear(), now.getMonth() - 6,  now.getDate()).toISOString().slice(0, 10); break
    case '1y': start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().slice(0, 10); break
    default:   return {}
  }
  return { start_date: start, end_date: end }
}

// ── Fetch chart ────────────────────────────────────────
const fetchReport = async () => {
  loadingChart.value = true
  try {
    const res = await api.get('analytics/trends', { params: getPeriodParams() })
    const trends = res.data.data
    financeData.value = Object.entries(trends).map(([month, v]) => ({
      month,
      income:   v.income  || 0,
      expenses: v.expense || 0,
      savings:  (v.income || 0) - (v.expense || 0),
    }))
  } catch (err) {
    console.error('fetchReport:', err)
    showToast('មិនអាចទាញទិន្នន័យបានទេ', 'error')
  } finally {
    loadingChart.value = false
  }
}

// ── Fetch budgets ──────────────────────────────────────
const fetchBudgets = async () => {
  loadingBudget.value = true
  try {
    const txRes      = await api.get('/transactions', { params: { _page: 1, _per_page: 100 } })
    const transactions = txRes.data?.data?.items ?? []
    const grouped    = {}
    transactions.forEach(tx => {
      if (tx.category?.type?.toUpperCase() !== 'EXPENSE') return
      const cat = tx.category?.name?.trim() ?? 'មិនស្គាល់'
      grouped[cat] = (grouped[cat] || 0) + Math.abs(Number(tx.amount) || 0)
    })
    const total = Object.values(grouped).reduce((s, a) => s + a, 0)
    budgets.value = Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount, percent: total ? Math.round((amount / total) * 100) : 0 }))
      .sort((a, b) => b.amount - a.amount)
  } catch (err) {
    console.error('fetchBudgets:', err)
  } finally {
    loadingBudget.value = false
  }
}

// ── Open tax modal (validate data first) ───────────────
const openTaxModal = () => {
  if (!financeData.value.length) {
    showToast('មិនទាន់មានទិន្នន័យសម្រាប់ Tax Summary', 'error')
    return
  }
  showTaxModal.value = true
}

// ── Download CSV ───────────────────────────────────────
const downloadCSV = async () => {
  if (downloading.value) return
  downloading.value = true
  try {
    const res  = await api.get('analytics/export', { responseType: 'blob', params: getPeriodParams() })
    const url  = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href  = url
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    showToast('បានទាញយក CSV ដោយជោគជ័យ!')
  } catch (err) {
    console.error('CSV export failed:', err)
    showToast('មានបញ្ហាក្នុងការទាញយក CSV', 'error')
  } finally {
    downloading.value = false
  }
}

// ── Download PDF ───────────────────────────────────────
const downloadPDF = () => {
  if (downloadingPDF.value) return
  if (!financeData.value.length) {
    showToast('មិនទាន់មានទិន្នន័យសម្រាប់ PDF', 'error')
    return
  }
  downloadingPDF.value = true
  try {
    const rows = financeData.value.map(row => `
      <tr>
        <td>${row.month}</td>
        <td style="color:#22c55e">$${formatNum(row.income)}</td>
        <td style="color:#ef4444">$${formatNum(row.expenses)}</td>
        <td style="color:${row.savings >= 0 ? '#22c55e' : '#ef4444'}">$${formatNum(row.savings)}</td>
      </tr>`).join('')

    const budgetRows = budgets.value.map(b => `
      <tr>
        <td>${b.name}</td>
        <td>$${formatNum(b.amount)}</td>
        <td>${b.percent}%</td>
      </tr>`).join('')

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>Financial Report ${currentYear}</title>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
  h1   { color: #2f80ed; border-bottom: 2px solid #2f80ed; padding-bottom: 10px; }
  h2   { color: #444; margin-top: 30px; font-size: 16px; }
  table{ width:100%; border-collapse:collapse; margin-top:12px; }
  th   { background:#f0f4ff; padding:10px; text-align:left; font-size:13px; }
  td   { padding:9px 10px; border-bottom:1px solid #eee; font-size:13px; }
  .grid{ display:flex; gap:20px; margin:20px 0; flex-wrap:wrap; }
  .box { flex:1; min-width:130px; background:#f8f9fa; border-radius:10px; padding:14px; }
  .box p{ margin:0; font-size:12px; color:#888; }
  .box h3{ margin:4px 0 0; font-size:20px; }
  .footer{ margin-top:40px; font-size:11px; color:#999; text-align:center; }
</style></head><body>
<h1>របាយការណ៍ហិរញ្ញវត្ថុ</h1>
<p style="color:#888">បង្កើតថ្ងៃទី ${new Date().toLocaleDateString()} · ឆ្នាំ ${currentYear} · រយៈពេល: ${periodLabel.value}</p>
<div class="grid">
  <div class="box"><p>ចំណូលជាមធ្យម/ខែ</p><h3 style="color:#22c55e">$${formatNum(summary.value.avgIncome)}</h3></div>
  <div class="box"><p>ចំណាយជាមធ្យម/ខែ</p><h3 style="color:#ef4444">$${formatNum(summary.value.avgExpense)}</h3></div>
  <div class="box"><p>សន្សំជាមធ្យម/ខែ</p><h3 style="color:#f59e0b">$${formatNum(summary.value.avgSavings)}</h3></div>
  <div class="box"><p>អត្រាសន្សំ</p><h3 style="color:#2f80ed">${summary.value.savingRate}%</h3></div>
</div>
<h2>ប្រាក់ចំណូល និងចំណាយតាមខែ</h2>
<table><thead><tr><th>ខែ</th><th>ចំណូល</th><th>ចំណាយ</th><th>សន្សំ</th></tr></thead><tbody>${rows}</tbody></table>
<h2>ការចំណាយតាមប្រភេទ</h2>
<table><thead><tr><th>ប្រភេទ</th><th>ចំនួន</th><th>ភាគរយ</th></tr></thead><tbody>${budgetRows}</tbody></table>
<div class="footer">* របាយការណ៍នេះបង្កើតដោយប្រព័ន្ធគ្រប់គ្រងហិរញ្ញវត្ថុ · ${new Date().toISOString().slice(0, 10)}</div>
</body></html>`

    const win = window.open('', '_blank')
    if (!win) { showToast('Browser blocked popup. Please allow popups.', 'error'); return }
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 600)
    showToast('បានបង្កើត PDF ដោយជោគជ័យ!')
  } catch (err) {
    console.error('PDF failed:', err)
    showToast('មានបញ្ហាក្នុងការបង្កើត PDF', 'error')
  } finally {
    downloadingPDF.value = false
  }
}

// ── onMounted ──────────────────────────────────────────
onMounted(async () => {
  pageLoading.value = true
  try {
    await Promise.all([fetchReport(), fetchBudgets()])
  } finally {
    pageLoading.value = false
  }
})
</script>

<style scoped>
/* ── Font ─────────────────────────────────────────── */
.font-costume {
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
}

/* ══════════════════════════════════════════════════
   SKELETON  (copy from CategoryView)
══════════════════════════════════════════════════ */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-input) 25%,
    var(--border-color) 50%,
    var(--bg-input) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: var(--radius);
}
@keyframes shimmer {
  0%   { background-position: 200% 0 }
  100% { background-position: -200% 0 }
}
.skeleton-header      { height: 80px; }
.skeleton-card        { height: 110px; }
.skeleton-chart       { height: 280px; }
.skeleton-export-card { height: 140px; }

/* ══════════════════════════════════════════════════
   HEADER  (identical to CategoryView)
══════════════════════════════════════════════════ */
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
.header-card h1 { font-size: 20px; font-weight: 700; margin: 0 0 2px; color: var(--text-white); }
.header-card p  { font-size: 12px; margin: 0; color: rgba(255,255,255,0.65); }

.add-btn {
  height: 46px;
  padding: 0 20px;
  font-size: 15px;
  white-space: nowrap;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
  background: rgba(255,255,255,0.15);
  color: var(--text-white);
  border: 1.5px solid rgba(255,255,255,0.4);
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition);
}
.add-btn:hover { background: rgba(255,255,255,0.25); }

/* ══════════════════════════════════════════════════
   STAT CARDS  (style ដូច CategoryView TotalCard)
══════════════════════════════════════════════════ */
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 16px 20px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  cursor: default;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
}
.stat-card__body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.stat-card__label { font-size: 14px; font-weight: 500; color: var(--text-primary); margin: 0 0 2px; }
.stat-card__sub   { font-size: 12px; color: var(--text-secondary); margin: 0 0 6px; }
.stat-card__value { font-size: 22px; font-weight: 700; color: var(--text-primary); margin: 0; }

/* icon wraps — same as CategoryView */
.icon-wrap {
  padding: 10px 14px;
  border-radius: 12px;
  color: var(--text-white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-wrap--income  { background: var(--color-success, #22c55e); }
.icon-wrap--expense { background: var(--color-danger,  #ef4444); }
.icon-wrap--savings { background: #0891b2; }
.icon-wrap--rate    { background: #7c3aed; }

/* ══════════════════════════════════════════════════
   CARD (chart / budget container)
══════════════════════════════════════════════════ */
.card {
  background-color: var(--bg-card);
  color: var(--text-primary);
}

/* ══════════════════════════════════════════════════
   DROPDOWN
══════════════════════════════════════════════════ */
.dropdown-menu {
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  min-width: 200px;
  padding: 8px 0;
  background: var(--bg-card);
  animation: fadeDown 0.15s ease;
}
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.dropdown-item {
  font-size: 14px;
  color: var(--text-primary);
  border-radius: 8px;
  margin: 2px 8px;
  width: calc(100% - 16px);
  transition: background 0.15s;
}
.dropdown-item:hover { background: var(--bg-input); color: #2f80ed; }
.dropdown-item.active { background: var(--bg-input); color: #2f80ed; font-weight: 600; }

/* ══════════════════════════════════════════════════
   EMPTY STATE (inline)
══════════════════════════════════════════════════ */
.empty-state-inline {
  text-align: center;
  padding: 50px 20px;
  color: var(--text-secondary);
}

/* ══════════════════════════════════════════════════
   BAR CHART
══════════════════════════════════════════════════ */
.chart-container { width: 100%; padding: 4px 0; overflow-x: auto; }
.chart-wrapper { display: flex; align-items: flex-end; min-width: 600px; }
.y-axis {
  display: flex; height: 320px; flex-direction: column;
  justify-content: space-between; margin-right: 12px;
  color: var(--text-primary); font-size: 13px; font-weight: 600;
}
.chart {
  height: 320px; flex: 1;
  display: flex; align-items: flex-end; justify-content: space-evenly;
  border-left: 2px solid var(--border-color);
  border-bottom: 2px solid var(--border-color);
  padding: 10px 10px 0; gap: 20px;
}
.month-group {
  display: flex; align-items: flex-end; justify-content: center;
  gap: 5px; position: relative; min-width: 70px; padding-bottom: 30px;
}
.bar { width: 20px; border-radius: 6px 6px 0 0; transition: all 0.3s ease; cursor: pointer; min-height: 2px; }
.bar:hover { transform: translateY(-4px); opacity: 0.85; }
.income  { background: #22c55e; }
.expenses{ background: #ef4444; }
.savings { background: #f59e0b; }
.month {
  position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
  font-size: 12px; font-weight: 600; white-space: nowrap; color: var(--text-primary);
}
.legend { display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; margin-top: 40px; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text-primary); }
.color { width: 16px; height: 16px; border-radius: 4px; flex-shrink: 0; }

/* ══════════════════════════════════════════════════
   BUDGET
══════════════════════════════════════════════════ */
.budget-card { width: 100%; padding: 4px 0; }
.budget-item { margin-bottom: 20px; }
.budget-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 8px; font-size: 15px; color: var(--text-primary);
}
.progress-bar { width: 100%; height: 10px; background: var(--bg-input); border-radius: 20px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #2f80ed, #56ccf2); border-radius: 20px; transition: width 0.6s ease; }

/* ══════════════════════════════════════════════════
   EXPORT CARDS
══════════════════════════════════════════════════ */
.export-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 24px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
}
.export-card:hover { transform: translateY(-6px); box-shadow: 0 10px 28px rgba(0,0,0,0.13); }
.export-card__icon {
  width: 60px; height: 60px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto; color: var(--text-white);
}
.export-card h5  { color: var(--text-primary); }
.export-card p   { color: var(--text-secondary) !important; }

/* ══════════════════════════════════════════════════
   MODAL  (identical style to CategoryView)
══════════════════════════════════════════════════ */
.swal-overlay {
  position: fixed; inset: 0;
  background: rgba(4,44,131,0.22);
  backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1050; padding: 16px;
}
.swal-box {
  background: var(--bg-card);
  border-radius: 24px;
  width: 100%; max-width: 460px;
  box-shadow: var(--shadow);
  overflow: hidden;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  border: 1px solid var(--border-color);
}
.swal-box--tax { max-width: 560px; max-height: 85vh; overflow-y: auto; }

.swal-header {
  display: flex; align-items: center; gap: 14px;
  padding: 22px 24px 16px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}
.swal-header__icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.icon-tax { background: #fef3c7; color: #d97706; }

.swal-title { margin: 0 0 2px; font-size: 17px; font-weight: 800; color: var(--text-primary); }
.swal-desc  { margin: 0; font-size: 12px; color: var(--text-secondary); }

.swal-close {
  position: absolute; top: 18px; right: 18px;
  width: 32px; height: 32px; border-radius: 8px;
  border: none; background: var(--bg-input);
  color: var(--text-secondary); font-size: 14px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: var(--transition);
}
.swal-close:hover { background: var(--color-danger); color: var(--text-white); }

.swal-body   { padding: 20px 24px; }
.swal-footer {
  display: flex; gap: 10px;
  padding: 16px 24px 22px;
  border-top: 1px solid var(--border-color);
}
.swal-btn {
  flex: 1; height: 46px; border-radius: 50px; border: none;
  font-size: 14px; font-weight: 700; cursor: pointer;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: var(--transition);
}
.swal-btn--cancel  { background: var(--bg-input); color: var(--text-secondary); }
.swal-btn--cancel:hover { background: var(--bg-body); color: var(--text-primary); }
.swal-btn--confirm {
  flex: 2; background: var(--color-primary); color: var(--text-white);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
.swal-btn--confirm:hover { background: var(--color-primary-hover); transform: translateY(-1px); }

/* ── Tax Modal content ────────────────────────── */
.tax-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; border-radius: 10px; font-size: 14px;
}
.income-row  { background: #f0fdf4; }
.expense-row { background: #fff1f2; }
.saving-row  { background: #eff6ff; }
.tax-month-table { font-size: 13px; }
.tax-month-header {
  display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;
  font-weight: 600; background: var(--bg-input);
  padding: 8px 10px; border-radius: 8px; margin-bottom: 4px; color: var(--text-primary);
}
.tax-month-row {
  display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 7px 10px; border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
}
.tax-month-row:last-child { border-bottom: none; }

/* ══════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════ */
.toast-wrap {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 10px; padding: 12px 22px;
  border-radius: 50px; font-size: 14px; font-weight: 600;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  box-shadow: var(--shadow); z-index: 2000; white-space: nowrap;
}
.toast-wrap--success { background: var(--text-primary); color: var(--bg-card); }
.toast-wrap--error   { background: var(--color-danger);  color: var(--text-white); }

/* ── Transitions ──────────────────────────────── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to       { opacity: 0; }
.modal-fade-enter-from .swal-box, .modal-fade-leave-to .swal-box { transform: scale(0.94) translateY(12px); }
.modal-fade-enter-active .swal-box, .modal-fade-leave-active .swal-box { transition: transform 0.25s ease; }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }

/* ── text-muted override ──────────────────────── */
.text-muted { color: var(--text-secondary) !important; }
</style>