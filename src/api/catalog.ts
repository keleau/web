/**
 * 商品相关接口（与 docs/03-后端接口与功能文档.md 对应）
 * 路径均相对于 VITE_API_BASE_URL，默认 /api。
 */
import { http } from './request'
import type { PageResult, PageQuery } from '@/types/api'
import type {
  AvailabilityFilter,
  PriceBand,
  ProductCategory,
  ProductItem,
  PromoTile,
  SortKey,
} from '@/types/catalog'

export interface ProductListQuery extends PageQuery {
  category?: ProductFilterValue
  availability?: AvailabilityFilter
  priceBand?: PriceBand
  sort?: SortKey
  keyword?: string
}

type ProductFilterValue = ProductCategory | '全部'

export function fetchProducts(query: ProductListQuery = {}) {
  return http.get<PageResult<ProductItem>>('/products', { params: query })
}

export function fetchProductById(id: string) {
  return http.get<ProductItem>(`/products/${encodeURIComponent(id)}`)
}

export function fetchPromoTiles() {
  return http.get<PromoTile[]>('/products/promos')
}

export function fetchProductCategories() {
  return http.get<ProductCategory[]>('/products/categories')
}
