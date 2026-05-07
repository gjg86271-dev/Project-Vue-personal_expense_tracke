import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/api' // your axios instance

export const useBudgetStore = defineStore('budget', () => {
  const budgets = ref([])
  const totalexpenses = ref([])
  const loading = ref(false)

  // stores/budget.js
const fetchBudgets = async () => {
  const response = await api.get('/budgets?_page=1&_per_page=10')


  budgets.value = response.data.data.items
//   console.log(budgets);
}

const fetchCategoryBreakdown = async (budgetId) => {
  const response = await api.get(`analytics/category-breakdown?month=4&year=2026`)
  totalexpenses.value = response.data.data[0].total
  console.log(totalexpenses.value);
}



  return { budgets, loading, fetchBudgets, fetchCategoryBreakdown, totalexpenses }
})
