<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Navbar from '@/components/comment/Navbar.vue'
import Sidebar from '@/components/comment/Sidebar.vue'

const isMobile = ref(false)
const isCollapsed = ref(false)
const isDrawerOpen = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) isDrawerOpen.value = false
}

function toggleSidebar() {
  if (isMobile.value) {
    isDrawerOpen.value = !isDrawerOpen.value
  } else {
    isCollapsed.value = !isCollapsed.value
  }
}

function closeDrawer() {
  isDrawerOpen.value = false
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="layout">

    <div class="navbar-row">
      <Navbar @toggle-sidebar="toggleSidebar" :is-mobile="isMobile" />
    </div>

    <div class="main">

      <!-- Mobile overlay -->
      <Transition name="fade">
        <div
          v-if="isMobile && isDrawerOpen"
          class="drawer-overlay"
          @click="closeDrawer"
        />
      </Transition>

      <!-- Sidebar -->
      <div :class="['sidebar-wrap', { 'sidebar-drawer': isMobile }]">
        <Transition name="slide">
          <Sidebar
            v-show="!isMobile || isDrawerOpen"
            :is-collapsed="!isMobile && isCollapsed"
            :is-mobile="isMobile"
            @close="closeDrawer"
          />
        </Transition>
      </div>

      <div class="content">
        <router-view />
      </div>

    </div>
  </div>
</template>

<style>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #eaf1fa;
}

/* ── FIX: navbar-row លើស sidebar ── */
.navbar-row {
  flex-shrink: 0;
  position: relative;
  z-index: 1001;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: visible;
  position: relative;
  min-height: 0;
}

.sidebar-wrap {
  display: flex;
  flex-shrink: 0;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  min-width: 0;
}

.sidebar-drawer {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  margin: 0 !important;
  border-radius: 0 20px 20px 0 !important;
  z-index: 1000;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.28s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>