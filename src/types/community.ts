/** 社区画廊域类型 */

export type CommunityCategory = '萌宠摆件' | '黏土浮雕' | '冰箱贴'

export type CommunityFilter = CommunityCategory | '全部'

export interface CommunityItem {
  id: string
  title: string
  category: CommunityCategory
  maker: string
  craft: string
  size: string
  image: string
}
