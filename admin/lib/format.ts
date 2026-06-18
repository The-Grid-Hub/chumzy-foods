import { CURRENCIES } from './constants'
import type { Product, Order } from './types'

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const SYMBOLS: Record<string, string> = { NGN: '₦', USD: '$', GBP: '£' }

export function formatMoney(amount: string | null, currency: string): string {
  if (amount === null || amount === '') return '—'
  return `${SYMBOLS[currency] ?? ''}${amount}`
}

/** Compact "₦5000 · $6.50 · £5.10" string of whichever product prices are set. */
export function productPrices(product: Product): string {
  const parts = CURRENCIES.map(c => {
    const value = product[c.field]
    return value ? `${c.symbol}${value}` : null
  }).filter(Boolean)
  return parts.length ? parts.join(' · ') : '—'
}

/** The order total in whichever currency was recorded. */
export function orderTotal(order: Order): string {
  if (order.totalNgn) return `₦${order.totalNgn}`
  if (order.totalUsd) return `$${order.totalUsd}`
  if (order.totalGbp) return `£${order.totalGbp}`
  return '—'
}
