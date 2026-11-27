/** 统一的业务错误对象：页面与 API 模块都用它判断错误类型 */
export class ApiError extends Error {
  readonly code: number
  readonly status?: number
  readonly traceId?: string

  constructor(
    message: string,
    code: number,
    options: { status?: number; traceId?: string } = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = options.status
    this.traceId = options.traceId
  }

  /** 是否是登录态失效 */
  get isUnauthorized(): boolean {
    return this.status === 401 || this.code === 40100
  }
}
