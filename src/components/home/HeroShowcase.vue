<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import FeaturesSection from '@/components/home/FeaturesSection.vue'
import SmartImage from '@/components/common/SmartImage.vue'
import { heroItems } from '@/data/home'

interface CarouselApi {
  prev: () => void
  next: () => void
  setActiveItem: (index: number) => void
}

const carouselRef = ref<CarouselApi | null>(null)
const activeIndex = ref(0)

function prevSlide() {
  carouselRef.value?.prev()
}

function nextSlide() {
  carouselRef.value?.next()
}

function goTo(index: number) {
  carouselRef.value?.setActiveItem(index)
}

function onSlideChange(index: number) {
  activeIndex.value = index
}

function startCreating() {
  ElMessage.success('演示入口：上传一张照片，即可开始生成专属手办')
}

function browseShop() {
  document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__copy">
      <span class="hero__eyebrow">GENERATE · PRINT · DELIVER</span>
      <h1 id="hero-title">把创意变成<br />可以拿在手里的礼物</h1>
      <p class="hero__sub">生成 + 生产 + 交付一站完成</p>
      <div class="hero__actions">
        <button class="hero__btn is-primary" type="button" @click="startCreating">立即制作</button>
        <button class="hero__btn is-ghost" type="button" @click="browseShop">浏览手办商城</button>
      </div>

      <FeaturesSection />
    </div>

    <div class="hero__visual">
      <el-carousel
        ref="carouselRef"
        class="hero-carousel"
        height="100%"
        :interval="6000"
        arrow="never"
        indicator-position="none"
        @change="onSlideChange"
      >
        <el-carousel-item v-for="item in heroItems" :key="item.id">
          <article class="hero-slide">
            <SmartImage
              class="hero-slide__image"
              :src="item.image"
              :alt="item.title"
              :lazy="false"
            />
            <span class="hero-slide__veil" aria-hidden="true" />
            <div class="hero-slide__copy">
              <span class="hero-slide__tag">精选场景</span>
              <h2>{{ item.title }}</h2>
              <p>{{ item.desc }}</p>
            </div>
          </article>
        </el-carousel-item>
      </el-carousel>

      <button class="hero-arrow is-prev" type="button" aria-label="上一张" @click="prevSlide">
        <el-icon :size="16"><ArrowLeft /></el-icon>
      </button>
      <button class="hero-arrow is-next" type="button" aria-label="下一张" @click="nextSlide">
        <el-icon :size="16"><ArrowRight /></el-icon>
      </button>

      <div class="hero-pager">
        <span class="hero-pager__count">
          {{ pad(activeIndex + 1) }} <em>/ {{ pad(heroItems.length) }}</em>
        </span>
        <span class="hero-pager__dots">
          <button
            v-for="(item, index) in heroItems"
            :key="item.id"
            type="button"
            :class="{ 'is-active': index === activeIndex }"
            :aria-label="`切换到第 ${index + 1} 张`"
            @click="goTo(index)"
          />
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  display: grid;
  width: 97%;
  max-width: var(--page-max);
  grid-template-columns: 1fr;
  align-items: center;
  gap: 36px;
  margin: 0 auto;
  padding: 32px 0 64px;
}

.hero__copy {
  max-width: 640px;
}

.hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--brand);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
}

.hero__eyebrow::before {
  width: 22px;
  height: 1px;
  background: var(--brand);
  content: '';
}

.hero h1 {
  margin-top: 14px;
  color: var(--text-primary);
  font-size: 32px;
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1.3;
}

.hero__sub {
  margin-top: 12px;
  color: var(--text-muted);
  font-size: 14px;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.hero__btn {
  display: inline-flex;
  height: 44px;
  align-items: center;
  padding: 0 24px;
  border-radius: 11px;
  font-size: 13px;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.hero__btn.is-primary {
  background: var(--brand);
  color: #001018;
  box-shadow: 0 10px 28px rgba(2, 155, 254, 0.24);
}

.hero__btn.is-primary:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
}

.hero__btn.is-ghost {
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: var(--text-secondary);
}

.hero__btn.is-ghost:hover {
  border-color: rgba(255, 255, 255, 0.38);
  color: var(--text-primary);
}

.hero__visual {
  position: relative;
  height: 360px;
}

.hero-carousel {
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface-1);
}

.hero-carousel :deep(.el-carousel__container) {
  height: 100%;
}

.hero-slide {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.hero-slide__image {
  position: absolute;
  inset: 0;
}

.hero-slide__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(9, 9, 11, 0.9) 0%,
    rgba(9, 9, 11, 0.36) 34%,
    rgba(9, 9, 11, 0) 62%
  );
  pointer-events: none;
}

.hero-slide__copy {
  position: absolute;
  right: 112px;
  bottom: 24px;
  left: 24px;
}

.hero-slide__tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border: 1px solid var(--brand-border);
  border-radius: 6px;
  background: rgba(2, 155, 254, 0.22);
  color: #bfe6ff;
  font-size: 10.5px;
  backdrop-filter: blur(6px);
}

.hero-slide h2 {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
  line-height: 1.4;
}

.hero-slide p {
  margin-top: 6px;
  color: #b9b9c0;
  font-size: 12px;
  line-height: 1.5;
}

.hero-arrow {
  position: absolute;
  top: 50%;
  z-index: 5;
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(9, 9, 11, 0.55);
  color: var(--text-primary);
  backdrop-filter: blur(10px);
  transform: translateY(-50%);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.hero-arrow:hover {
  border-color: var(--brand-border);
  background: rgba(9, 9, 11, 0.78);
  color: var(--brand);
}

.hero-arrow.is-prev {
  left: 16px;
}

.hero-arrow.is-next {
  right: 16px;
}

.hero-pager {
  position: absolute;
  right: 20px;
  bottom: 18px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 12px;
}

.hero-pager__count {
  color: rgba(255, 255, 255, 0.62);
  font-size: 11px;
  letter-spacing: 1px;
}

.hero-pager__count em {
  color: rgba(255, 255, 255, 0.32);
  font-style: normal;
}

.hero-pager__dots {
  display: flex;
  align-items: center;
  gap: 5px;
}

.hero-pager__dots button {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
  transition:
    width 0.25s ease,
    background-color 0.25s ease;
}

.hero-pager__dots button.is-active {
  width: 20px;
  background: var(--brand);
}

@media (max-width: 639px) {
  .hero-arrow {
    display: none;
  }

  .hero-pager {
    top: 14px;
    right: 14px;
    bottom: auto;
  }

  .hero-slide__copy {
    right: 20px;
    bottom: 20px;
    left: 20px;
  }
}

@media (min-width: 768px) {
  .hero {
    gap: 40px;
    padding: 36px 0 72px;
  }

  .hero h1 {
    font-size: 40px;
  }

  .hero__visual {
    height: 440px;
  }

  .hero-slide__copy {
    left: 28px;
    bottom: 28px;
  }

  .hero-slide h2 {
    font-size: 22px;
  }
}

@media (min-width: 1024px) {
  .hero {
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    gap: 48px;
    padding: 40px 0 88px;
  }

  .hero h1 {
    font-size: 44px;
  }

  .hero__visual {
    height: 540px;
  }
}

@media (min-width: 1280px) {
  .hero {
    gap: 64px;
    padding: 48px 0 96px;
  }

  .hero h1 {
    font-size: 52px;
  }

  .hero__sub {
    font-size: 16px;
  }

  .hero__visual {
    height: 560px;
  }

  .hero-slide__copy {
    right: 128px;
    bottom: 30px;
    left: 30px;
  }

  .hero-slide h2 {
    font-size: 24px;
  }

  .hero-slide p {
    font-size: 12.5px;
  }
}
</style>
