<template>
  <aside :class="['sidebar', { 'sidebar--collapsed': isCollapsed }]">
    <div class="sidebar-header">
      <h2 class="title" v-if="!isCollapsed">ម៉ីនុយ</h2>
      <span class="title-mini title" v-else>ម៉ីនុយ</span>
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/dashboard" class="nav-item" active-class="nav-item--active">
        <i class="bi bi-grid fs-5"></i>
        <span class="nav-label">ផ្ទាំងគ្រប់គ្រង</span>
      </RouterLink>

      <RouterLink to="/transactions" class="nav-item" active-class="nav-item--active">
        <i class="bi bi-arrow-left-right fs-5"></i>
        <span class="nav-label">ប្រតិបត្តិការ</span>
      </RouterLink>

      <RouterLink to="/report" class="nav-item" active-class="nav-item--active">
        <i class="bi bi-bar-chart fs-5"></i>
        <span class="nav-label">របាយការណ៍</span>
      </RouterLink>

      <RouterLink to="/budget" class="nav-item" active-class="nav-item--active">
        <i class="bi bi-credit-card-2-front fs-5"></i>
        <span class="nav-label">ថវិកា</span>
      </RouterLink>

      <RouterLink to="/goal" class="nav-item" active-class="nav-item--active">
        <i class="bi bi-bullseye fs-5"></i>
        <span class="nav-label">គោលដៅ</span>
      </RouterLink>
    </nav>

    <hr class="divider" />

    <button class="nav-item logout" @click="handleLogout">
      <i class="bi bi-box-arrow-right fs-5"></i>
      <span class="nav-label">តាកចេញ</span>
    </button>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'


const props = defineProps({
  isCollapsed: { type: Boolean, default: false }
})

const router = useRouter()

function handleLogout() {
  router.push('/landing')
}
</script>

<style scoped>
.sidebar {
  width: 300px;
  min-width: 240px;
  height: calc(100vh - 20px);
  margin: 10px;
  padding: 24px 16px;
  background: #bad7f8;
  border-right: 1px solid #e5e7eb;

  border-radius: 20px;

  display: flex;
  flex-direction: column;
}

/* COLLAPSED */
.sidebar--collapsed {
  width: 80px;
  min-width: 80px;
  padding: 24px 8px;
  align-items: center;
}

.sidebar--collapsed .nav-item {
  justify-content: center;
  padding: 10px 4px;
  width: 100%;
  flex-direction: column;
  gap: 4px;
}

.sidebar--collapsed .nav-label {
  display: block;
  font-size: 11px;
  font-weight: 400;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 68px;
}

.sidebar--collapsed .title-mini {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
  display: block;
}

/* HEADER */
.sidebar-header {
  width: 100%;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 4px;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}

/* NAV */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 16px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  transition: background 0.15s, color 0.15s;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  line-height: 1.6;
}

.nav-item:hover {
  background: #e8edf7;
  color: #1d3a8a;
}

.nav-item--active {
  background: #1e3a8a !important;
  color: #ffffff !important;
  font-weight: 600;
}

.nav-item--active:hover {
  background: #1e40af !important;
}

/* DIVIDER */
.divider {
  border: none;
  border-top: 1.5px solid #d1d5db;
  margin: 20px 0;
  width: 100%;
}

/* LOGOUT */
.logout {
  color: #dc2626;
  font-weight: 600;
  margin-top: 0;
}

.logout:hover {
  background: #fef2f2;
  color: #b91c1c;
}
</style>