/** 接口通用类型：响应包、分页、错误码 */

/** 后端统一响应包；code=0 表示成功 */
export interface ApiEnvelope<T = unknown> {
  code: number
  message: string
  data: T
  traceId?: string
}

export interface PageQuery {
  page?: number
  pageSize?: number
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** 与后端约定的业务错误码（文档中同步维护） */
export const API_ERROR_CODES = {
  OK: 0,
  BAD_REQUEST: 40000,
  UNAUTHORIZED: 40100,
  FORBIDDEN: 40300,
  NOT_FOUND: 40400,
  FILE_TOO_LARGE: 41300,
  UNSUPPORTED_MEDIA_TYPE: 41500,
  RATE_LIMITED: 42900,
  SERVER_ERROR: 50000,
  MODEL_TASK_FAILED: 51001,
} as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES]
