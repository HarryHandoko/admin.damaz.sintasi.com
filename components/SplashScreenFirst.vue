<template>
  <transition name="fade">
    <div v-if="visible" class="splash-screen">
      <img src="/favicon.ico" alt="Logo" />
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>Loading... {{ progress }}%</p>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const visible = ref(true)
const progress = ref(0)

onMounted(() => {
  let percent = 0
  const interval = setInterval(() => {
    percent += 2
    progress.value = percent
    if (percent >= 100) {
      clearInterval(interval)
      setTimeout(() => visible.value = false, 500) // Short delay to let bar finish
    }
  }, 40) // 40ms * 50 = 2 seconds
})
</script>

<style scoped>
.splash-screen {
  position: fixed;
  z-index: 9999;
  background: #fff;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 80px;
  animation: spin 1s linear infinite;
}

.progress-bar-container {
  width: 200px;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  margin: 16px 0 8px 0;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: #3498db;
  width: 0;
  transition: width 0.1s linear;
  border-radius: 4px;
}

/* Fade animation for splash */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
