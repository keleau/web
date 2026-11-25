<script setup lang="ts">
import SmartImage from '@/components/common/SmartImage.vue'
import type { CommunityItem } from '@/data/home'

defineProps<{
  item: CommunityItem
}>()

const emit = defineEmits<{
  (e: 'select'): void
}>()
</script>

<template>
  <article
    class="community-card"
    role="button"
    tabindex="0"
    @click="emit('select')"
    @keydown.enter="emit('select')"
    @keydown.space.prevent="emit('select')"
  >
    <SmartImage class="community-card__cover" :src="item.image" :alt="item.title" />

    <span class="community-card__veil" aria-hidden="true" />

    <div class="community-card__meta">
      <span class="community-card__tag">{{ item.category }}</span>
      <h3 class="community-card__title">{{ item.title }}</h3>
    </div>

    <div class="community-card__thumb" aria-hidden="true">
      <SmartImage :src="item.image" alt="" />
    </div>
  </article>
</template>

<style scoped>
.community-card {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  background: var(--surface-1);
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.community-card:hover,
.community-card:focus-visible {
  border-color: rgba(255, 255, 255, 0.22);
}

.community-card:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}

.community-card__cover {
  position: absolute;
  inset: 0;
  transition: transform 0.5s ease;
}

.community-card:hover .community-card__cover {
  transform: scale(1.05);
}

.community-card__veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(17, 17, 17, 0.92) 0%, rgba(17, 17, 17, 0.42) 34%, rgba(17, 17, 17, 0.04) 62%);
  pointer-events: none;
}

.community-card__meta {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 16px 92px 16px 16px;
}

.community-card__tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border: 1px solid var(--brand-border);
  border-radius: 6px;
  background: rgba(2, 155, 254, 0.3);
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

.community-card__title {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.community-card__thumb {
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 64px;
  height: 64px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.34);
  border-radius: 6px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
  transform: rotate(8deg);
  transition: transform 0.3s ease;
}

.community-card:hover .community-card__thumb {
  transform: rotate(0deg) scale(1.2);
}

@media (min-width: 640px) {
  .community-card__meta {
    padding-right: 108px;
  }

  .community-card__thumb {
    width: 84px;
    height: 84px;
  }
}
</style>
