<script setup lang="ts">
import { ShoppingCart } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const { count } = storeToRefs(cart)

function openCart() {
  cart.openDrawer()
}
</script>

<template>
  <button class="floating-cart" type="button" aria-label="打开购物车" @click="openCart">
    <el-badge :value="count" :hidden="count === 0" :max="99" class="floating-cart__badge">
      <el-icon :size="20"><ShoppingCart /></el-icon>
    </el-badge>
  </button>
</template>

<style scoped>
.floating-cart {
  position: fixed;
  right: 24px;
  bottom: 28px;
  z-index: 120;
  display: inline-flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--hairline);
  border-radius: 14px;
  background: rgba(24, 24, 28, 0.9);
  color: var(--text-secondary);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.floating-cart:hover {
  border-color: var(--brand-border);
  color: var(--brand);
  transform: translateY(-2px);
}

.floating-cart__badge :deep(.el-badge__content) {
  border: none;
  background: var(--brand);
  color: #001018;
  font-weight: 700;
}
</style>
