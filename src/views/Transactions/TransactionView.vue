<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/api'
import TransactionForm from '@/components/form/TransactionForm.vue'
import { useTransactionStore } from '@/stores/transactionStore'



const transactions = ref([])
const transactionsitmes = ref({})

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

//detele

async function deletIDtransaction(id) {
  try{
    const res = await api.delete(`transactions/${id}`)
    transactions.value = transactions.value.filter(
      item => item.id !== id
    )
  }catch(error){
    console.log(error)
  }
}

//update

async function updateIDtransaction(id, form) {
  try {
    const res = await api.put(
      `transactions/${id}`,
      form
    )
    transactions.value = transactions.value.map(item =>
      item.id === id
        ? res.data.data
        : item
    )
  } catch (error) {
    console.log(error)
  }
}

// Create
async function createTransaction(form) {
  try {

    await api.post('transactions', form)

    fetchAlltransaction()

  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div class="container">
    <TransactionForm :items="transactions" 
    @delete-transaction="deletIDtransaction"
    @update-transaction="updateIDtransaction"
    @create-transaction="createTransaction"/>
  </div>
</template>