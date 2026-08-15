'use client'
import { motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { WHATSAPP_URL, BUSINESS_PHONE, PHONE_TEL_HREF } from '@/lib/constants'

export default function WhatsAppBanner() {
  return (
    // brand-whatsapp-dark, not the bright #25D366: white text on the bright
    // green measures ~2:1, well under AA. This surface is 7.7:1.
    <section id="order" className="on-dark py-16 bg-brand-whatsapp-dark">
      <div className="content-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-brand-whatsapp/25 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={32} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-white font-serif font-bold text-2xl mb-1">
                Order directly on WhatsApp
              </h2>
              <p className="text-white/90 text-base">
                Chat with us to place your order, ask about pricing, or enquire about bulk deliveries.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white text-brand-whatsapp-dark font-bold px-7 min-h-12 rounded-xl hover:bg-green-50 transition-colors duration-200 text-base no-underline"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Chat on WhatsApp
              <span className="sr-only">(opens WhatsApp in a new tab)</span>
            </a>
            <a
              href={PHONE_TEL_HREF}
              className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-7 min-h-12 rounded-xl transition-colors duration-200 text-base no-underline"
            >
              <Phone size={18} aria-hidden="true" />
              Call Us
              <span className="sr-only">on {BUSINESS_PHONE}</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
