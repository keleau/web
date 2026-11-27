<script setup lang="ts">
import SmartImage from '@/components/common/SmartImage.vue'
import type { CommunityItem } from '@/types/community'

const props = defineProps<{
  item: CommunityItem
  index: number
}>()

const emit = defineEmits<{
  (e: 'select'): void
}>()

function pad(value: number) {
  return String(value).padStart(2, '0')
}
</script>

<template>
  <article
    class="sheet"
    role="button"
    tabindex="0"
    @click="emit('select')"
    @keydown.enter="emit('select')"
    @keydown.space.prevent="emit('select')"
  >
    <div class="sheet__media">
      <SmartImage class="sheet__cover" :src="props.item.image" :alt="props.item.title" />
      <span class="sheet__no">{{ pad(props.index + 1) }}</span>

      <div class="sheet__spec">
        <span>{{ props.item.craft }}</span>
        <span>{{ props.item.size }}</span>
      </div>
    </div>

    <div class="sheet__caption">
      <div class="sheet__caption-main">
        <h3>{{ props.item.title }}</h3>
        <span class="sheet__maker">{{ props.item.maker }}</span>
      </div>
      <span class="sheet__tag">{{ props.item.category }}</span>
    </div>
  </article>
</template>

<style scoped>
.sheet {
  display: flex;
  min-width: 0;
  flex-direction: column;
  cursor: pointer;
}

.sheet:focus-visible {
  outline: 1px solid var(--brand);
  outline-offset: 3px;
}

.sheet__media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  border: 1px solid var(--hairline);
  background: var(--surface-1);
  transition: border-color 0.3s ease;
}

.sheet:hover .sheet__media,
.sheet:focus-visible .sheet__media {
  border-color: var(--hairline-strong);
}

.sheet__cover {
  position: absolute;
  inset: 0;
  transition:
    transform 0.7s var(--ease-out),
    filter 0.5s ease;
}

.sheet:hover .sheet__cover {
  transform: scale(1.045);
}

.sheet__no {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  color: rgba(255, 255, 255, 0.78);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.16em;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.55);
}

.sheet__spec {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 14px 12px;
  background: linear-gradient(to top, rgba(9, 9, 11, 0.92) 0%, rgba(9, 9, 11, 0.52) 62%, transparent 100%);
  color: var(--text-secondary);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  transform: translateY(102%);
  transition: transform 0.4s var(--ease-out);
}

.sheet:hover .sheet__spec,
.sheet:focus-visible .sheet__spec {
  transform: translateY(0);
}

.sheet__caption {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding-top: 12px;
}

.sheet__caption-main {
  min-width: 0;
}

.sheet__caption h3 {
  overflow: hidden;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sheet__maker {
  display: block;
  margin-top: 2px;
  color: var(--text-dim);
  font-size: 10.5px;
  letter-spacing: 0.04em;
}

.sheet__tag {
  flex-shrink: 0;
  padding: 2px 8px;
  border: 1px solid var(--hairline);
  border-radius: var(--radius-pill);
  color: var(--text-muted);
  font-size: 10px;
  transition:
    border-color 0.3s ease,
    color 0.3s ease;
}

.sheet:hover .sheet__tag {
  border-color: var(--sand-border);
  color: var(--sand);
}
</style>
