/**
 * 商品数据入口（service 层）
 *
 * 目前读取本地 mock 数据；接入后端时只需把这里替换为 @/api/catalog 的
 * fetchProducts/fetchProductById，并保持返回结构不变，页面与组件无需改动。
 */
import { productCategories, products, promoTiles } from '@/data/products'
import type { ProductFilter, ProductItem, PromoTile } from '@/types/catalog'

export function getProducts(): readonly ProductItem[] {
  return products
}

export function getProductById(id?: string | null): ProductItem | null {
  if (!id) return null
  return products.find((product) => product.id === id) ?? null
}

export function getProductIndex(product: ProductItem): number {
  return products.indexOf(product)
}

export function getPromoTiles(): readonly PromoTile[] {
  return promoTiles
}

export function getProductCategories(): readonly ProductFilter[] {
  return productCategories
}

export function getRelatedProducts(product: ProductItem, limit = 4): ProductItem[] {
  return products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit)
}

export function getFeaturedProducts(ids: readonly string[]): ProductItem[] {
  return ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is ProductItem => Boolean(product))
}
