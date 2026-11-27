import { defineStore } from 'pinia'
import { getProductById } from '@/services/catalog'
import type { CartItem, StoredCartItem } from '@/types/cart'
import type { ProductItem } from '@/types/catalog'
import { readStorage, STORAGE_KEYS, writeStorage } from '@/utils/storage'

const MAX_QUANTITY = 99

/** 数量归一化：非法值回落到 1，并限制在 1–99 */
export function normalizeQuantity(value: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(value)))
}

/** 从 localStorage 还原购物车；商品以当前商品表为准，已下架商品自动剔除 */
function loadCartItems(): CartItem[] {
  const stored = readStorage<StoredCartItem[]>(STORAGE_KEYS.cart, [])
  if (!Array.isArray(stored)) return []

  // 用 Map 去重：历史数据里可能出现同一商品多行，合并数量而不是展示重复行
  const byId = new Map<string, CartItem>()
  for (const entry of stored) {
    if (!entry || typeof entry.id !== 'string') continue
    const product = getProductById(entry.id)
    if (!product) continue

    const quantity = normalizeQuantity(entry.quantity)
    const existing = byId.get(product.id)
    if (existing) {
      existing.quantity = normalizeQuantity(existing.quantity + quantity)
    } else {
      byId.set(product.id, { product, quantity })
    }
  }

  return [...byId.values()]
}

/**
 * 购物车 Store
 * - 增删改、数量变化、小计与清空
 * - 持久化到 localStorage（只存 id + 数量，价格始终取商品表）
 * - 抽屉开关也放在这里，FloatingCart 与 CartDrawer 共享状态
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadCartItems(),
    drawerOpen: false,
  }),

  getters: {
    /** 购物车里商品件数（含重复） */
    count: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),

    /** 唯一商品种类数 */
    uniqueCount: (state) => state.items.length,

    /** 总价（按分计算后还原，避免浮点误差） */
    total: (state) =>
      Math.round(
        state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * 100,
      ) / 100,

    /** 是否为空 */
    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    /** 写入 localStorage */
    persist() {
      const snapshot: StoredCartItem[] = this.items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      }))
      writeStorage(STORAGE_KEYS.cart, snapshot)
    },

    /** 加入购物车；已存在则累加 */
    add(product: ProductItem, quantity = 1) {
      const delta = normalizeQuantity(quantity)
      const existing = this.items.find((item) => item.product.id === product.id)
      if (existing) {
        existing.quantity = normalizeQuantity(existing.quantity + delta)
      } else {
        this.items.push({ product, quantity: delta })
      }
      this.persist()
    },

    /** 把某件商品数量设置为指定值；<=0 视为移除 */
    setQuantity(productId: string, quantity: number) {
      const target = this.items.find((item) => item.product.id === productId)
      if (!target) return
      if (quantity <= 0) {
        this.remove(productId)
        return
      }
      target.quantity = normalizeQuantity(quantity)
      this.persist()
    },

    increment(productId: string) {
      const target = this.items.find((item) => item.product.id === productId)
      if (!target) return
      target.quantity = normalizeQuantity(target.quantity + 1)
      this.persist()
    },

    decrement(productId: string) {
      const target = this.items.find((item) => item.product.id === productId)
      if (!target) return
      if (target.quantity <= 1) {
        this.remove(productId)
        return
      }
      target.quantity -= 1
      this.persist()
    },

    remove(productId: string) {
      this.items = this.items.filter((item) => item.product.id !== productId)
      this.persist()
    },

    clear() {
      this.items = []
      this.persist()
    },

    openDrawer() {
      this.drawerOpen = true
    },

    closeDrawer() {
      this.drawerOpen = false
    },

    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen
    },
  },
})
