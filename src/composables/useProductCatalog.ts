/* 商城筛选、排序、视图切换的唯一状态源，StoreView 只负责组装和渲染 */

import { computed, ref } from 'vue'
import { getProducts, getPromoTiles } from '@/services/catalog'
import type {
  AvailabilityFilter,
  CatalogEntry,
  PriceBand,
  ProductFilter,
  ProductItem,
  SortKey,
  ViewMode,
} from '@/types/catalog'

/** 兼容旧的类型引用路径；新代码请直接从 @/types/catalog 引入 */
export type {
  AvailabilityFilter,
  CatalogEntry,
  PriceBand,
  SortKey,
  ViewMode,
} from '@/types/catalog'

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

  /** 当前筛选后的商品（不含促销位） */
  const visibleProducts = computed<ProductItem[]>(() => {
    const filtered = getProducts().filter((product) => {
      if (category.value !== '全部' && product.category !== category.value) return false
      if (availability.value === 'limited' && product.badge !== 'limited') return false
      if (availability.value === 'in-stock' && product.badge === 'limited') return false
      if (priceBand.value !== 'all' && !priceMatchers[priceBand.value](product.price)) return false
      return true
    })

    return [...filtered].sort(sorters[sort.value])
  })

  const count = computed(() => visibleProducts.value.length)

  /** 网格视图下把促销位混入；筛选或列表视图时不展示 */
  const entries = computed<CatalogEntry[]>(() => {
    const productEntries: CatalogEntry[] = visibleProducts.value.map((product) => ({
      kind: 'product',
      product,
    }))

    const showsPromos = view.value === 'grid' && !hasActiveFilters.value
    if (!showsPromos) return productEntries

    const promos = getPromoTiles()
    const mixed: CatalogEntry[] = []
    let promoIndex = 0

    productEntries.forEach((entry, index) => {
      if (PROMO_SLOTS.includes(index) && promoIndex < promos.length) {
        mixed.push({ kind: 'promo', promo: promos[promoIndex] })
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
