<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDown, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SmartImage from '@/components/common/SmartImage.vue'
import { heroItems } from '@/data/home'

const active = ref(0)
const current = computed(() => heroItems[active.value])

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function select(index: number) {
  active.value = index
}

function startCreating() {
  ElMessage.success('演示入口：上传一张照片，即可开始生成专属手办')
}

function jumpToProcess() {
  document.querySelector('#process')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__masthead">
      <span class="hero__masthead-mark">造物工坊</span>
      <span class="hero__masthead-rule" aria-hidden="true"></span>
      <span class="hero__masthead-note">DONGGUAN — 2026</span>
      <span class="hero__masthead-spacer"></span>
      <span class="hero__masthead-note">SCROLL ↓</span>
    </div>

    <div class="hero__grid">
      <div class="hero__copy">
        <p class="kicker">generate · print · deliver</p>

        <h1 id="hero-title" class="hero__title">
          把创意变成<br />
          可以拿在手里的礼物
        </h1>

        <p class="hero__sub">
          生成、生产、交付一站完成。上传一张照片，剩下的交给工坊——
          <em>它会被做成一件真正能摸到的作品。</em>
        </p>

        <div class="hero__actions">
          <button class="btn btn--primary" type="button" @click="startCreating">
            开始制作
            <el-icon><ArrowRight /></el-icon>
          </button>
          <button class="btn btn--text" type="button" @click="jumpToProcess">
            看它怎么被做出来
            <el-icon><ArrowDown /></el-icon>
          </button>
        </div>

        <ul class="hero__stats">
          <li>
            <strong>1 件</strong>
            <span>起印数量</span>
          </li>
          <li>
            <strong>全彩树脂</strong>
            <span>成型工艺</span>
          </li>
          <li>
            <strong>3–5 天</strong>
            <span>生产周期</span>
          </li>
        </ul>
      </div>

      <div class="hero__specimen">
        <span class="hero__specimen-label" aria-hidden="true">SPECIMEN — 作品样本</span>

        <figure class="plate">
          <div class="plate__frame" aria-hidden="true"></div>
          <span class="plate__fig">N° {{ pad(active + 1) }} / {{ pad(heroItems.length) }}</span>

          <Transition name="plate" mode="out-in">
            <SmartImage
              :key="current.id"
              class="plate__image"
              :src="current.image"
              :alt="current.title"
              :lazy="false"
            />
          </Transition>
        </figure>

        <div class="plate__caption">
          <div class="plate__caption-main">
            <h2>{{ current.title }}</h2>
            <p>{{ current.desc }}</p>
          </div>
          <span class="plate__spec">{{ current.spec }}</span>
        </div>

        <div class="hero__thumbs" role="tablist" aria-label="作品样本切换">
          <button
            v-for="(item, index) in heroItems"
            :key="item.id"
            class="hero__thumb"
            :class="{ 'is-active': index === active }"
            type="button"
            role="tab"
            :aria-selected="index === active"
            :aria-label="item.title"
            @click="select(index)"
          >
            <SmartImage :src="item.image" alt="" :lazy="false" />
            <span class="hero__thumb-index">{{ pad(index + 1) }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  max-width: var(--page-max);
  margin: 0 auto;
  padding: clamp(22px, 3vw, 40px) clamp(18px, 3vw, 40px) 0;
}

.hero::before {
  position: absolute;
  top: -120px;
  right: 0;
  width: 62%;
  height: 560px;
  background: radial-gradient(52% 48% at 62% 44%, rgba(2, 155, 254, 0.12), transparent 70%);
  content: '';
  pointer-events: none;
}

.hero__masthead {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--hairline);
  color: var(--text-dim);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero__masthead-mark {
  color: var(--text-muted);
}

.hero__masthead-rule {
  width: 40px;
  height: 1px;
  background: var(--hairline-strong);
}

.hero__masthead-spacer {
  flex: 1;
}

.hero__masthead-note {
  white-space: nowrap;
}

.hero__grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(32px, 5vw, 72px);
  padding: clamp(34px, 5vw, 72px) 0 clamp(56px, 7vw, 96px);
}

.hero__copy {
  max-width: 660px;
}

.hero__title {
  margin-top: 20px;
  font-size: clamp(38px, 4.9vw, 66px);
  font-weight: 900;
  letter-spacing: -0.045em;
  line-height: 1.04;
  text-wrap: balance;
}

.hero__sub {
  max-width: 44ch;
  margin-top: 22px;
  color: var(--text-muted);
  font-size: 14.5px;
  line-height: 1.85;
}

.hero__sub em {
  color: var(--text-secondary);
  font-style: normal;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 18px;
  margin-top: 32px;
}

.hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 18px 0;
  margin-top: clamp(36px, 5vw, 56px);
  border-top: 1px solid var(--hairline);
  padding-top: 20px;
}

.hero__stats li {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
  padding-right: clamp(20px, 2.4vw, 34px);
  border-right: 1px solid var(--hairline);
  margin-right: clamp(20px, 2.4vw, 34px);
}

.hero__stats li:last-child {
  padding-right: 0;
  border-right: 0;
  margin-right: 0;
}

.hero__stats strong {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.hero__stats span {
  color: var(--text-dim);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero__specimen {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-self: start;
}

.hero__specimen-label {
  position: absolute;
  top: 10px;
  left: -34px;
  color: var(--text-dim);
  font-size: 9.5px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
}

.plate {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  border: 1px solid var(--hairline-strong);
  background: var(--surface-1);
}

.plate__frame {
  position: absolute;
  inset: 8px;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.14);
  pointer-events: none;
}

.plate__fig {
  position: absolute;
  top: 18px;
  right: 20px;
  z-index: 3;
  padding: 3px 8px;
  background: rgba(9, 9, 11, 0.72);
  color: var(--sand);
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.18em;
  backdrop-filter: blur(6px);
}

.plate__image {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.plate-enter-active,
.plate-leave-active {
  transition:
    opacity 0.45s var(--ease-out),
    transform 0.6s var(--ease-out);
}

.plate-enter-from {
  opacity: 0;
  transform: scale(1.04);
}

.plate-leave-to {
  opacity: 0;
  transform: scale(0.99);
}

.plate__caption {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--hairline);
  margin-top: 16px;
}

.plate__caption-main {
  min-width: 0;
}

.plate__caption h2 {
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.45;
}

.plate__caption p {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 12px;
}

.plate__spec {
  flex-shrink: 0;
  padding-top: 3px;
  color: var(--sand);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.hero__thumbs {
  display: flex;
  gap: 8px;
  margin-top: 18px;
}

.hero__thumb {
  position: relative;
  width: 74px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 1px solid var(--hairline);
  background: var(--surface-1);
  opacity: 0.5;
  transition:
    opacity 0.3s ease,
    border-color 0.3s ease;
}

.hero__thumb :deep(.smart-image) {
  position: absolute;
  inset: 0;
}

.hero__thumb:hover {
  opacity: 0.85;
}

.hero__thumb.is-active {
  border-color: var(--sand-border);
  opacity: 1;
}

.hero__thumb-index {
  position: absolute;
  right: 5px;
  bottom: 3px;
  z-index: 1;
  color: rgba(255, 255, 255, 0.72);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}

@media (max-width: 767px) {
  .hero__masthead-note:last-child,
  .hero__specimen-label {
    display: none;
  }

  .hero__thumbs {
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .hero__thumb {
    width: 64px;
    flex-shrink: 0;
  }
}

@media (min-width: 1024px) {
  .hero__grid {
    grid-template-columns: minmax(0, 0.94fr) minmax(0, 1.06fr);
    align-items: stretch;
  }

  .hero__specimen {
    padding-top: 6px;
  }

  .hero__copy {
    display: flex;
    flex-direction: column;
  }

  .hero__stats {
    margin-top: auto;
    padding-top: 22px;
  }
}
</style>
