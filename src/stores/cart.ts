import { defineStore } from 'pinia'
import type { ProductItem } from '@/data/products'

export interface CartItem {
  product: ProductItem
  quantity: number
}

/**
 * 购物车 Store
 * 负责商品增删改、数量变化、小计与清空。
 * 所有持久化通过 sessionStorage（演示）。
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    /** 购物车里商品件数（可能重复） */
    count: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),

    /** 唯一商品种类数 */
    uniqueCount: (state) => state.items.length,

    /** 总价 */
    total: (state) =>
      state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

    /** 是否为空 */
    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    /** 加入购物车；已存在则 +1 */
    add(product: ProductItem, quantity = 1) {
      const existing = this.items.find((item) => item.product.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({ product, quantity })
      }
    },

    /** 把某件商品数量设置为指定值（最小 1） */
    setQuantity(productId: string, quantity: number) {
      const target = this.items.find((item) => item.product.id === productId)
      if (!target) return
      if (quantity <= 0) {
        this.remove(productId)
      } else {
        target.quantity = quantity
      }
    },

    /** +1 */
    increment(productId: string) {
      const target = this.items.find((item) => item.product.id === productId)
      if (target) target.quantity += 1
    },

    /** -1，减到 0 自动移除 */
    decrement(productId: string) {
      const target = this.items.find((item) => item.product.id === productId)
      if (!target) return
      target.quantity -= 1
      if (target.quantity <= 0) {
        this.items = this.items.filter((item) => item.product.id !== productId)
      }
    },

    /** 移除某件商品 */
    remove(productId: string) {
      this.items = this.items.filter((item) => item.product.id !== productId)
    },

    /** 清空 */
    clear() {
      this.items = []
    },
  },
})
