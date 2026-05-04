<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/comment/Navbar.vue'
import Sidebar from '@/components/comment/Sidebar.vue'
</script>

<template>
  <div class="layout">
     <Navbar />
    <div class="main">
     
      <div style="display: flex; gap: 20px; padding: 20px;">
        <Sidebar />
        <div style="flex: 1; padding: 20px;">
          <RouterView />
         </div>
       </div>
    
    </div>
  </div>
</template>

<style>
.layout {
  height: 100vh;
  background-color: #f0f2f5;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>