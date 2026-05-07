<template>
  <div class="container">

    <!-- Header -->
    <div class="top-bar">
      <h2 class="title">My Budgets</h2>

      <button
        class="add-btn"
        @click="openAddModal"
      >
        + Add Budget
      </button>
    </div>

    <!-- Loading -->
    <div v-if="budgetStore.loading">
      Loading...
    </div>

    <!-- Overview -->
    <CardOverView
      :budgets="budgetStore.budgets"
      :totalexpenses="budgetStore.totalexpenses"
    />

    <!-- Budget Cards -->
    <div class="grid">
      <BaseCard
        v-for="item in budgetStore.budgets"
        :key="item.id"
        :budget="item"
        @edit-budget="openEditModal"
        @delete-budget="openDeleteModal"
      />
    </div>

    <!-- ADD / EDIT MODAL -->
    <BaseModal
      v-if="showModal"
      :title="isEditing ? 'Edit Budget' : 'Add Budget'"
      @close-modal="closeModal"
    >
      <!-- BODY -->
      <template #body>

        <div class="form-group">
          <label>Category Name</label>

          <input
            v-model="form.category.name"
            type="text"
            placeholder="Enter category"
          />
        </div>

        <div class="form-group">
          <label>Budget Amount</label>

          <input
            v-model="form.limitAmount"
            type="number"
            placeholder="Enter amount"
          />
        </div>

      </template>

      <!-- FOOTER -->
      <template #footer>

        <button
          class="cancel-btn"
          @click="closeModal"
        >
          Cancel
        </button>

        <button
          class="save-btn"
          @click="saveBudget"
        >
          {{ isEditing ? 'Update' : 'Save' }}
        </button>

      </template>
    </BaseModal>

    <!-- DELETE MODAL -->
    <BaseModal
      v-if="showDeleteModal"
      title="Delete Budget"
      @close-modal="closeDeleteModal"
    >
      <!-- BODY -->
      <template #body>

        <div class="delete-body">
          <div class="delete-icon">
            🗑️
          </div>

          <h3>Delete Budget?</h3>

          <p>
            Are you sure you want to delete
            <strong>
              {{ selectedBudget?.category?.name }}
            </strong>
            ?
          </p>
        </div>

      </template>

      <!-- FOOTER -->
      <template #footer>

        <button
          class="cancel-btn"
          @click="closeDeleteModal"
        >
          Cancel
        </button>

        <button
          class="delete-btn"
          @click="deleteBudget"
        >
          Delete
        </button>

      </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { useBudgetStore } from '@/stores/budgetStore'

import BaseCard from '@/components/ui/base/BudgetCard.vue'
import CardOverView from '@/components/ui/base/OverViewCard.vue'
import BaseModal from '@/components/ui/base/BaseModal.vue'

const budgetStore = useBudgetStore()

/* ADD + EDIT MODAL */
const showModal = ref(false)

const isEditing = ref(false)

/* DELETE MODAL */
const showDeleteModal = ref(false)

const selectedBudget = ref(null)

/* FORM */
const form = ref({
  id: null,
  category: {
    name: ''
  },
  limitAmount: 0
})

/* FETCH */
onMounted(async () => {
  await budgetStore.fetchBudgets()
  await budgetStore.fetchCategoryBreakdown()
})

/* ADD */
function openAddModal() {

  isEditing.value = false

  form.value = {
    id: null,
    category: {
      name: ''
    },
    limitAmount: 0
  }

  showModal.value = true
}

/* EDIT */
function openEditModal(budget) {

  isEditing.value = true

  form.value = {
    ...budget,
    category: {
      ...budget.category
    }
  }

  showModal.value = true
}

/* DELETE */
function openDeleteModal(budget) {

  selectedBudget.value = budget

  showDeleteModal.value = true
}

/* SAVE */
function saveBudget() {

  if (isEditing.value) {

    const index = budgetStore.budgets.findIndex(
      item => item.id === form.value.id
    )

    if (index !== -1) {
      budgetStore.budgets[index] = {
        ...form.value
      }
    }

    console.log('UPDATED')

  } else {

    const newBudget = {
      ...form.value,
      id: Date.now(),
      spentAmount: 0
    }

    budgetStore.budgets.push(newBudget)

    console.log('CREATED')
  }

  closeModal()
}

/* DELETE */
function deleteBudget() {

  budgetStore.budgets = budgetStore.budgets.filter(
    item => item.id !== selectedBudget.value.id
  )

  console.log('DELETED')

  closeDeleteModal()
}

/* CLOSE */
function closeModal() {
  showModal.value = false
}

function closeDeleteModal() {
  showDeleteModal.value = false
}
</script>

<style scoped>
.container {
  padding: 24px;
  background: #f5f7fb;
  min-height: 100vh;
}

/* Top */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 20px;
}

.title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* Buttons */
.add-btn,
.save-btn,
.cancel-btn,
.delete-btn {
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.add-btn,
.save-btn {
  background: #1677ff;
  color: white;
}

.cancel-btn {
  background: #e5e7eb;
}

.delete-btn {
  background: #ff4d4f;
  color: white;
}

/* Form */
.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 12px;

  border: 1px solid #ddd;
  border-radius: 10px;

  outline: none;
}

.form-group input:focus {
  border-color: #1677ff;
}

/* Delete Modal */
.delete-body {
  text-align: center;
  padding: 10px;
}

.delete-icon {
  font-size: 50px;
  margin-bottom: 12px;
}

.delete-body h3 {
  margin-bottom: 10px;
}

.delete-body p {
  color: #666;
}
</style>