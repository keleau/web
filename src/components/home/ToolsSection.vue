<script setup lang="ts">
import type { Component } from 'vue'
import { ArrowRight, Camera, MagicStick, User, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SmartImage from '@/components/common/SmartImage.vue'
import { features, type FeatureIcon } from '@/data/home'

const iconMap: Record<FeatureIcon, Component> = {
  bust: User,
  full: UserFilled,
  scan: Camera,
  vertex: MagicStick,
}

function openFeature(title: string) {
  ElMessage.info(`「${title}」为演示入口，登录后即可开始创作`)
}
</script>

<template>
  <section id="features" class="page-section tools" aria-label="生产工具">
    <div class="section-head">
      <div class="section-head__title">
        <span class="kicker">03 — tools</span>
        <h2>四种建模方式</h2>
      </div>
      <p class="section-head__note">
        照片、扫描件或顶点色模型，都能进入同一条产线。选一个最接近你手头素材的起点。
      </p>
    </div>

    <ul class="tools__list">
      <li v-for="(item, index) in features" :key="item.id">
        <button
          class="tool-row reveal"
          type="button"
          :style="{ transitionDelay: `${index * 60}ms` }"
          @click="openFeature(item.title)"
        >
          <span class="tool-row__no">{{ String(index + 1).padStart(2, '0') }}</span>

          <span class="tool-row__icon">
            <el-icon :size="18"><component :is="iconMap[item.icon]" /></el-icon>
          </span>

          <span class="tool-row__text">
            <span class="tool-row__title">{{ item.title }}</span>
            <span class="tool-row__desc">{{ item.desc }}</span>
          </span>

          <span class="tool-row__meta">{{ item.duration }}</span>

          <span class="tool-row__arrow">
            <el-icon :size="14"><ArrowRight /></el-icon>
          </span>

          <span class="tool-row__preview" aria-hidden="true">
            <SmartImage :src="item.image" alt="" />
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.tools {
  padding-bottom: 0;
}

.tools__list {
  list-style: none;
}

.tool-row {
  position: relative;
  display: grid;
  width: 100%;
  min-height: 92px;
  grid-template-columns: 38px 54px minmax(0, 1fr) 96px 30px;
  align-items: center;
  gap: clamp(14px, 2vw, 26px);
  padding: 18px 4px;
  border-bottom: 1px solid var(--hairline);
  text-align: left;
  transition: background-color 0.3s ease;
}

.tool-row:first-child {
  border-top: 1px solid var(--hairline);
}

.tool-row::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(90deg, rgba(230, 192, 150, 0.06), transparent 55%);
  content: '';
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.tool-row:hover::before,
.tool-row:focus-visible::before {
  opacity: 1;
}

.tool-row:focus-visible {
  outline: 1px solid var(--brand);
  outline-offset: 2px;
}

.tool-row__no {
  position: relative;
  z-index: 1;
  color: var(--text-dim);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.1em;
  transition: color 0.3s ease;
}

.tool-row:hover .tool-row__no {
  color: var(--sand);
}

.tool-row__icon {
  position: relative;
  z-index: 1;
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--hairline);
  border-radius: 50%;
  color: var(--text-secondary);
  transition:
    color 0.3s ease,
    border-color 0.3s ease,
    background 0.3s ease;
}

.tool-row:hover .tool-row__icon {
  border-color: var(--sand-border);
  background: var(--sand-soft);
  color: var(--sand);
}

.tool-row__text {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
}

.tool-row__title {
  color: var(--text-primary);
  font-size: clamp(17px, 1.4vw, 20px);
  font-weight: 700;
  letter-spacing: -0.015em;
}

.tool-row__desc {
  overflow: hidden;
  color: var(--text-muted);
  font-size: 12.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tool-row__meta {
  position: relative;
  z-index: 1;
  color: var(--text-dim);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-align: right;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.tool-row:hover .tool-row__meta {
  color: var(--text-muted);
}

.tool-row__arrow {
  position: relative;
  z-index: 1;
  display: inline-flex;
  justify-content: flex-end;
  color: var(--text-dim);
  transition:
    color 0.3s ease,
    transform 0.3s var(--ease-out);
}

.tool-row:hover .tool-row__arrow {
  color: var(--sand);
  transform: translateX(4px);
}

.tool-row__preview {
  position: absolute;
  top: 50%;
  right: 132px;
  z-index: 6;
  width: 208px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: var(--surface-2);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%) translateX(12px) rotate(-1.6deg) scale(0.96);
  transition:
    opacity 0.35s ease,
    transform 0.5s var(--ease-out);
}

.tool-row__preview :deep(.smart-image) {
  position: absolute;
  inset: 0;
}

.tool-row:hover .tool-row__preview,
.tool-row:focus-visible .tool-row__preview {
  opacity: 1;
  transform: translateY(-50%) translateX(0) rotate(-1.6deg) scale(1);
}

@media (max-width: 1023px) {
  .tool-row__preview {
    display: none;
  }
}

@media (max-width: 640px) {
  .tool-row {
    grid-template-columns: 26px 40px minmax(0, 1fr) 20px;
    gap: 12px;
  }

  .tool-row__meta {
    display: none;
  }

  .tool-row__icon {
    width: 36px;
    height: 36px;
  }
}
</style>
