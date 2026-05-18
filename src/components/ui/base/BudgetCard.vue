<template>
  <!-- ✅ click card ទាំងមូល → view detail, stop propagation លើ action buttons -->
  <div class="card" @click="viewBudget">

    <!-- Header -->
    <div class="card-header">
      <div class="title">
        <h3>{{ budget.category?.name || 'No Category' }}</h3>
        <p>Monthly Budget</p>
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
      <span>{{ percent.toFixed(1) }}% used</span>
      <span class="left">${{ left.toFixed(2) }} left</span>
    </div>

    <!-- Warning -->
    <div class="warning" v-if="percent >= 80">
      ⚠️ Budget almost exceeded!
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
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
}

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
}

.title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.title p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #888;
}

/* Actions */
.actions {
  display: flex;
  gap: 8px;
}

.actions button {
  border: none;
  background: #f3f4f6;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.actions button:hover { background: #e5e7eb; }
.actions .danger:hover { background: #fee2e2; color: #dc2626; }

/* Info */
.info { margin-top: 12px; }

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
}

.spent { color: #ef4444; font-weight: 600; }
.total { color: #111827; font-weight: 600; }

/* Progress */
.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 12px;
}

.progress {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease;
}

/* Bottom */
.bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  color: #6b7280;
}

.left { font-weight: 600; color: #111827; }

/* Warning */
.warning {
  margin-top: 10px;
  padding: 8px;
  border-radius: 10px;
  background: #fff7ed;
  color: #c2410c;
  font-size: 12px;
}
</style>