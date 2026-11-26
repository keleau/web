<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { RouterLink, useRouter } from 'vue-router'
import ProductTile from '@/components/store/ProductTile.vue'
import { products, type ProductItem } from '@/data/products'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cart = useCartStore()

const FEATURED_IDS = ['mecha-toy', 'clay-guard', 'dunhuang-flying', 'thousand-miles']

const featured = FEATURED_IDS.map((id) =>
  products.find((product) => product.id === id),
).filter((product): product is ProductItem => Boolean(product))

function addToCart(product: ProductItem) {
  cart.add(product)
  ElMessage.success(`已加入购物车：${product.title}`)
}

function openProduct(product: ProductItem) {
  router.push({ name: 'product-detail', params: { id: product.id } })
}
</script>

<template>
  <section id="store" class="page-section home-store" aria-label="精选作品">
    <div class="section-head">
      <div class="section-head__title">
        <span class="kicker">05 — store</span>
        <h2>把喜欢的作品带回家</h2>
      </div>
      <p class="section-head__note">
        工坊自己出的版数作品：全彩树脂、手工修边、附编号卡。也可从一张照片开始，做一件只属于你的。
      </p>
    </div>

    <div class="home-store__grid">
      <ProductTile
        v-for="product in featured"
        :key="product.id"
        :product="product"
        @buy="addToCart"
        @open="openProduct"
      />
    </div>

    <div class="home-store__foot">
      <span>全部作品均为限量或开放版，售完不补。</span>
      <RouterLink class="home-store__more" to="/store">
        进入产品商城 · {{ products.length }} 件
        <el-icon :size="12"><ArrowRight /></el-icon>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.home-store__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(18px, 2.4vw, 28px) clamp(12px, 1.4vw, 20px);
}

.home-store__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: clamp(22px, 2.8vw, 34px);
  padding-top: 16px;
  border-top: 1px solid var(--hairline);
  color: var(--text-dim);
  font-size: 11px;
}

.home-store__more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 11.5px;
  transition: color 0.25s ease;
}

.home-store__more:hover {
  color: var(--brand-strong);
}

.home-store__more .el-icon {
  transition: transform 0.25s var(--ease-out);
}

.home-store__more:hover .el-icon {
  transform: translateX(3px);
}

@media (min-width: 900px) {
  .home-store__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
