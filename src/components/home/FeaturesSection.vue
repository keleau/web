<script setup lang="ts">
import type { Component } from 'vue'
import { ArrowRight, Camera, MagicStick, User, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
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
  <section id="features" class="feature-list" aria-label="功能入口">
    <button
      v-for="(item, index) in features"
      :key="item.id"
      class="feature-row"
      type="button"
      @click="openFeature(item.title)"
    >
      <span class="feature-row__index">{{ String(index + 1).padStart(2, '0') }}</span>
      <span class="feature-row__icon">
        <el-icon :size="17"><component :is="iconMap[item.icon]" /></el-icon>
      </span>
      <span class="feature-row__text">
        <span class="feature-row__title">{{ item.title }}</span>
        <span class="feature-row__desc">{{ item.desc }}</span>
      </span>
      <el-icon class="feature-row__arrow" :size="14"><ArrowRight /></el-icon>
    </button>
  </section>
</template>

<style scoped>
.feature-list {
  margin-top: 32px;
}

.feature-row {
  display: flex;
  width: 100%;
  height: 64px;
  align-items: center;
  gap: 14px;
  padding: 0 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: left;
  transition: background-color 0.2s ease;
}

.feature-row:last-child {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.feature-row:hover,
.feature-row:focus-visible {
  background-color: rgba(255, 255, 255, 0.025);
}

.feature-row:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: -2px;
}

.feature-row__index {
  width: 22px;
  flex-shrink: 0;
  color: #7c7c85;
  font-size: 11px;
  letter-spacing: 1px;
}

.feature-row__icon {
  display: inline-flex;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--brand-border);
  border-radius: 10px;
  background: var(--brand-soft);
  color: #4cc3ff;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.feature-row:hover .feature-row__icon {
  background: rgba(2, 155, 254, 0.24);
  color: var(--brand);
}

.feature-row__text {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.feature-row__title {
  overflow: hidden;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feature-row__desc {
  overflow: hidden;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feature-row__arrow {
  color: #55555c;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.feature-row:hover .feature-row__arrow {
  color: var(--brand);
  transform: translateX(2px);
}

@media (min-width: 1024px) {
  .feature-row {
    height: 68px;
  }
}

@media (min-width: 1280px) {
  .feature-list {
    margin-top: 36px;
  }

  .feature-row {
    height: 70px;
  }

  .feature-row__title {
    font-size: 14.5px;
  }
}
</style>
