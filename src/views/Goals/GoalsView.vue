<template>
  <div class="dashboard">
    <div class="header">
      <div>
        <h1  class=" fonts">គោលដៅសន្សំ</h1>
        <p class="fonts">តាមដាន និងគ្រប់គ្រងគោលដៅសន្សំប្រាក់របស់អ្នក</p>
      </div>

      <button class="add-btn fonts" @click="showModal = true">
        បន្ថែមគោលដៅថ្មី
        <span>+</span>
      </button>
    </div>

    <!-- ADD MODAL -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h2 class="fonts">បន្ថែមគោលដៅថ្មី</h2>
          <span class="close-btn" @click="closeModal">✕</span>
        </div>

        <form @submit.prevent="createGoal">
          <!-- ERROR -->
          <div v-if="createError" class="error-box">
            {{ createError }}
          </div>

          <!-- SUCCESS -->
          <div v-if="createSuccess" class="success-box">
            {{ createSuccess }}
          </div>

          <div class="form-group">
            <label class="fonts">ឈ្មោះគោលដៅ</label>
            <input type="text" v-model="form.name" placeholder="ឧ. ទិញម៉ូតូ" />
          </div>

          <div class="form-group">
            <label class="fonts">ចំនួនទឹកប្រាក់គោលដៅ ($)</label>
            <input
              type="number"
              v-model="form.targetAmount"
              placeholder="0.00"
            />
          </div>

          <div class="form-group">
            <label class="fonts">កាលបរិច្ឆេទកំណត់</label>
            <input type="date" v-model="form.deadline" />
          </div>

          <button type="submit" class="submit-btn fonts">រក្សាទុកគោលដៅ</button>
        </form>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h2 class="fonts">កែសម្រួលគោលដៅ</h2>
          <span class="close-btn" @click="closeEditModal">✕</span>
        </div>

        <form @submit.prevent="updateGoal">
          <!-- ERROR -->
          <div v-if="editError" class="error-box">
            {{ editError }}
          </div>

          <!-- SUCCESS -->
          <div v-if="editSuccess" class="success-box">
            {{ editSuccess }}
          </div>

          <div class="form-group">
            <label class="fonts">ឈ្មោះគោលដៅ</label>
            <input type="text" v-model="editForm.name" />
          </div>

          <div class="form-group">
            <label class="fonts">ចំនួនទឹកប្រាក់គោលដៅ ($)</label>
            <input type="number" v-model="editForm.targetAmount" />
          </div>

          <div class="form-group">
            <label class="fonts">កាលបរិច្ឆេទកំណត់</label>
            <input type="date" v-model="editForm.deadline" />
          </div>

          <button type="submit" class="submit-btn fonts">
            ធ្វើបច្ចុប្បន្នភាព
          </button>
        </form>
      </div>
    </div>

    <!-- PROGRESS MODAL -->
    <div v-if="showProgressModal" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h2 class="fonts">បន្ថែមប្រាក់សន្សំ</h2>
          <span class="close-btn" @click="closeProgressModal">✕</span>
        </div>

        <form @submit.prevent="submitGoalProgress">
          <!-- ERROR -->
          <div v-if="progressError" class="error-box">
            {{ progressError }}
          </div>

          <!-- SUCCESS -->
          <div v-if="progressSuccess" class="success-box">
            {{ progressSuccess }}
          </div>

          <div class="form-group">
            <label class="fonts"> ចំនួនទឹកប្រាក់ដែលត្រូវបន្ថែម ($) </label>

            <input type="number" v-model="progressAmount" placeholder="0.00" />
          </div>

          <button type="submit" class="submit-btn fonts">
            រក្សាទុកការសន្សំ
          </button>
        </form>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-grid">
      <div class="stat-card">
        <h4 class="fonts">គោលដៅសរុប</h4>
        <h2 class="fonts">{{ goals.length }}</h2>
      </div>

      <div class="stat-card">
        <h4 class="fonts">ប្រាក់សន្សំសរុប</h4>
        <h2 class="fonts">${{ totalSaved.toLocaleString() }}</h2>
      </div>

      <div class="stat-card">
        <h4 class="fonts">ទឹកប្រាក់នៅសល់</h4>
        <h2 class="fonts">${{ totalRemaining.toLocaleString() }}</h2>
      </div>
    </div>

    <!-- GOALS -->
    <div class="goal-card" v-for="goal in goals" :key="goal.id">
      <div class="goal-top">
        <div>
          <div class="title-row">
            <h3 class="fonts">{{ goal.name }}</h3>

            <span class="status">{{ goal.progress }}%</span>
          </div>

          <p class="fonts">ថ្ងៃកំណត់: {{ formatDate(goal.deadline) }}</p>
        </div>

        <div class="actions">
          <span @click="openEditModal(goal)">
            <i class="bi bi-pencil-square"></i>
          </span>

          <span @click="removeGoal(goal.id)" style="color: red">
            <i class="bi bi-trash3"></i>
          </span>
        </div>
      </div>

      <div class="progress-section">
        <div class="progress-label">
          <span class="fonts"> សម្រេចបាន {{ goal.progress }}% </span>
        </div>

        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{
              width: goal.progress + '%',
              background: goal.color,
            }"
          ></div>
        </div>
      </div>

      <div class="goal-bottom">
        <div>
          <h2 class="fonts">${{ goal.saved.toLocaleString() }}</h2>
          <p class="fonts">បានសន្សំ</p>
        </div>

        <div class="remaining">
          <h2 class="fonts">${{ goal.remaining.toLocaleString() }}</h2>
          <p class="fonts">នៅសល់</p>
        </div>
      </div>

      <button class="save-btn fonts" @click="openProgressModal(goal)">
        <i class="bi bi-plus-circle"></i>
        បន្ថែមប្រាក់សន្សំ
      </button>
    </div>
    <!-- VALIDATION MODAL -->
    <div v-if="showMessageModal" class="message-modal-overlay">
      <div class="message-modal-box">
        <!-- ICON -->
        <div class="message-icon" :class="messageType">
          <i
            v-if="messageType === 'success'"
            class="bi bi-check-circle-fill"
          ></i>

          <i v-if="messageType === 'error'" class="bi bi-x-circle-fill"></i>
        </div>

        <!-- MESSAGE -->
        <h2 class="fonts message-title">
          {{ messageTitle }}
        </h2>

        <p class="fonts message-text">
          {{ messageText }}
        </p>

        <!-- BUTTON -->
        <button class="message-btn fonts" @click="closeMessageModal">
          យល់ព្រម
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useGoalsStore } from "@/stores/goalStore";

const goalStore = useGoalsStore();
const showModal = ref(false);
const showEditModal = ref(false);
const showProgressModal = ref(false);

const form = ref({
  name: "",
  targetAmount: "",
  deadline: "",
});

const editForm = ref({
  id: "",
  name: "",
  targetAmount: "",
  deadline: "",
});

const selectedGoalId = ref("");
const progressAmount = ref("");

/* VALIDATION MESSAGE */
const createError = ref("");
const createSuccess = ref("");

const editError = ref("");
const editSuccess = ref("");

const progressError = ref("");
const progressSuccess = ref("");

onMounted(async () => {
  await goalStore.fetchAllGoals();
});

/* MESSAGE MODAL */
const showMessageModal = ref(false);

const messageTitle = ref("");

const messageText = ref("");

const messageType = ref("success");

function openMessageModal(title, text, type = "success") {
  showMessageModal.value = true;

  messageTitle.value = title;

  messageText.value = text;

  messageType.value = type;
}

function closeMessageModal() {
  showMessageModal.value = false;
}

const goals = computed(() => {
  return goalStore.goals.map((goal) => {
    const saved = goal.currentAmount || 0;

    const target = goal.targetAmount || 0;

    const progress =
      target > 0 ? Math.min(Math.round((saved / target) * 100), 100) : 0;

    return {
      ...goal,
      saved,
      remaining: target - saved,
      progress,
      color:
        progress >= 70 ? "#16a34a" : progress >= 30 ? "#ff7a00" : "#ef4444",
    };
  });
});

const totalSaved = computed(() => {
  return goals.value.reduce((total, goal) => total + goal.saved, 0);
});

const totalRemaining = computed(() => {
  return goals.value.reduce((total, goal) => total + goal.remaining, 0);
});

/* CREATE */
async function createGoal() {
  if (!form.value.name.trim()) {
    openMessageModal(
      "កំហុសក្នុងការផ្ទៀងផ្ទាត់",
      "សូមបញ្ចូលឈ្មោះគោលដៅ",
      "error",
    );
    return;
  }

  if (!form.value.targetAmount || form.value.targetAmount <= 0) {
    openMessageModal(
      "កំហុសក្នុងការផ្ទៀងផ្ទាត់",
      "សូមបញ្ចូលចំនួនទឹកប្រាក់ត្រឹមត្រូវ",
      "error",
    );
    return;
  }

  if (!form.value.deadline) {
    openMessageModal(
      "កំហុសក្នុងការផ្ទៀងផ្ទាត់",
      "សូមជ្រើសរើសកាលបរិច្ឆេទ",
      "error",
    );
    return;
  }

  try {
    const payload = {
      name: form.value.name,
      targetAmount: Number(form.value.targetAmount),
      deadline: form.value.deadline,
    };

    await goalStore.createGoal(payload);

    await goalStore.fetchAllGoals();

    openMessageModal("ជោគជ័យ", "បង្កើតគោលដៅជោគជ័យ", "success");

    closeModal();
  } catch (error) {
    openMessageModal("បរាជ័យ", "បង្កើតគោលដៅបរាជ័យ", "error");
  }
}

/* EDIT */
function openEditModal(goal) {
  showEditModal.value = true;

  editForm.value = {
    id: goal.id,
    name: goal.name,
    targetAmount: goal.targetAmount,
    deadline: goal.deadline?.split("T")[0],
  };
}

async function updateGoal() {
  if (!editForm.value.name.trim()) {
    openMessageModal("Validation Error", "សូមបញ្ចូលឈ្មោះគោលដៅ", "error");
    return;
  }

  if (!editForm.value.targetAmount || editForm.value.targetAmount <= 0) {
    openMessageModal(
      "Validation Error",
      "សូមបញ្ចូលចំនួនទឹកប្រាក់ត្រឹមត្រូវ",
      "error",
    );
    return;
  }

  if (!editForm.value.deadline) {
    openMessageModal("Validation Error", "សូមជ្រើសរើសកាលបរិច្ឆេទ", "error");
    return;
  }

  try {
    const payload = {
      name: editForm.value.name,
      targetAmount: Number(editForm.value.targetAmount),
      deadline: editForm.value.deadline,
    };

    await goalStore.updateGoal(editForm.value.id, payload);

    await goalStore.fetchAllGoals();

    openMessageModal("ជោគជ័យ", "កែសម្រួលជោគជ័យ", "success");

    closeEditModal();
  } catch (error) {
    openMessageModal("បរាជ័យ", "កែសម្រួលបរាជ័យ", "error");
  }
}

/* DELETE */
async function removeGoal(id) {
  await goalStore.deleteGoal(id);

  await goalStore.fetchAllGoals();
}

/* PROGRESS */
function openProgressModal(goal) {
  selectedGoalId.value = goal.id;

  progressAmount.value = "";

  showProgressModal.value = true;
}

function closeProgressModal() {
  showProgressModal.value = false;

  progressAmount.value = "";

  selectedGoalId.value = "";
}

async function submitGoalProgress() {
  if (!progressAmount.value || progressAmount.value <= 0) {
    openMessageModal(
      "កំហុសក្នុងការផ្ទៀងផ្ទាត់",
      "សូមបញ្ចូលចំនួនទឹកប្រាក់ត្រឹមត្រូវ",
      "error",
    );

    return;
  }

  try {
    await goalStore.addGoalProgress(selectedGoalId.value, progressAmount.value);

    await goalStore.fetchAllGoals();

    openMessageModal("ជោគជ័យ", "បន្ថែមប្រាក់សន្សំជោគជ័យ", "success");

    closeProgressModal();
  } catch (error) {
    openMessageModal("បរាជ័យ", "បន្ថែមប្រាក់សន្សំបរាជ័យ", "error");
  }
}

/* CLOSE */
function closeModal() {
  showModal.value = false;

  form.value = {
    name: "",
    targetAmount: "",
    deadline: "",
  };

  createError.value = "";
  createSuccess.value = "";
}

function closeEditModal() {
  showEditModal.value = false;

  editForm.value = {
    id: "",
    name: "",
    targetAmount: "",
    deadline: "",
  };

  editError.value = "";
  editSuccess.value = "";
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}
</script>

<style scoped>
/* =========================
   GLOBAL
========================= */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard {
  min-height: 100vh;
  padding: 32px;
  background: #f6f8fc; /* clean finance app background */
  font-family: "Kantumruy Pro", sans-serif;
}

/* =========================
   HEADER
========================= */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
  flex-wrap: wrap;
}

.header h1 {
  font-size: 34px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
}

.header p {
  color: #6b7280;
  font-size: 15px;
}

.add-btn {
  border: none;
  outline: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 14px 22px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: 0.3s;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
}

.add-btn span {
  font-size: 22px;
  font-weight: bold;
}

.add-btn:hover {
  transform: translateY(-2px);
  opacity: 0.95;
} 

/* =========================
   STATS
========================= */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 22px;
  padding: 22px;
  border: 1px solid #eef2f7;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  transition: 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card h4 {
  color: #6b7280;
  font-size: 14px;
}

.stat-card h2 {
  font-size: 30px;
  font-weight: 800;
  color: #111827;
}

/* =========================
   GOAL CARD
========================= */
.goal-card {
  background: white;
  border-radius: 28px;
  padding: 24px;
  margin-bottom: 22px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
  border: 1px solid #f3f4f6;
}

.goal-card:hover {
  transform: translateY(-4px);
}

.goal-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 20px;
  margin-bottom: 24px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.title-row h3 {
  font-size: 24px;
  color: #111827;
  font-weight: 700;
}

.goal-top p {
  color: #6b7280;
  font-size: 14px;
}

/* STATUS */
.status {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* ACTIONS */
.actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.actions span {
  width: 42px;
  height: 42px;
  background: #f9fafb;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
  font-size: 18px;
  color: #374151;
}

.actions span:hover {
  background: #eef2ff;
  color: #4f46e5;
  transform: scale(1.08);
}

/* =========================
   PROGRESS
========================= */
.progress-section {
  margin-bottom: 24px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #374151;
  font-size: 14px;
}

.progress-bar {
  width: 100%;
  height: 14px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s ease;
}

/* =========================
   GOAL BOTTOM
========================= */
.goal-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  flex-wrap: wrap;
  gap: 20px;
}

.goal-bottom h2 {
  font-size: 30px;
  color: #111827;
  margin-bottom: 5px;
}

.goal-bottom p {
  color: #6b7280;
  font-size: 14px;
}

.remaining h2 {
  color: #ef4444;
}

/* =========================
   SAVE BUTTON
========================= */
.save-btn {
  width: 100%;
  border: none;
  outline: none;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  padding: 16px;
  border-radius: 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.save-btn:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}

/* =========================
   MODAL
========================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
}

.modal-box {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 30px;
  padding: 28px;
  animation: modalPop 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

@keyframes modalPop {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 26px;
}

.modal-header h2 {
  font-size: 24px;
  color: #111827;
}

.close-btn {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
  font-size: 18px;
}

.close-btn:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* =========================
   FORM
========================= */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #374151;
  font-size: 15px;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 16px;
  padding: 14px 16px;
  font-size: 15px;
  transition: 0.3s;
}

.form-group input:focus {
  border-color: #6366f1;
  background: white;
  outline: none;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.submit-btn {
  width: 100%;
  border: none;
  background: linear-gradient(135deg, #6366f1, #7c3aed);
  color: white;
  padding: 16px;
  border-radius: 18px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  transition: 0.3s;
  margin-top: 10px;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

/* =========================
   SUCCESS & ERROR
========================= */
.error-box,
.success-box {
  padding: 14px 16px;
  border-radius: 14px;
  margin-bottom: 18px;
  font-size: 14px;
  font-weight: 600;
}

.error-box {
  background: #fee2e2;
  color: #dc2626;
}

.success-box {
  background: #dcfce7;
  color: #16a34a;
}

/* =========================
   MESSAGE MODAL
========================= */
.message-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.message-modal-box {
  width: 100%;
  max-width: 380px;
  background: white;
  border-radius: 30px;
  padding: 32px 24px;
  text-align: center;
  animation: modalPop 0.3s ease;
}

.message-icon {
  width: 90px;
  height: 90px;
  margin: auto;
  border-radius: 50%;
  font-size: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.message-icon.success {
  background: #dcfce7;
  color: #16a34a;
}

.message-icon.error {
  background: #fee2e2;
  color: #dc2626;
}

.message-title {
  font-size: 26px;
  margin-bottom: 10px;
  color: #111827;
}

.message-text {
  color: #6b7280;
  font-size: 15px;
  margin-bottom: 24px;
  line-height: 1.6;
}

.message-btn {
  border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 14px 26px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  transition: 0.3s;
}

.message-btn:hover {
  transform: translateY(-2px);
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 768px) {
  .dashboard {
    padding: 20px;
  }

  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .goal-top {
    flex-direction: column;
  }

  .goal-bottom {
    flex-direction: column;
    align-items: start;
  }

  .header h1 {
    font-size: 28px;
  }

  .goal-bottom h2 {
    font-size: 24px;
  }
}
</style>
