import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/api'

export const useTransactionStore = defineStore('transaction', () => {

  const transactions = ref([])
  const meta         = ref(null)
  const loading      = ref(false)
  const summary      = ref({
    totalIncome:  0,
    totalExpense: 0,
    netBalance:   0,
  })

  // ── FETCH ALL ─────────────────────────────────────────
  async function fetchTransactions(page = 1, perPage = 100) {
    loading.value = true
    try {
      const res = await api.get(
        `transactions?_page=${page}&_per_page=${perPage}&sortBy=transactionDate&sortDir=desc`
      )
      transactions.value = res.data.data.items
      meta.value         = res.data.data.meta
    } catch (err) {
      console.error('fetchTransactions:', err.response?.data || err)
    } finally {
      loading.value = false
    }
  }

  // ── FETCH SUMMARY ─────────────────────────────────────
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

  // ── CREATE ────────────────────────────────────────────
async function createTransaction(payload) {
  try {
    const res = await api.post('transactions', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (err) {
    console.error('createTransaction error:', JSON.stringify(err.response?.data, null, 2))
    throw err
  }
}

async function updateTransaction(id, payload) {
  try {
    const res = await api.put(`transactions/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
  } catch (err) {
    console.error('updateTransaction error:', JSON.stringify(err.response?.data, null, 2))
    throw err
  }
}

  // ── UPDATE ────────────────────────────────────────────
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
      console.error('updateTransaction error:', err.response?.data)
      throw err
    }
  }

  // ── DELETE ────────────────────────────────────────────
  async function deleteTransaction(id) {
    try {
      await api.delete(`transactions/${id}`)
    } catch (err) {
      console.error('deleteTransaction error:', err.response?.data)
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