<script setup lang="ts">
import { computed } from 'vue'
import ProductTile from '@/components/store/ProductTile.vue'
import PromoTile from '@/components/store/PromoTile.vue'
import type { CatalogEntry } from '@/types/catalog'
import type { ProductItem, PromoTile as PromoTileData } from '@/types/catalog'

const props = defineProps<{
  entry: CatalogEntry
}>()

const emit = defineEmits<{
  (e: 'buy', product: ProductItem): void
  (e: 'open', product: ProductItem): void
  (e: 'promo', promo: PromoTileData): void
}>()

const product = computed(() =>
  props.entry.kind === 'product' ? props.entry.product : null,
)
const promo = computed(() =>
  props.entry.kind === 'promo' ? props.entry.promo : null,
)
</script>

<template>
  <ProductTile
    v-if="product"
    :product="product"
    @buy="emit('buy', $event)"
    @open="emit('open', $event)"
  />
  <PromoTile
    v-else-if="promo"
    :promo="promo"
    @action="emit('promo', $event)"
  />
</template>
