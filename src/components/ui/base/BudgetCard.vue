<template>
  <!-- ✅ click card ទាំងមូល → view detail, stop propagation លើ action buttons -->
  <div class="card" @click="viewBudget">

    <!-- Header -->
    <div class="card-header">
      <div class="title">
        <h3>{{ budget.category?.name || 'No Category' }}</h3>
        <p>ថវិកាប្រចាំខែ</p>
      </div>

      <div class="actions">
        <button @click.stop="editBudget">
          <i class="bi bi-pencil-square"></i>
        </button>

        <button @click.stop="deleteBudget" class="danger">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    </div>

    <!-- Info -->
    <div class="info">
      <div class="row">
        <span>ចំណាយ</span>
        <span class="spent">${{ spent.toFixed(2) }}</span>
      </div>

      <div class="row">
        <span>ថវិកា</span>
        <span class="total">${{ total.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Progress -->
    <div class="progress-bar">
      <div
        class="progress"
        :style="{
          width: Math.min(percent, 100) + '%',
          background: color
        }"
      ></div>
    </div>

    <!-- Bottom -->
    <div class="bottom">
      <span>{{ percent.toFixed(1) }}% បានប្រើ</span>
      <span class="left">${{ left.toFixed(2) }} ប្រាក់នៅសល់</span>
    </div>

    <!-- Warning -->
    <div class="warning" v-if="percent >= 80">
      ថវិកាជិតលើសកំណត់!
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'

const transactionStore = useTransactionStore()

onMounted(() => {
  transactionStore.fetchTransactions()
})

// ✅ បន្ថែម 'view-budget'
const emit = defineEmits([
  'edit-budget',
  'delete-budget',
  'view-budget',
])

const props = defineProps({
  budget: {
    type: Object,
    default: () => ({})
  }
})

/* ─── COMPUTED ────────────────────────────────────────────── */
const spent = computed(() =>
  transactionStore.transactions
    .filter(t =>
      t.category?.id === props.budget.category?.id &&
      t.category?.type === 'EXPENSE'
    )
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)
)

const total   = computed(() => Number(props.budget?.limitAmount ?? 0))
const percent = computed(() => !total.value ? 0 : Math.min((spent.value / total.value) * 100, 100))
const left    = computed(() => Math.max(total.value - spent.value, 0))

const color = computed(() => {
  if (percent.value >= 80) return 'linear-gradient(90deg, #ff4d4f, #ff7875)'
  if (percent.value >= 50) return 'linear-gradient(90deg, #faad14, #ffd666)'
  return 'linear-gradient(90deg, #16c35b, #73d13d)'
})

/* ─── EVENTS ──────────────────────────────────────────────── */
function viewBudget()   { emit('view-budget',   props.budget) }  // ✅
function editBudget()   { emit('edit-budget',   props.budget) }
function deleteBudget() { emit('delete-budget', props.budget) }
</script>

<style scoped>
/* ====================================
   MODERN BUDGET CARD UI
==================================== */

.card {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: 0.3s;
  margin-top: 20px;
  cursor: pointer; /* ✅ បង្ហាញ pointer ដឹងថា clickable */
}

.card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 20px 45px rgba(0, 0, 0, 0.08),
    inset 0 1px 1px rgba(255,255,255,0.5);
}

/* ====================================
   HEADER
==================================== */

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
  position: relative;
  z-index: 2;
}

.title h3 {
  margin: 0;
  font-size: 23px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
}

.title p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

/* ====================================
   ACTIONS
==================================== */

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.actions button {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 14px;
  background: #f8fafc;
  color: #374151;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.04);
}

.actions button:hover {
  transform: scale(1.08);
  background: #eef2ff;
  color: #4f46e5;
}

.actions .danger:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* ====================================
   INFO SECTION

.info {
  position: relative;
  z-index: 2;
  background: #f9fafb;
  border-radius: 20px;
  padding: 18px;
  margin-bottom: 18px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.row:last-child {
  margin-bottom: 0;
}

.row span:first-child {
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
}

.spent,
.total {
  font-size: 18px;
  font-weight: 800;
}

.spent { color: #ef4444; font-weight: 600; }
.total { color: #111827; font-weight: 600; }

/* ====================================
   PROGRESS
==================================== */

.progress-bar {
  width: 100%;
  height: 14px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  position: relative;
  margin-bottom: 16px;
}

.progress {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s ease;
  position: relative;
}

.progress::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 100%;
  background: rgba(255,255,255,0.3);
  filter: blur(4px);
}

/* ====================================
   BOTTOM
==================================== */

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  position: relative;
  z-index: 2;
  gap: 10px;
  flex-wrap: wrap;
}

.bottom span {
  font-size: 13px;
  font-weight: 700;
}

.bottom span:first-child {
  color: #6366f1;
  background: #eef2ff;
  padding: 8px 14px;
  border-radius: 999px;
}

.left {
  color: #111827;
  background: #f3f4f6;
  padding: 8px 14px;
  border-radius: 999px;
}

/* ====================================
   WARNING
==================================== */

.warning {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    #fff7ed,
    #ffedd5
  );
  color: #c2410c;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #fdba74;
  animation: pulseWarning 1.5s infinite;
}

.warning::before {
  content: "⚠";
  font-size: 18px;
}

@keyframes pulseWarning {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.01);
  }

  100% {
    transform: scale(1);
  }
}

/* ====================================
   RESPONSIVE
==================================== */

@media (max-width: 768px) {
  .card {
    padding: 20px;
    border-radius: 24px;
  }

  .title h3 {
    font-size: 20px;
  }

  .bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .bottom span {
    width: 100%;
    text-align: center;
  }

  .actions button {
    width: 38px;
    height: 38px;
  }
}
</style>