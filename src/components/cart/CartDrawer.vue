<script setup lang="ts">
/** 购物车抽屉：FloatingCart 打开，复用购物车 Store，不持有自己的业务状态 */
import { computed } from 'vue'
import { Delete, ShoppingCart } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { RouterLink, useRouter } from 'vue-router'
import SmartImage from '@/components/common/SmartImage.vue'
import QuantityStepper from '@/components/common/QuantityStepper.vue'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'

const cart = useCartStore()
const router = useRouter()

const visible = computed({
  get: () => cart.drawerOpen,
  set: (value: boolean) => (value ? cart.openDrawer() : cart.closeDrawer()),
})

function goStore() {
  cart.closeDrawer()
  router.push('/store')
}

function openProduct(id: string) {
  cart.closeDrawer()
  router.push({ name: 'product-detail', params: { id } })
}

function checkout() {
  ElMessage.info('结算流程待接入支付与订单接口（演示）')
}
</script>

<template>
  <el-drawer
    v-model="visible"
    direction="rtl"
    size="min(420px, 92vw)"
    class="cart-drawer"
    :with-header="true"
  >
    <template #header>
      <div class="cart-drawer__head">
        <strong>购物车</strong>
        <span>{{ cart.count }} 件</span>
      </div>
    </template>

    <div v-if="cart.isEmpty" class="cart-drawer__empty">
      <span class="cart-drawer__empty-icon">
        <el-icon :size="22"><ShoppingCart /></el-icon>
      </span>
      <p>购物车还是空的</p>
      <span>去商城挑一件，或从一张照片开始定制。</span>
      <button class="btn btn--primary" type="button" @click="goStore">去逛逛</button>
    </div>

    <ul v-else class="cart-drawer__list">
      <li v-for="item in cart.items" :key="item.product.id" class="cart-item">
        <RouterLink
          class="cart-item__thumb"
          :to="{ name: 'product-detail', params: { id: item.product.id } }"
          :aria-label="`查看 ${item.product.title}`"
          @click="cart.closeDrawer()"
        >
          <SmartImage :src="item.product.image" :alt="item.product.title" />
        </RouterLink>

        <div class="cart-item__info">
          <button
            class="cart-item__title"
            type="button"
            @click="openProduct(item.product.id)"
          >
            {{ item.product.title }}
          </button>
          <span class="cart-item__meta">
            {{ item.product.category }} · {{ item.product.edition }}
          </span>

          <div class="cart-item__foot">
            <span class="cart-item__price">{{ formatPrice(item.product.price) }}</span>
            <QuantityStepper
              size="sm"
              :model-value="item.quantity"
              :max="99"
              :label="`${item.product.title} 数量`"
              @update:model-value="cart.setQuantity(item.product.id, $event)"
            />
          </div>
        </div>

        <button
          class="cart-item__remove"
          type="button"
          :aria-label="`移除 ${item.product.title}`"
          @click="cart.remove(item.product.id)"
        >
          <el-icon :size="12"><Delete /></el-icon>
        </button>
      </li>
    </ul>

    <template #footer>
      <div class="cart-drawer__footer">
        <div class="cart-drawer__total">
          <span>合计</span>
          <strong>{{ formatPrice(cart.total) }}</strong>
        </div>
        <p>运费与税费在结算时计算，限量作品售完即止。</p>
        <div class="cart-drawer__actions">
          <button class="btn btn--ghost" type="button" @click="goStore">继续选购</button>
          <button
            class="btn btn--primary"
            type="button"
            :disabled="cart.isEmpty"
            @click="checkout"
          >
            去结算
          </button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
:global(.cart-drawer .el-drawer__body) {
  display: flex;
  flex-direction: column;
  padding: 0 clamp(18px, 3vw, 24px);
}

.cart-drawer__head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.cart-drawer__head strong {
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.cart-drawer__head span {
  color: var(--text-dim);
  font-size: 11px;
}

.cart-drawer__empty {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px 0;
  text-align: center;
}

.cart-drawer__empty-icon {
  display: inline-flex;
  width: 52px;
  height: 52px;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--hairline-strong);
  border-radius: 50%;
  color: var(--text-muted);
}

.cart-drawer__empty p {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
}

.cart-drawer__empty span {
  max-width: 26ch;
  color: var(--text-muted);
  font-size: 11.5px;
  line-height: 1.7;
}

.cart-drawer__empty .btn {
  margin-top: 8px;
}

.cart-drawer__list {
  flex: 1;
  margin: 0;
  padding: 4px 0 12px;
  list-style: none;
}

.cart-item {
  position: relative;
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--hairline);
}

.cart-item__thumb {
  position: relative;
  display: block;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: 1px solid var(--hairline);
  background: #ece7dc;
}

.cart-item__thumb :deep(.smart-image) {
  position: absolute;
  inset: 0;
}

.cart-item__info {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
  padding-right: 22px;
}

.cart-item__title {
  overflow: hidden;
  color: var(--text-primary);
  font-size: 12.5px;
  font-weight: 600;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item__title:hover {
  color: var(--brand-strong);
}

.cart-item__meta {
  color: var(--text-dim);
  font-size: 10px;
}

.cart-item__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
}

.cart-item__price {
  color: var(--text-primary);
  font-size: 12.5px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.cart-item__remove {
  position: absolute;
  top: 14px;
  right: 0;
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--text-dim);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.cart-item__remove:hover {
  background: rgba(220, 60, 60, 0.16);
  color: #ff8a8a;
}

.cart-drawer__footer {
  padding: 14px 0 20px;
  border-top: 1px solid var(--hairline);
}

.cart-drawer__total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.cart-drawer__total span {
  color: var(--text-muted);
  font-size: 11px;
}

.cart-drawer__total strong {
  color: var(--text-primary);
  font-size: 20px;
  font-variant-numeric: tabular-nums;
  font-weight: 800;
}

.cart-drawer__footer p {
  margin-top: 5px;
  color: var(--text-dim);
  font-size: 10px;
  line-height: 1.6;
}

.cart-drawer__actions {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  gap: 10px;
  margin-top: 14px;
}

.cart-drawer__actions .btn {
  height: 42px;
  padding: 0 12px;
  font-size: 12px;
}

.cart-drawer__actions .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>
