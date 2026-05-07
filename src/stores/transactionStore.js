import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/api'

export const useTransactionStore = defineStore('transaction', () => {

  const transactions = ref([])
  const loading = ref(false)

  async function fetchTransactions() {
    loading.value = true
    try {
      const res = await api.get('/transactions')
      transactions.value = res.data.data.items
    } catch (err) {
      console.error('Failed to fetch:', err)
    } finally {
      loading.value = false
    }
  }

  const spendingByCategory = computed(() => {
    const expenses = transactions.value.filter(
      t => t.category.type === 'EXPENSE'
    )
    const total = expenses.reduce((sum, t) => sum + t.amount, 0)
    if (total === 0) return []

    const grouped = {}
    expenses.forEach(t => {
      const name = t.category.name
      grouped[name] = (grouped[name] || 0) + t.amount
    })

    return Object.entries(grouped).map(([name, amount]) => ({
      label: name,
      percentage: Math.round((amount / total) * 100),
      amount
    }))
  })

  return { transactions, loading, fetchTransactions, spendingByCategory }
})