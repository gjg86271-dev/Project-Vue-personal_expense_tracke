import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/api'

export const useBudgetStore = defineStore('budget', () => {

  const budgets        = ref([])
  const totalexpenses  = ref(0)
  const loading        = ref(false)
  const meta           = ref(null)
  const selectedBudget = ref(null)

  /* ─── FETCH ALL ─────────────────────────────────────────── */
  const fetchBudgets = async (page = 1) => {
    try {
      loading.value = true
      const response = await api.get(`/budgets?_page=${page}&_per_page=10`)
      budgets.value  = response.data.data.items
      meta.value     = response.data.data.meta
    } catch (error) {
      console.error('Error fetching budgets:', error)
    } finally {
      loading.value = false
    }
  }

  /* ─── FETCH BY ID ───────────────────────────────────────── */
  const fetchBudgetById = async (id) => {
    try {
      const response       = await api.get(`/budgets/${id}`)
      selectedBudget.value = response.data.data
      console.log('Budget detail:', selectedBudget.value)
    } catch (error) {
      console.error('Error fetching budget detail:', error)
      selectedBudget.value = null
    }
  }

  /* ─── FETCH CATEGORY BREAKDOWN ──────────────────────────── */
  const fetchCategoryBreakdown = async () => {
    try {
      const now   = new Date()
      const month = now.getMonth() + 1  // ✅ dynamic — ខែបច្ចុប្បន្ន
      const year  = now.getFullYear()   // ✅ dynamic — ឆ្នាំបច្ចុប្បន្ន

      const response = await api.get(`analytics/category-breakdown?month=${month}&year=${year}`)
      const data = response.data?.data

      if (Array.isArray(data) && data.length > 0) {
        // ✅ sum total ទាំងអស់ — safe check រាល់ item
        totalexpenses.value = data.reduce((sum, item) => sum + (item.total ?? 0), 0)
      } else {
        totalexpenses.value = 0
      }
    } catch (error) {
      console.error('Error fetching category breakdown:', error)
      totalexpenses.value = 0  // ✅ reset — កុំ crash UI
    }
  }

  /* ─── CREATE ────────────────────────────────────────────── */
  const createBudget = async (budgetData) => {
    try {
      const response = await api.post('/budgets', budgetData)
      console.log('Created:', response.data)
    } catch (error) {
      console.error('BACKEND ERROR:', error.response?.data)
      console.log('DETAILS:', error.response?.data?.details)
      throw error
    }
  }

  /* ─── UPDATE ────────────────────────────────────────────── */
  const updateBudget = async (budgetId, budgetData) => {
    try {
      const response = await api.put(`/budgets/${budgetId}`, budgetData)
      console.log('Updated:', response.data)
    } catch (error) {
      console.error('Error updating budget:', error)
      throw error
    }
  }

  /* ─── DELETE ────────────────────────────────────────────── */
  const deleteBudget = async (budgetId) => {
    try {
      const response = await api.delete(`/budgets/${budgetId}`)
      console.log('Deleted:', response.data)
    } catch (error) {
      console.error('Error deleting budget:', error)
      throw error
    }
  }

  return {
    budgets,
    totalexpenses,
    loading,
    meta,
    selectedBudget,

    fetchBudgets,
    fetchBudgetById,
    fetchCategoryBreakdown,
    createBudget,
    updateBudget,
    deleteBudget,
  }
})