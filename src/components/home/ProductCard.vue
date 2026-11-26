<script setup lang="ts">
import { computed } from 'vue'
import { ShoppingCart } from '@element-plus/icons-vue'
import SmartImage from '@/components/common/SmartImage.vue'
import type { ProductItem } from '@/data/home'

const props = defineProps<{
  product: ProductItem
}>()

const emit = defineEmits<{
  (e: 'buy', product: ProductItem): void
  (e: 'open', product: ProductItem): void
}>()

const isWide = computed(() => props.product.ratio === '5:4')
</script>

<template>
  <article class="piece">
    <div class="piece__media" :class="{ 'is-wide': isWide }">
      <SmartImage class="piece__cover" :src="props.product.image" :alt="props.product.title" />

      <span
        class="piece__edition"
        :class="{ 'is-limited': props.product.badge === 'limited' }"
      >
        {{ props.product.edition }}
      </span>

      <div class="piece__actions">
        <button class="piece__cart" type="button" :aria-label="`加入购物车：${props.product.title}`" @click="emit('buy', props.product)">
          <el-icon :size="13"><ShoppingCart /></el-icon>
          加入购物车
        </button>
      </div>

      <button class="piece__open" type="button" :aria-label="`查看 ${props.product.title}`" @click="emit('open', props.product)"></button>
    </div>

    <h3 class="piece__title" :title="props.product.title">{{ props.product.title }}</h3>

    <div class="piece__meta">
      <span class="piece__price">￥{{ props.product.price }}</span>
      <span class="piece__sold">已售 {{ props.product.sold }} 件</span>
    </div>
  </article>
</template>

<style scoped>
.piece {
  display: flex;
  height: 100%;
  min-width: 0;
  flex-direction: column;
}

.piece__media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  border: 1px solid var(--hairline);
  background: var(--surface-1);
  transition: border-color 0.35s ease;
}

.piece__media.is-wide {
  background: #0c0c0f;
}

.piece__media.is-wide :deep(.smart-image) {
  background: #0c0c0f;
}

.piece__media.is-wide :deep(.smart-image__img) {
  object-fit: contain;
}

.piece__media:hover {
  border-color: var(--hairline-strong);
}

.piece__cover {
  position: absolute;
  inset: 0;
  transition:
    transform 0.8s var(--ease-out),
    filter 0.5s ease;
}

.piece__media:hover .piece__cover {
  transform: scale(1.03);
  filter: brightness(1.04);
}

.piece__edition {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 3;
  padding: 3px 7px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(9, 9, 11, 0.6);
  color: rgba(255, 255, 255, 0.72);
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: 0.06em;
  backdrop-filter: blur(6px);
}

.piece__edition.is-limited {
  border-color: var(--sand-border);
  background: rgba(9, 9, 11, 0.66);
  color: var(--sand);
}

.piece__actions {
  position: absolute;
  right: 10px;
  bottom: 10px;
  left: 10px;
  z-index: 3;
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 0.3s ease,
    transform 0.4s var(--ease-out);
}

.piece__media:hover .piece__actions,
.piece__media:focus-within .piece__actions {
  opacity: 1;
  transform: translateY(0);
}

.piece__cart {
  display: inline-flex;
  height: 32px;
  align-items: center;
  gap: 5px;
  padding: 0 12px;
  border-radius: var(--radius-pill);
  background: rgba(9, 9, 11, 0.86);
  color: var(--text-primary);
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(8px);
  transition:
    background-color 0.25s ease,
    color 0.25s ease;
}

.piece__cart:hover {
  background: var(--brand);
  color: #001018;
}

.piece__open {
  position: absolute;
  inset: 0;
  z-index: 2;
  cursor: pointer;
}

.piece__open:focus-visible {
  outline: 1px solid var(--brand);
  outline-offset: -3px;
}

.piece__title {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 12.5px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.piece__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
}

.piece__price {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.piece__sold {
  color: var(--text-dim);
  font-size: 10px;
  white-space: nowrap;
}

@media (hover: none) {
  .piece__actions {
    opacity: 1;
    transform: none;
  }
}
</style>
