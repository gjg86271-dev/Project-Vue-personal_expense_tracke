<template>
  <div class="card">
    <div class="top">
      <div>
        <h3>ទិដ្ឋភាពថវិកា</h3>
        <p>ចំណាយប្រចាំខែ</p>
      </div>

      <div class="amount">
        <h2>${{ totalexpenses }}</h2>
        <span>Of ${{ totalBudget.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Progress -->
    <div class="progress-bar">
      <div
        class="progress"
        :style="{
          width: percent + '%',
          background:
            percent > 80 ? '#ff4d4f' : percent > 50 ? '#faad14' : '#16c35b',
        }"
      ></div>
    </div>

    <!-- Bottom -->
    <div class="bottom">
      <span class="percent">{{ percent.toFixed(1) }}% បានប្រើ</span>
      <span class="left">${{ left.toFixed(2) }} នៅខ្វះ</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  budgets: {
    type: Array,
    default: () => [],
  },
  totalexpenses: {
    type: Number,
    default: 0,
  },
});

const totalBudget = computed(() =>
  props.budgets.reduce((sum, b) => sum + (b.limitAmount || 0), 0),
);

// 👉 replace later with real API sum
const totalSpent = computed(() =>
  props.budgets.reduce((sum, b) => sum + (b.spentAmount || 0), 0),
);
const percent = computed(() => {
  if (!totalBudget.value) return 0;
  const value = (props.totalexpenses / totalBudget.value) * 100;
  return Math.min(value, 100);
});
const left = computed(() => totalBudget.value - props.totalexpenses);
</script>

<style scoped>
.card {
  width: 100%;
  background: #f8f9fb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount h2 {
  margin: 0;
  font-size: 28px;
}

.progress-bar {
  margin: 16px 0;
  height: 10px;
  background: #ddd;
  border-radius: 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #16c35b;
  transition: width 0.4s ease;
}

.bottom {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.percent {
  color: #16c35b;
}
</style>
