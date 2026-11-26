<script setup lang="ts">
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import FloatingCart from '@/components/common/FloatingCart.vue'
import { useReveal } from '@/composables/useReveal'

// 初始化滚动入场动画（IntersectionObserver）
useReveal()
</script>

<template>
  <div class="app-shell">
    <SiteHeader />
    <main class="site-main">
      <router-view />
    </main>
    <SiteFooter />
    <FloatingCart />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: var(--bg);
}

.site-main {
  flex: 1;
}
</style>
