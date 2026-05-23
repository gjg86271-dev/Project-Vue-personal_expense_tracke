<template>
  <div class="card border-0">
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
/* ===================================
   WHITE MODERN OVERVIEW CARD UI
=================================== */

.card {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 30px;
  border-radius: 30px;
  background-color: var(--bg-card);
  border: 1px solid #eef2f7;
  box-shadow:
    0 10px 35px rgba(0, 0, 0, 0.06),
    0 2px 10px rgba(0, 0, 0, 0.03);
}

/* Decorative Background */
.card::before {
  content: "";
  position: absolute;
  top: -90px;
  right: -90px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.06);
}

.card::after {
  content: "";
  position: absolute;
  bottom: -70px;
  left: -70px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.05);
}

/* ===================================
   TOP
=================================== */

.top {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.top h3 {
  font-size: 30px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.top p {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

/* ===================================
   AMOUNT
=================================== */

.amount {
  text-align: right;
}

.amount h2 {
  margin: 0;
  font-size: 42px;
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1;
}

.amount span {
  display: inline-block;
  margin-top: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
}

/* ===================================
   PROGRESS
=================================== */

.progress-bar {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 16px;
  margin: 26px 0 22px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
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
  width: 40px;
  height: 100%;
  background: rgba(255,255,255,0.4);
  filter: blur(4px);
}

/* ===================================
   BOTTOM
=================================== */

.bottom {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.bottom span {
  font-size: 14px;
  font-weight: 700;
  padding: 10px 16px;
  border-radius: 999px;
}

.percent {
  background: #eef2ff;
  color: #4f46e5;
}

.left {
  background: #f3f4f6;
  color: #111827;
}

/* ===================================
   RESPONSIVE
=================================== */

@media (max-width: 768px) {
  .card {
    padding: 24px;
    border-radius: 24px;
  }

  .top {
    flex-direction: column;
  }

  .amount {
    width: 100%;
    text-align: left;
  }

  .amount h2 {
    font-size: 34px;
  }

  .top h3 {
    font-size: 24px;
  }

  .bottom {
    flex-direction: column;
    align-items: stretch;
  }

  .bottom span {
    text-align: center;
  }
}
</style>
