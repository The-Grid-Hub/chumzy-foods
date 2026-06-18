'use client'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

const highlights = [
  'Registered Nigerian business since October 2020',
  'Fresh, authentic ingredients sourced from trusted farms',
  'Retail and bulk orders available',
  'Serving customers locally in Abuja and internationally in UK & USA',
  'Direct WhatsApp ordering for convenience',
  'Affordable pricing without compromising quality',
]

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="content-wrap">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-brand-amber font-semibold text-sm uppercase tracking-widest mb-3 block">
              Our Story
            </span>
            <h2 className="section-heading mb-6">
              Trusted Source for<br />
              <span className="text-brand-green">Authentic Raw Foods</span>
            </h2>
            <p className="text-brand-muted leading-relaxed mb-4">
              Founded in October 2020 by Chioma Nwodo at Main Market, Gwagwalada, Abuja,
              Chumzy Raw Food Materials was born out of a simple mission: to make fresh,
              authentic Nigerian food ingredients accessible to everyone — from households
              and individual cooks to small food vendors.
            </p>
            <p className="text-brand-muted leading-relaxed mb-8">
              What sets Chumzy apart is our commitment to <strong className="text-brand-dark">affordability without compromise</strong>.
              Every product is carefully sourced to ensure freshness and authenticity, so
              whether you&apos;re cooking at home in Abuja or missing the taste of home in the UK or USA,
              you can always rely on us.
            </p>

            <ul className="space-y-3">
              {highlights.map(h => (
                <li key={h} className="flex items-start gap-3 text-sm text-brand-dark">
                  <CheckCircle size={18} className="text-brand-green flex-shrink-0 mt-0.5" />
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Stats cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: '2020', label: 'Year Founded', sub: 'Gwagwalada, Abuja' },
              { value: '10+', label: 'Products', sub: 'Fresh raw ingredients' },
              { value: '2', label: 'Continents Served', sub: 'Africa · Europe · Americas' },
              { value: '100%', label: 'Quality Focus', sub: 'No compromise on freshness' },
            ].map(stat => (
              <div
                key={stat.label}
                className="card p-6 border-brand-green/10"
                style={{ borderLeft: '4px solid #1A5C2A' }}
              >
                <div className="text-3xl font-extrabold text-brand-green mb-1">{stat.value}</div>
                <div className="font-semibold text-brand-dark text-sm">{stat.label}</div>
                <div className="text-xs text-brand-muted mt-1">{stat.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
