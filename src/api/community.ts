/** 社区画廊接口 */
import { http } from './request'
import type { PageQuery, PageResult } from '@/types/api'
import type { CommunityCategory, CommunityItem } from '@/types/community'

export interface CommunityListQuery extends PageQuery {
  category?: CommunityCategory | '全部'
}

export function fetchCommunityItems(query: CommunityListQuery = {}) {
  return http.get<PageResult<CommunityItem>>('/community/items', { params: query })
}

export function fetchCommunityCategories() {
  return http.get<CommunityCategory[]>('/community/categories')
}

export function fetchCommunityItemById(id: string) {
  return http.get<CommunityItem>(`/community/items/${encodeURIComponent(id)}`)
}
