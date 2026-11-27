/* 滚动入场动画：App.vue 初始化，组件用 .reveal + transitionDelay 参与 */

import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useReveal() {
  const route = useRoute()
  let observer: IntersectionObserver | null = null
  let mutationObserver: MutationObserver | null = null
  let scheduled = false

  function observeReveals() {
    if (!observer) return
    document.querySelectorAll<HTMLElement>('.reveal:not(.is-revealed)').forEach((el) => {
      observer?.observe(el)
    })
  }

  /** 合并同一帧内的多次 DOM 变化，避免筛选/路由切换时重复扫描 */
  function scheduleObserve() {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(() => {
      scheduled = false
      observeReveals()
    })
  }

  onMounted(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !('IntersectionObserver' in window)) return

    document.documentElement.classList.add('reveal-enabled')

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-revealed')
          observer?.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    )

    // 异步路由、筛选后的新卡片、弹窗内容都可能在首轮扫描之后才出现
    mutationObserver = new MutationObserver(scheduleObserve)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    observeReveals()
  })

  watch(
    () => route.fullPath,
    async () => {
      await nextTick()
      scheduleObserve()
    },
  )

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    mutationObserver?.disconnect()
    mutationObserver = null
    document.documentElement.classList.remove('reveal-enabled')
  })
}
