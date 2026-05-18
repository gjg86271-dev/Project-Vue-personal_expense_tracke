<style scoped>
.icons {
    font-size: 50px;
    margin-left: 80px;
    color: #7CAF50;
}

.iconss {
    font-size: 50px;
    margin-left: 80px;
}

.card {
    padding: 30px 20px;
}

.text-time {
    color: #7CAF50;
}

.fs-7 {
    font-size: 18px;
}

.font-costume {
    font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
}

.chart-container {
    background: #f8f9fa;
    width: 100%;
    border-radius: 20px;
    padding: 30px;
    overflow-x: auto;
}

.chart-wrapper {
    display: flex;
    align-items: flex-end;
    min-width: 700px;
}

.y-axis {
    display: flex;
    height: 350px;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 15px;
    color: #666;
    font-weight: 600;
    font-size: 14px;
}

.chart {
    height: 350px;
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;
    border-left: 2px solid #d1d5db;
    border-bottom: 2px solid #d1d5db;
    padding: 20px 10px;
    gap: 30px;
}

.month-group {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 6px;
    position: relative;
    min-width: 70px;
}

.bar {
    width: 22px;
    border-radius: 8px 8px 0 0;
    transition: all 0.3s ease;
}

.bar:hover {
    transform: translateY(-5px);
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
    bottom: -35px;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
}

.legend {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 25px;
    margin-top: 50px;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.color {
    width: 18px;
    height: 18px;
    border-radius: 4px;
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
    background: #2f80ed;
    border-radius: 20px;
}

.title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 30px;
}

.budget-card {
    width: 100%;
    min-height: 400px;
    background: #f5f5f5;
    padding: 30px;
    border-radius: 12px;
    font-family: "Kantumruy Pro", sans-serif;
}

.budget-item {
    margin-bottom: 22px;
}

.budget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.budget-header p,
.budget-header span {
    font-size: 20px;
    color: #555;
}
/* ---- */
.pb-edit {
    padding-bottom: 20px;
}
.mt-edit{
    margin-top: -10px;
}
.bg-edit{
    color: #4CAF50;
}

.card_edit {
  padding: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: #ffffff;
}

.card_edit:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
}

/* icon effect */
.card i {
  transition: 0.3s ease;
}

.card_edit:hover i {
  transform: scale(1.2);
}
.card_edit:hover {
  background: linear-gradient(135deg, #ffffff, #f3f8ff);
}
.fw-bold-edit{
    font-weight: 500;
}
</style>
<template>
    <div class="font-costume">
        <h2 class="fw-bold">របាយការណ៍ និងការវិភាគ</h2>
        <p>ការយល់ដឹងលម្អិតអំពីសកម្មភាពហិរញ្ញវត្ថុរបស់អ្នក</p>
        <div class="d-flex">
            <button type="button" class="btn btn-outline-secondary rounded-4"><i class="bi bi-calendar"></i> ៦
                ខែចុងក្រោយ</button>
            <button class="btn btn-primary ms-3 rounded-4" type="submit"><i class="bi bi-download"></i>
                ទាញយករបាយការណ៍</button>
        </div>
        <div class="row mt-5 mb-5">
            <div class="col-3">
                <div class="card_edit border-0 rounded-4">
                    <div class="d-flex justify-content-between">
                        <div>
                            <p class="fs-5 fw-bold-edit">ការចំណាយជាមធ្យម/ខែ</p>
                            <p class="mt-edit">ប្រាក់ចំណូល</p>
                            <p class="mt-edit fs-2">$557.30</p>
                        </div>
                        <div>
                            <p class="mt-4"><i class="bi fs-1 bg-edit bi-graph-up-arrow"></i></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card_edit border-0 rounded-4">
                    <div class="d-flex justify-content-between">
                        <div>
                            <p class="fs-5 fw-bold-edit">ការចំណាយជាមធ្យម/ខែ</p>
                            <p class="mt-edit">ប្រាក់ចំណាយ</p>
                            <p class="mt-edit fs-2">$105.10</p>
                        </div>
                        <div>
                            <p class="mt-4"><i class="bi fs-1  text-danger bi-graph-up-arrow"></i></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card_edit border-0 rounded-4">
                    <div class="d-flex justify-content-between">
                        <div>
                            <p class="fs-5 fw-bold-edit">ការចំណាយជាមធ្យម/ខែ</p>
                            <p class="mt-edit">ការសន្សំ</p>
                            <p class="mt-edit fs-2">$130.20</p>
                        </div>
                        <div>
                            <p class="mt-4"><i class="bi fs-1 text-info bi-graph-up-arrow"></i></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-3">
                <div class="card_edit border-0 rounded-4">
                    <div class="d-flex justify-content-between">
                        <div>
                            <p class="fs-5 fw-bold-edit">អត្រាសន្សំ</p>
                            <p class="mt-edit fs-2">30.8%</p>
                            <p class="mt-edit">នៃប្រាប់ចំណូលសរុប</p>
                            
                        </div>
                        <div>
                            <p class="mt-4"><i class="bi fs-1 bg-edit bi-pie-chart"></i></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 mb-5">
            <div class="card border-0 rounded-4 shadow">
                <p class="fs-5 fw-bold">ប្រាក់ចំណូលធៀប និងចំណាយ</p>
                <div class="chart-container">
                    <div class="chart-wrapper">
                        <div class="y-axis">
                            <span v-for="(value, index) in yAxisValues" :key="index">
                                {{ value.toLocaleString() }}
                            </span>
                        </div>
                        <div class="chart">
                            <div v-for="(item, index) in financeData" :key="index" class="month-group">
                                <div class="bar income" :style="{
                                    height: (item.income / maxValue) * 300 + 'px'
                                }"></div>

                                <!-- expenses -->
                                <div class="bar expenses" :style="{
                                    height: (item.expenses / maxValue) * 300 + 'px'
                                }"></div>

                                <!-- savings -->
                                <div class="bar savings" :style="{
                                    height: (item.savings / maxValue) * 300 + 'px'
                                }"></div>
                            </div>
                        </div>
                    </div>
                    <div class="legend">
                        <div class="legend-item">
                            <span class="color income mb-3"></span>
                            <p>ប្រាក់ចំណូល</p>
                        </div>

                        <div class="legend-item">
                            <span class="color expenses mb-3"></span>
                            <p>ប្រាក់ចំណាយ</p>
                        </div>

                        <div class="legend-item">
                            <span class="color savings mb-3"></span>
                            <p>ប្រាក់សន្សំ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 mb-5">
            <div class="card shadow border-0 rounded-4">
                <p class="fs-5 fw-bold">ការចំណាយតាមប្រភេទ</p>
                <div class="budget-card">


                    <div v-for="(item, index) in budgets" :key="index" class="budget-item">
                        <div class="budget-header">
                            <p>{{ item.name }}</p>
                            <span>${{ item.amount }}({{ item.percent }}%)</span>
                        </div>

                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: item.percent + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-4">
                <div class="card_edit border-0 shadow rounded-4">
                    <h1>📊</h1>
                    <h1>CSV Export</h1>
                    <p>
                        ទាញយកប្រតិបត្តិការជាសន្លឹកកិច្ចការ (Spreadsheet)
                    </p>
                </div>
            </div>
            <div class="col-4">
                <div class="card_edit border-0 shadow rounded-4">
                    <h1>📑</h1>
                    <h1>PDF Report</h1>
                    <p>
                        បង្កើតរបាយការណ៍ហិរញ្ញវត្ថុលម្អិត
                    </p>
                </div>
            </div>
            <div class="col-4">
                <div class="card_edit border-0 shadow rounded-4">
                    <h1>📈</h1>
                    <h1>Tax Summary</h1>
                    <p>
                        នាំចេញសម្រាប់គោលបំណងបំពេញបែបបទពន្ធ
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import api from '@/api/api'
import { onMounted, ref, computed } from 'vue'
const financeData = ref([])

const fetchReport = async () => {
    try {
        const res = await api.get('analytics/trends')

        const trends = res.data.data

        financeData.value = Object.entries(trends).map(([month, value]) => ({
            month,
            income: value.income,
            expenses: value.expense,
            savings: value.income - value.expense
        }))

        console.log(financeData.value)

    } catch (err) {
        console.log(err)
    }
}

onMounted(() => {
    fetchReport()
})
const maxValue = computed(() => {
    if (!financeData.value.length) return 0

    return Math.max(
        ...financeData.value.flatMap(item => [
            item.income,
            item.expenses,
            item.savings
        ])
    )
})

const yAxisValues = computed(() => {
    const step = Math.ceil(maxValue.value / 4)

    return [
        step * 4,
        step * 3,
        step * 2,
        step,
        0
    ]
})
const budgets = ref([])

const fetchBudgets = async () => {
    try {

        const res = await api.get(
            'transactions?_page=1&_per_page=100'
        )

        const transactions = res.data.data.items

        // only expense
        const expenses = transactions.filter(
            item => item.category.type === 'EXPENSE'
        )

        // group by category
        const grouped = {}

        expenses.forEach(item => {

            const category = item.category.name.trim()

            if (!grouped[category]) {
                grouped[category] = 0
            }

            grouped[category] += item.amount
        })

        // total expense
        const total = Object.values(grouped).reduce(
            (sum, amount) => sum + amount,
            0
        )

        // convert to ui format
        budgets.value = Object.entries(grouped).map(
            ([name, amount]) => ({
                name,
                amount,
                percent: Math.round(
                    (amount / total) * 100
                )
            })
        )

        console.log(budgets.value)

    } catch (err) {
        console.log(err)
    }
}
onMounted(() => {
    fetchReport()
    fetchBudgets()
})
</script>