<template>
    <div class="card border-0 shadow">
        <div class="card-body">
            <div class="card-header-row">
                <div class="card-title">{{ title }}</div>
                <div class="card-icon">
                   <slot name="icon"></slot>
                </div>
            </div>
            <div class="card-subtitle">{{ formattedValue }}</div>
            <div class="card-text">
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  value: { type: Number, default: 0 },
  currency: { type: String, default: '' }
})

const formattedValue = computed(() => {
  return `${props.currency}${Number(props.value).toLocaleString()}`
})
</script>

<style scoped>
/* ================= ROOT VARIABLES ================= */
:root {
  --sidebar-width: 300px;
  --sidebar-collapsed-width: 80px;
}

/* ================= MAIN CARD ================= */
.card {
  border-radius: 16px;
  background-color: var(--bg-card);
  border: 1px solid #e5e7eb;

  /* 👇 RESPONSIVE WIDTH BASED ON SIDEBAR */
  width: calc(100% - var(--sidebar-width));

  transition: all 0.3s ease;
}

/* when sidebar collapsed */
body.sidebar-collapsed .card {
  width: calc(100% - var(--sidebar-collapsed-width));
}

/* mobile fallback */
@media (max-width: 992px) {
  .card {
    width: 100% !important;
  }
}

/* ================= CARD BODY ================= */
.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ================= HEADER ================= */
.card-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* TITLE */
.card-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}

/* ICON */
.card-icon {
  width: 48px;
  height: 48px;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #9aadc0;
  border: 1px solid #e5e7eb;

  flex-shrink: 0;
}

/* ICON SIZE */
.card-icon svg {
  width: 18px;
  height: 18px;
}

/* VALUE */
.card-subtitle {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
}

/* TEXT (optional trend or subtitle) */
.card-text {
  font-size: 13px;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>