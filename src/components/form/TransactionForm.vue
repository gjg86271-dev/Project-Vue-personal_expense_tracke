<template>
  <div class=" mb-4" style="font-family: Kantumruy Pro;">
     <div class="d-flex justify-content-between mb-3"
          style="font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;">
          <div class="title">
            <h1 class="fw-bold">ប្រតិបត្តិការ</h1>
            <p class="text-secondary">គ្រប់គ្រងប្រតិបត្តិការហិរញ្ញវត្ថុរបស់អ្នកទាំងអស់</p>
          </div>
          <button class="btn btn-primary rounded-5" @click="openModal()"
            style="font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important; height: 50px; width: 180px ; font-size: 18px;"><i
            class="bi bi-plus"></i> បន្ថែមប្រតិបត្តិការ 
          </button>
        </div>
    <div class="row">
      <div class="col">
        <div class="card rounded-4 border-0 shadow"> 
          <p class="fs-5">ប្រតិបត្តិសរុប</p>
          <p class="h1">10</p>
        </div>
      </div>
      <div class="col">
        <div class="card rounded-4 border-0 shadow"> 
          <p class="fs-5">ប្រាក់ចំណូលសរុប</p>
          <p class="h1 text-success">$4000.00</p>
        </div>
      </div>
      <div class="col">
        <div class="card rounded-4 border-0 shadow"> 
          <p class="fs-5">ការចំណាយសរុប</p>
          <p class="h1 text-danger">$557.50</p>
        </div>
      </div>
    </div>
  </div>
  <div class=" mb-4"> 
    <div class="col rounded-4 border-0 shadow">
      <div class="card">
        <div class="box d-flex">
          <div class="d-flex mt-3">
            <i class="bi bi-funnel"></i>
            <p class="ms-2 fs-5">តម្រង</p>
          </div>
          <div class="btn btn-group  border-0">
            <select class="form-select btn-custom" aria-label="Default select example">
              <option selected>ប្រភេទ</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
          <div class="btn btn-group border-0">
            <select class="form-select btn-custom" aria-label="Default select example">
              <option selected>ប្រភេទទាំងអស់</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
          <div class="search-box mt-2 ms-6">
            <i class="bi bi-search"></i>
            <input type="search" placeholder="ស្វែងរកឈ្មោះអ្នកប្រើនឹង អុីម៉ែល">
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- TABLE -->
  <table class="table shadow rounded-6  border-start">
    
    <thead class="table-secondary">
      <tr class="text-center">
        <th>កាលបរិច្ឆេទ</th>
        <th>ការពិពណ៌នា</th>
        <th>ប្រភេទទូទៅ</th>
        <th>លក្ខណៈ</th>
        <th>ចំនួនទឹកប្រាក់</th>
        <th>សកម្មភាព</th>
      </tr>
    </thead>

    <tbody>

      <tr class="text-center"
        v-for="item in items"
        :key="item.id"
      >
        <td>
          {{ new Date(item.transactionDate).toLocaleDateString('en-GB') }}
        </td>

        <td>{{ item.notes }}</td>

        <td>{{ item.category?.name }}</td>

        <td>
          <span
            :class="
              item.category?.type === 'INCOME'
                ? 'text-success'
                : 'text-danger'
            "
          >
            {{ item.category?.type }}
          </span>
        </td>

        <td>${{ item.amount }}</td>

        <td>

          <!-- EDIT -->
          <button
            class="btn text-dark btn-sm"
            @click="openModal(item)"
          >
            <i class="bi bi-pencil-square"></i>
          </button>

          <!-- DELETE -->
          <button
            class="btn text-danger btn-sm"
            @click="openDeleteModal(item)"
          >
            <i class="bi bi-trash"></i>
          </button>

        </td>
      </tr>

      <!-- EMPTY -->
      <tr v-if="items.length === 0">
        <td
          colspan="7"
          class="text-center"
        >
          Loading...
        </td>
      </tr>

    </tbody>
  </table>
  <!-- EDIT MODAL -->
  <BaseModal
    v-if="showModal"
    :title="isEditing ? 'Edit Budget' : 'Add Budget'"
    @close-modal="closeModal"
  >

    <!-- BODY -->
    <template #body>

      <div class="form-group mb-3">
        <label>Category Name</label>

          <select class="form-select" v-model="form.categoryId">

  <option disabled value="">
    Select Category
  </option>

  <option
    v-for="category in categories"
    :key="category.id"
    :value="category.id"
  >
    {{ category.name }}
  </option>

</select>
      </div>

      <div class="form-group">
        <label>Budget Amount</label>

        <input
          v-model="form.amount"
          type="number"
          class="form-control"
          placeholder="Enter amount"
        />
      </div>
      <div class="form-group mt-3">
      <label>Notes</label>

      <input
        v-model="form.notes"
        type="text"
        class="form-control"
        placeholder="Enter notes"
      />
    </div>
    <div class="form-group mt-3">
    <label>Date</label>

    <input
      v-model="form.transactionDate"
      type="date"
      class="form-control"
    />
  </div>

    </template>

    <!-- FOOTER -->
    <template #footer>

      <button
        class="btn btn-secondary"
        @click="closeModal"
      >
        Cancel
      </button>

      <button
        class="btn btn-primary"
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

      <div class="text-center">

        <div class="fs-1 mb-3">
          🗑️
        </div>

        <h4 class="fw-bold">
          Delete Budget?
        </h4>

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
        class="btn btn-secondary"
        @click="closeDeleteModal"
      >
        Cancel
      </button>

      <button
        class="btn btn-danger"
        @click="deleteBudget()"
      >
        Delete
      </button>

    </template>

  </BaseModal>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import BaseModal from '../ui/base/BaseModal.vue'
import { useCategoryStore } from '@/stores/categoryStore'

const categoryStore = useCategoryStore();

onMounted(async()=>{
  await categoryStore.fetchAllCategories();
})

const categories = computed(() => {
  return categoryStore.categories
})

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits([
  'delete-transaction',
  'update-transaction',
  'create-transaction'
])


  // EDIT MODAL
const showModal = ref(false)
const isEditing = ref(false)
  // DELETE MODAL
const showDeleteModal = ref(false)
const selectedBudget = ref(null)
  // FORM
const form = reactive({
  categoryId: '',
  amount: '',
  transactionDate: '',
  notes: ''
})

  // OPEN EDIT MODAL
function openModal(item = null) {
  showModal.value = true

  if (item) {
    isEditing.value = true
    selectedBudget.value = item

    form.categoryId = item.category?.id || ''
    form.amount = item.amount || ''
    form.notes = item.notes || ''
    form.transactionDate = item.transactionDate?.split('T')[0] || ''
  } else {
    isEditing.value = false
    selectedBudget.value = null

    form.categoryId = ''
    form.amount = ''
    form.notes = ''
    form.transactionDate = ''
  }
}
// CLOSE EDIT MODAL
function closeModal() {
  showModal.value = false
}
//  SAVE
function saveBudget() {
  if (isEditing.value) {
    emit(
      'update-transaction',
      selectedBudget.value.id,
      form
    )
  } else {
    emit(
      'create-transaction',
      form
    )
  }
  closeModal()
}
  // OPEN DELETE MODAL
function openDeleteModal(budget) {
  selectedBudget.value = budget
  showDeleteModal.value = true
}

  // CLOSE DELETE MODAL
function closeDeleteModal() {
  showDeleteModal.value = false
}
  // DELETE
function deleteBudget() {
  // delete logic here
  emit(
    'delete-transaction',
    selectedBudget.value.id
  )

  closeDeleteModal()
}
</script>
<style scoped>
.rounded-6 {
  border-radius: 20px !important;
  overflow: hidden;
  border-collapse: separate;
}
.btn-custom{
  border-radius: 30px; 
}
.card{
  padding: 10px 15px;
}
.bi-funnel{
  font-size: 20px;
}
 .search-box{
  width: 500px;
  height: 45px;
  border: 2px solid #9ca3af;
  border-radius: 50px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background: #fff;
}
.search-box i{
  color: #6b7280;
  font-size: 18px;
  margin-right: 10px;
}
.search-box input{
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  background: transparent;
}
.ms-6{
  margin-left: 240px;
}
</style>