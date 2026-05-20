<template>
  <div class="app-wrapper">
    <div class="bg-blob bg-blob-left"></div>
    <div class="bg-blob bg-blob-right"></div>
    <div class="bg-blob bg-blob-top"></div>
    <div class="bg-dots"></div>
    <div class="deco-ring deco-ring-tl"></div>
    <div class="deco-ring deco-ring-br"></div>

    <Header />

    <main class="main-content">
      <RouterView />
    </main>

    <Footerlanding />
  </div>
</template>

<script setup>
import Header from '@/components/commentlanding/Header.vue'
import Footerlanding from '@/components/commentlanding/Footerlanding.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
.app-wrapper {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  background: var(--bg-body);
  transition: background var(--transition);
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
      var(--blob-color-a) 0%,
      transparent 70%);
}

.bg-blob-right {
  bottom: -120px;
  right: -120px;
  width: 480px;
  height: 420px;
  background: radial-gradient(ellipse,
      var(--blob-color-b) 0%,
      transparent 70%);
}

.bg-blob-top {
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 340px;
  background: radial-gradient(ellipse,
      var(--blob-color-c) 0%,
      transparent 70%);
}

/* Dot Grid */
.bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle,
      var(--dot-color) 1.5px,
      transparent 1.5px);
  background-size: 36px 36px;
  pointer-events: none;
  z-index: 0;
}

/* Decorative rings */
.deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid var(--ring-border);
  pointer-events: none;
  z-index: 0;
}

.deco-ring-tl {
  top: -60px;
  left: -60px;
  width: 280px;
  height: 280px;
  box-shadow: 0 0 0 50px var(--ring-glow-a);
}

.deco-ring-br {
  bottom: -80px;
  right: -80px;
  width: 320px;
  height: 320px;
  box-shadow: 0 0 0 60px var(--ring-glow-b);
}
</style>