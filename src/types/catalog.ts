/**
 * 商品域类型：数据、筛选、视图共用同一套契约。
 * 组件不再各自声明商品结构，后端字段调整时只改这里。
 */

export type ProductCategory = '潮流潮玩' | '珍藏纪念' | '创意礼物' | '装饰美学'

/** 商城筛选项：含「全部」 */
export type ProductFilter = ProductCategory | '全部'

export type ProductBadge = 'fan' | 'limited'

export type ProductRatio = '1:1' | '4:5' | '3:4' | '5:4'

export interface ProductItem {
  id: string
  title: string
  /** 单位：元（后端如用分，请在 service 层统一换算） */
  price: number
  sold: number
  category: ProductCategory
  badge?: ProductBadge
  edition: string
  ratio: ProductRatio
  image: string
  /** 3D 模型地址（.glb）。放进 public/models/ 后填 '/models/xxx.glb'；留空则展示内置占位浮雕 */
  model?: string
}

export type PromoTone = 'sand' | 'paper' | 'ink'

export interface PromoTile {
  id: string
  brand: string
  title: string
  note: string
  cta: string
  image: string
  tone: PromoTone
  /** 网格下方说明，避免组件里写死文案 */
  caption: string
  captionNote: string
}

/* ---------------- 商城筛选 / 排序 / 视图 ---------------- */

export type AvailabilityFilter = 'all' | 'in-stock' | 'limited'

export type PriceBand = 'all' | 'under-500' | '500-1000' | 'over-1000'

export type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'popular'

export type ViewMode = 'grid' | 'list'

/** 商城网格中的一格：商品或服务位 */
export type CatalogEntry =
  | { kind: 'product'; product: ProductItem }
  | { kind: 'promo'; promo: PromoTile }
