import type { ProductItem } from './catalog'

export interface CartItem {
  product: ProductItem
  quantity: number
}

/** 持久化时只存 id + 数量，商品信息以服务端/商品表为准 */
export interface StoredCartItem {
  id: string
  quantity: number
}
