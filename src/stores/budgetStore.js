import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/api'

export const useBudgetStore = defineStore('budget', () => {

  const budgets        = ref([])
  const totalexpenses  = ref(0)
  const loading        = ref(false)
  const meta           = ref(null)
  const selectedBudget = ref(null)   // ✅ stores /budgets/:id result

  /* ─── FETCH ALL ─────────────────────────────────────────── */
  const fetchBudgets = async (page = 1) => {
    try {
      loading.value = true
      const response    = await api.get(`/budgets?_page=${page}&_per_page=10`)
      budgets.value     = response.data.data.items
      meta.value        = response.data.data.meta
    } catch (error) {
      console.error('Error fetching budgets:', error)
    } finally {
      loading.value = false
    }
  }

  /* ─── FETCH BY ID ───────────────────────────────────────── */
  // ✅ GET /budgets/:id  →  saves into selectedBudget
  const fetchBudgetById = async (id) => {
    try {
      const response      = await api.get(`/budgets/${id}`)
      selectedBudget.value = response.data.data   // { id, limitAmount, month, year, category, ... }
      console.log('Budget detail:', selectedBudget.value)
    } catch (error) {
      console.error('Error fetching budget detail:', error)
      selectedBudget.value = null
    }
  }

  /* ─── FETCH OVERVIEW ────────────────────────────────────── */
  const fetchCategoryBreakdown = async () => {
    try {
      const response      = await api.get('/analytics/category-breakdown?month=4&year=2026')
      totalexpenses.value = response.data.data[0].total
    } catch (error) {
      console.error('Error fetching category breakdown:', error)
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