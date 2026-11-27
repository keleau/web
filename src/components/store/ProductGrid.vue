<script setup lang="ts">
import CatalogCell from '@/components/store/CatalogCell.vue'
import type { CatalogEntry } from '@/types/catalog'
import type { ProductItem, PromoTile } from '@/types/catalog'

defineProps<{
  entries: CatalogEntry[]
}>()

const emit = defineEmits<{
  (e: 'buy', product: ProductItem): void
  (e: 'open', product: ProductItem): void
  (e: 'promo', promo: PromoTile): void
}>()
</script>

<template>
  <div class="product-grid">
    <CatalogCell
      v-for="entry in entries"
      :key="entry.kind === 'promo' ? entry.promo.id : entry.product.id"
      :entry="entry"
      @buy="emit('buy', $event)"
      @open="emit('open', $event)"
      @promo="emit('promo', $event)"
    />
  </div>
</template>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px 14px;
}

@media (min-width: 680px) {
  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 30px 18px;
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1440px) {
  .product-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 34px 20px;
  }
}
</style>
