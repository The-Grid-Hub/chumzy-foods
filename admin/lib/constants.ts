export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const TOKEN_KEY = 'chumzy-admin-token'

export const PRODUCT_CATEGORIES = [
  'Oils',
  'Soup Ingredients',
  'Grains & Cassava',
  'Dried Fish & Seafood',
  'Seafood Seasonings',
  'Canned Goods',
]

export const CURRENCIES = [
  { code: 'NGN', symbol: '₦', label: 'Naira (₦)', field: 'priceNgn' },
  { code: 'USD', symbol: '$', label: 'US Dollar ($)', field: 'priceUsd' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)', field: 'priceGbp' },
] as const
