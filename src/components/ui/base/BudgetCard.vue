<template>
  <div class="card">
    <!-- Header -->
    <div class="card-header">
      <div>
        <h3>{{ budget.category?.name || 'No Category' }}</h3>
        <p>Monthly Budget</p>
      </div>

      <div class="actions">
        <span @click="editBudget">
            <i class="bi bi-pencil-square"></i>
        </span>
        <span @click="deleteBudget">
            <i class="bi bi-trash3"></i>
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="info">
      <div class="row">
        <span>Spent</span>
        <span class="spent">${{ spent.toFixed(2) }}</span>
      </div>

      <div class="row">
        <span>Budget</span>
        <span>${{ total.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="progress-bar">
      <div
        class="progress"
        :style="{
          width: percent > 0 ? percent + '%' : '6px',
          background: color
        }"
      ></div>
    </div>

    <!-- Bottom -->
    <div class="bottom">
      <span>{{ percent.toFixed(1) }}% used</span>
      <span>${{ left.toFixed(2) }} left</span>
    </div>

    <!-- Warning -->
    <div class="warning" v-if="percent >= 80">
      ⚠️ Budget almost exceeded!
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'

const emit = defineEmits(['edit-budget', 'delete-budget'])


const props = defineProps({
  budget: {
    type: Object,
    default: () => ({})
  }
})

const spent = computed(() => Number(props.budget.spentAmount) || 0)
const total = computed(() => Number(props.budget.limitAmount) || 0)

const percent = computed(() => {
  if (!total.value) return 0
  return Math.min((spent.value / total.value) * 100, 100)
})

const left = computed(() => Math.max(total.value - spent.value, 0))

const color = computed(() => {
  if (percent.value >= 80) {
    return 'linear-gradient(90deg, #ff4d4f, #ff7875)'
  }
  if (percent.value >= 50) {
    return 'linear-gradient(90deg, #faad14, #ffd666)'
  }
  return 'linear-gradient(90deg, #16c35b, #73d13d)'
})

function editBudget() {
  emit('edit-budget', props.budget)
}

function deleteBudget() {
  emit('delete-budget', props.budget)
}
</script>

<style scoped>
.card {
    margin-top: 20px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
  width: 100%;
}

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 20px;
}

.card-header p {
  margin: 2px 0 0;
  font-size: 13px;
  color: #888;
}

.actions span {
  margin-left: 8px;
  cursor: pointer;
}

/* Info */
.info {
  margin-top: 12px;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
}

.spent {
  color: #faad14;
  font-weight: bold;
}

/* Progress */
.progress-bar {
  height: 10px;
  background: #f1f3f5;
  border-radius: 999px;
  overflow: hidden;
  margin: 12px 0;
}

.progress {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease, background 0.3s ease;
  position: relative;
}

/* Bottom */
.bottom {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

/* Warning */
.warning {
  margin-top: 10px;
  background: #fff3cd;
  color: #856404;
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
}
</style>