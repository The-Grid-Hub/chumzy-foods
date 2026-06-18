import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart-context'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Chumzy Raw Food Materials | Fresh Nigerian Ingredients',
  description:
    'Buy authentic Nigerian raw food materials — palm oil, egusi, ogbono, garri, stockfish, and more. Delivered to Nigeria, UK, and USA. Retail and bulk orders available.',
  keywords: 'Nigerian raw food, palm oil, egusi, ogbono, garri, stockfish, crayfish, buy Nigerian food online',
  openGraph: {
    title: 'Chumzy Raw Food Materials',
    description: 'Fresh, authentic Nigerian raw food ingredients delivered to your door.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
