<template>
  <div class="container font">
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

    <BaseModal
      v-if="showModal"
      :title="isEditing ? 'កែសម្រួលថវិកា' : 'បន្ថែមថវិកា'"
      @close-modal="closeModal"
    >
      <template #body>
        <!-- ERROR -->

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

    <!-- TOAST -->

    <div v-if="toast.show" :class="['app-toast', toast.type]">
      {{ toast.message }}
    </div>
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

/* DATA */
const selectedBudget = ref(null);

const form = ref({
  id: null,
  categoryId: "",
  limitAmount: 0,
});

/* TOAST */
const toast = ref({
  show: false,
  message: "",
  type: "success",
});

function showToast(message, type = "success") {
  toast.value.show = false;

  setTimeout(() => {
    toast.value.message = message;
    toast.value.type = type;
    toast.value.show = true;

    setTimeout(() => {
      toast.value.show = false;
    }, 3000);
  }, 100);
}

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
  if (!form.value.categoryId) {
    showToast("សូមជ្រើសរើសប្រភេទ", "error");
    return;
  }

  if (!form.value.limitAmount || form.value.limitAmount <= 0) {
    showToast("សូមបញ្ចូលចំនួនថវិកា", "error");
    return;
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
      showToast("កែសម្រួលថវិកាជោគជ័យ", "success");
    } else {
      await budgetStore.createBudget(payload);
      showToast("បន្ថែមថវិកាជោគជ័យ", "success");
    }

    await budgetStore.fetchBudgets();

    setTimeout(() => {
      closeModal();
    }, 1000);
  } catch (error) {
    console.error(error);
    showToast("មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ", "error");
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
/* =========================================
   MODERN BUDGET DASHBOARD UI
========================================= */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top left, #eef2ff 0%, transparent 30%),
    radial-gradient(circle at bottom right, #ede9fe 0%, transparent 30%),
    linear-gradient(135deg, #f8fafc, #eef2ff);
  font-family: "Kantumruy Pro", sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* =========================================
   HEADER
========================================= */

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 34px;
  gap: 20px;
  flex-wrap: wrap;
}

.title {
  font-size: 38px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -1px;
  position: relative;
}

.title::after {
  content: "";
  width: 70px;
  height: 5px;
  border-radius: 999px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  position: absolute;
  left: 0;
  bottom: -10px;
}

/* =========================================
   ADD BUTTON
========================================= */

.add-btn {
  border: none;
  outline: none;
  padding: 15px 26px;
  border-radius: 18px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.35s;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 15px 35px rgba(99, 102, 241, 0.35),
    inset 0 1px 1px rgba(255,255,255,0.25);
}

.add-btn::before {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  top: -50px;
  right: -40px;
}

.add-btn:hover {
  transform: translateY(-3px) scale(1.02);
}

/* =========================================
   LOADING
========================================= */

.loading-box {
  background: white;
  padding: 20px;
  border-radius: 22px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 700;
  color: #6366f1;
  box-shadow: 0 10px 30px rgba(0,0,0,0.06);
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  from {
    opacity: 0.7;
  }

  to {
    opacity: 1;
  }
}

/* =========================================
   GRID
========================================= */

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 26px;
  margin-top: 28px;
}

/* =========================================
   FORM
========================================= */

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 700;
  color: #374151;
}

.form-group input,
.form-select {
  width: 100%;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 18px;
  padding: 16px;
  font-size: 15px;
  transition: 0.3s ease;
  font-family: "Kantumruy Pro", sans-serif;
  color: #111827;
}

.form-group input:focus,
.form-select:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow:
    0 0 0 5px rgba(99,102,241,0.12),
    0 10px 20px rgba(99,102,241,0.08);
  transform: translateY(-1px);
}

/* =========================================
   BUTTONS
========================================= */

.save-btn,
.cancel-btn,
.delete-btn {
  border: none;
  padding: 14px 24px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: 0.3s;
  min-width: 120px;
}

.save-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 10px 25px rgba(99,102,241,0.25);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(99,102,241,0.35);
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.delete-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 10px 25px rgba(239,68,68,0.25);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(239,68,68,0.35);
}

/* =========================================
   DELETE MODAL
========================================= */

.delete-body {
  text-align: center;
  padding: 14px 0;
}

.delete-icon {
  width: 95px;
  height: 95px;
  margin: auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 46px;
  margin-bottom: 20px;
  box-shadow: 0 10px 25px rgba(239,68,68,0.18);
}

.delete-body h3 {
  font-size: 28px;
  margin-bottom: 12px;
  color: #111827;
}

.delete-body p {
  color: #6b7280;
  line-height: 1.7;
  font-size: 15px;
}

.delete-body strong {
  color: #111827;
}

/* =========================================
   TOAST
========================================= */

.app-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 18px 24px;
  border-radius: 20px;
  color: white;
  font-weight: 700;
  z-index: 9999;
  animation: toastSlide 0.35s ease;
  min-width: 320px;
  backdrop-filter: blur(10px);
  box-shadow:
    0 15px 40px rgba(0,0,0,0.15),
    inset 0 1px 1px rgba(255,255,255,0.2);
}

.app-toast.success {
  background: linear-gradient(135deg, #10b981, #34d399);
}

.app-toast.error {
  background: linear-gradient(135deg, #ef4444, #f87171);
}

@keyframes toastSlide {
  from {
    opacity: 0;
    transform: translateX(120px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* =========================================
   MODAL ANIMATION
========================================= */

.modal-enter-active,
.modal-leave-active {
  transition: 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 992px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .top-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .title {
    font-size: 30px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .app-toast {
    left: 20px;
    right: 20px;
    min-width: auto;
  }

  .save-btn,
  .cancel-btn,
  .delete-btn {
    width: 100%;
  }
}
</style>
