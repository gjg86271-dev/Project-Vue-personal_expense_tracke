<template>
  <div class="card border-0 shadow">
    <div class="card-header bg-white border-0">
      <h3 class="card-title">និន្នាការប្រចាំខែ</h3>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-else class="card-body">
      <div class="chart-wrapper">
        <canvas ref="chartRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js'
import api from '@/api/api'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
)

const chartRef = ref(null)
const loading = ref(true)
let chartInstance = null

async function fetchAndBuild() {
  try {
    const res = await api.get('/analytics/trends')
    const raw = res.data.data

    const labels = Object.keys(raw).map(key => {
      const [year, month] = key.split('-')
      const date = new Date(year, month - 1)
      return date.toLocaleString('km-KH', { month: 'short' })
    })

    const incomeData = Object.values(raw).map(v => v.income)
    const expenseData = Object.values(raw).map(v => v.expense)

    loading.value = false

    await new Promise(r => setTimeout(r, 50))

    if (!chartRef.value) return
    if (chartInstance) chartInstance.destroy()

    chartInstance = new Chart(chartRef.value, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'ចំណូល',
            data: incomeData,
            borderColor: '#1D9E75',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#1D9E75',
            pointRadius: 4,
            tension: 0.4
          },
          {
            label: 'ចំណាយ',
            data: expenseData,
            borderColor: '#E24B4A',
            backgroundColor: 'transparent',
            pointBackgroundColor: '#E24B4A',
            pointRadius: 4,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: "'Kantumruy Pro', 'Khmer OS', sans-serif"
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: val => val.toLocaleString()
            }
          }
        }
      }
    })
  } catch (err) {
    console.error('Trend fetch error:', err)
    loading.value = false
  }
}

onMounted(() => {
  fetchAndBuild()
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 0 0 0.75rem 0;
  flex-shrink: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
}

.card-body {
  padding: 0;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.chart-wrapper {
  flex: 1;
  min-height: 200px;
  position: relative;
}

.loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
}
</style>