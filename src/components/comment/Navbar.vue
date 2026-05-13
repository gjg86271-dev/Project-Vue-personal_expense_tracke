<template>
  <header class="navbar">
    <div class="navbar-left">
      <!-- Toggle Button -->
      <button class="icon-button me-2" @click="emit('toggle-sidebar')" type="button" aria-label="Toggle Sidebar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round"/>
        </svg>
      </button>

      <img src="/src/assets/img/image.png" alt="ExpenseTracker" class="brand-icon" />
    </div>

    <div class="navbar-right">
      <button class="icon-button" type="button" aria-label="Notifications">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="divider"></div>

      <div class="profile-wrapper" ref="triggerRef">
        <button class="profile" @click="toggleDropdown" type="button">
          <img v-if="avatarUrl" :src="avatarUrl" :alt="name" class="avatar-img" />
          <div v-else class="avatar">{{ initials }}</div>
          <div class="profile-text">
            <div class="profile-name">{{ name }}</div>
            <div class="profile-email">{{ email }}</div>
          </div>
          <svg class="chevron" :class="{ open: isOpen }"
            width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="dropdown">
      <div v-if="isOpen" ref="menuRef" :style="menuStyle">
        <div style="display:flex;align-items:center;gap:10px;padding:14px 16px;">
          <img v-if="avatarUrl" :src="avatarUrl" :alt="name"
            style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid #e5e7eb;flex-shrink:0;" />
          <div v-else
            style="width:36px;height:36px;border-radius:50%;background:#2563eb;color:#fff;display:grid;place-items:center;font-weight:700;font-size:13px;flex-shrink:0;">
            {{ initials }}
          </div>
          <div>
            <div style="font-size:13px;font-weight:600;color:#111827;line-height:1.3;">{{ name }}</div>
            <div style="font-size:11px;color:#6b7280;line-height:1.3;">{{ email }}</div>
          </div>
        </div>

        <div style="height:1px;background:#e5e7eb;margin:0;"></div>

        <RouterLink
          to="/profile"
          @click="isOpen = false"
          style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;font-weight:500;color:#374151;text-decoration:none;cursor:pointer;transition:background 0.12s;"
          @mouseover="e => e.currentTarget.style.background='#f1f5f9'"
          @mouseleave="e => e.currentTarget.style.background='transparent'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span>គណនីរបស់អ្នក</span>
        </RouterLink>

        <div style="height:1px;background:#e5e7eb;margin:0;"></div>

        <button
          @click="handleLogout"
          type="button"
          style="display:flex;align-items:center;gap:10px;padding:10px 16px;font-size:13px;font-weight:500;color:#e53e3e;cursor:pointer;border:none;background:none;width:100%;font-family:inherit;transition:background 0.12s;"
          @mouseover="e => e.currentTarget.style.background='#fff5f5'"
          @mouseleave="e => e.currentTarget.style.background='transparent'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>ចាកចេញ</span>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  name:      { type: String, default: 'Chea Phing' },
  email:     { type: String, default: 'cheaphing32@gmail.com' },
  avatarUrl: { type: String, default: null }
})

const emit = defineEmits(['logout', 'toggle-sidebar'])  // ✅ បន្ថែម toggle-sidebar

const isOpen     = ref(false)
const triggerRef = ref(null)
const menuRef    = ref(null)
const menuStyle  = ref({})

const initials = computed(() =>
  props.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
)

function updatePosition() {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  menuStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 8}px`,
    right: `${window.innerWidth - rect.right}px`,
    minWidth: '220px',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
    overflow: 'hidden',
    zIndex: '99999',
  }
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) nextTick(updatePosition)
}

function handleLogout() {
  isOpen.value = false
  emit('logout')
}

function handleClickOutside(e) {
  if (
    triggerRef.value && !triggerRef.value.contains(e.target) &&
    menuRef.value    && !menuRef.value.contains(e.target)
  ) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, true)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, true)
})
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  background: #bad7f8;
  /* border-bottom: 1px solid #e5e7eb; */
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-icon {
  width: 160px;
  height: 60px;
  object-fit: contain;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-button {
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  display: grid;
  place-items: center;
  border-radius: 8px;
  transition: background 0.15s;
}
.icon-button:hover { background: #f1f5f9; color: #111827; }

.divider {
  width: 1px;
  height: 32px;
  background: #e5e7eb;
}

.profile-wrapper { position: relative; }

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 6px 8px;
  border-radius: 10px;
  transition: background 0.15s;
  font-family: inherit;
}
.profile:hover { background: #f1f5f9; }

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  flex-shrink: 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.profile-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  text-align: left;
}

.profile-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  line-height: 1.3;
}

.profile-email {
  font-size: 11px;
  color: #6b7280;
  white-space: nowrap;
  line-height: 1.3;
}

.chevron {
  color: #9ca3af;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}
.chevron.open { transform: rotate(180deg); }

:global(.dropdown-enter-active),
:global(.dropdown-leave-active) {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
:global(.dropdown-enter-from),
:global(.dropdown-leave-to) {
  opacity: 0;
  transform: translateY(-6px);
}
</style>