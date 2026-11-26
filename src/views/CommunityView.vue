<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { RouterLink } from 'vue-router'
import PageIntro from '@/components/common/PageIntro.vue'
import CommunityGallery from '@/components/community/CommunityGallery.vue'
import type { CommunityItem } from '@/data/community'

function openItem(item: CommunityItem) {
  ElMessage.info(`正在打开「${item.title}」的创作详情（演示）`)
}
</script>

<template>
  <div class="community-page">
    <PageIntro
      class="page-section"
      eyebrow="Community — 2026"
      title="社区画廊"
      meta="公开作品 · 每周更新"
      note="社区创作者用同一套工具做出的作品。点开任意一件，可以看到它的工艺、尺寸和制作参数。"
      align="left"
    />

    <div class="page-section community-page__body">
      <CommunityGallery @select="openItem" />

      <div class="community-page__foot">
        <p>所有作品均由社区创作者上传，制作参数可在详情页查看。</p>
        <RouterLink class="community-page__cta" :to="{ path: '/', hash: '#features' }">
          把你的照片做成第一件
          <el-icon :size="12"><ArrowRight /></el-icon>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.community-page__body {
  padding-top: clamp(6px, 1.4vw, 14px);
}

.community-page__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: clamp(32px, 4vw, 56px);
  padding-top: 18px;
  border-top: 1px solid var(--hairline);
  color: var(--text-dim);
  font-size: 11px;
}

.community-page__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  transition: color 0.25s ease;
}

.community-page__cta:hover {
  color: var(--brand-strong);
}

.community-page__cta .el-icon {
  transition: transform 0.25s var(--ease-out);
}

.community-page__cta:hover .el-icon {
  transform: translateX(3px);
}
</style>
