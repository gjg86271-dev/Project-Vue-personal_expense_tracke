<template>
  <div class="container"   style="font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;">
    <!-- Header -->
    <div class="top-bar">
      <h2 class="title">ថវិការបស់ខ្ញុំ</h2>
     
      <button class="add-btn" @click="openAddModal">បន្ថែមគម្រោងថវិកា</button>
    </div>

    <!-- Loading -->
    <div v-if="budgetStore.loading">កំពុងដំណើរការ...</div>

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
      :title="isEditing ? 'កែសម្រួលថវិកា' : 'បន្ថែមថវិកា'"
      @close-modal="closeModal"
    >
      <template #body>
        <!-- ERROR -->
        <div v-if="errorMessage" class="error-box">
          {{ errorMessage }}
        </div>

        <!-- SUCCESS -->
        <div v-if="successMessage" class="success-box">
          {{ successMessage }}
        </div>
        <!-- CATEGORY -->
        <div class="form-group">
          <label>ឈ្មោះប្រភេទ</label>

          <select class="form-select" v-model="form.categoryId">
            <option disabled value="">ជ្រើសរើសប្រភេទ</option>

            <option
              v-for="category in expenseCategories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- AMOUNT -->
        <div class="form-group">
          <label>បរិមាណថវិកា</label>

          <input
            v-model="form.limitAmount"
            type="number"
            placeholder="Enter amount"
          />
        </div>
      </template>

      <template #footer>
        <button class="cancel-btn" @click="closeModal">បោះបង់</button>
        <button class="save-btn" @click="saveBudget">
          {{ isEditing ? "Update" : "Save" }}
        </button>
      </template>
    </BaseModal>

    <!-- DELETE MODAL -->
    <BaseModal
      v-if="showDeleteModal"
      title="Delete Budget"
      @close-modal="closeDeleteModal"
    >
      <template #body>
        <div class="delete-body">
          <div class="delete-icon">🗑️</div>

          <h3>លុបថវិកា?</h3>

          <p>
            តើអ្នកប្រាកដថាចង់លុប
            <strong>
              {{ selectedBudget?.category?.name }}
            </strong>
            ?
          </p>
        </div>
      </template>

      <template #footer>
        <button class="cancel-btn" @click="closeDeleteModal">បោះបង់</button>
        <button class="delete-btn" @click="deleteBudget">លុប</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useBudgetStore } from "@/stores/budgetStore";
import { useCategoryStore } from "@/stores/categoryStore";

import BaseCard from "@/components/ui/base/BudgetCard.vue";
import CardOverView from "@/components/ui/base/OverViewCard.vue";
import BaseModal from "@/components/ui/base/BaseModal.vue";
import { useTransactionStore } from "@/stores/transactionStore";

/* STORES */
const budgetStore = useBudgetStore();
const categoryStore = useCategoryStore();
const transactionStore = useTransactionStore();
/* MODALS */
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
/* DATA */
const selectedBudget = ref(null);

const form = ref({
  id: null,
  categoryId: "",
  limitAmount: 0,
});

/* FETCH */
onMounted(async () => {
  await budgetStore.fetchBudgets();
  await budgetStore.fetchCategoryBreakdown();
  await categoryStore.fetchAllCategories();
  await transactionStore.fetchTransactions();
});

const expenseCategories = computed(() => {
  return categoryStore.categories.filter((c) => c.type === "EXPENSE");
});

/* ADD */
function openAddModal() {
  isEditing.value = false;

  form.value = {
    id: null,
    categoryId: "",
    limitAmount: 0,
  };

  showModal.value = true;
}

/* EDIT */
function openEditModal(budget) {
  isEditing.value = true;

  form.value = {
    id: budget.id,
    categoryId: budget.category?.id,
    limitAmount: budget.limitAmount,
  };

  showModal.value = true;
}

/* DELETE OPEN MODAL (FIXED) */
function openDeleteModal(budget) {
  selectedBudget.value = budget;
  showDeleteModal.value = true;
}

/* DELETE */
async function deleteBudget() {
  if (!selectedBudget.value) return;

  await budgetStore.deleteBudget(selectedBudget.value.id);
  await budgetStore.fetchBudgets();

  closeDeleteModal();
}

/* SAVE */
async function saveBudget() {
  errorMessage.value = "";
  successMessage.value = "";

  // VALIDATION ONLY FOR ADD
  if (!isEditing.value) {

    if (!form.value.categoryId) {
      errorMessage.value = "សូមជ្រើសរើសប្រភេទ";
      return;
    }

    if (!form.value.limitAmount || form.value.limitAmount <= 0) {
      errorMessage.value = "សូមបញ្ចូលចំនួនថវិកា";
      return;
    }
  }

  const payload = {
    categoryId: form.value.categoryId,
    limitAmount: Number(form.value.limitAmount),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };

  try {
    if (isEditing.value) {
      await budgetStore.updateBudget(form.value.id, payload);
      successMessage.value = "កែសម្រួលថវិកាជោគជ័យ";
    } else {
      await budgetStore.createBudget(payload);
      successMessage.value = "បន្ថែមថវិកាជោគជ័យ";
    }

    await budgetStore.fetchBudgets();

    setTimeout(() => {
      closeModal();
      successMessage.value = "";
    }, 1000);

  } catch (error) {
    console.error(error);
    errorMessage.value = "មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ";
  }
}
/* CLOSE */
function closeModal() {
  showModal.value = false;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  selectedBudget.value = null;
}
</script>

<style scoped>
.container {
  padding: 24px;
  background: #f5f7fb;
  min-height: 100vh;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 28px;
  font-weight: 700;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* buttons */
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

/* form */
.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.form-group input,
.form-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

/* delete */
.delete-body {
  text-align: center;
}

.delete-icon {
  font-size: 50px;
  margin-bottom: 10px;
}
/* messages */
.error-box {
  background: #ffeaea;
  color: #d90429;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-weight: 600;
}

.success-box {
  background: #e8fff1;
  color: #15803d;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-weight: 600;
}
</style>
