import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/api'

export const useTransactionStore = defineStore('transaction', () => {

  const transactions = ref([])
  const loading = ref(false)
  const error = ref(null) // ← បន្ថែម error state

  async function fetchTransactions() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/transactions')
      transactions.value = res.data?.data?.items ?? [] // ← safe access
    } catch (err) {
      console.error('Failed to fetch:', err)
      error.value = err.message || 'Failed to fetch transactions'
    } finally {
      loading.value = false
    }
  }

  const spendingByCategory = computed(() => {
    const expenses = transactions.value.filter(
      t => t.category?.type === 'EXPENSE' // ← optional chaining
    )
    const total = expenses.reduce((sum, t) => sum + (t.amount ?? 0), 0) // ← safe amount
    if (total === 0) return []

    const grouped = {}
    expenses.forEach(t => {
      const name = t.category?.name ?? 'Unknown' // ← fallback name
      grouped[name] = (grouped[name] || 0) + (t.amount ?? 0)
    })

    return Object.entries(grouped).map(([name, amount]) => ({
      label: name,
      percentage: Math.round((amount / total) * 100),
      amount
    }))
  })

  return { transactions, loading, error, fetchTransactions, spendingByCategory }
})