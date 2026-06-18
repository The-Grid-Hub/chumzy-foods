'use client'
import { motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { WHATSAPP_URL, BUSINESS_PHONE } from '@/lib/constants'

export default function WhatsAppBanner() {
  return (
    <section className="py-16" style={{ background: '#25D366' }}>
      <div className="content-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-2xl mb-1">
                Order directly on WhatsApp
              </h3>
              <p className="text-white/80 text-base">
                Chat with us to place your order, ask about pricing, or enquire about bulk deliveries.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white text-green-700 font-bold px-7 py-3.5 rounded-xl hover:bg-green-50 transition-colors duration-200 text-base"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
            <a
              href={`tel:${BUSINESS_PHONE}`}
              className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors duration-200 text-base"
            >
              <Phone size={18} />
              Call Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
