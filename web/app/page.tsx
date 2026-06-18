import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Products from '@/components/sections/Products'
import WhatsAppBanner from '@/components/sections/WhatsAppBanner'
import Reviews from '@/components/sections/Reviews'
import BulkOrder from '@/components/sections/BulkOrder'
import Contact from '@/components/sections/Contact'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Products />
      <WhatsAppBanner />
      <Reviews />
      <BulkOrder />
      <Contact />
    </main>
  )
}
