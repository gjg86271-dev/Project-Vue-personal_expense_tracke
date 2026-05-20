<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/api'
import TransactionForm from '@/components/form/TransactionForm.vue'

const transactions = ref([])

async function fetchAlltransaction() {
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

// Delete
async function deletIDtransaction(id) {
  try {
    await api.delete(`transactions/${id}`)
    transactions.value = transactions.value.filter(item => item.id !== id)
  } catch (error) {
    console.log(error)
  }
}

// Update — accepts FormData or plain object
async function updateIDtransaction(id, form) {
  try {
    const isFormData = form instanceof FormData
    const res = await api.put(`transactions/${id}`, form, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    })
    transactions.value = transactions.value.map(item =>
      item.id === id ? res.data.data : item
    )
  } catch (error) {
    console.log(error)
  }
}

// Create — accepts FormData or plain object
async function createTransaction(form) {
  try {
    const isFormData = form instanceof FormData
    await api.post('transactions', form, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    })
    fetchAlltransaction()
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="container">
    <TransactionForm
      :items="transactions"
      @delete-transaction="deletIDtransaction"
      @update-transaction="updateIDtransaction"
      @create-transaction="createTransaction"
    />
  </div>
</template>