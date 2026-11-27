const currency = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/** 1350 → ¥1,350；1350.5 → ¥1,350.5（最多两位小数） */
export function formatPrice(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '¥--'
  return `¥${currency.format(value)}`
}

/** 3 → "03" */
export function padIndex(value: number): string {
  if (!Number.isFinite(value)) return '--'
  return String(Math.max(0, Math.trunc(value))).padStart(2, '0')
}
