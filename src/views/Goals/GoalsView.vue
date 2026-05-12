<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="header">
      <div>
        <h1>គោលដៅ</h1>
        <p>តាមដានគោលដៅសន្សំរបស់អ្នក</p>
      </div>

      <button
        class="add-btn"
        @click="showModal = true"
      >
        បន្ថែមគោលដៅ
        <span>+</span>
      </button>
    </div>

    <!-- CREATE MODAL -->
    <div
      v-if="showModal"
      class="modal-overlay"
    >
      <div class="modal-box">
        <div class="modal-header">
          <h2>បន្ថែមគោលដៅ</h2>

          <span
            class="close-btn"
            @click="closeModal"
          >
            ✕
          </span>
        </div>

        <form @submit.prevent="createGoal">
          <div class="form-group">
            <label>ឈ្មោះគោលដៅ</label>

            <input
              type="text"
              v-model="form.name"
              required
            />
          </div>

          <div class="form-group">
            <label>Target Amount</label>

            <input
              type="number"
              v-model="form.targetAmount"
              required
            />
          </div>

          <div class="form-group">
            <label>Deadline</label>

            <input
              type="date"
              v-model="form.deadline"
              required
            />
          </div>

          <button
            type="submit"
            class="submit-btn"
          >
            Save Goal
          </button>
        </form>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div
      v-if="showEditModal"
      class="modal-overlay"
    >
      <div class="modal-box">
        <div class="modal-header">
          <h2>Edit Goal</h2>

          <span
            class="close-btn"
            @click="closeEditModal"
          >
            ✕
          </span>
        </div>

        <form @submit.prevent="updateGoal">
          <div class="form-group">
            <label>Goal Name</label>

            <input
              type="text"
              v-model="editForm.name"
              required
            />
          </div>

          <div class="form-group">
            <label>Target Amount</label>

            <input
              type="number"
              v-model="editForm.targetAmount"
              required
            />
          </div>

         

          <div class="form-group">
            <label>Deadline</label>

            <input
              type="date"
              v-model="editForm.deadline"
              required
            />
          </div>

          <button
            type="submit"
            class="submit-btn"
          >
            Update Goal
          </button>
        </form>
      </div>
    </div>

    <!-- PROGRESS MODAL -->
    <div
      v-if="showProgressModal"
      class="modal-overlay"
    >
      <div class="modal-box">
        <div class="modal-header">
          <h2>Add Goal Progress</h2>

          <span
            class="close-btn"
            @click="closeProgressModal"
          >
            ✕
          </span>
        </div>

        <form
          @submit.prevent="
            submitGoalProgress
          "
        >
          <div class="form-group">
            <label>Amount</label>

            <input
              type="number"
              v-model="progressAmount"
              required
            />
          </div>

          <button
            type="submit"
            class="submit-btn"
          >
            Save Progress
          </button>
        </form>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-grid">
      <div class="stat-card">
        <h4>គោលដៅសរុប</h4>

        <h2>{{ goals.length }}</h2>

        <p>active</p>
      </div>

      <div class="stat-card">
        <h4>ប្រាក់សន្សំសរុប</h4>

        <h2>
          ${{ totalSaved.toLocaleString() }}
        </h2>

        <p>across all goals</p>
      </div>

      <div class="stat-card">
        <h4>នៅសល់</h4>

        <h2>
          ${{
            totalRemaining.toLocaleString()
          }}
        </h2>

        <p>to reach targets</p>
      </div>
    </div>

    <!-- GOAL CARD -->
    <div
      class="goal-card"
      v-for="goal in goals"
      :key="goal.id"
    >
      <!-- TOP -->
      <div class="goal-top">
        <div class="goal-info">
      
          <div>
            <div class="title-row">
              <h3>{{ goal.name }}</h3>

              <span class="status">
                {{ goal.progress }}%
              </span>
            </div>

            <p>
              Deadline:
              {{ formatDate(goal.deadline) }}
            </p>
          </div>
        </div>

        <div class="actions">
          <span
            @click="
              openEditModal(goal)
            "
          >
            <i
              class="bi bi-pencil-square"
            ></i>
          </span>

          <span
            @click="
              removeGoal(goal.id)
            "
          >
            <i class="bi bi-trash3"></i>
          </span>
        </div>
      </div>

      <!-- PROGRESS -->
      <div class="progress-section">
        <div class="progress-label">
          <span>
            {{ goal.progress }}%
            completed
          </span>
        </div>

        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{
              width:
                goal.progress + '%',
              background:
                goal.color,
            }"
          ></div>
        </div>
      </div>

      <!-- BOTTOM -->
      <div class="goal-bottom">
        <div>
          <h2>
            ${{
              goal.saved.toLocaleString()
            }}
          </h2>

          <p>បានសន្សំ</p>
        </div>

        <div class="remaining">
          <h2>
            ${{
              goal.remaining.toLocaleString()
            }}
          </h2>

          <p>នៅសល់</p>
        </div>
      </div>

      <!-- BUTTON -->
      <div class="buttons">
        <button
          class="save-btn   bg-green-500 text-black px-2 py-1 rounded  border-0 shadow-sm mt-2"
          @click="
            openProgressModal(goal)
          "
        >
          បន្ថែមប្រាក់
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
} from "vue";

import { useGoalsStore } from "@/stores/goalStore";

const goalStore = useGoalsStore();

const showModal = ref(false);

const showEditModal = ref(false);

const showProgressModal =
  ref(false);

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


const goals = computed(() => {
  return goalStore.goals.map(
    (goal) => {
      const saved =
        goal.currentAmount || 0;

      const target =
        goal.targetAmount || 0;

      const progress =
        target > 0
          ? Math.round(
              (saved / target) *
                100
            )
          : 0;

      return {
        ...goal,
        saved,
        remaining:
          target - saved,
        progress,

        color:
          progress >= 70
            ? "#16a34a"
            : progress >= 30
            ? "#ff7a00"
            : "#ef4444",
      };
    }
  );
});

const totalSaved = computed(() => {
  return goals.value.reduce(
    (total, goal) =>
      total + goal.saved,
    0
  );
});

const totalRemaining =
  computed(() => {
    return goals.value.reduce(
      (total, goal) =>
        total +
        goal.remaining,
      0
    );
  });


async function createGoal() {
  const payload = {
    name: form.value.name,

    targetAmount: Number(
      form.value.targetAmount
    ),

    deadline:
      form.value.deadline,
  };

  await goalStore.createGoal(
    payload
  );

  await goalStore.fetchAllGoals();

  closeModal();
}


function openEditModal(goal) {
  showEditModal.value = true;

  editForm.value = {
    id: goal.id,

    name: goal.name,

    targetAmount:
      goal.targetAmount,

    deadline:
      goal.deadline?.split(
        "T"
      )[0],
  };
}

async function updateGoal() {
  const payload = {
    name: editForm.value.name,

    targetAmount: Number(
      editForm.value
        .targetAmount
    ),

    currentAmount: Number(
      editForm.value
        .currentAmount
    ),

    deadline:
      editForm.value.deadline,
  };

  await goalStore.updateGoal(
    editForm.value.id,
    payload
  );

  await goalStore.fetchAllGoals();

  closeEditModal();
}


async function removeGoal(id) {
  await goalStore.deleteGoal(id);

  await goalStore.fetchAllGoals();
}


function openProgressModal(goal) {
  selectedGoalId.value =
    goal.id;

  progressAmount.value = "";

  showProgressModal.value = true;
}

function closeProgressModal() {
  showProgressModal.value = false;

  progressAmount.value = "";

  selectedGoalId.value = "";
}

async function submitGoalProgress() {
  await goalStore.addGoalProgress(
    selectedGoalId.value,
    progressAmount.value
  );

  await goalStore.fetchAllGoals();

  closeProgressModal();
}


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
    currentAmount: "",
    deadline: "",
  };
}


function formatDate(date) {
  return new Date(
    date
  ).toLocaleDateString();
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Inter, sans-serif;
}

.dashboard {
  padding: 30px;
  background: #f7f8fc;
  min-height: 100vh;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 32px;
  color: #1d2433;
}

.header p {
  color: #9aa4b2;
  margin-top: 5px;
}

.add-btn {
  border: none;
  background: #2450c5;
  color: white;
  padding: 12px 22px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
}

.stat-card h4 {
  color: #6b7280;
  margin-bottom: 10px;
}

.stat-card h2 {
  font-size: 32px;
}

/* Goal Card */
.goal-card {
  background: white;
  border-radius: 24px;
  padding: 25px;
  margin-bottom: 25px;
}

.goal-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.goal-info {
  display: flex;
  gap: 15px;
}

.goal-icon {
  width: 55px;
  height: 55px;
  background: #1f2a44;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 15px;
  cursor: pointer;
}

/* Progress */
.progress-section {
  margin-bottom: 25px;
}

.progress-label {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e5e7eb;
  border-radius: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
}

/* Bottom */
.goal-bottom {
  display: flex;
  justify-content: space-between;
}

.remaining {
  text-align: right;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  width: 420px;
  background: white;
  border-radius: 24px;
  padding: 25px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}

.close-btn {
  cursor: pointer;
  font-size: 20px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dbe2ef;
  border-radius: 12px;
  outline: none;
}

.submit-btn {
  width: 100%;
  border: none;
  background: #2450c5;
  color: white;
  padding: 14px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 600;
}
</style>
