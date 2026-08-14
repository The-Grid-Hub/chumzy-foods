import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import MotionProvider from '@/components/layout/MotionProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import StructuredData from '@/components/layout/StructuredData'
import { BUSINESS_NAME, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BUSINESS_NAME} | Fresh Nigerian Ingredients`,
  description:
    'Buy authentic Nigerian raw food materials — palm oil, egusi, ogbono, garri, stockfish, and more. Delivered to Nigeria, UK, and USA. Retail and bulk orders available.',
  alternates: { canonical: '/' },
  openGraph: {
    title: BUSINESS_NAME,
    description:
      'Fresh, authentic Nigerian raw food ingredients delivered to your door.',
    type: 'website',
    url: SITE_URL,
    siteName: BUSINESS_NAME,
    locale: 'en_NG',
  },
  twitter: {
    card: 'summary_large_image',
    title: BUSINESS_NAME,
    description:
      'Fresh, authentic Nigerian raw food ingredients delivered to your door.',
  },
  appleWebApp: { capable: true, title: 'Chumzy', statusBarStyle: 'default' },
  // No `icons` here on purpose: setting it — even with only `other` — suppresses
  // the icon.svg and apple-icon.png links that the app/ file conventions emit.
  // That cost more than the Safari pinned-tab mask-icon was worth.
}

export const viewport: Viewport = {
  themeColor: '#1A5C2A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body>
        <StructuredData />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <MotionProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
