<template>
  <div class="app-wrapper">

    <!-- Background layers -->
    <div class="bg-blob bg-blob-left"></div>
    <div class="bg-blob bg-blob-right"></div>
    <div class="bg-blob bg-blob-top"></div>
    <div class="bg-dots"></div>
    <div class="deco-ring deco-ring-tl"></div>
    <div class="deco-ring deco-ring-br"></div>

    <!-- App content -->
    <Header />

    <main class="main-content">
      <RouterView />
      <div class="deco-ring deco-ring-br"></div>
    </main>


    <Footerlanding />

  </div>
</template>

<script setup>
import Header from '@/components/commentlanding/Header.vue'
import Footerlanding from '@/components/commentlanding/Footerlanding.vue';
import { RouterView } from 'vue-router'
</script>

<style scoped>
.app-wrapper {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  background: linear-gradient(135deg,
      #EEF4FF 0%,
      #F5F8FF 60%,
      #E8F0FE 100%);
}

.main-content {
  position: relative;
  z-index: 1;
}

/* Blobs */
.bg-blob {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.bg-blob-left {
  top: -120px;
  left: -120px;
  width: 520px;
  height: 460px;
  background: radial-gradient(ellipse,
      rgba(200, 217, 255, 0.55) 0%,
      transparent 70%);
}

.bg-blob-right {
  bottom: -120px;
  right: -120px;
  width: 480px;
  height: 420px;
  background: radial-gradient(ellipse,
      rgba(181, 212, 244, 0.45) 0%,
      transparent 70%);
}

.bg-blob-top {
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 340px;
  background: radial-gradient(ellipse,
      rgba(221, 232, 255, 0.6) 0%,
      transparent 70%);
}

/* Dot Grid */
.bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle,
      rgba(55, 138, 221, 0.12) 1.5px,
      transparent 1.5px);
  background-size: 36px 36px;
  pointer-events: none;
  z-index: 0;
}

/* Decorative rings */
.deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(55, 138, 221, 0.1);
  pointer-events: none;
  z-index: 0;
}

.deco-ring-tl {
  top: -60px;
  left: -60px;
  width: 280px;
  height: 280px;
  box-shadow: 0 0 0 50px rgba(55, 138, 221, 0.04);
}

.deco-ring-br {
  bottom: -80px;
  right: -80px;
  width: 320px;
  height: 320px;
  box-shadow: 0 0 0 60px rgba(24, 95, 165, 0.04);
}
</style>