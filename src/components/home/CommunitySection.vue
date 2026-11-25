<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SectionTabs from '@/components/common/SectionTabs.vue'
import { communityCategories, communityItems } from '@/data/home'
import CommunityCard from './CommunityCard.vue'

const AUTOPLAY_INTERVAL = 5000

const activeCategory = ref('全部')
const viewportRef = ref<HTMLElement | null>(null)
const canPrev = ref(false)
const canNext = ref(true)
const isHovering = ref(false)

let autoplayTimer: number | undefined

const tabOptions = communityCategories.map((category) => ({
  label: category,
  value: category,
}))

const visibleItems = computed(() =>
  activeCategory.value === '全部'
    ? communityItems
    : communityItems.filter((item) => item.category === activeCategory.value),
)

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function updateArrows() {
  const viewport = viewportRef.value
  if (!viewport) return
  const maxScroll = viewport.scrollWidth - viewport.clientWidth
  canPrev.value = viewport.scrollLeft > 4
  canNext.value = viewport.scrollLeft < maxScroll - 4
}

function scrollToPage(direction: 1 | -1) {
  const viewport = viewportRef.value
  if (!viewport) return

  const page = viewport.clientWidth
  const max = viewport.scrollWidth - viewport.clientWidth
  const current = Math.round(viewport.scrollLeft)

  if (direction === 1 && current >= max - 4) {
    viewport.scrollTo({ left: 0, behavior: 'smooth' })
    return
  }
  if (direction === -1 && current <= 4) {
    viewport.scrollTo({ left: max, behavior: 'smooth' })
    return
  }

  const target = Math.min(Math.max(Math.round(current / page) * page + direction * page, 0), max)
  viewport.scrollTo({ left: target, behavior: 'smooth' })
}

function startAutoplay() {
  stopAutoplay()
  if (prefersReducedMotion) return
  autoplayTimer = window.setInterval(() => {
    if (isHovering.value) return
    scrollToPage(1)
  }, AUTOPLAY_INTERVAL)
}

function stopAutoplay() {
  if (autoplayTimer !== undefined) {
    window.clearInterval(autoplayTimer)
    autoplayTimer = undefined
  }
}

function startCreating() {
  ElMessage.success('演示入口：上传一张照片，即可开始生成专属手办')
}

function openItem(title: string) {
  ElMessage.info(`正在打开「${title}」的创作详情（演示）`)
}

watch(activeCategory, async () => {
  await nextTick()
  viewportRef.value?.scrollTo({ left: 0 })
  updateArrows()
})

onMounted(() => {
  updateArrows()
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<template>
  <section id="community" class="community-section" aria-label="社区聚焦">
    <div class="community-head">
      <div class="community-head__title">
        <h2>社区聚焦</h2>
        <button class="pill-cta" type="button" @click="startCreating">立即制作</button>
      </div>
      <SectionTabs v-model="activeCategory" :options="tabOptions" />
    </div>

    <div
      class="community-carousel"
      :class="{ 'is-start': !canPrev, 'is-end': !canNext }"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <div ref="viewportRef" class="community-viewport" @scroll.passive="updateArrows">
        <div class="community-track">
          <div v-for="item in visibleItems" :key="item.id" class="community-slide">
            <CommunityCard :item="item" @select="openItem(item.title)" />
          </div>
        </div>
      </div>

      <button
        class="carousel-arrow is-prev"
        type="button"
        aria-label="上一组"
        @click="scrollToPage(-1)"
      >
        <el-icon :size="16"><ArrowLeft /></el-icon>
      </button>
      <button
        class="carousel-arrow is-next"
        type="button"
        aria-label="下一组"
        @click="scrollToPage(1)"
      >
        <el-icon :size="16"><ArrowRight /></el-icon>
      </button>
    </div>
  </section>
</template>

<style scoped>
.community-section {
  width: 97%;
  max-width: var(--page-max);
  margin: 0 auto 72px;
}

.community-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 32px;
}

.community-head__title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.community-head__title h2 {
  color: var(--text-primary);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.6px;
  line-height: 1.2;
}

.pill-cta {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(51, 177, 254, 0.25);
  color: #e6f6ff;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.pill-cta:hover {
  background: rgba(51, 177, 254, 0.38);
}

.community-carousel {
  position: relative;
}

.community-carousel::before,
.community-carousel::after {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 4;
  width: 24px;
  content: '';
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.community-carousel::before {
  left: 0;
  background: linear-gradient(to right, rgba(9, 9, 11, 0.72), rgba(9, 9, 11, 0));
}

.community-carousel.is-start::before {
  opacity: 0;
}

.community-carousel::after {
  right: 0;
  background: linear-gradient(to left, rgba(9, 9, 11, 0.72), rgba(9, 9, 11, 0));
}

.community-carousel.is-end::after {
  opacity: 0;
}

.community-viewport {
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.community-viewport::-webkit-scrollbar {
  display: none;
}

.community-track {
  display: flex;
  gap: 20px;
}

.community-slide {
  width: 100%;
  flex: 0 0 auto;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  z-index: 5;
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  background: rgba(24, 24, 24, 0.88);
  color: var(--text-primary);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  transform: translateY(-50%);
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background-color 0.2s ease,
    opacity 0.2s ease;
}

.carousel-arrow:hover {
  border-color: var(--brand-border);
  background: rgba(34, 34, 37, 0.95);
  color: var(--brand);
}

.carousel-arrow.is-prev {
  left: 6px;
}

.carousel-arrow.is-next {
  right: 6px;
}

@media (min-width: 640px) {
  .community-slide {
    width: calc((100% - 20px) / 2);
  }

  .community-head__title h2 {
    font-size: 30px;
  }
}

@media (min-width: 1024px) {
  .community-section {
    margin-bottom: 96px;
  }

  .community-head {
    margin-bottom: 40px;
  }

  .community-head__title h2 {
    font-size: 34px;
  }

  .community-slide {
    width: calc((100% - 40px) / 3);
  }

  .carousel-arrow.is-prev {
    left: -20px;
  }

  .carousel-arrow.is-next {
    right: -20px;
  }
}

@media (min-width: 1280px) {
  .community-slide {
    width: calc((100% - 60px) / 4);
  }
}
</style>
