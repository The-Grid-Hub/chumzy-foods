export const BUSINESS_NAME = 'Chumzy Raw Food Materials'
export const BUSINESS_SHORT_NAME = 'CHUMZY'
export const BUSINESS_TAGLINE = 'Raw Food Materials'

export const WHATSAPP_NUMBER = '2348051459969'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const BUSINESS_EMAIL = 'foreverchioma@gmail.com'
/** Display form. Use PHONE_TEL_HREF for `tel:` links — this one contains spaces. */
export const BUSINESS_PHONE = '+234 805 145 9969'
export const PHONE_TEL_HREF = `tel:+${WHATSAPP_NUMBER}`
export const BUSINESS_ADDRESS = 'Main Market, Gwagwalada, Abuja, Nigeria'
/**
 * Canonical origin, used for metadataBase / canonical / OG URLs.
 * Set NEXT_PUBLIC_SITE_URL in the deployment env to the real domain — the
 * fallback below is a placeholder and will produce wrong absolute URLs.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chumzyrawfoods.vercel.app'
export const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_ADDRESS)}`
export const GOOGLE_MAPS_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(BUSINESS_ADDRESS)}&z=15&output=embed`

export const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#products', label: 'Products' },
  { href: '#bulk', label: 'Bulk Orders' },
  { href: '#about', label: 'About Us' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#contact', label: 'Contact' },
]

export const PRODUCT_CATEGORIES = [
  'All',
  'Oils',
  'Soup Ingredients',
  'Grains & Cassava',
  'Beans & Legumes',
  'Dried Fish & Seafood',
  'Seafood Seasonings',
  'Canned Goods',
]
