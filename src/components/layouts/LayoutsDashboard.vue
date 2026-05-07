<script setup>
import Navbar from '@/components/comment/Navbar.vue'
import Sidebar from '@/components/comment/Sidebar.vue'
</script>

<template>
  <div class="layout">
    <Navbar />
    <div class="main">
      <Sidebar />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style>
.layout {
  height: 100vh;
  display: flex;          /* ← add this */
  flex-direction: column; /* ← add this */
  background-color: #f0f2f5;
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