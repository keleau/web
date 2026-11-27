/**
 * 社区数据入口（service 层）
 * 接入后端时替换为 @/api/community 的实现，保持函数签名不变。
 */
import { communityCategories, communityItems } from '@/data/community'
import type { CommunityFilter, CommunityItem } from '@/types/community'

export function getCommunityItems(): readonly CommunityItem[] {
  return communityItems
}

export function getCommunityCategories(): readonly CommunityFilter[] {
  return communityCategories
}

export function filterCommunityItems(category: CommunityFilter): CommunityItem[] {
  if (category === '全部') return [...communityItems]
  return communityItems.filter((item) => item.category === category)
}

export function countCommunityItems(category: CommunityFilter): number {
  return category === '全部'
    ? communityItems.length
    : communityItems.filter((item) => item.category === category).length
}
