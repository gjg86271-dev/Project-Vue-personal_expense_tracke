import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/api'

export const useTransactionStore = defineStore('transaction', () => {

  const transactions = ref([])
  const meta         = ref(null)
  const loading      = ref(false)

  const summary = ref({
    totalIncome:  0,
    totalExpense: 0,
    netBalance:   0,
  })

  // ── FETCH ALL ─────────────────────────────
  async function fetchTransactions(page = 1, filters = {}) {
    loading.value = true
    try {
      const params = new URLSearchParams()
      params.set('_page',     page)
      params.set('_per_page', 10)               // ✅ 10 per page for pagination to work
      params.set('sortBy',    'transactionDate')
      params.set('sortDir',   'desc')

      if (filters.type)            params.set('type',       filters.type)
      if (filters.categoryId)      params.set('categoryId', filters.categoryId)
      if (filters.search?.trim())  params.set('search',     filters.search.trim())

      const res = await api.get(`transactions?${params.toString()}`)

      transactions.value = res.data.data.items ?? []
      meta.value         = res.data.data.meta  ?? null

    } catch (err) {
      console.error('fetchTransactions:', err.response?.data || err)
      transactions.value = []
    } finally {
      loading.value = false
    }
  }

  // ── SUMMARY ───────────────────────────────
  async function fetchSummary() {
    try {
      const res  = await api.get('analytics/dashboard-summary')
      const data = res.data?.data || {}
      summary.value = {
        totalIncome:  data.totalIncome  || 0,
        totalExpense: data.totalExpense || 0,
        netBalance:   data.netBalance   || 0,
      }
    } catch (err) {
      console.error('fetchSummary:', err.response?.data || err)
    }
  }

  // ── CREATE ────────────────────────────────
  async function createTransaction(payload) {
    try {
      const res = await api.post('transactions', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    } catch (err) {
      console.error('createTransaction:', err.response?.data)
      throw err
    }
  }

  // ── UPDATE ────────────────────────────────
  async function updateTransaction(id, payload) {
    try {
      const isFormData = payload instanceof FormData
      const res = await api.put(`transactions/${id}`, payload, {
        headers: isFormData
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' },
      })
      return res.data
    } catch (err) {
      console.error('updateTransaction:', err.response?.data)
      throw err
    }
  }

  // ── DELETE ────────────────────────────────
  async function deleteTransaction(id) {
    try {
      await api.delete(`transactions/${id}`)
    } catch (err) {
      console.error('deleteTransaction:', err.response?.data)
      throw err
    }
  }

  return {
    transactions,
    meta,
    loading,
    summary,
    fetchTransactions,
    fetchSummary,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
})