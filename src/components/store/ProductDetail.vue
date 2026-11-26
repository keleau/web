<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { ArrowLeft, Check, MagicStick, Minus, Plus, ShoppingCart } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { RouterLink, useRoute } from 'vue-router'
import SmartImage from '@/components/common/SmartImage.vue'
import { products, type ProductItem } from '@/data/products'
import { useCartStore } from '@/stores/cart'
import { formatPrice, padIndex } from '@/utils/format'

// three.js 单独分包，只有打开详情页时才加载
const ModelViewer = defineAsyncComponent(() => import('@/components/store/ModelViewer.vue'))

const route = useRoute()
const cart = useCartStore()

const quantity = ref(1)
const show3d = ref(true)
const viewerFailed = ref(false)

function handleViewerError() {
  viewerFailed.value = true
  show3d.value = false
}

const product = computed<ProductItem | null>(() => {
  const id = route.params.id as string
  return products.find((p) => p.id === id) ?? null
})

const isLimited = computed(() => product.value?.badge === 'limited')
const related = computed<ProductItem[]>(() => {
  if (!product.value) return []
  const sameCategory = products.filter(
    (p) => p.category === product.value!.category && p.id !== product.value!.id,
  )
  return sameCategory.slice(0, 4)
})

function changeQuantity(delta: number) {
  quantity.value = Math.max(1, quantity.value + delta)
}

function addToCart() {
  if (!product.value) return
  cart.add(product.value, quantity.value)
  ElMessage.success(`已加入购物车：${product.value.title} × ${quantity.value}`)
}
</script>

<template>
  <div class="product-detail page-section" v-if="product">
    <RouterLink class="product-detail__back" to="/store">
      <el-icon :size="14"><ArrowLeft /></el-icon>
      返回产品商城
    </RouterLink>

    <div class="product-detail__main">
      <div class="product-detail__gallery">
        <div class="product-detail__frame">
          <SmartImage
            v-if="!show3d"
            :src="product.image"
            :alt="product.title"
            :lazy="false"
          />
          <ModelViewer
            v-else
            :key="product.id"
            :src="product.model"
            :variant="product.id"
            :poster="product.image"
            @error="handleViewerError"
          />
        </div>

        <div v-if="!viewerFailed" class="product-detail__view-switch" role="group" aria-label="切换展示方式">
          <button
            type="button"
            :class="{ 'is-active': show3d }"
            :aria-pressed="show3d"
            @click="show3d = true"
          >
            3D
          </button>
          <button
            type="button"
            :class="{ 'is-active': !show3d }"
            :aria-pressed="!show3d"
            @click="show3d = false"
          >
            图片
          </button>
        </div>

        <span class="product-detail__fig">N° {{ padIndex(products.indexOf(product) + 1) }}</span>
      </div>

      <div class="product-detail__info">
        <p class="product-detail__kicker">{{ product.category }} · {{ product.ratio }}</p>

        <h1>{{ product.title }}</h1>

        <div class="product-detail__meta">
          <span class="product-detail__price">{{ formatPrice(product.price) }}</span>
          <span class="product-detail__edition" :class="{ 'is-limited': isLimited }">
            {{ product.edition }}
          </span>
        </div>

        <p class="product-detail__desc">
          全彩树脂逐层堆叠色彩与纹理，无需后期上色；人工修边、装配、质检后包装发出。
          每一件都附编号卡，进度全程可查。
        </p>

        <dl class="product-detail__specs">
          <div>
            <dt>工艺</dt>
            <dd>全彩树脂打印 · 人工修边</dd>
          </div>
          <div>
            <dt>尺寸</dt>
            <dd>按比例 {{ product.ratio }} · 约 150 mm</dd>
          </div>
          <div>
            <dt>交付周期</dt>
            <dd>3–5 天</dd>
          </div>
          <div>
            <dt>已售</dt>
            <dd>{{ product.sold }} 件</dd>
          </div>
        </dl>

        <div class="product-detail__actions">
          <div class="quantity-control" role="group" aria-label="数量选择">
            <button type="button" aria-label="减少" @click="changeQuantity(-1)">
              <el-icon :size="13"><Minus /></el-icon>
            </button>
            <span>{{ quantity }}</span>
            <button type="button" aria-label="增加" @click="changeQuantity(1)">
              <el-icon :size="13"><Plus /></el-icon>
            </button>
          </div>

          <button class="btn btn--primary product-detail__cta" type="button" @click="addToCart">
            <el-icon :size="14"><ShoppingCart /></el-icon>
            加入购物车
          </button>

          <RouterLink
            class="btn btn--ghost product-detail__custom"
            :to="{ name: 'custom', query: { product: product.id } }"
          >
            <el-icon :size="14"><MagicStick /></el-icon>
            定制此款
          </RouterLink>
        </div>
      </div>
    </div>

    <section v-if="related.length" class="product-detail__related">
      <h2>同品类作品</h2>
      <div class="product-detail__related-grid">
        <RouterLink
          v-for="item in related"
          :key="item.id"
          class="related-card"
          :to="`/store/${item.id}`"
        >
          <div class="related-card__media">
            <SmartImage :src="item.image" :alt="item.title" />
          </div>
          <div class="related-card__body">
            <h3>{{ item.title }}</h3>
            <div class="related-card__foot">
              <span>{{ formatPrice(item.price) }}</span>
              <span class="related-card__check">
                <el-icon :size="11"><Check /></el-icon>
              </span>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>

  <div v-else class="product-detail product-detail--empty">
    <p>没有找到这件作品。</p>
    <RouterLink class="btn btn--ghost" to="/store">返回产品商城</RouterLink>
  </div>
</template>

<style scoped>
.product-detail {
  padding-top: clamp(24px, 3vw, 40px);
  padding-bottom: clamp(48px, 6vw, 80px);
}

.product-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  color: var(--text-muted);
  font-size: 12px;
  transition: color 0.25s ease;
}

.product-detail__back:hover {
  color: var(--brand-strong);
}

.product-detail__main {
  display: grid;
  gap: clamp(32px, 4.5vw, 64px);
  margin-top: clamp(16px, 2.4vw, 28px);
}

.product-detail__gallery {
  position: relative;
}

.product-detail__frame {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: 1px solid var(--hairline-strong);
  background: #ece7dc;
}

.product-detail__view-switch {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 4;
  display: inline-flex;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-pill);
  background: rgba(9, 9, 11, 0.62);
  backdrop-filter: blur(8px);
}

.product-detail__view-switch button {
  padding: 3px 11px;
  border-radius: var(--radius-pill);
  color: rgba(255, 255, 255, 0.52);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.product-detail__view-switch button:hover {
  color: rgba(255, 255, 255, 0.82);
}

.product-detail__view-switch button.is-active {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.product-detail__fig {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 3px 8px;
  background: rgba(9, 9, 11, 0.72);
  color: var(--sand);
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.18em;
  backdrop-filter: blur(6px);
}

.product-detail__info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-detail__kicker {
  color: var(--text-dim);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.product-detail__info h1 {
  font-size: clamp(28px, 3.2vw, 44px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.08;
}

.product-detail__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12px 18px;
}

.product-detail__price {
  color: var(--text-primary);
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.product-detail__edition {
  padding: 3px 10px;
  border: 1px solid var(--hairline);
  border-radius: var(--radius-pill);
  color: var(--text-muted);
  font-size: 11px;
}

.product-detail__edition.is-limited {
  border-color: var(--sand-border);
  color: var(--sand);
}

.product-detail__desc {
  max-width: 52ch;
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.85;
}

.product-detail__specs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 28px;
  padding: 18px 0;
  border-top: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
}

.product-detail__specs div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-detail__specs dt {
  color: var(--text-dim);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.product-detail__specs dd {
  color: var(--text-secondary);
  font-size: 12.5px;
}

.product-detail__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}

.quantity-control {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--hairline-strong);
  border-radius: var(--radius-pill);
  overflow: hidden;
}

.quantity-control button {
  display: inline-flex;
  width: 38px;
  height: 46px;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.quantity-control button:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
}

.quantity-control span {
  min-width: 40px;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.product-detail__cta {
  flex: 1;
  min-width: 200px;
}

.product-detail__custom {
  min-width: 148px;
}

.product-detail__related {
  margin-top: clamp(56px, 7vw, 96px);
  padding-top: clamp(28px, 3.4vw, 44px);
  border-top: 1px solid var(--hairline);
}

.product-detail__related h2 {
  margin-bottom: clamp(18px, 2.4vw, 28px);
  color: var(--text-primary);
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.product-detail__related-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(18px, 2.4vw, 28px) clamp(12px, 1.4vw, 20px);
}

.related-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: inherit;
}

.related-card__media {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: 1px solid var(--hairline);
  background: var(--surface-1);
  transition: border-color 0.3s ease;
}

.related-card:hover .related-card__media {
  border-color: var(--hairline-strong);
}

.related-card__body h3 {
  overflow: hidden;
  color: var(--text-secondary);
  font-size: 12.5px;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.related-card__foot > span {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.related-card__check {
  color: var(--sand);
}

.product-detail--empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-height: 50vh;
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
}

@media (min-width: 900px) {
  .product-detail__main {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
  }

  .product-detail__related-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
