import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/api'

export const useTransactionStore = defineStore('transaction', () => {

  const transactions = ref([])

  const transactionsitems = ref({
    totalItems: 0,
  })

  const loading = ref(false)
  const error = ref(null)

  async function fetchTransactions() {
    loading.value = true
    error.value = null

    try {
      const res = await api.get('/transactions')

      transactions.value = res.data?.data?.items ?? []

    } catch (err) {
      console.error('Failed to fetch:', err)
      error.value = err.message || 'Failed to fetch transactions'
    } finally {
      loading.value = false
    }
  }

  async function fetchTransactionsitems() {
    loading.value = true
    error.value = null

    try {
      const res = await api.get('/transactions')

      transactionsitems.value = res.data?.data?.meta ?? {
        totalItems: 0,
      }
      

    } catch (err) {
      console.error('Failed to fetch:', err)
      error.value = err.message || 'Failed to fetch transactions'
    } finally {
      loading.value = false
    }
  }

  const spendingByCategory = computed(() => {

    const expenses = transactions.value.filter(
      t => t.category?.type === 'EXPENSE'
    )

    const total = expenses.reduce(
      (sum, t) => sum + (t.amount ?? 0),
      0
    )

    if (total === 0) return []

    const grouped = {}

    expenses.forEach(t => {
      const name = t.category?.name ?? 'Unknown'

      grouped[name] = (grouped[name] || 0) + (t.amount ?? 0)
    })

    return Object.entries(grouped).map(([name, amount]) => ({
      label: name,
      percentage: Math.round((amount / total) * 100),
      amount
    }))
  })

  return {
    transactions,
    transactionsitems,
    loading,
    error,
    fetchTransactions,
    fetchTransactionsitems,
    spendingByCategory
  }
})