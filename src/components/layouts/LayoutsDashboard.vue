<script setup>
import { ref } from 'vue'
import Navbar from '@/components/comment/Navbar.vue'
import Sidebar from '@/components/comment/Sidebar.vue'

const sidebarCollapsed = ref(false)

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="layout">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <div class="main">
      <Sidebar :is-collapsed="sidebarCollapsed" />
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
  background-color:#eaf1fa;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>