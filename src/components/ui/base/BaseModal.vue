<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="true" class="swal-overlay" @click.self="close">
        <div class="swal-box">

          <!-- ── Header ── -->
          <div class="swal-header">
            <div class="swal-header__icon icon-create">
              <i class="bi bi-plus-circle-fill"></i>
            </div>
            <div>
              <h3 class="swal-title">{{ title }}</h3>
              <p v-if="description" class="swal-desc">{{ description }}</p>
            </div>
            <button class="swal-close" @click="close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- ── Body ── -->
          <div class="swal-body">
            <slot name="body"></slot>
          </div>

          <!-- ── Footer ── -->
          <div class="swal-footer">
            <slot name="footer"></slot>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const emit = defineEmits(['close-modal'])

defineProps({
  title:       String,
  description: String,
})

function close() {
  emit('close-modal')
}
</script>

<style scoped>
/* ── Overlay ──────────────────────────────────────────────────────────── */
.swal-overlay {
  position: fixed; inset: 0;
  background: rgba(4, 44, 131, 0.22);
  backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1050; padding: 16px;
}

/* ── Box ──────────────────────────────────────────────────────────────── */
.swal-box {
  background: var(--bg-card);
  border-radius: 24px;
  width: 100%; max-width: 460px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  font-family: var(--font-khmer);
  overflow: hidden;
}

/* ── Header ───────────────────────────────────────────────────────────── */
.swal-header {
  display: flex; align-items: center; gap: 14px;
  padding: 22px 24px 16px;
  border-bottom: 1px solid var(--border-color);
  position: relative; flex-shrink: 0;
}

.swal-header__icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.icon-create { background: var(--bg-input); color: var(--color-primary); }

.swal-title {
  margin: 0 0 2px;
  font-size: 17px; font-weight: 800;
  color: var(--text-primary);
}
.swal-desc {
  margin: 0;
  font-size: 12px; color: var(--text-secondary);
}

.swal-close {
  position: absolute; top: 18px; right: 18px;
  width: 32px; height: 32px; border-radius: 8px;
  border: none; background: var(--bg-input); color: var(--text-secondary);
  font-size: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: var(--transition);
}
.swal-close:hover { background: var(--color-danger); color: var(--text-white); }

/* ── Body ─────────────────────────────────────────────────────────────── */
.swal-body {
  padding: 20px 24px;
  overflow-y: auto; flex: 1;
}

/* ── Footer ───────────────────────────────────────────────────────────── */
.swal-footer {
  display: flex; gap: 10px;
  padding: 16px 24px 22px;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

/* expose footer btn styles so HomeView slots work */
.swal-footer :deep(button) {
  flex: 1; height: 46px; border-radius: 50px; border: none;
  font-size: 14px; font-weight: 700; cursor: pointer;
  font-family: var(--font-khmer);
  display: flex; align-items: center; justify-content: center;
  gap: 7px; transition: var(--transition);
}
.swal-footer :deep(button:disabled) { opacity: 0.6; cursor: not-allowed; }

.swal-footer :deep(.btn-cancel),
.swal-footer :deep(.btn-secondary) {
  background: var(--bg-input); color: var(--text-secondary);
}
.swal-footer :deep(.btn-cancel:hover:not(:disabled)),
.swal-footer :deep(.btn-secondary:hover:not(:disabled)) {
  background: var(--bg-body); color: var(--text-primary);
}

.swal-footer :deep(.btn-confirm),
.swal-footer :deep(.btn-primary) {
  flex: 2;
  background: var(--color-primary); color: var(--text-white);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--color-primary) 30%, transparent);
}
.swal-footer :deep(.btn-confirm:hover:not(:disabled)),
.swal-footer :deep(.btn-primary:hover:not(:disabled)) {
  background: var(--color-primary-hover); transform: translateY(-1px);
}

/* ── Field group (used in body slot) ─────────────────────────────────── */
.swal-body :deep(.field-group) { margin-bottom: 18px; }

.swal-body :deep(.field-label) {
  display: block; margin-bottom: 8px;
  font-size: 13px; font-weight: 600; color: var(--text-primary);
}
.swal-body :deep(.required) { color: var(--color-danger); }

.swal-body :deep(.input-shell) {
  display: flex; align-items: center; height: 46px;
  border: 1.5px solid var(--border-color); border-radius: 50px;
  padding: 0 16px; background: var(--bg-input); transition: var(--transition);
}
.swal-body :deep(.input-shell:focus-within) {
  border-color: var(--color-primary); background: var(--bg-card);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent);
}
.swal-body :deep(.input-shell.is-invalid) {
  border-color: var(--color-danger); background: var(--color-danger-light);
}
.swal-body :deep(.input-shell--select) { padding-right: 8px; }

.swal-body :deep(.field-icon) {
  color: var(--text-secondary); font-size: 14px; flex-shrink: 0; margin-right: 8px;
}

.swal-body :deep(.input-shell input),
.swal-body :deep(.input-shell select),
.swal-body :deep(.input-shell textarea) {
  flex: 1; height: 100%; border: 0; outline: 0;
  background: transparent; font-size: 14px;
  color: var(--text-primary); font-family: var(--font-khmer);
}
.swal-body :deep(.input-shell input::placeholder) { color: var(--border-color); }
.swal-body :deep(.input-shell input:disabled),
.swal-body :deep(.input-shell select:disabled) { opacity: 0.6; }
.swal-body :deep(.input-shell select) { cursor: pointer; }

/* textarea shell */
.swal-body :deep(.input-shell--textarea) {
  height: auto; border-radius: 16px; padding: 12px 16px; align-items: flex-start;
}
.swal-body :deep(.input-shell--textarea textarea) {
  height: auto; resize: vertical; min-height: 72px; padding: 0;
}

.swal-body :deep(.field-error) {
  font-size: 12px; color: var(--color-danger);
  margin-top: 4px; display: flex; align-items: center; gap: 4px;
}

/* type toggle */
.swal-body :deep(.type-toggle) { display: flex; gap: 10px; }
.swal-body :deep(.type-btn) {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
  height: 46px; border-radius: 12px; border: 2px solid var(--border-color);
  background: var(--bg-input); color: var(--text-secondary);
  font-size: 14px; font-weight: 700; cursor: pointer;
  font-family: var(--font-khmer); transition: var(--transition);
}
.swal-body :deep(.type-btn:disabled) { opacity: 0.5; cursor: not-allowed; }
.swal-body :deep(.type-btn--income.active) {
  border-color: var(--color-success); background: var(--color-success-light); color: var(--color-success);
}
.swal-body :deep(.type-btn--expense.active) {
  border-color: var(--color-danger); background: var(--color-danger-light); color: var(--color-danger);
}

/* file input */
.swal-body :deep(.file-shell) {
  display: flex; align-items: center; gap: 10px; height: 46px;
  border: 1.5px dashed var(--border-color); border-radius: 50px;
  padding: 0 16px; background: var(--bg-input); cursor: pointer;
  transition: var(--transition);
}
.swal-body :deep(.file-shell:hover) {
  border-color: var(--color-primary); background: var(--bg-card);
}
.swal-body :deep(.file-shell input[type="file"]) {
  flex: 1; border: 0; outline: 0; background: transparent;
  font-size: 13px; color: var(--text-primary); font-family: var(--font-khmer);
  cursor: pointer;
}

/* attachment / selected file */
.swal-body :deep(.attachment-link) {
  font-size: 13px; color: var(--color-primary);
  text-decoration: none; display: inline-flex; align-items: center; gap: 4px;
}
.swal-body :deep(.attachment-link:hover) { text-decoration: underline; }
.swal-body :deep(.selected-file) {
  font-size: 13px; color: var(--text-secondary);
  display: inline-flex; align-items: center; gap: 4px;
}

/* ── Transition ───────────────────────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }
.modal-fade-enter-from .swal-box,
.modal-fade-leave-to .swal-box { transform: scale(0.94) translateY(12px); }
.modal-fade-enter-active .swal-box,
.modal-fade-leave-active .swal-box { transition: transform 0.25s ease; }
</style>