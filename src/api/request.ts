import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { ApiError } from './error'
import type { ApiEnvelope } from '@/types/api'
import { removeStorage, STORAGE_KEYS } from '@/utils/storage'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 为 true 时不在拦截器里弹错误提示，由调用方自行处理 */
    skipErrorMessage?: boolean
    /** 为 true 时不携带 token */
    skipAuth?: boolean
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const service = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

/* ---------------- 错误提示去重 ---------------- */

const recentMessages = new Map<string, number>()
const MESSAGE_GAP = 1500

function notifyError(message: string) {
  const now = Date.now()
  const last = recentMessages.get(message) ?? 0
  if (now - last < MESSAGE_GAP) return
  if (recentMessages.size > 50) recentMessages.clear()
  recentMessages.set(message, now)
  ElMessage.error(message)
}

function statusMessage(status?: number): string {
  switch (status) {
    case 400:
      return '请求参数不正确'
    case 401:
      return '登录状态已失效，请重新登录'
    case 403:
      return '没有权限执行该操作'
    case 404:
      return '请求的资源不存在'
    case 413:
      return '文件过大，请压缩后重试'
    case 415:
      return '不支持的文件格式'
    case 429:
      return '操作过于频繁，请稍后再试'
    case 500:
    case 502:
    case 503:
      return '服务暂时不可用，请稍后重试'
    default:
      return ''
  }
}

function isEnvelope(value: unknown): value is ApiEnvelope {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<ApiEnvelope>
  return typeof candidate.code === 'number' && typeof candidate.message === 'string'
}

/* ---------------- 拦截器 ---------------- */

service.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = localStorage.getItem(STORAGE_KEYS.token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

service.interceptors.response.use(
  (response) => {
    const body = response.data
    const config = response.config

    // 统一响应包 { code, message, data }：code=0 视为成功，直接返回 data
    if (isEnvelope(body)) {
      if (body.code === 0) return body.data

      const message = body.message || '请求失败'
      if (body.code === 401) removeStorage(STORAGE_KEYS.token)
      if (!config.skipErrorMessage) notifyError(message)
      return Promise.reject(
        new ApiError(message, body.code, {
          status: response.status,
          traceId: body.traceId,
        }),
      )
    }

    // 兼容后端直接返回裸数据的接口
    return body
  },
  (error: AxiosError<ApiEnvelope>) => {
    if (axios.isCancel(error)) return Promise.reject(error)

    const status = error.response?.status
    const body = error.response?.data
    let message = body?.message || statusMessage(status) || error.message || '网络异常'

    if (status === 401) {
      removeStorage(STORAGE_KEYS.token)
      message = '登录状态已失效，请重新登录'
    }

    const apiError = new ApiError(message, body?.code ?? status ?? -1, {
      status,
      traceId: body?.traceId,
    })

    if (!error.config?.skipErrorMessage) notifyError(message)
    return Promise.reject(apiError)
  },
)

/** 带类型的请求入口：拦截器已解包 data，这里只做类型断言 */
export function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return service.request(config) as Promise<T>
}

/** 常用方法糖，避免业务层重复写 method / url */
export const http = {
  get<T>(url: string, config?: AxiosRequestConfig) {
    return request<T>({ ...config, url, method: 'GET' })
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return request<T>({ ...config, url, method: 'POST', data })
  },
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return request<T>({ ...config, url, method: 'PUT', data })
  },
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return request<T>({ ...config, url, method: 'PATCH', data })
  },
  delete<T>(url: string, config?: AxiosRequestConfig) {
    return request<T>({ ...config, url, method: 'DELETE' })
  },
  /** 文件上传：自动挂载进度回调 */
  upload<T>(
    url: string,
    form: FormData,
    onProgress?: (percent: number) => void,
    config?: AxiosRequestConfig,
  ) {
    return request<T>({
      ...config,
      url,
      method: 'POST',
      data: form,
      timeout: 60000,
      onUploadProgress: (event) => {
        if (!event.total) return
        onProgress?.(Math.round((event.loaded / event.total) * 100))
      },
    })
  },
}

export default service
