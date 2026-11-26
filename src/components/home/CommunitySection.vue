<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SectionTabs from '@/components/common/SectionTabs.vue'
import { communityCategories, communityItems } from '@/data/home'
import CommunityCard from './CommunityCard.vue'

const activeCategory = ref<string>('全部')

const visibleItems = computed(() =>
  activeCategory.value === '全部'
    ? communityItems
    : communityItems.filter((item) => item.category === activeCategory.value),
)

const tabOptions = computed(() =>
  communityCategories.map((category) => ({
    label: category,
    value: category,
    count:
      category === '全部'
        ? communityItems.length
        : communityItems.filter((item) => item.category === category).length,
  })),
)

function startCreating() {
  ElMessage.success('演示入口：上传一张照片，即可开始生成专属手办')
}

function openItem(title: string) {
  ElMessage.info(`正在打开「${title}」的创作详情（演示）`)
}

function openGallery() {
  ElMessage.info('社区画廊为演示入口')
}
</script>

<template>
  <section id="community" class="page-section community" aria-label="社区聚焦">
    <div class="section-head community__head">
      <div class="section-head__title">
        <span class="kicker">04 — community</span>
        <div class="community__title-row">
          <h2>社区聚焦</h2>
          <button class="community__cta" type="button" @click="startCreating">
            立即制作
            <el-icon :size="12"><ArrowRight /></el-icon>
          </button>
        </div>
      </div>

      <div class="community__filters">
        <span class="community__count">共 {{ visibleItems.length }} 件公开作品</span>
        <SectionTabs v-model="activeCategory" :options="tabOptions" />
      </div>
    </div>

    <TransitionGroup name="sheet" tag="div" class="community__grid">
      <CommunityCard
        v-for="(item, index) in visibleItems"
        :key="item.id"
        :item="item"
        :index="index"
        @select="openItem(item.title)"
      />
    </TransitionGroup>

    <div class="community__foot">
      <span>所有作品均由社区创作者上传，制作参数可在详情页查看。</span>
      <button class="community__more" type="button" @click="openGallery">
        进入社区画廊
        <el-icon :size="12"><ArrowRight /></el-icon>
      </button>
    </div>
  </section>
</template>

<style scoped>
.community__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}

.community__cta {
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
    background-color 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;
}

.community__cta:hover {
  background: rgba(2, 155, 254, 0.28);
  border-color: var(--brand);
  color: #fff;
}

.community__filters {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  max-width: 100%;
}

.community__count {
  color: var(--text-dim);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.community__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(14px, 1.8vw, 24px) clamp(12px, 1.4vw, 20px);
}

.community__foot {
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

.community__more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 11.5px;
  transition: color 0.25s ease;
}

.community__more:hover {
  color: var(--brand-strong);
}

.community__more .el-icon {
  transition: transform 0.25s var(--ease-out);
}

.community__more:hover .el-icon {
  transform: translateX(3px);
}

.sheet-enter-active,
.sheet-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.45s var(--ease-out);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 380px) {
  .community__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (min-width: 768px) {
  .community__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .community__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .community__filters {
    align-items: flex-end;
  }
}
</style>
