<template>
  <div class="card border-0 shadow">
    <div class="card-header bg-white border-0">
      <h3 class="card-title">ការចំណាយតាមប្រភេទ</h3>
    </div>

    <div v-if="store.loading" class="loading">Loading...</div>

    <div v-else class="card-body">
      <div class="chart-container">
        <div class="chart-wrapper">
          <canvas ref="chartRef"></canvas>
        </div>
        <div class="legend">
          <div
            v-for="(item, index) in store.spendingByCategory"
            :key="item.label"
            class="legend-item"
          >
            <span class="dot" :style="{ background: colors[index] }"></span>
            <span class="label">{{ item.label }}</span>
            <span class="percent">{{ item.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useTransactionStore } from '@/stores/transactionStore'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const store = useTransactionStore()
const chartRef = ref(null)
let chartInstance = null

const colors = [
  '#4A90E2', '#E24B4A', '#7F77DD',
  '#888780', '#EF9F27', '#1D9E75'
]

function buildChart() {
  if (!chartRef.value) return
  if (store.spendingByCategory.length === 0) return
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(chartRef.value, {
    type: 'doughnut',
    data: {
      labels: store.spendingByCategory.map(i => i.label),
      datasets: [{
        data: store.spendingByCategory.map(i => i.percentage),
        backgroundColor: colors,
        borderWidth: 3,
        borderColor: 'transparent',
        hoverOffset: 6
      }]
    },
    options: {
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  })
}

onMounted(async () => {
  await store.fetchTransactions()
  await nextTick()
  buildChart()
})

watch(() => store.spendingByCategory, async () => {
  await nextTick()
  buildChart()
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 1rem;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
}

.chart-container {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.chart-wrapper {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.dot {
  width: 11px;
  height: 11px;
  border-radius: 2px;
  flex-shrink: 0;
}

.label {
  flex: 1;
  color: #333;
}

.percent {
  color: #888;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #888;
}
</style>