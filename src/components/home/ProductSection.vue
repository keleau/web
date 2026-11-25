<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SectionTabs from '@/components/common/SectionTabs.vue'
import { productCategories, products, type ProductItem } from '@/data/home'
import { useCartStore } from '@/stores/cart'
import ProductCard from './ProductCard.vue'

const PAGE_SIZE = 10

const activeCategory = ref('全部')
const visibleCount = ref(PAGE_SIZE)
const cart = useCartStore()

const tabOptions = productCategories.map((category) => ({
  label: category,
  value: category,
}))

const filteredProducts = computed(() =>
  activeCategory.value === '全部'
    ? products
    : products.filter((item) => item.category === activeCategory.value),
)

const visibleProducts = computed(() => filteredProducts.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredProducts.value.length)

watch(activeCategory, () => {
  visibleCount.value = PAGE_SIZE
})

function loadMore() {
  visibleCount.value += PAGE_SIZE
}

function buy(product: ProductItem) {
  cart.add()
  ElMessage.success(`已将「${product.title}」加入购物车`)
}
</script>

<template>
  <section id="products" class="products-section" aria-label="灵感商品">
    <div class="products-bar">
      <h2>灵感商品</h2>
      <SectionTabs v-model="activeCategory" :options="tabOptions" />
    </div>

    <TransitionGroup name="product" tag="div" class="products-grid">
      <ProductCard
        v-for="item in visibleProducts"
        :key="item.id"
        :product="item"
        @buy="buy"
      />
    </TransitionGroup>

    <div class="products-more">
      <button v-if="hasMore" class="load-more" type="button" @click="loadMore">
        滚动到底部加载更多...
      </button>
      <span v-else class="products-end">已经到底啦～</span>
    </div>
  </section>
</template>

<style scoped>
.products-section {
  width: 97%;
  max-width: var(--page-max);
  margin: 0 auto 96px;
}

.products-bar {
  position: sticky;
  top: var(--header-height);
  z-index: 40;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 32px;
  padding: 12px 0;
  background: rgba(9, 9, 11, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.products-bar h2 {
  color: var(--text-primary);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.6px;
  line-height: 1.2;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.product-enter-active,
.product-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.product-enter-from,
.product-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

.products-more {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.load-more {
  display: inline-flex;
  height: 38px;
  align-items: center;
  padding: 0 22px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
  font-size: 12px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.load-more:hover {
  border-color: var(--brand-border);
  background: rgba(2, 155, 254, 0.1);
  color: var(--text-primary);
}

.products-end {
  color: var(--text-dim);
  font-size: 12px;
}

@media (min-width: 640px) {
  .products-grid {
    gap: 20px;
  }
}

@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .products-bar h2 {
    font-size: 30px;
  }
}

@media (min-width: 1024px) {
  .products-section {
    margin-bottom: 120px;
  }

  .products-bar {
    margin-bottom: 40px;
  }

  .products-bar h2 {
    font-size: 34px;
  }
}

@media (min-width: 1280px) {
  .products-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}
</style>
