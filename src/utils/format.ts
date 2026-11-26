const currency = new Intl.NumberFormat('zh-CN', {
  maximumFractionDigits: 0,
})

/** 1350 → ¥1,350 */
export function formatPrice(value: number): string {
  return `¥${currency.format(value)}`
}

/** 3 → "03" */
export function padIndex(value: number): string {
  return String(value).padStart(2, '0')
}
