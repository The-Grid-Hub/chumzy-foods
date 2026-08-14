import { PRODUCTS } from '@/lib/products'
import { REVIEWS, AVERAGE_RATING } from '@/lib/reviews'
import {
  BUSINESS_EMAIL,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  SITE_URL,
} from '@/lib/constants'

const schema = {
  '@context': 'https://schema.org',
  '@type': 'GroceryStore',
  name: BUSINESS_NAME,
  url: SITE_URL,
  // schema.org requires absolute URLs here, so these go through SITE_URL
  // rather than next/image.
  logo: `${SITE_URL}/assets/logo/logo_bg_white.png`,
  image: `${SITE_URL}/assets/logo/logo_bg_white.png`,
  email: BUSINESS_EMAIL,
  telephone: BUSINESS_PHONE,
  description:
    'Authentic Nigerian raw food materials — oils, soup ingredients, grains, beans, dried fish and canned goods. Retail and bulk, delivered to Nigeria, UK and USA.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Main Market',
    addressLocality: 'Gwagwalada',
    addressRegion: 'Abuja',
    addressCountry: 'NG',
  },
  areaServed: ['Nigeria', 'United Kingdom', 'United States'],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: AVERAGE_RATING.toFixed(1),
    reviewCount: REVIEWS.length,
    bestRating: 5,
  },
  makesOffer: PRODUCTS.map((p) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Product',
      name: p.name,
      category: p.category,
      description: p.description,
    },
    availability: p.inStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  })),
}

/** LocalBusiness + AggregateRating JSON-LD. Server component — no client cost. */
export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // Serialised from local static data only; no user input reaches this.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
