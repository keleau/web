<script setup lang="ts">
import SmartImage from '@/components/common/SmartImage.vue'
import type { ProductItem } from '@/data/home'

const props = defineProps<{
  product: ProductItem
}>()

const emit = defineEmits<{
  (e: 'buy', product: ProductItem): void
}>()
</script>

<template>
  <article class="product-card">
    <div class="product-card__media">
      <SmartImage :src="props.product.image" :alt="props.product.title" />

      <span v-if="props.product.badge === 'fan'" class="product-card__badge">粉丝收藏</span>
      <span v-else-if="props.product.badge === 'limited'" class="product-card__badge is-limited">
        限时发售
      </span>

      <div class="product-card__overlay">
        <button class="product-card__buy" type="button" @click="emit('buy', props.product)">
          立即购买
        </button>
      </div>
    </div>

    <h3 class="product-card__title" :title="props.product.title">{{ props.product.title }}</h3>
    <div class="product-card__meta">
      <span class="product-card__price">￥{{ props.product.price }}</span>
      <span class="product-card__sold">已售 {{ props.product.sold }} 件</span>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  min-width: 0;
}

.product-card__media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--surface-1);
}

.product-card__media :deep(.smart-image) {
  position: absolute;
  inset: 0;
  transition: transform 0.5s ease;
}

.product-card__media:hover :deep(.smart-image) {
  transform: scale(1.05);
}

.product-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border: 1px solid rgba(2, 155, 254, 0.55);
  border-radius: 999px;
  background: rgba(2, 155, 254, 0.16);
  color: #9ad8ff;
  font-size: 10.5px;
  font-weight: 500;
  backdrop-filter: blur(6px);
}

.product-card__badge.is-limited {
  border-color: transparent;
  background: linear-gradient(90deg, #ff7a18 0%, #ff2e63 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(255, 46, 99, 0.3);
}

.product-card__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.product-card__media:hover .product-card__overlay,
.product-card__media:focus-within .product-card__overlay {
  opacity: 1;
  pointer-events: auto;
}

.product-card__buy {
  display: inline-flex;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-radius: 8px;
  background: var(--brand);
  color: #001018;
  font-size: 13px;
  font-weight: 600;
  transition:
    filter 0.2s ease,
    transform 0.2s ease;
}

.product-card__buy:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.product-card__title {
  overflow: hidden;
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
}

.product-card__price {
  color: var(--brand);
  font-size: 14px;
  font-weight: 700;
}

.product-card__sold {
  color: var(--text-muted);
  font-size: 11px;
  white-space: nowrap;
}

@media (hover: none) {
  .product-card__overlay {
    background: rgba(0, 0, 0, 0.22);
    opacity: 1;
    pointer-events: auto;
  }

  .product-card__buy {
    height: 30px;
    padding: 0 16px;
    font-size: 12px;
  }
}
</style>
