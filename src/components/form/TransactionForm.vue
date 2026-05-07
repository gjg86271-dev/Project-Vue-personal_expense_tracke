<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <table class="table shadow rounded-6 border-start">
    <thead class="table-secondary">
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Category</th>
        <th>Type</th>
        <th>Amount</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(item, index) in items" :key="item.id">
        <td>
          {{ new Date(item.transactionDate).toLocaleDateString('en-GB') }}
        </td>
        <td>{{ item.notes }}</td>
        <td>{{ item.category?.name }}</td>
        <td>
          <span
            :class="item.category?.type === 'INCOME'
              ? 'text-success'
              : 'text-danger'"
          >
            {{ item.category?.type }}
          </span>
        </td>
        <td>${{ item.amount }}</td>
        <td>
          <button class="btn text-dark  btn-sm"><i class="bi bi-pencil-square"></i></button>
          <button class="btn text-danger"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
      <tr v-if="items.length === 0">
        <td colspan="7" class="text-center">Loading...</td>
      </tr>
    </tbody>
  </table>
</template>
<style scoped>
    .rounded-6{
        border-radius: 20px !important;
        overflow: hidden;
        border-collapse: separate;
    }
</style>