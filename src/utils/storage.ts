/** 本地存储的安全封装：隐私模式 / 存储禁用时不会让页面崩溃 */

export const STORAGE_KEYS = {
  cart: 'cw.cart.v1',
  token: 'token',
  guideSeen: 'cw.custom-guide.seen',
} as const

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 存储空间不足或被禁用时静默失败，购物车仍在内存中可用
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // 忽略
  }
}
