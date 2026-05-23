<script setup>
// ✅ Parent is now a thin shell — the store handles all data.
// TransactionForm.vue reads from the store directly, so no props/emits needed.
import TransactionForm from '@/components/form/TransactionForm.vue'

</script>

<template>
 

    <TransactionForm />

</template>