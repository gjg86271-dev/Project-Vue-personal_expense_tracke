<template>
  <div class="dashboard bg-transparent">
    <!-- HEADER -->

      <div class="header-card">
        <div>
          <h1>គោលដៅសន្សំ</h1>
          <p>តាមដាន និងគ្រប់គ្រងគោលដៅសន្សំប្រាក់របស់អ្នក</p>
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
          <div class="form-group">
            <label class="fonts">ឈ្មោះគោលដៅ</label>

            <input type="text" v-model="form.name" placeholder="ឧ. ទិញម៉ូតូ" />
          </div>

          <div class="form-group">
            <label class="fonts">ចំនួនទឹកប្រាក់គោលដៅ ($)</label>

            <input type="number" v-model="form.targetAmount" placeholder="0.00" />
          </div>

          <div class="form-group">
            <label class="fonts">កាលបរិច្ឆេទកំណត់</label>

            <input type="date" v-model="form.deadline" />
          </div>

          <button type="submit" class="submit-btn fonts">
            រក្សាទុកគោលដៅ
          </button>
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
          <div class="form-group">
            <label class="fonts">
              ចំនួនទឹកប្រាក់ដែលត្រូវបន្ថែម ($)
            </label>

            <input type="number" v-model="progressAmount" placeholder="0.00" />
          </div>

          <button type="submit" class="submit-btn fonts">
            រក្សាទុកការសន្សំ
          </button>
        </form>
      </div>
    </div>

    <!-- DELETE MODAL -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="delete-modal-box">
        <div class="delete-icon">
          <i class="bi bi-trash3-fill"></i>
        </div>

        <h2 class="fonts delete-title">
          លុបគោលដៅ?
        </h2>

        <p class="fonts delete-text">
          តើអ្នកពិតជាចង់លុបគោលដៅនេះមែនទេ?
          ទិន្នន័យនឹងមិនអាចត្រឡប់វិញបានទេ។
        </p>

        <div class="delete-actions">
          <button class="cancel-btn fonts" @click="closeDeleteModal">
            បោះបង់
          </button>

          <button class="delete-btn fonts" @click="removeGoal">
            លុប
          </button>
        </div>
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

            <span class="status">
              {{ goal.progress }}%
            </span>
          </div>

          <p class="fonts">
            ថ្ងៃកំណត់:
            {{ formatDate(goal.deadline) }}
          </p>
        </div>

        <div class="actions">
          <span @click="openEditModal(goal)">
            <i class="bi bi-pencil-square"></i>
          </span>

          <span @click="openDeleteModal(goal.id)" class="delete-action">
            <i class="bi bi-trash3"></i>
          </span>
        </div>
      </div>

      <!-- PROGRESS -->
      <div class="progress-section">
        <div class="progress-label">
          <span class="fonts">
            សម្រេចបាន {{ goal.progress }}%
          </span>
        </div>

        <div class="progress-bar">
          <div class="progress-fill" :style="{
            width: goal.progress + '%',
            background: goal.color,
          }"></div>
        </div>
      </div>

      <!-- BOTTOM -->
      <div class="goal-bottom">
        <div>
          <h2 class="fonts">
            ${{ goal.saved.toLocaleString() }}
          </h2>

          <p class="fonts">បានសន្សំ</p>
        </div>

        <div class="remaining">
          <h2 class="fonts">
            ${{ goal.remaining.toLocaleString() }}
          </h2>

          <p class="fonts">នៅសល់</p>
        </div>
      </div>

      <!-- SAVE BTN -->
      <button class="save-btn fonts" @click="openProgressModal(goal)">
        <i class="bi bi-plus-circle"></i>

        បន្ថែមប្រាក់សន្សំ
      </button>
    </div>

    <!-- MESSAGE MODAL -->
    <div v-if="showMessageModal" class="message-modal-overlay">
      <div class="message-modal-box">
        <div class="message-icon" :class="messageType">
          <i v-if="messageType === 'success'" class="bi bi-check-circle-fill"></i>

          <i v-if="messageType === 'error'" class="bi bi-x-circle-fill"></i>
        </div>

        <h2 class="fonts message-title">
          {{ messageTitle }}
        </h2>

        <p class="fonts message-text">
          {{ messageText }}
        </p>

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

const showDeleteModal = ref(false);

const deleteGoalId = ref(null);

const showMessageModal = ref(false);

const messageTitle = ref("");

const messageText = ref("");

const messageType = ref("success");

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

onMounted(async () => {
  await goalStore.fetchAllGoals();
});

/* MESSAGE MODAL */
function openMessageModal(title, text, type = "success") {
  showMessageModal.value = true;

  messageTitle.value = title;

  messageText.value = text;

  messageType.value = type;
}

function closeMessageModal() {
  showMessageModal.value = false;
}

/* COMPUTED */
const goals = computed(() => {
  return goalStore.goals.map((goal) => {
    const saved = goal.currentAmount || 0;

    const target = goal.targetAmount || 0;

    const progress =
      target > 0
        ? Math.min(Math.round((saved / target) * 100), 100)
        : 0;

    return {
      ...goal,
      saved,
      remaining: target - saved,
      progress,
      color:
        progress >= 70
          ? "#16a34a"
          : progress >= 30
            ? "#ff7a00"
            : "#ef4444",
    };
  });
});

const totalSaved = computed(() => {
  return goals.value.reduce((total, goal) => total + goal.saved, 0);
});

const totalRemaining = computed(() => {
  return goals.value.reduce(
    (total, goal) => total + goal.remaining,
    0
  );
});

/* CREATE */
async function createGoal() {
  if (!form.value.name.trim()) {
    openMessageModal(
      "កំហុស",
      "សូមបញ្ចូលឈ្មោះគោលដៅ",
      "error"
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

    openMessageModal(
      "ជោគជ័យ",
      "បង្កើតគោលដៅជោគជ័យ",
      "success"
    );

    closeModal();
  } catch (error) {
    openMessageModal(
      "បរាជ័យ",
      "បង្កើតគោលដៅបរាជ័យ",
      "error"
    );
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
  try {
    const payload = {
      name: editForm.value.name,
      targetAmount: Number(editForm.value.targetAmount),
      deadline: editForm.value.deadline,
    };

    await goalStore.updateGoal(editForm.value.id, payload);

    await goalStore.fetchAllGoals();

    openMessageModal(
      "ជោគជ័យ",
      "កែសម្រួលជោគជ័យ",
      "success"
    );

    closeEditModal();
  } catch (error) {
    openMessageModal(
      "បរាជ័យ",
      "កែសម្រួលបរាជ័យ",
      "error"
    );
  }
}

/* DELETE */
function openDeleteModal(id) {
  deleteGoalId.value = id;

  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;

  deleteGoalId.value = null;
}

async function removeGoal() {
  try {
    await goalStore.deleteGoal(deleteGoalId.value);

    await goalStore.fetchAllGoals();

    openMessageModal(
      "ជោគជ័យ",
      "លុបគោលដៅជោគជ័យ",
      "success"
    );

    closeDeleteModal();
  } catch (error) {
    openMessageModal(
      "បរាជ័យ",
      "លុបគោលដៅបរាជ័យ",
      "error"
    );
  }
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
  try {
    await goalStore.addGoalProgress(
      selectedGoalId.value,
      progressAmount.value
    );

    await goalStore.fetchAllGoals();

    openMessageModal(
      "ជោគជ័យ",
      "បន្ថែមប្រាក់សន្សំជោគជ័យ",
      "success"
    );

    closeProgressModal();
  } catch (error) {
    openMessageModal(
      "បរាជ័យ",
      "បន្ថែមប្រាក់សន្សំបរាជ័យ",
      "error"
    );
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
}

function closeEditModal() {
  showEditModal.value = false;

  editForm.value = {
    id: "",
    name: "",
    targetAmount: "",
    deadline: "",
  };
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* HEADER CARD */
.header-card {
  background: var(--bg-sidebar);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
}

.header-card h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 2px 0;
  color: var(--text-white);
}

.header-card p {
  font-size: 12px;
  margin: 0;
  color: var(--text-secondary);
}

/* BUTTON */
.add-btn {
  height: 46px;
  padding: 0 20px;
  font-size: 15px;
  white-space: nowrap;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif !important;
  background: rgba(255, 255, 255, 0.15);
  color: var(--text-white);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition);
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* DASHBOARD */
.dashboard {
  font-family: "Kantumruy Pro", sans-serif;
}

/* HEADER */
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
  color: var(--text-primary);
}

.header p {
  color: var(--text-secondary);
  margin-top: 8px;
}

/* STATS */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: var(--bg-card);
  padding: 24px;
  border-radius: 24px;
  box-shadow: var(--shadow);
}

.stat-card h4 {
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.stat-card h2 {
  font-size: 32px;
  color: var(--text-primary);
}

/* GOAL CARD */
.goal-card {
  background: var(--bg-card);
  padding: 24px;
  border-radius: 28px;
  margin-bottom: 24px;
  box-shadow: var(--shadow);
}

.goal-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-row h3 {
  font-size: 24px;
  color: var(--text-primary);
}

.status {
  background: var(--color-success);
  color: var(--text-white);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

/* ACTIONS */
.actions {
  display: flex;
  gap: 12px;
}

.actions span {
  width: 42px;
  height: 42px;
  background: var(--bg-input);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
  color: var(--text-primary);
}

.actions span:hover {
  transform: scale(1.08);
}

.delete-action {
  color: var(--color-danger);
}

/* PROGRESS */
.progress-section {
  margin-bottom: 24px;
}

.progress-label {
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  height: 14px;
  background: var(--border-color);
  border-radius: 999px;
  overflow: hidden;
}

/* BOTTOM */
.goal-bottom {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.goal-bottom h2 {
  font-size: 30px;
  color: var(--text-primary);
}

.remaining h2 {
  color: var(--color-danger);
}

/* SAVE BTN */
.save-btn {
  width: 100%;
  border: none;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-hover)
  );
  color: var(--text-white);
  padding: 16px;
  border-radius: 18px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.3s;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
}

.modal-box {
  width: 100%;
  max-width: 500px;
  background: var(--bg-card);
  border-radius: 30px;
  padding: 28px;
  animation: modalPop 0.3s ease;
  color: var(--text-primary);
}

@keyframes modalPop {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.close-btn {
  width: 40px;
  height: 40px;
  background: var(--bg-input);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* FORM */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.form-group input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-input);
  color: var(--text-primary);
}

.submit-btn {
  width: 100%;
  border: none;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-hover)
  );
  color: var(--text-white);
  padding: 16px;
  border-radius: 18px;
  cursor: pointer;
  font-weight: 700;
}

/* DELETE MODAL */
.delete-modal-box {
  width: 100%;
  max-width: 420px;
  background: var(--bg-card);
  border-radius: 30px;
  padding: 34px 28px;
  text-align: center;
  animation: modalPop 0.3s ease;
}

.delete-icon {
  width: 90px;
  height: 90px;
  margin: auto;
  background: var(--color-danger-light);
  color: var(--color-danger);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  margin-bottom: 20px;
}

.delete-title {
  font-size: 28px;
  margin-bottom: 12px;
  color: var(--text-primary);
}

.delete-text {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 28px;
}

.delete-actions {
  display: flex;
  gap: 14px;
}

.cancel-btn,
.delete-btn {
  flex: 1;
  border: none;
  padding: 15px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
}

.cancel-btn {
  background: var(--bg-input);
  color: var(--text-primary);
}

.delete-btn {
  background: linear-gradient(
    135deg,
    var(--color-danger),
    #dc2626
  );
  color: var(--text-white);
}

/* MESSAGE MODAL */
.message-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.message-modal-box {
  width: 100%;
  max-width: 380px;
  background: var(--bg-card);
  border-radius: 30px;
  padding: 30px 24px;
  text-align: center;
  color: var(--text-primary);
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
  margin-bottom: 20px;
}

.message-icon.success {
  background: var(--color-success-light);
  color: var(--color-success);
}

.message-icon.error {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.message-title {
  font-size: 26px;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.message-text {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.message-btn {
  border: none;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-hover)
  );
  color: var(--text-white);
  padding: 14px 26px;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .dashboard {
    padding: 20px;
  }

  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .goal-top,
  .goal-bottom {
    flex-direction: column;
    gap: 18px;
  }
}

/* FORCE GLOBAL TEXT COLOR */
.dashboard {
  color: var(--text-primary);
}

/* MAKE ALL TEXT INHERIT */
.dashboard p,
.dashboard span,
.dashboard h1,
.dashboard h2,
.dashboard h3,
.dashboard h4,
.dashboard label {
  color: inherit;
}
</style>