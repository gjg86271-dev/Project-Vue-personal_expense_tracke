<template>
  <div class="font-costume">

    <div class="header-card mb-4">
      <div>
        <h1 class="fw-bold">របាយការណ៍ និងការវិភាគ</h1>
        <p>ការយល់ដឹងលម្អិតអំពីសកម្មភាពហិរញ្ញវត្ថុរបស់អ្នក</p>
      </div>
      <div class="d-flex">

        <!-- Period Dropdown -->
        <div class="dropdown">
          <button type="button" class="btn btn-primary rounded-4 dropdown-toggle" data-bs-toggle="dropdown"
            aria-expanded="false" style=" height: 46px;
  padding: 0 20px;">
            <i class="bi bi-calendar me-1"></i> {{ periodLabel }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow rounded-4 border-0 mt-2">
            <li>
              <span class="dropdown-header small text-muted px-3 pt-2">ជ្រើសរើសរយៈពេល</span>
            </li>
            <li>
              <hr class="dropdown-divider mx-3 my-1" />
            </li>
            <li v-for="opt in periodOptions" :key="opt.value">
              <a class="dropdown-item px-3 py-2 d-flex align-items-center gap-2"
                :class="{ active: selectedPeriod === opt.value }" href="#"
                @click.prevent="setPeriod(opt.value, opt.label)">
                <i :class="opt.icon" class="fs-6"></i>
                <span>{{ opt.label }}</span>
                <i v-if="selectedPeriod === opt.value" class="bi bi-check2 ms-auto text-primary"></i>
              </a>
            </li>
          </ul>
        </div>

        <button class="btn add-btn ms-3 rounded-4" type="button" @click="downloadCSV" :disabled="downloading">
          <span v-if="downloading" class="spinner-border spinner-border-sm me-1"></span>
          <i v-else class="bi bi-download me-1"></i>
          {{ downloading ? 'កំពុងទាញ...' : 'ទាញយករបាយការណ៍' }}
        </button>
      </div>
    </div>

    <!-- SUMMARY CARDS -->
    <div class="row mt-5 mb-5 g-3">
      <div class="col-md-3 col-6">
        <div class="card_edit border-0 rounded-4 p-3">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <p class="fs-6 fw-bold-edit mb-1">ចំណូលជាមធ្យម/ខែ</p>
              <p class="text-muted small mb-1">ប្រាក់ចំណូល</p>
              <p class="fs-3 fw-bold mb-0">${{ formatNum(summary.avgIncome) }}</p>
            </div>
            <i class="bi fs-1 bg-edit bi-graph-up-arrow mt-2"></i>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card_edit border-0 rounded-4 p-3">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <p class="fs-6 fw-bold-edit mb-1">ចំណាយជាមធ្យម/ខែ</p>
              <p class="text-muted small mb-1">ប្រាក់ចំណាយ</p>
              <p class="fs-3 fw-bold mb-0">${{ formatNum(summary.avgExpense) }}</p>
            </div>
            <i class="bi fs-1 text-danger bi-graph-down-arrow mt-2"></i>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card_edit border-0 rounded-4 p-3">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <p class="fs-6 fw-bold-edit mb-1">សន្សំជាមធ្យម/ខែ</p>
              <p class="text-muted small mb-1">ការសន្សំ</p>
              <p class="fs-3 fw-bold mb-0">${{ formatNum(summary.avgSavings) }}</p>
            </div>
            <i class="bi fs-1 text-info bi-piggy-bank mt-2"></i>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card_edit border-0 rounded-4 p-3">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <p class="fs-6 fw-bold-edit mb-1">អត្រាសន្សំ</p>
              <p class="fs-3 fw-bold mb-0">{{ summary.savingRate }}%</p>
              <p class="text-muted small mb-0">នៃប្រាក់ចំណូលសរុប</p>
            </div>
            <i class="bi fs-1 bg-edit bi-pie-chart mt-2"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- BAR CHART -->
    <div class="col-12 mb-5">
      <div class="card border-0 rounded-4 shadow p-4">
        <p class="fs-5 fw-bold mb-3">ប្រាក់ចំណូលធៀប និងចំណាយ</p>
        <div v-if="loadingChart" class="text-center py-5 text-muted">
          <div class="spinner-border spinner-border-sm me-2"></div>កំពុងផ្ទុក...
        </div>
        <div v-else-if="!financeData.length" class="text-center py-5 text-muted">
          មិនមានទិន្នន័យ
        </div>
        <div v-else class="chart-container">
          <div class="chart-wrapper">
            <div class="y-axis">
              <span v-for="(val, i) in yAxisValues" :key="i">{{ val.toLocaleString() }}</span>
            </div>
            <div class="chart">
              <div v-for="(item, index) in financeData" :key="index" class="month-group">
                <div class="bar income" :style="{ height: barHeight(item.income) + 'px' }"
                  :title="`ចំណូល: $${formatNum(item.income)}`"></div>
                <div class="bar expenses" :style="{ height: barHeight(item.expenses) + 'px' }"
                  :title="`ចំណាយ: $${formatNum(item.expenses)}`"></div>
                <div class="bar savings" :style="{ height: barHeight(item.savings) + 'px' }"
                  :title="`សន្សំ: $${formatNum(item.savings)}`"></div>
                <span class="month">{{ item.month }}</span>
              </div>
            </div>
          </div>
          <div class="legend">
            <div class="legend-item"><span class="color income"></span>
              <p class="mb-0">ប្រាក់ចំណូល</p>
            </div>
            <div class="legend-item"><span class="color expenses"></span>
              <p class="mb-0">ប្រាក់ចំណាយ</p>
            </div>
            <div class="legend-item"><span class="color savings"></span>
              <p class="mb-0">ប្រាក់សន្សំ</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BUDGET PROGRESS -->
    <div class="col-12 mb-5">
      <div class="card shadow border-0 rounded-4 p-4">
        <p class="fs-5 fw-bold mb-3">ការចំណាយតាមប្រភេទ</p>
        <div v-if="loadingBudget" class="text-center py-4 text-muted">
          <div class="spinner-border spinner-border-sm me-2"></div>កំពុងផ្ទុក...
        </div>
        <div v-else-if="!budgets.length" class="text-center py-4 text-muted">
          មិនមានទិន្នន័យ
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

    <!-- EXPORT CARDS -->
    <div class="row g-3">
      <div class="col-md-4 col-12">
        <div class="card_edit border-0 shadow rounded-4 p-4 text-center" @click="downloadCSV" style="cursor:pointer">
          <div class="fs-1">📊</div>
          <h5 class="fw-bold">CSV Export</h5>
          <p class="text-muted small mb-0">ទាញយកប្រតិបត្តិការជាសន្លឹកកិច្ចការ (Spreadsheet)</p>
        </div>
      </div>
      <div class="col-md-4 col-12">
        <div class="card_edit border-0 shadow rounded-4 p-4 text-center" @click="downloadPDF" style="cursor:pointer">
          <div class="fs-1">
            <span v-if="downloadingPDF" class="spinner-border spinner-border-sm text-secondary"></span>
            <span v-else>📑</span>
          </div>
          <h5 class="fw-bold">PDF Report</h5>
          <p class="text-muted small mb-0">{{ downloadingPDF ? 'កំពុងបង្កើត PDF...' : 'បង្កើតរបាយការណ៍ហិរញ្ញវត្ថុលម្អិត'
          }}</p>
        </div>
      </div>
      <div class="col-md-4 col-12">
        <div class="card_edit border-0 shadow rounded-4 p-4 text-center" @click="showTaxModal = true"
          style="cursor:pointer">
          <div class="fs-1">📈</div>
          <h5 class="fw-bold">Tax Summary</h5>
          <p class="text-muted small mb-0">នាំចេញសម្រាប់គោលបំណងបំពេញបែបបទពន្ធ</p>
        </div>
      </div>
    </div>

    <!-- TAX SUMMARY MODAL -->
    <div v-if="showTaxModal" class="modal-backdrop" @click.self="showTaxModal = false">
      <div class="modal-box rounded-4 shadow-lg p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h5 class="fw-bold mb-0">📈 Tax Summary</h5>
          <button class="btn-close" @click="showTaxModal = false"></button>
        </div>

        <p class="text-muted small mb-3">ឆ្នាំ {{ currentYear }} · ព័ត៌មានសម្រាប់ការបំពេញបែបបទពន្ធ</p>

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
        <div class="tax-month-table">
          <div class="tax-month-header">
            <span>ខែ</span>
            <span>ចំណូល</span>
            <span>ចំណាយ</span>
            <span>ចំណេញ</span>
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
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/api'

// ── State ──────────────────────────────────────────────
const financeData = ref([])
const budgets = ref([])
const loadingChart = ref(false)
const loadingBudget = ref(false)
const downloading = ref(false)
const downloadingPDF = ref(false)
const showTaxModal = ref(false)
const currentYear = new Date().getFullYear()

// ── Period ─────────────────────────────────────────────
const selectedPeriod = ref('6m')
const periodLabel = ref('៦ ខែចុងក្រោយ')

const periodOptions = [
  { value: '1m', label: '១ ខែចុងក្រោយ', icon: 'bi bi-calendar-week' },
  { value: '3m', label: '៣ ខែចុងក្រោយ', icon: 'bi bi-calendar-month' },
  { value: '6m', label: '៦ ខែចុងក្រោយ', icon: 'bi bi-calendar2-range' },
  { value: '1y', label: '១ ឆ្នាំចុងក្រោយ', icon: 'bi bi-calendar-check' },
  { value: 'all', label: 'ទាំងអស់', icon: 'bi bi-infinity' },
]

const setPeriod = (value, label) => {
  selectedPeriod.value = value
  periodLabel.value = label
  fetchReport()
  fetchBudgets()
}

// ── Helpers ────────────────────────────────────────────
const formatNum = (val) =>
  Number(val || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

// ── Chart computed ─────────────────────────────────────
const maxValue = computed(() => {
  if (!financeData.value.length) return 1
  return Math.max(
    ...financeData.value.flatMap(i => [i.income, i.expenses, Math.max(i.savings, 0)])
  ) || 1
})

const barHeight = (val) => Math.max((Math.max(val, 0) / maxValue.value) * 300, 0)

const yAxisValues = computed(() => {
  const step = Math.ceil(maxValue.value / 4)
  return [step * 4, step * 3, step * 2, step, 0]
})

// ── Summary computed ───────────────────────────────────
const summary = computed(() => {
  if (!financeData.value.length)
    return { avgIncome: 0, avgExpense: 0, avgSavings: 0, savingRate: 0 }

  const len = financeData.value.length
  const avgIncome = financeData.value.reduce((s, i) => s + i.income, 0) / len
  const avgExpense = financeData.value.reduce((s, i) => s + i.expenses, 0) / len
  const avgSavings = financeData.value.reduce((s, i) => s + i.savings, 0) / len
  const totalIncome = financeData.value.reduce((s, i) => s + i.income, 0)
  const totalSavings = financeData.value.reduce((s, i) => s + i.savings, 0)
  const savingRate = totalIncome > 0
    ? ((totalSavings / totalIncome) * 100).toFixed(1)
    : 0

  return { avgIncome, avgExpense, avgSavings, savingRate }
})

// ── Tax data computed ──────────────────────────────────
const taxData = computed(() => {
  const totalIncome = financeData.value.reduce((s, i) => s + i.income, 0)
  const totalExpense = financeData.value.reduce((s, i) => s + i.expenses, 0)
  return { totalIncome, totalExpense, net: totalIncome - totalExpense }
})

// ── Period → date params helper ────────────────────────
const getPeriodParams = () => {
  const now = new Date()
  const end = now.toISOString().slice(0, 10)
  let start

  switch (selectedPeriod.value) {
    case '1m':
      start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        .toISOString().slice(0, 10)
      break
    case '3m':
      start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        .toISOString().slice(0, 10)
      break
    case '6m':
      start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
        .toISOString().slice(0, 10)
      break
    case '1y':
      start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        .toISOString().slice(0, 10)
      break
    case 'all':
    default:
      return {}
  }

  return { start_date: start, end_date: end }
}

// ── Fetch trends ───────────────────────────────────────
const fetchReport = async () => {
  loadingChart.value = true
  try {
    const res = await api.get('analytics/trends', { params: getPeriodParams() })
    const trends = res.data.data
    financeData.value = Object.entries(trends).map(([month, v]) => ({
      month,
      income: v.income || 0,
      expenses: v.expense || 0,
      savings: (v.income || 0) - (v.expense || 0),
    }))
  } catch (err) {
    console.error('fetchReport:', err)
  } finally {
    loadingChart.value = false
  }
}

// ── Fetch budgets ──────────────────────────────────────
const fetchBudgets = async () => {
  loadingBudget.value = true

  try {
    const txRes = await api.get('/transactions', {
      params: {
        _page: 1,
        _per_page: 100
      }
    })

    const transactions = txRes.data?.data?.items ?? []

    const grouped = {}

    transactions.forEach(tx => {
      const catType = tx.category?.type?.toUpperCase()
      if (catType !== 'EXPENSE') return

      const cat = tx.category?.name?.trim() ?? 'មិនស្គាល់'
      grouped[cat] = (grouped[cat] || 0) + Math.abs(Number(tx.amount) || 0)
    })

    const total = Object.values(grouped).reduce((s, a) => s + a, 0)

    budgets.value = Object.entries(grouped)
      .map(([name, amount]) => ({
        name,
        amount,
        percent: total ? Math.round((amount / total) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount)

  } catch (err) {
    console.error('fetchBudgets:', err?.response?.data || err)
  } finally {
    loadingBudget.value = false
  }
}

// ── Download CSV ───────────────────────────────────────
const downloadCSV = async () => {
  downloading.value = true
  try {
    const res = await api.get('analytics/export', {
      responseType: 'blob',
      params: getPeriodParams()
    })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Export failed:', err)
  } finally {
    downloading.value = false
  }
}

// ── Download PDF ───────────────────────────────────────
const downloadPDF = () => {
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
  body { font-family: 'Khmer OS', Arial, sans-serif; padding: 40px; color: #333; }
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
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close() }, 600)
  } catch (err) {
    console.error('PDF failed:', err)
  } finally {
    downloadingPDF.value = false
  }
}

// ── onMounted ──────────────────────────────────────────
onMounted(() => {
  fetchReport()
  fetchBudgets()
})
</script>

<style scoped>
/* ── HEADER ───────────────────────────────────────── */
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
  margin: 0 0 2px;
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

/* ── DROPDOWN MENU ────────────────────────────────── */
.dropdown-menu {
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  min-width: 200px;
  padding: 8px 0;
  animation: fadeDown 0.15s ease;
}

.dropdown-item {
  font-size: 14px;
  color: #333;
  border-radius: 8px;
  margin: 2px 8px;
  width: calc(100% - 16px);
  transition: background 0.15s;
}

.dropdown-item:hover {
  background: #f0f4ff;
  color: #2f80ed;
}

.dropdown-item.active {
  background: #e8f0fe;
  color: #2f80ed;
  font-weight: 600;
}

@keyframes fadeDown {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── GENERAL ──────────────────────────────────────── */
.font-costume {
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
}

.bg-edit {
  color: #4CAF50;
}

.fw-bold-edit {
  font-weight: 500;
}

.card_edit {
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: #ffffff;
  border-radius: 16px;
}

.card_edit:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  background: linear-gradient(135deg, #ffffff, #f3f8ff);
}

/* ── CHART ────────────────────────────────────────── */
.chart-container {
  background: #f8f9fa;
  width: 100%;
  border-radius: 16px;
  padding: 24px;
  overflow-x: auto;
}

.chart-wrapper {
  display: flex;
  align-items: flex-end;
  min-width: 600px;
}

.y-axis {
  display: flex;
  height: 320px;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 12px;
  color: #666;
  font-size: 13px;
  font-weight: 600;
}

.chart {
  height: 320px;
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-evenly;
  border-left: 2px solid #d1d5db;
  border-bottom: 2px solid #d1d5db;
  padding: 10px 10px 0;
  gap: 20px;
}

.month-group {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
  position: relative;
  min-width: 70px;
  padding-bottom: 30px;
}

.bar {
  width: 20px;
  border-radius: 6px 6px 0 0;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 2px;
}

.bar:hover {
  transform: translateY(-4px);
  opacity: 0.85;
}

.income {
  background: #22c55e;
}

.expenses {
  background: #ef4444;
}

.savings {
  background: #f59e0b;
}

.month {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  color: #555;
}

.legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 40px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

/* ── BUDGET ───────────────────────────────────────── */
.budget-card {
  width: 100%;
  background: #f5f5f5;
  padding: 24px;
  border-radius: 12px;
}

.budget-item {
  margin-bottom: 20px;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 15px;
  color: #444;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #d9d9d9;
  border-radius: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2f80ed, #56ccf2);
  border-radius: 20px;
  transition: width 0.6s ease;
}

/* ── TAX MODAL ────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 16px;
}

.modal-box {
  background: #fff;
  width: 100%;
  max-width: 560px;
  max-height: 85vh;
  overflow-y: auto;
}

.tax-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
}

.income-row {
  background: #f0fdf4;
}

.expense-row {
  background: #fff1f2;
}

.saving-row {
  background: #eff6ff;
}

.tax-month-table {
  font-size: 13px;
}

.tax-month-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  font-weight: 600;
  background: #f8f9fa;
  padding: 8px 10px;
  border-radius: 8px;
  margin-bottom: 4px;
  color: #555;
}

.tax-month-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 7px 10px;
  border-bottom: 1px solid #f0f0f0;
}

.tax-month-row:last-child {
  border-bottom: none;
}
</style>