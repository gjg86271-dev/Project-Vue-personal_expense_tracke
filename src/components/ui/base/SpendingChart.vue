<template>
  <div class="spend-card">

    <!-- HEADER -->
    <div class="spend-card__header">
      <h3 class="spend-card__title">ចំណូល និង ចំណាយ តាមប្រភេទ</h3>
    </div>

    <!-- LOADING -->
    <div v-if="isLoading" class="spend-card__loading">
      <span class="spinner"></span>
      <span>កំពុងផ្ទុក...</span>
    </div>

    <div v-else class="spend-card__body">
      <div class="charts-row">

        <!-- INCOME CHART -->
        <div class="chart-box">
          <div class="chart-box__header">
            <span class="chart-box__icon chart-box__icon--income">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </span>
            <h5 class="chart-box__title chart-box__title--income">ចំណូល</h5>
          </div>

          <div v-if="incomeChartData.length === 0" class="chart-empty">
            <p>មិនមានទិន្នន័យ</p>
          </div>

          <div v-else class="chart-content">
            <div class="chart-donut-wrap">
              <canvas ref="incomeRef"></canvas>

              <div class="chart-center">
                <span class="chart-center__count">{{ incomeChartData.length }}</span>
                <span class="chart-center__label">ប្រភេទ</span>
              </div>
            </div>

            <div class="legend">
              <div
                v-for="(item, index) in incomeChartData"
                :key="'inc-' + item.label"
                class="legend-item"
              >
                <span
                  class="legend-dot"
                  :style="{ background: incomeColors[index % incomeColors.length] }"
                ></span>

                <span class="legend-label">
                  {{ item.label }}
                </span>

                <span class="legend-amount income-amount">
                  {{ formatAmount(item.amount) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- EXPENSE CHART -->
        <div class="chart-box">
          <div class="chart-box__header">
            <span class="chart-box__icon chart-box__icon--expense">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
            </span>

            <h5 class="chart-box__title chart-box__title--expense">
              ចំណាយ
            </h5>
          </div>

          <div v-if="expenseChartData.length === 0" class="chart-empty">
            <p>មិនមានទិន្នន័យ</p>
          </div>

          <div v-else class="chart-content">
            <div class="chart-donut-wrap">
              <canvas ref="expenseRef"></canvas>

              <div class="chart-center">
                <span class="chart-center__count">
                  {{ expenseChartData.length }}
                </span>

                <span class="chart-center__label">
                  ប្រភេទ
                </span>
              </div>
            </div>

            <div class="legend">
              <div
                v-for="(item, index) in expenseChartData"
                :key="'exp-' + item.label"
                class="legend-item"
              >
                <span
                  class="legend-dot"
                  :style="{ background: expenseColors[index % expenseColors.length] }"
                ></span>

                <span class="legend-label">
                  {{ item.label }}
                </span>

                <span class="legend-amount expense-amount">
                  {{ formatAmount(item.amount) }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useTransactionStore } from '@/stores/transactionStore'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const txStore = useTransactionStore()

// ✅ FIX: derive isLoading from the store directly — no prop needed
const isLoading = computed(() => txStore.isLoading ?? false)

const incomeRef  = ref(null)
const expenseRef = ref(null)

let incomeChart  = null
let expenseChart = null

const incomeColors = [
  '#1D9E75', '#5DCAA5', '#9FE1CB', '#0F6E56',
  '#3B6D11', '#639922', '#97C459', '#C0DD97'
]
const expenseColors = [
  '#D85A30', '#F0997B', '#F5C4B3', '#993C1D',
  '#BA7517', '#EF9F27', '#FAC775', '#E24B4A'
]

const formatAmount = (amount) => {
  const num = parseFloat(amount) || 0
  if (num >= 1000) return '$' + (num / 1000).toFixed(1) + 'k'
  return '$' + num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const incomeChartData = computed(() => {
  const grouped = {}
  for (const tx of (txStore.transactions ?? [])) {
    if (tx.category?.type !== 'INCOME') continue
    const name = tx.category?.name ?? 'មិនស្គាល់'
    if (!grouped[name]) grouped[name] = 0
    grouped[name] += parseFloat(tx.amount) || 0
  }
  return Object.entries(grouped)
    .filter(([, amount]) => amount > 0)
    .map(([label, amount]) => ({ label, amount }))
})

const expenseChartData = computed(() => {
  const grouped = {}
  for (const tx of (txStore.transactions ?? [])) {
    if (tx.category?.type !== 'EXPENSE') continue
    const name = tx.category?.name ?? 'មិនស្គាល់'
    if (!grouped[name]) grouped[name] = 0
    grouped[name] += parseFloat(tx.amount) || 0
  }
  return Object.entries(grouped)
    .filter(([, amount]) => amount > 0)
    .map(([label, amount]) => ({ label, amount }))
})

function destroyCharts() {
  if (incomeChart)  { incomeChart.destroy();  incomeChart  = null }
  if (expenseChart) { expenseChart.destroy(); expenseChart = null }
}

function buildChart(canvas, data, colors) {
  if (!canvas || !data.length) return null
  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: data.map(i => i.label),
      datasets: [{
        data: data.map(i => i.amount),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 8,
      }]
    },
    options: {
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const item  = data[ctx.dataIndex]
              const total = data.reduce((s, i) => s + i.amount, 0)
              const pct   = ((item.amount / total) * 100).toFixed(1)
              return [
                ` ប្រភេទ: ${ctx.label}`,
                ` ចំនួន: ${formatAmount(item.amount)}`,
                ` សមាមាត្រ: ${pct}%`,
              ]
            }
          }
        }
      }
    }
  })
}

async function renderCharts() {
  await nextTick()
  destroyCharts()
  if (incomeRef.value && incomeChartData.value.length) {
    incomeChart = buildChart(incomeRef.value, incomeChartData.value, incomeColors)
  }
  if (expenseRef.value && expenseChartData.value.length) {
    expenseChart = buildChart(expenseRef.value, expenseChartData.value, expenseColors)
  }
}

watch(
  () => txStore.transactions,
  () => renderCharts(),
  { deep: true }
)

onMounted(() => renderCharts())

onBeforeUnmount(() => destroyCharts())
</script>

<style scoped>
.spend-card {
  background-color: var(--bg-card);
  border-radius: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  overflow: hidden;
  width: 100%;
}

.spend-card__header {
  padding: 22px 24px 0;
}

.spend-card__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 20px;
}

.spend-card__body {
  padding: 0 24px 24px;
}

.spend-card__loading {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  padding: 60px 24px;
  color: var(--text-secondary);
  font-size: 14px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top-color: #1D9E75;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.charts-row {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.chart-box {
  flex: 1 1 0;
  min-width: 0;
  background-color: var(--bg-card);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.chart-box__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}

.chart-box__icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chart-box__icon--income {
  background-color: var(--color-success-light);
  color: var(--color-success);
}

.chart-box__icon--expense {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.chart-box__title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.chart-box__title--income {
  color: var(--color-success);
}

.chart-box__title--expense {
  color: var(--color-danger);
}

.chart-content {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.chart-donut-wrap {
  position: relative;
  width: 160px;
  height: 160px;
  flex-shrink: 0;
}

.chart-donut-wrap canvas {
  width: 160px !important;
  height: 160px !important;
}

.chart-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.chart-center__count {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.chart-center__label {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
  max-height: 220px;
  overflow-y: auto;
  padding-right: 6px;
}

.legend::-webkit-scrollbar {
  width: 6px;
}

.legend::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.legend::-webkit-scrollbar-thumb {
  background: #c7c7c7;
  border-radius: 10px;
}

.legend::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  min-width: 0;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.legend-amount {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.income-amount {
  color: #1D9E75;
}

.expense-amount {
  color: #D85A30;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 100px;
  color: #9ca3af;
  font-size: 13px;
}

@media (max-width: 640px) {
  .charts-row {
    flex-direction: column;
  }

  .chart-box {
    width: 100%;
  }

  .legend {
    max-height: 180px;
  }
}
</style>