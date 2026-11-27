<script setup lang="ts">
import { computed, ref } from 'vue'
import SectionTabs from '@/components/common/SectionTabs.vue'
import CommunityCard from '@/components/community/CommunityCard.vue'
import {
  countCommunityItems,
  filterCommunityItems,
  getCommunityCategories,
} from '@/services/community'
import type { CommunityFilter, CommunityItem } from '@/types/community'

const props = withDefaults(
  defineProps<{
    limit?: number
    showTabs?: boolean
  }>(),
  {
    limit: 0,
    showTabs: true,
  },
)

const emit = defineEmits<{
  (e: 'select', item: CommunityItem): void
}>()

const activeCategory = ref<CommunityFilter>('全部')

const filteredItems = computed(() => filterCommunityItems(activeCategory.value))

const visibleItems = computed(() =>
  props.limit > 0 ? filteredItems.value.slice(0, props.limit) : filteredItems.value,
)

const tabOptions = computed(() =>
  getCommunityCategories().map((category) => ({
    label: category,
    value: category,
    count: countCommunityItems(category),
  })),
)
</script>

<template>
  <div class="community-gallery">
    <div v-if="showTabs" class="community-gallery__bar">
      <SectionTabs v-model="activeCategory" :options="tabOptions" />
      <span class="community-gallery__count">共 {{ visibleItems.length }} 件公开作品</span>
    </div>

    <TransitionGroup name="sheet" tag="div" class="community-gallery__grid">
      <CommunityCard
        v-for="(item, index) in visibleItems"
        :key="item.id"
        :item="item"
        :index="index"
        @select="emit('select', item)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.community-gallery__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px 24px;
  margin-bottom: clamp(18px, 2.4vw, 28px);
}

.community-gallery__count {
  color: var(--text-dim);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.community-gallery__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(14px, 1.8vw, 24px) clamp(12px, 1.4vw, 20px);
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
  .community-gallery__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (min-width: 768px) {
  .community-gallery__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .community-gallery__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
