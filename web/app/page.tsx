import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Products from '@/components/sections/Products'
import BulkOrder from '@/components/sections/BulkOrder'
import WhatsAppBanner from '@/components/sections/WhatsAppBanner'
import Reviews from '@/components/sections/Reviews'
import Contact from '@/components/sections/Contact'
import StickyMobileCta from '@/components/ui/StickyMobileCta'

export default function HomePage() {
  return (
    <>
      {/* pb clears the sticky mobile CTA bar, which is fixed over the page bottom. */}
      <main id="main" className="pb-20 lg:pb-0">
        <Hero />
        <About />
        <Products />
        <BulkOrder />
        <WhatsAppBanner />
        <Reviews />
        <Contact />
      </main>
      <StickyMobileCta />
    </>
  )
}
