<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'
import SectionTabs from '@/components/common/SectionTabs.vue'
import { productCategories, products, type ProductItem } from '@/data/home'
import { useCartStore } from '@/stores/cart'
import ProductCard from './ProductCard.vue'

const activeCategory = ref<string>('全部')
const cart = useCartStore()

const filteredProducts = computed(() =>
  activeCategory.value === '全部'
    ? products
    : products.filter((item) => item.category === activeCategory.value),
)

const tabOptions = computed(() =>
  productCategories.map((category) => ({
    label: category,
    value: category,
    count:
      category === '全部'
        ? products.length
        : products.filter((item) => item.category === category).length,
  })),
)

function buy(item: ProductItem) {
  cart.add()
  ElMessage.success(`已将「${item.title}」加入购物车`)
}

function open(item: ProductItem) {
  ElMessage.info(`「${item.title}」详情页为演示入口`)
}

function customOrder() {
  ElMessage.success('定制从一张照片开始：选一种建模方式即可')
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section id="products" class="page-section products" aria-label="作品商店">
    <div class="products__intro">
      <span class="kicker">05 — editions</span>
      <p>每一件都可单独定制，按版数发售；点开可查看工艺与尺寸。</p>
    </div>

    <div class="products__bar">
      <div class="products__bar-inner">
        <div class="products__bar-title">
          <h2>作品商店</h2>
          <span class="products__bar-count">{{ filteredProducts.length }} 件在售</span>
        </div>
        <SectionTabs v-model="activeCategory" :options="tabOptions" />
      </div>
    </div>

    <div class="products__grid">
      <ProductCard
        v-for="item in filteredProducts"
        :key="item.id"
        :product="item"
        @buy="buy"
        @open="open"
      />
    </div>

    <div class="products__end">
      <span class="products__more-end">已展示全部作品 · 共 {{ filteredProducts.length }} 件</span>
      <button class="products__custom" type="button" @click="customOrder">
        用一张照片定制一件
        <el-icon :size="12"><ArrowRight /></el-icon>
      </button>
    </div>
  </section>
</template>

<style scoped>
.products__intro {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--hairline);
}

.products__intro p {
  color: var(--text-dim);
  font-size: 11px;
  letter-spacing: 0.02em;
}

.products__bar {
  position: sticky;
  top: var(--header-height);
  z-index: 40;
  margin-inline: calc(-1 * clamp(18px, 3vw, 40px));
  border-bottom: 1px solid var(--hairline);
  background: rgba(9, 9, 11, 0.86);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.products__bar-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px 32px;
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 14px clamp(18px, 3vw, 40px) 0;
}

.products__bar-title {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding-bottom: 10px;
}

.products__bar-title h2 {
  color: var(--text-primary);
  font-size: clamp(22px, 2vw, 30px);
  letter-spacing: -0.03em;
}

.products__bar-count {
  color: var(--text-dim);
  font-size: 10px;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.products__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(30px, 3.2vw, 46px) clamp(12px, 1.4vw, 20px);
  padding-top: clamp(24px, 2.8vw, 36px);
}

.products__end {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-top: clamp(36px, 4vw, 56px);
  padding-top: 18px;
  border-top: 1px solid var(--hairline);
}

.products__custom {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--sand);
  font-size: 12px;
  letter-spacing: 0.02em;
  transition: color 0.25s ease;
}

.products__custom:hover {
  color: var(--brand-strong);
}

.products__more-end {
  color: var(--text-dim);
  font-size: 11px;
  letter-spacing: 0.06em;
}

@media (max-width: 1079px) {
  .products__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 759px) {
  .products__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 379px) {
  .products__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .products__bar-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .products__bar-title {
    padding-bottom: 4px;
  }
}
</style>
