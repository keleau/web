/* 商城筛选、排序、视图切换的唯一状态源，StoreView 只负责组装和渲染 */

import { computed, ref } from 'vue'
import {
  products,
  promoTiles,
  type ProductFilter,
  type ProductItem,
  type PromoTile,
} from '@/data/products'

export type AvailabilityFilter = 'all' | 'in-stock' | 'limited'
export type PriceBand = 'all' | 'under-500' | '500-1000' | 'over-1000'
export type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'popular'
export type ViewMode = 'grid' | 'list'

export type CatalogEntry =
  | { kind: 'product'; product: ProductItem }
  | { kind: 'promo'; promo: PromoTile }

const priceMatchers: Record<Exclude<PriceBand, 'all'>, (price: number) => boolean> = {
  'under-500': (price) => price < 500,
  '500-1000': (price) => price >= 500 && price <= 1000,
  'over-1000': (price) => price > 1000,
}

const sorters: Record<SortKey, (a: ProductItem, b: ProductItem) => number> = {
  recommended: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  popular: (a, b) => b.sold - a.sold,
}

/** 促销位插入网格的位置：首行一张，之后约每行一张 */
const PROMO_SLOTS = [0, 6, 12]

export function useProductCatalog() {
  const category = ref<ProductFilter>('全部')
  const availability = ref<AvailabilityFilter>('all')
  const priceBand = ref<PriceBand>('all')
  const sort = ref<SortKey>('recommended')
  const view = ref<ViewMode>('grid')

  const hasActiveFilters = computed(
    () =>
      category.value !== '全部' ||
      availability.value !== 'all' ||
      priceBand.value !== 'all',
  )

  const visibleProducts = computed(() => {
    const filtered = products.filter((product) => {
      if (category.value !== '全部' && product.category !== category.value) return false
      if (availability.value === 'limited' && product.badge !== 'limited') return false
      if (availability.value === 'in-stock' && product.badge === 'limited') return false
      if (priceBand.value !== 'all' && !priceMatchers[priceBand.value](product.price)) return false
      return true
    })

    return [...filtered].sort(sorters[sort.value])
  })

  const count = computed(() => visibleProducts.value.length)

  const entries = computed<CatalogEntry[]>(() => {
    const entries: CatalogEntry[] = visibleProducts.value.map((product) => ({
      kind: 'product',
      product,
    }))

    const showsPromos = view.value === 'grid' && !hasActiveFilters.value
    if (!showsPromos) return entries

    const mixed: CatalogEntry[] = []
    let promoIndex = 0

    entries.forEach((entry, index) => {
      if (PROMO_SLOTS.includes(index) && promoIndex < promoTiles.length) {
        mixed.push({ kind: 'promo', promo: promoTiles[promoIndex] })
        promoIndex += 1
      }
      mixed.push(entry)
    })

    return mixed
  })

  function resetFilters() {
    category.value = '全部'
    availability.value = 'all'
    priceBand.value = 'all'
  }

  return {
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
  }
}
