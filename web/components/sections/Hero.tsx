'use client'
import { motion } from 'framer-motion'
import { ShoppingBag, Truck, Shield, Leaf } from 'lucide-react'
import Image from 'next/image'
import { WHATSAPP_URL } from '@/lib/constants'
import HeroShowcase from '@/components/ui/HeroShowcase'
import textureImg from '@/public/products/white-beans.jpg'

const badges = [
  { icon: ShoppingBag, label: 'Retail & Bulk' },
  { icon: Truck, label: 'UK & USA Delivery' },
  { icon: Shield, label: 'Quality Guaranteed' },
]

export default function Hero() {
  return (
    <section
      id="home"
      className="on-dark relative min-h-[92vh] flex items-center overflow-hidden bg-brand-gradient-hero"
    >
      {/* Photo texture under the gradient */}
      <Image
        src={textureImg}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-[0.07] pointer-events-none"
      />

      {/* Decorative circles */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 bg-brand-amber"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -left-16 w-64 h-64 rounded-full opacity-10 bg-brand-amber-light"
      />

      <div className="content-wrap relative z-10 py-20 w-full">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-brand-amber/20 text-brand-amber-light font-semibold text-sm px-4 py-1.5 rounded-full mb-6 border border-brand-amber/30">
                <Leaf size={14} aria-hidden="true" />
                Fresh · Authentic · Affordable
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
              <span className="text-brand-amber-light">Raw Food</span>
              <br />
              Delivered to You
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-white/80 text-lg sm:text-xl leading-relaxed mb-10"
            >
              Palm oil, egusi, ogbono, garri, stockfish and more — sourced fresh,
              packed with care, and shipped to Nigeria, UK, and USA. The taste of home, wherever you are.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-10"
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

          <div className="hidden lg:block">
            <HeroShowcase />
          </div>
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
