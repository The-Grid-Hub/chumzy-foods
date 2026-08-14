import type { MetadataRoute } from 'next'
import { BUSINESS_NAME } from '@/lib/constants'

/**
 * Served at /manifest.webmanifest; Next injects the <link rel="manifest"> itself.
 * Icon paths are root-relative to public/ — the PWA icons stay there rather than
 * moving into app/, since only the manifest references them.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BUSINESS_NAME,
    // Title case, not BUSINESS_SHORT_NAME ('CHUMZY') — this renders under a home
    // screen icon, where all-caps reads as shouting.
    short_name: 'Chumzy',
    description:
      'Fresh Nigerian raw food materials — oils, soup ingredients, grains, dried fish.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFBF5', // brand.cream — matches `body` in globals.css
    theme_color: '#1A5C2A', // brand.green — matches viewport.themeColor
    icons: [
      { src: '/assets/logo/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/logo/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/assets/logo/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
