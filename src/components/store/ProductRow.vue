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

const isLimited = computed(() => props.product.badge === 'limited')
</script>

<template>
  <article class="product-row">
    <button
      class="product-row__media"
      type="button"
      :aria-label="`查看 ${props.product.title}`"
      @click="emit('open', props.product)"
    >
      <SmartImage :src="props.product.image" :alt="props.product.title" />
    </button>

    <div class="product-row__body">
      <h3>{{ props.product.title }}</h3>
      <p>
        <span>{{ props.product.category }}</span>
        <span class="product-row__dot" aria-hidden="true">·</span>
        <span :class="{ 'is-limited': isLimited }">{{ props.product.edition }}</span>
        <span class="product-row__dot" aria-hidden="true">·</span>
        <span>已售 {{ props.product.sold }}</span>
      </p>
    </div>

    <span class="product-row__price">{{ formatPrice(props.product.price) }}</span>

    <button
      class="product-row__add"
      type="button"
      :aria-label="`加入购物车：${props.product.title}`"
      @click="emit('buy', props.product)"
    >
      <el-icon :size="13"><ShoppingCart /></el-icon>
      <span>加入购物车</span>
    </button>
  </article>
</template>

<style scoped>
.product-row {
  display: grid;
  grid-template-areas: 'media body price add';
  grid-template-columns: 86px minmax(0, 1fr) 108px 128px;
  align-items: center;
  gap: 20px;
  padding: 14px 4px;
  border-bottom: 1px solid var(--hairline);
  transition: background-color 0.25s ease;
}

.product-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.product-row__media {
  position: relative;
  grid-area: media;
  aspect-ratio: 4 / 5;
  padding: 4px;
  border: 1px solid var(--hairline);
  background: #ece7dc;
  transition: border-color 0.25s ease;
}

.product-row__media:hover {
  border-color: rgba(255, 255, 255, 0.32);
}

.product-row__media :deep(.smart-image) {
  background: #0c0c0f;
}

.product-row__body {
  grid-area: body;
  min-width: 0;
}

.product-row__body h3 {
  overflow: hidden;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-row__body p {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
  color: var(--text-dim);
  font-size: 10.5px;
}

.product-row__body p .is-limited {
  color: var(--sand);
}

.product-row__dot {
  color: var(--text-dim);
  opacity: 0.5;
}

.product-row__price {
  grid-area: price;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.product-row__add {
  grid-area: add;
  display: inline-flex;
  height: 34px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 14px;
  border: 1px solid var(--hairline-strong);
  border-radius: var(--radius-pill);
  color: var(--text-secondary);
  font-size: 11px;
  transition:
    border-color 0.25s ease,
    background-color 0.25s ease,
    color 0.25s ease;
}

.product-row__add:hover {
  border-color: var(--brand-border);
  background: var(--brand-soft);
  color: var(--brand-strong);
}

@media (max-width: 720px) {
  .product-row {
    grid-template-areas:
      'media body price'
      'media body add';
    grid-template-columns: 64px minmax(0, 1fr) auto;
    gap: 6px 14px;
    padding: 12px 2px;
  }

  .product-row__price {
    align-self: start;
    font-size: 13px;
  }

  .product-row__add {
    align-self: end;
    width: 32px;
    height: 32px;
    padding: 0;
  }

  .product-row__add span {
    display: none;
  }
}
</style>
