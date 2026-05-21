<template>
  <!-- Modal -->
  <div class="modal-overlay">
    <div class="modal-container">

      <!-- Header -->
      <div class="modal-header">
        <h3>{{ title }}</h3>

        <button class="close-btn" @click="close">
          ✕
        </button>
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
/* Overlay */
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

/* Modal Box */
/* Modal Box */
/* Modal Box */
.modal-container {
  width: fit-content;
  min-width: 400px;
  max-width: 500px;             /* កុំឲ្យលើស 500px ឬ 90% screen */
  max-height: 90vh;             /* កុំឲ្យលើស 90% screen height */
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  animation: popup 0.25s ease;
  display: flex;
  flex-direction: column;       /* ឲ្យ body scroll បាន */
}

/* Body */
.modal-body {
  padding: 20px;
  overflow-y: auto;             /* scroll លើ content ខាងក្នុង */
  flex: 1;
}
/* Animation */
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

/* Header */
.modal-header {
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f0;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
}

/* Close Button */
.close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #666;

  transition: 0.2s;
}

.close-btn:hover {
  color: #ff4d4f;
  transform: rotate(90deg);
}


/* Footer */
.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;

  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>