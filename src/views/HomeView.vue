<script setup>
import { ref, onMounted } from 'vue'
import TotalCard from '@/components/ui/base/Totalcard.vue'
import api from '@/api/api'
import SpendingChart from '@/components/ui/base/SpendingChart.vue'
import TrendChart from '@/components/ui/base/TrendChart.vue'

// =====================
// STATE (current only)
// =====================
const all_total = ref({
  totalIncome: 0,
  totalExpense: 0,
  netBalance: 0
})

const loading = ref(true)

// =====================
// API CALL
// =====================
const fetchAlltotal = async () => {
  try {
    const res = await api.get('analytics/dashboard-summary')
    const data = res.data.data

    // safe mapping
    all_total.value = {
      totalIncome: data?.totalIncome || 0,
      totalExpense: data?.totalExpense || 0,
      netBalance: data?.netBalance || 0
    }

    console.log('Dashboard data:', all_total.value)

  } catch (err) {
    console.error('API Error:', err)
  } finally {
    loading.value = false
  }
}

// =====================
// LIFECYCLE
// =====================
onMounted(() => {
  fetchAlltotal()
})
</script>

<template>
  <main>
    <section>


      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border"></div>
      </div>

      <!-- Content -->
      <div v-else class="container">
        <div class="d-flex justify-content-between mb-3"
          style="font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;">
          <div class="title">
            <h1 class="fw-bold"> ផ្ទាំងគ្រប់គ្រង</h1>
            <p class="text-secondary">ទិដ្ឋភាពទូទៅនៃសកម្មភាពហិរញ្ញវត្ថុរបស់អ្នក</p>
          </div>
          <button class="btn btn-primary rounded-5  "
            style="font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important; height: 50px; width: 180px ; font-size: 18px;"><i
              class="bi bi-plus"></i> បន្ថែមប្រតិបត្តិការ </button>
        </div>
        <div class="row g-3">

          <!-- Income -->
          <div class="col-12 col-md-4">
            <TotalCard title="ចំណូលសរុប" :value="all_total.totalIncome">
              <template #icon>
                <div class="bg-success px-3 py-2 rounded-3 text-white">
                  <i class="bi bi-graph-up-arrow fs-4"></i>
                </div>
              </template>
            </TotalCard>
          </div>

          <!-- Expense -->
          <div class="col-12 col-md-4">
            <TotalCard title="ចំណាយសរុប" :value="all_total.totalExpense">
              <template #icon>
                <div class="bg-danger px-3 py-2 rounded-3 text-white">
                  <i class="bi bi-graph-down-arrow fs-4"></i>
                </div>
              </template>
            </TotalCard>
          </div>

          <!-- Net Balance -->
          <div class="col-12 col-md-4">
            <TotalCard title="សមតុល្យសុទ្ធ" :value="all_total.netBalance">
              <template #icon>
                <div class="bg-secondary px-3 py-2 rounded-3 text-white">
                  <i class="bi bi-wallet2 fs-4"></i>
                </div>
              </template>
            </TotalCard>
          </div>

        </div>
      </div>
    </section>
    <section class="mt-3">
      <div class="container">
        <div class="row">
          <div class="col-6 ">
            <SpendingChart class="high-auto" />
          </div>
          <div class="col-6 ">
            <TrendChart class="high-auto" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<style scoped>
.high-auto{
  height: 360px;
}
</style>