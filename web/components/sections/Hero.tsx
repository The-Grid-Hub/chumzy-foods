'use client'
import { motion } from 'framer-motion'
import { ShoppingBag, Truck, Shield } from 'lucide-react'
import { WHATSAPP_URL } from '@/lib/constants'

const badges = [
  { icon: ShoppingBag, label: 'Retail & Bulk' },
  { icon: Truck, label: 'UK & USA Delivery' },
  { icon: Shield, label: 'Quality Guaranteed' },
]

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0F3D1A 0%, #1A5C2A 60%, #2E7D44 100%)',
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
        style={{ background: '#D97706' }}
      />
      <div
        className="absolute -bottom-32 -left-16 w-64 h-64 rounded-full opacity-10"
        style={{ background: '#F59E0B' }}
      />

      <div className="content-wrap relative z-10 py-20 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-brand-amber/20 text-brand-amber-light font-semibold text-sm px-4 py-1.5 rounded-full mb-6 border border-brand-amber/30">
              🌿 Fresh · Authentic · Affordable
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-white font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6"
          >
            Fresh Nigerian
            <br />
            <span style={{ color: '#F59E0B' }}>Raw Food</span>
            <br />
            Delivered to You
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl"
          >
            Palm oil, egusi, ogbono, garri, stockfish and more — sourced fresh,
            packed with care, and shipped to Nigeria, UK, and USA. The taste of home, wherever you are.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <a href="#products" className="btn-amber text-base px-8 py-4">
              Shop Now
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-white text-white hover:bg-white hover:text-brand-green text-base px-8 py-4"
            >
              Order on WhatsApp
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-6"
          >
            {badges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/70 text-sm">
                <Icon size={16} className="text-brand-amber-light" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <div className="w-px h-8 bg-white/30 animate-pulse" />
        <span className="text-white/40 text-xs tracking-widest">SCROLL</span>
      </div>
    </section>
  )
}
