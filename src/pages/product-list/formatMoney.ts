export function formatMoney(value: string): string {
  const n = Number.parseFloat(value)
  if (!Number.isFinite(n)) return value
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}
