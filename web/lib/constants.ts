export const WHATSAPP_NUMBER = '2348051459969'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const BUSINESS_EMAIL = 'foreverchioma@gmail.com'
export const BUSINESS_PHONE = '+234 805 145 9969'
export const BUSINESS_ADDRESS = 'Main Market, Gwagwalada, Abuja, Nigeria'

if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    'NEXT_PUBLIC_API_URL is not set — falling back to http://localhost:8080. ' +
      'Set it in web/.env.local to match your server.'
  )
}

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#products', label: 'Products' },
  { href: '#about', label: 'About Us' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#bulk-order', label: 'Bulk Orders' },
  { href: '#contact', label: 'Contact' },
]

export const PRODUCT_CATEGORIES = [
  'All',
  'Oils',
  'Soup Ingredients',
  'Grains & Cassava',
  'Dried Fish & Seafood',
  'Seafood Seasonings',
  'Canned Goods',
]

export const CURRENCIES = [
  { code: 'NGN', symbol: '₦', label: 'Naira (₦)' },
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' },
] as const

export type CurrencyCode = 'NGN' | 'USD' | 'GBP'
