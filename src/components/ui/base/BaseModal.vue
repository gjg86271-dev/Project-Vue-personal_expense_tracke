<template>
  <div class="modal-overlay">
    <div class="modal-container">

      <!-- Header -->
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <slot name="body"></slot>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <slot name="footer"></slot>
      </div>

    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close-modal'])

defineProps({
  title: String,
  description: String
})

function close() {
  emit('close-modal')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-container {
  width: fit-content;
  min-width: 400px;
  max-width: 500px;
  max-height: 90vh;
  background: var(--bg-card);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  animation: popup 0.25s ease;
  display: flex;
  flex-direction: column;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  background: var(--bg-card);
  color: var(--text-primary);
}

@keyframes popup {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: var(--text-primary);
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: var(--transition);
}

.close-btn:hover {
  color: var(--color-danger);
  transform: rotate(90deg);
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>