<template>
  <main class="page">

    <!-- HEADER -->
    <section>
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="card header-card">
              <h2>📊 ការវិភាគចំណូល</h2>
              <p>បង្ហាញចំណូលតាមប្រភេទ</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CHART -->
    <section class="mt-3">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6">

            <div class="card chart-card">

              <div v-if="store.loading" class="loading">
                Loading...
              </div>

              <div v-else class="chart-wrapper">
                <canvas ref="chartRef"></canvas>

                <div class="legend">
                  <div
                    v-for="(item, index) in incomeData"
                    :key="item.label"
                    class="legend-item"
                  >
                    <span
                      class="dot"
                      :style="{ background: colors[index] }"
                    ></span>

                    <span class="label">{{ item.label }}</span>
                    <span class="percent">{{ item.percentage }}%</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
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
  '#22c55e', '#16a34a', '#4ade80',
  '#86efac', '#bbf7d0', '#15803d'
]

// 👉 filter only INCOME
const incomeData = computed(() => {
  if (!store.spendingByCategory) return []
  return store.spendingByCategory.filter(i => i.type === 'INCOME')
})

function destroyChart() {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}

function buildChart() {
  if (!chartRef.value) return
  if (!incomeData.value.length) return

  destroyChart()

  chartInstance = new Chart(chartRef.value, {
    type: 'doughnut',
    data: {
      labels: incomeData.value.map(i => i.label),
      datasets: [
        {
          data: incomeData.value.map(i => i.percentage),
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }
      ]
    },
    options: {
      cutout: '70%',
      responsive: true,
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

watch(incomeData, async () => {
  await nextTick()
  buildChart()
})

onBeforeUnmount(() => {
  destroyChart()
})
</script>

<style scoped>
.page {
  font-family: 'Kantumruy Pro', sans-serif;
  background: #f4f6fb;
  min-height: 100vh;
  padding: 20px;
}

/* HEADER */
.header-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.header-card h2 {
  margin: 0;
  font-size: 20px;
  color: #111827;
}

.header-card p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

/* CHART CARD */
.chart-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
}

/* CHART WRAPPER */
.chart-wrapper {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

/* CANVAS SIZE */
canvas {
  width: 220px !important;
  height: 220px !important;
}

/* LEGEND */
.legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.label {
  flex: 1;
  color: #374151;
}

.percent {
  color: #9ca3af;
}

/* LOADING */
.loading {
  text-align: center;
  padding: 30px;
  color: #9ca3af;
}
</style>