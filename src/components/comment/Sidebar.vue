<template>
  <aside :class="['sidebar', { 'sidebar--collapsed': isCollapsed }]">

    <!-- HEADER -->
    <div class="sidebar__header">
      <h2 v-show="!isCollapsed" class="sidebar__title sidebar__title--full">ម៉ីនុយ</h2>
      <span v-show="isCollapsed" class="sidebar__title sidebar__title--mini">ម៉ីនុយ</span>
    </div>

    <!-- NAVIGATION -->
    <nav class="sidebar__nav">

      <RouterLink to="/dashboard/home" class="sidebar__item" active-class="sidebar__item--active">
        <i class="bi bi-grid sidebar__icon"></i>
        <span class="sidebar__label">ផ្ទាំងគ្រប់គ្រង</span>
      </RouterLink>

      <RouterLink to="/dashboard/transactions" class="sidebar__item" active-class="sidebar__item--active">
        <i class="bi bi-arrow-left-right sidebar__icon"></i>
        <span class="sidebar__label">ប្រតិបត្តិការ</span>
      </RouterLink>

      <RouterLink to="/dashboard/category" class="sidebar__item" active-class="sidebar__item--active">
        <i class="bi bi-grid-3x3-gap-fill sidebar__icon"></i>
        <span class="sidebar__label">ប្រភេទ</span>
      </RouterLink>

      <RouterLink to="/dashboard/report" class="sidebar__item" active-class="sidebar__item--active">
        <i class="bi bi-bar-chart sidebar__icon"></i>
        <span class="sidebar__label">របាយការណ៍</span>
      </RouterLink>

      <RouterLink to="/dashboard/budget" class="sidebar__item" active-class="sidebar__item--active">
        <i class="bi bi-credit-card-2-front sidebar__icon"></i>
        <span class="sidebar__label">ថវិកា</span>
      </RouterLink>

      <RouterLink to="/dashboard/goal" class="sidebar__item" active-class="sidebar__item--active">
        <i class="bi bi-bullseye sidebar__icon"></i>
        <span class="sidebar__label">គោលដៅ</span>
      </RouterLink>

    </nav>

    <hr class="sidebar__divider" />

    <!-- LOGOUT -->
    <button class="sidebar__item sidebar__logout" @click="handleLogout">
      <i class="bi bi-box-arrow-right sidebar__icon"></i>
      <span class="sidebar__label">ចាកចេញ</span>
    </button>

  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Swal from 'sweetalert2'

defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
})

const router    = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  const confirm = await Swal.fire({
    title:              'ចាកចេញ?',
    text:               'តើអ្នកពិតជាចង់ចាកចេញមែនទេ?',
    icon:               'question',
    showCancelButton:   true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor:  '#6b7280',
    confirmButtonText:  'ចាកចេញ',
    cancelButtonText:   'បោះបង់',
  })

  if (!confirm.isConfirmed) return

  authStore.logout()
  router.push({ name: 'landing' })  // ✅ landing = guestOnly → redirect ត្រឹមត្រូវ
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  min-width: 250px;
  height: calc(100vh - 20px);
  margin: 10px;
  padding: 24px 16px;
  background: var(--bg-sidebar);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease, min-width 0.3s ease, padding 0.3s ease;
}

.sidebar--collapsed {
  width: 80px;
  min-width: 80px;
  padding: 24px 8px;
  align-items: center;
}

.sidebar__header { width: 100%; overflow: hidden; }

.sidebar__title {
  margin: 0 0 24px 4px;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-white);
  white-space: nowrap;
  font-family: var(--font-khmer);
}

.sidebar__title--full {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.sidebar--collapsed .sidebar__title--full {
  opacity: 0;
  transform: translateX(-10px);
}

.sidebar__title--mini {
  opacity: 0;
  transform: scale(0.8);
  font-size: 16px;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.sidebar--collapsed .sidebar__title--mini {
  opacity: 1;
  transform: scale(1);
}

.sidebar__nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 16px;
  border: none;
  border-radius: 12px;
  background: transparent;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  color: var(--text-white);
  position: relative;
  overflow: hidden;
  font-family: var(--font-khmer);
  transition: background 0.2s ease, transform 0.2s ease, color 0.2s ease;
}

.sidebar__item:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateX(3px);
}

.sidebar__item--active {
  background: var(--color-primary) !important;
  color: var(--text-white) !important;
  font-weight: 600;
}

.sidebar__icon {
  flex-shrink: 0;
  font-size: 20px;
  transition: transform 0.2s ease;
}
.sidebar__item:hover .sidebar__icon { transform: scale(1.1); }

.sidebar__label {
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.2s ease, max-width 0.3s ease;
}

.sidebar--collapsed .sidebar__item {
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  padding: 10px 4px;
}
.sidebar--collapsed .sidebar__label {
  font-size: 10px;
  text-align: center;
  line-height: 1.2;
}

.sidebar__divider {
  width: 100%;
  margin: 20px 0;
  border: none;
  border-top: 1px solid var(--border-color);
}

.sidebar__logout {
  color: var(--color-danger-light, #fca5a5);
  font-weight: 600;
}
.sidebar__logout:hover {
  background: rgba(220, 38, 38, 0.15);
  color: var(--text-white);
  transform: none;
}
.sidebar__logout:hover .sidebar__icon { transform: translateX(4px); }
</style>