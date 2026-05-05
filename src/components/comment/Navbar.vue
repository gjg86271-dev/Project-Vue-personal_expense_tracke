<template>
  <header class="navbar">
    <div class="navbar-left">
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

      <div class="profile">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="name"
          class="avatar-img"
        />
        <div v-else class="avatar">{{ initials }}</div>

        <div class="profile-text">
          <div class="profile-name">{{ name }}</div>
          <div class="profile-email">{{ email }}</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: 'Chea Phing'
  },
  email: {
    type: String,
    default: 'cheaphing32@gmail.com'
  },
  avatarUrl: {
    type: String,
    default: null   // pass a URL to show a real photo, otherwise shows initials
  }
})

const initials = computed(() =>
  props.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
)
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
}

.brand-icon {
  width: 130px;
  height: 50px;
  object-fit: contain;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Bell button — no border, just icon */
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

.icon-button:hover {
  background: #f1f5f9;
  color: #111827;
}

/* Vertical divider between bell and profile */
.divider {
  width: 1px;
  height: 32px;
  background: #e5e7eb;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

/* Real photo avatar */
.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

/* Fallback initials avatar */
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
</style>