<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import FloatingCart from '@/components/common/FloatingCart.vue'

let pending: HTMLElement[] = []
let ticking = false
let timer: number | undefined

function revealVisible() {
  if (!pending.length) return
  const limit = window.innerHeight * 0.96
  pending = pending.filter((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.top > limit || rect.bottom <= 0) return true
    el.classList.add('is-revealed')
    return false
  })
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    revealVisible()
  })
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return

  pending = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
  if (!pending.length) return

  document.documentElement.classList.add('reveal-enabled')
  revealVisible()

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  // 兜底轮询：即使滚动事件不触发，也能正常显示
  timer = window.setInterval(() => {
    if (!pending.length) {
      window.clearInterval(timer)
      return
    }
    revealVisible()
  }, 700)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (timer) window.clearInterval(timer)
})
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
