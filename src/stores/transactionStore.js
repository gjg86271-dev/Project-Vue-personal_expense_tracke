import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/api'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const meta         = ref(null)
  const loading      = ref(false)

  // ← default value សំខាន់ណាស់
  const summary = ref({
    totalIncome:  0,
    totalExpense: 0,
    netBalance:   0
  })

  async function fetchTransactions(page = 1, perPage = 10) {
    loading.value = true
    try {
      const res = await api.get(
        `transactions?_page=${page}&_per_page=${perPage}&sortBy=id&sortDir=asc`
      )
      transactions.value = res.data.data.items
      meta.value         = res.data.data.meta
    } catch (err) {
      console.error('fetchTransactions:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchSummary() {
    try {
      const res = await api.get('analytics/dashboard-summary')
      const data = res.data?.data || {}
      summary.value = {
        totalIncome:  data.totalIncome  || 0,
        totalExpense: data.totalExpense || 0,
        netBalance:   data.netBalance   || 0
      }
    } catch (err) {
      console.error('fetchSummary:', err)
    }
  }

  async function createTransaction(payload) {
    try {
      await api.post('transactions', payload)
    } catch (err) {
      console.error('createTransaction:', err)
      throw err
    }
  }

  async function updateTransaction(id, payload) {
    try {
      await api.put(`transactions/${id}`, payload)
    } catch (err) {
      console.error('updateTransaction:', err)
      throw err
    }
  }

  async function deleteTransaction(id) {
    try {
      await api.delete(`transactions/${id}`)
    } catch (err) {
      console.error('deleteTransaction:', err)
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
    deleteTransaction
  }
})