<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { RouterLink } from 'vue-router'
import CommunityGallery from '@/components/community/CommunityGallery.vue'
import SectionHead from '@/components/common/SectionHead.vue'
import type { CommunityItem } from '@/types/community'

function startCreating() {
  ElMessage.success('演示入口：上传一张照片，即可开始生成专属手办')
}

function openItem(item: CommunityItem) {
  ElMessage.info(`正在打开「${item.title}」的创作详情（演示）`)
}
</script>

<template>
  <section id="community" class="page-section home-community" aria-label="社区聚焦">
    <SectionHead
      kicker="04 — community"
      title="社区聚焦"
      note="真实的照片、真实的打印件。看看别人把谁做成了桌上的那一件，再决定自己的第一件做什么。"
    >
      <template #actions>
        <button class="home-community__cta" type="button" @click="startCreating">
          立即制作
          <el-icon :size="12"><ArrowRight /></el-icon>
        </button>
      </template>
    </SectionHead>

    <CommunityGallery :limit="4" :show-tabs="false" @select="openItem" />

    <div class="home-community__foot">
      <span>所有作品均由社区创作者上传，制作参数可在详情页查看。</span>
      <RouterLink class="home-community__more" to="/community">
        进入社区画廊
        <el-icon :size="12"><ArrowRight /></el-icon>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.home-community__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}

.home-community__cta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border: 1px solid var(--brand-border);
  border-radius: var(--radius-pill);
  background: var(--brand-soft);
  color: #bfe6ff;
  font-size: 11.5px;
  font-weight: 600;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;
}

.home-community__cta:hover {
  border-color: var(--brand);
  background: rgba(2, 155, 254, 0.28);
  color: #fff;
}

.home-community__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: clamp(20px, 2.6vw, 34px);
  padding-top: 16px;
  border-top: 1px solid var(--hairline);
  color: var(--text-dim);
  font-size: 11px;
}

.home-community__more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 11.5px;
  transition: color 0.25s ease;
}

.home-community__more:hover {
  color: var(--brand-strong);
}

.home-community__more .el-icon {
  transition: transform 0.25s var(--ease-out);
}

.home-community__more:hover .el-icon {
  transform: translateX(3px);
}
</style>
