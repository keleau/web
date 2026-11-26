<script setup lang="ts">
import { computed } from 'vue'
import { ShoppingCart } from '@element-plus/icons-vue'
import SmartImage from '@/components/common/SmartImage.vue'
import type { ProductItem } from '@/data/products'
import { formatPrice } from '@/utils/format'

const props = defineProps<{
  product: ProductItem
}>()

const emit = defineEmits<{
  (e: 'buy', product: ProductItem): void
  (e: 'open', product: ProductItem): void
}>()

const isWide = computed(() => props.product.ratio === '5:4')
const isLimited = computed(() => props.product.badge === 'limited')
</script>

<template>
  <article class="product-tile">
    <div class="product-tile__media">
      <div class="product-tile__plate" :class="{ 'is-wide': isWide }">
        <SmartImage
          class="product-tile__image"
          :src="props.product.image"
          :alt="props.product.title"
        />

        <span class="product-tile__edition" :class="{ 'is-limited': isLimited }">
          {{ props.product.edition }}
        </span>
      </div>

      <button
        class="product-tile__add"
        type="button"
        :aria-label="`加入购物车：${props.product.title}`"
        @click="emit('buy', props.product)"
      >
        <el-icon :size="14"><ShoppingCart /></el-icon>
      </button>

      <button
        class="product-tile__hit"
        type="button"
        :aria-label="`查看 ${props.product.title}`"
        @click="emit('open', props.product)"
      ></button>
    </div>

    <h3 class="product-tile__title" :title="props.product.title">
      {{ props.product.title }}
    </h3>

    <div class="product-tile__meta">
      <span class="product-tile__price">{{ formatPrice(props.product.price) }}</span>
      <span class="product-tile__category">{{ props.product.category }}</span>
    </div>
  </article>
</template>

<style scoped>
.product-tile {
  display: flex;
  min-width: 0;
  flex-direction: column;
  height: 100%;
}

.product-tile__media {
  position: relative;
  aspect-ratio: 4 / 5;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #ece7dc;
  transition:
    border-color 0.35s ease,
    background-color 0.35s ease;
}

.product-tile__media:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: #f3eee4;
}

.product-tile__plate {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: #0c0c0f;
}

.product-tile__plate.is-wide {
  background:
    radial-gradient(120% 90% at 50% 35%, #1a1a20 0%, #0c0c0f 70%);
}

.product-tile__image {
  position: absolute;
  inset: 0;
  transition:
    transform 0.8s var(--ease-out),
    filter 0.5s ease;
}

.product-tile__plate.is-wide :deep(.smart-image__img) {
  object-fit: contain;
}

.product-tile__media:hover .product-tile__image {
  transform: scale(1.035);
  filter: brightness(1.05);
}

.product-tile__edition {
  position: absolute;
  top: 9px;
  left: 9px;
  z-index: 3;
  padding: 3px 7px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(9, 9, 11, 0.62);
  color: rgba(255, 255, 255, 0.76);
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: 0.05em;
  backdrop-filter: blur(6px);
  pointer-events: none;
}

.product-tile__edition.is-limited {
  border-color: var(--sand-border);
  color: var(--sand);
}

.product-tile__add {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 5;
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(9, 9, 11, 0.88);
  color: var(--text-primary);
  opacity: 0;
  transform: translateY(5px);
  transition:
    opacity 0.3s ease,
    transform 0.35s var(--ease-out),
    background-color 0.2s ease,
    color 0.2s ease;
  backdrop-filter: blur(8px);
}

.product-tile__media:hover .product-tile__add,
.product-tile__media:focus-within .product-tile__add {
  opacity: 1;
  transform: translateY(0);
}

.product-tile__add:hover {
  background: var(--brand);
  color: #001018;
}

.product-tile__hit {
  position: absolute;
  inset: 0;
  z-index: 2;
  cursor: pointer;
}

.product-tile__hit:focus-visible {
  outline: 1px solid var(--brand);
  outline-offset: -3px;
}

.product-tile__title {
  display: -webkit-box;
  overflow: hidden;
  min-height: 2.9em;
  margin-top: 11px;
  color: var(--text-secondary);
  font-size: 12.5px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-tile__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 7px;
}

.product-tile__price {
  color: var(--text-primary);
  font-size: 13.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.product-tile__category {
  overflow: hidden;
  color: var(--text-dim);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (hover: none) {
  .product-tile__add {
    opacity: 1;
    transform: none;
  }
}
</style>
