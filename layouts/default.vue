<script lang="ts" setup>
import SplashScreen from '@/components/SplashScreen.vue';
import DefaultLayoutWithVerticalNav from './components/DefaultLayoutWithVerticalNav.vue';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const showSplash = ref(true)
const router = useRouter()

router.beforeEach((to, from, next) => {
  showSplash.value = true
  next()
})

router.afterEach(() => {
  // Delay to let progress finish
  setTimeout(() => {
    showSplash.value = false
  }, 800)
})

onMounted(() => {
  setTimeout(() => {
    showSplash.value = false
  }, 1000)
})
</script>

<template>

  <SplashScreen :show="showSplash" />
  <DefaultLayoutWithVerticalNav>
    <slot />
  </DefaultLayoutWithVerticalNav>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
