<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import PageIntro from '@/components/common/PageIntro.vue'
import ProductGrid from '@/components/store/ProductGrid.vue'
import ProductRow from '@/components/store/ProductRow.vue'
import StoreCallout from '@/components/store/StoreCallout.vue'
import StoreToolbar from '@/components/store/StoreToolbar.vue'
import { useProductCatalog } from '@/composables/useProductCatalog'
import { getProducts } from '@/services/catalog'
import type { ProductItem, PromoTile } from '@/types/catalog'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cart = useCartStore()
const catalogCount = getProducts().length

const {
  category,
  availability,
  priceBand,
  sort,
  view,
  visibleProducts,
  entries,
  count,
  hasActiveFilters,
  resetFilters,
} = useProductCatalog()

function addToCart(product: ProductItem) {
  cart.add(product)
  ElMessage.success(`已加入购物车：${product.title}`)
}

function openProduct(product: ProductItem) {
  router.push({ name: 'product-detail', params: { id: product.id } })
}

function openPromo(promo: PromoTile) {
  if (promo.id === 'custom-pet' || promo.id === 'upload-model') {
    router.push({ name: 'custom' })
    return
  }
  ElMessage.info(`「${promo.cta}」为我们预留的服务入口，可先浏览社区里的真实作品。`)
}
</script>

<template>
  <div class="store-page">
    <PageIntro
      class="page-section"
      eyebrow="Catalogue — 2026"
      title="产品"
      meta="全彩树脂 · 人工修边"
      note="从工坊直接发货的版数作品与定制服务。每一件都附编号卡，售完即止。"
      size="display"
    />

    <div class="page-section store-catalog">
      <StoreToolbar
        :category="category"
        :availability="availability"
        :price-band="priceBand"
        :sort="sort"
        :view="view"
        :count="count"
        :has-active-filters="hasActiveFilters"
        @update:category="category = $event"
        @update:availability="availability = $event"
        @update:price-band="priceBand = $event"
        @update:sort="sort = $event"
        @update:view="view = $event"
        @reset="resetFilters"
      />

      <ProductGrid
        v-if="view === 'grid'"
        class="store-catalog__body"
        :entries="entries"
        @buy="addToCart"
        @open="openProduct"
        @promo="openPromo"
      />

      <div v-else class="store-list store-catalog__body">
        <ProductRow
          v-for="product in visibleProducts"
          :key="product.id"
          :product="product"
          @buy="addToCart"
          @open="openProduct"
        />
      </div>

      <div v-if="count === 0" class="store-empty">
        <p>没有符合条件的作品。</p>
        <button type="button" @click="resetFilters">清除筛选，查看全部 {{ catalogCount }} 件</button>
      </div>
    </div>

    <StoreCallout />
  </div>
</template>

<style scoped>
.store-page {
  position: relative;
  padding-bottom: clamp(20px, 3vw, 40px);
}

.store-page::before {
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

.store-catalog {
  position: relative;
}

.store-catalog__body {
  margin-top: clamp(20px, 2.8vw, 32px);
}

.store-list {
  border-top: 1px solid var(--hairline);
  margin-top: clamp(20px, 2.8vw, 32px);
}

.store-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 72px 0;
  color: var(--text-muted);
  font-size: 12.5px;
}

.store-empty button {
  color: var(--brand-strong);
  font-size: 12px;
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
