<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2 class="title">ម៉ីនុយ</h2>
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/dashboard" class="nav-item" active-class="nav-item--active">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="8" height="8" rx="1"/>
          <rect x="13" y="3" width="8" height="8" rx="1"/>
          <rect x="3" y="13" width="8" height="8" rx="1"/>
          <rect x="13" y="13" width="8" height="8" rx="1"/>
        </svg>
        <span>ផ្ទាំងគ្រប់គ្រង</span>
      </RouterLink>

      <RouterLink to="/transactions" class="nav-item" disabled>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.8"/>
          <path d="M3 17h6M3 20h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M16 8v12m0 0l-3-3m3 3l3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>ប្រតិបត្តិការ</span>
      </RouterLink>

      <RouterLink to="/report" class="nav-item" disabled>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>របាយការណ៍</span>
      </RouterLink>

      <RouterLink to="/budget" class="nav-item" disabled>
        <i class="bi bi-credit-card-2-front"></i>
        <span>ថវិកា</span>
      </RouterLink>

      <RouterLink to="/goal" class="nav-item" disabled>
        <i class="bi bi-bullseye"></i>
        <span>គោលដៅ</span>
      </RouterLink>
    </nav>

    <hr class="divider" />

    <button class="nav-item logout" @click="handleLogout">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M17 16l4-4m0 0l-4-4m4 4H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13 21H6a2 2 0 01-2-2V5a2 2 0 012-2h7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>តាកចេញ</span>
    </button>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function handleLogout() {
  router.push('/landing')
}
</script>

<style scoped>
.sidebar {
  width: 300px;
  min-width: 240px;
  height: 100vh;
  padding: 24px 16px;
  background: #f5f6fa;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 4px;
  font-family: 'Kantumruy Pro', 'Khmer OS', sans-serif;
  letter-spacing: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
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

.nav-item:hover:not(:disabled) {
  background: #e8edf7;
  color: #1d3a8a;
}

.nav-item:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.nav-item--active {
  background: #1e3a8a !important;
  color: #ffffff !important;
  font-weight: 600;
  border-radius: 10px;
}

.nav-item--active:hover {
  background: #1e40af !important;
}

.divider {
  border: none;
  border-top: 1.5px solid #d1d5db;
  margin: 20px 0;
}

.logout {
  color: #dc2626;
  font-weight: 600;
  gap: 14px;
  margin-top: 0;
}

.logout:hover {
  background: #fef2f2;
  color: #b91c1c;
}
</style>