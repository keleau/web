<script setup lang="ts">
import ProductDetail from '@/components/store/ProductDetail.vue'
</script>

<template>
  <div class="product-detail-view">
    <ProductDetail />
  </div>
</template>

<style scoped>
.product-detail-view {
  position: relative;
}

.product-detail-view::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 420px;
  background:
    radial-gradient(46% 100% at 50% 0%, rgba(230, 192, 150, 0.07), transparent 72%),
    radial-gradient(32% 60% at 82% 8%, rgba(2, 155, 254, 0.05), transparent 70%);
  content: '';
  pointer-events: none;
}
</style>
