<template>
  <div class="spend-card">

    <!-- HEADER -->
    <div class="spend-card__header">
      <h3 class="spend-card__title">ចំណូល និង ចំណាយ តាមប្រភេទ</h3>
    </div>

    <!-- LOADING -->
    <div v-if="categoryStore.loading" class="spend-card__loading">
      <span class="spinner"></span>
      <span>កំពុងផ្ទុក...</span>
    </div>

    <div v-else class="spend-card__body">

      <!-- CHARTS ROW -->
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
                <span class="legend-dot" :style="{ background: incomeColors[index % incomeColors.length] }"></span>
                <span class="legend-label">{{ item.label }}</span>
                <span v-if="item.isSystem" class="legend-badge">System</span>
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
            <h5 class="chart-box__title chart-box__title--expense">ចំណាយ</h5>
          </div>

          <div v-if="expenseChartData.length === 0" class="chart-empty">
            <p>មិនមានទិន្នន័យ</p>
          </div>
          <div v-else class="chart-content">
            <div class="chart-donut-wrap">
              <canvas ref="expenseRef"></canvas>
              <div class="chart-center">
                <span class="chart-center__count">{{ expenseChartData.length }}</span>
                <span class="chart-center__label">ប្រភេទ</span>
              </div>
            </div>
            <div class="legend">
              <div
                v-for="(item, index) in expenseChartData"
                :key="'exp-' + item.label"
                class="legend-item"
              >
                <span class="legend-dot" :style="{ background: expenseColors[index % expenseColors.length] }"></span>
                <span class="legend-label">{{ item.label }}</span>
                <span v-if="item.isSystem" class="legend-badge">System</span>
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
import { useCategoryStore } from '@/stores/categoryStore'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const categoryStore = useCategoryStore()

const incomeRef = ref(null)
const expenseRef = ref(null)

let incomeChart = null
let expenseChart = null

// 🎨 Colors
const incomeColors = [
  '#1D9E75', '#5DCAA5', '#9FE1CB', '#0F6E56',
  '#3B6D11', '#639922', '#97C459', '#C0DD97'
]
const expenseColors = [
  '#D85A30', '#F0997B', '#F5C4B3', '#993C1D',
  '#BA7517', '#EF9F27', '#FAC775', '#E24B4A'
]

// 🔥 Map categories → chart data
const incomeChartData = computed(() =>
  categoryStore.incomeCategories.map(c => ({
    label: c.name,
    value: 1,
    isSystem: c.isSystem ?? false,
  }))
)

const expenseChartData = computed(() =>
  categoryStore.expenseCategories.map(c => ({
    label: c.name,
    value: 1,
    isSystem: c.isSystem ?? false,
  }))
)

// 🔥 Destroy safely
function destroyCharts() {
  if (incomeChart) { incomeChart.destroy(); incomeChart = null }
  if (expenseChart) { expenseChart.destroy(); expenseChart = null }
}

// 🔥 Build chart
function buildChart(canvas, data, colors) {
  if (!canvas || !data.length) return null
  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: data.map(i => i.label),
      datasets: [{
        data: data.map(() => 1),
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
            label: (ctx) => ` ${ctx.label}`
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

onMounted(async () => {
  await categoryStore.fetchAllCategories()
  await renderCharts()
})

watch(
  () => [categoryStore.incomeCategories, categoryStore.expenseCategories],
  () => renderCharts(),
  { deep: true }
)

onBeforeUnmount(() => destroyCharts())
</script>

<style scoped>
/* CARD */
.spend-card {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
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
  color: #111827;
  margin: 0 0 20px;
}

.spend-card__body {
  padding: 0 24px 24px;
}

/* LOADING */
.spend-card__loading {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  padding: 60px 24px;
  color: #6b7280;
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
  to { transform: rotate(360deg); }
}

/* CHARTS ROW — equal flex children */
.charts-row {
  display: flex;
  gap: 20px;
  align-items: stretch; /* make both boxes same height */
}

.chart-box {
  flex: 1 1 0;          /* equal width, no shrink bias */
  min-width: 0;         /* allow shrinking below content */
  background: #f9fafb;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* CHART BOX HEADER */
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
  background: #E1F5EE;
  color: #0F6E56;
}
.chart-box__icon--expense {
  background: #FAECE7;
  color: #993C1D;
}

.chart-box__title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}
.chart-box__title--income { color: #0F6E56; }
.chart-box__title--expense { color: #993C1D; }

/* CHART CONTENT */
.chart-content {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

/* Donut — larger size */
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
  color: #111827;
  line-height: 1;
}

.chart-center__label {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
}

/* LEGEND */
.legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 9px;
  overflow: hidden;
  min-width: 0;
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
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.legend-badge {
  font-size: 10px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 4px;
  padding: 2px 6px;
  flex-shrink: 0;
}

/* EMPTY */
.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 100px;
  color: #9ca3af;
  font-size: 13px;
}

/* RESPONSIVE */
@media (max-width: 640px) {
  .charts-row {
    flex-direction: column;
  }
  .chart-box {
    width: 100%;
  }
}
</style>