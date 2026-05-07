<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/api'
import TransactionForm from '@/components/form/TransactionForm.vue'

const transactions = ref([])

async function fetchAlltransaction () {
  try {
    const res = await api.get(
      'transactions?_page=1&_per_page=10&sortBy=id&sortDir=asc'
    )
    transactions.value = res.data.data.items

  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  fetchAlltransaction()
})
</script>

<template>
  <div class="container mt-4">
    <TransactionForm :items="transactions" />
  </div>
</template>