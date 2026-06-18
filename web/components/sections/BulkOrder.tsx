'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package2, CheckCircle } from 'lucide-react'
import { API_BASE } from '@/lib/constants'
import type { BulkOrderForm } from '@/lib/types'

const perks = [
  'Competitive wholesale pricing',
  'Flexible packaging and quantities',
  'Dedicated account management via WhatsApp',
  'Regular supply for restaurants, caterers, and retailers',
]

const initialForm: BulkOrderForm = {
  businessName: '',
  contactName: '',
  email: '',
  phone: '',
  country: '',
  productRequests: '',
  estimatedQuantity: '',
  deliveryTimeline: '',
  additionalNotes: '',
}

export default function BulkOrder() {
  const [form, setForm] = useState<BulkOrderForm>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (field: keyof BulkOrderForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/bulk-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try WhatsApp instead.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="bulk-order" className="py-24" style={{ background: '#F5F0E8' }}>
      <div className="content-wrap">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-amber font-semibold text-sm uppercase tracking-widest mb-3 block">
              Wholesale & Bulk
            </span>
            <h2 className="section-heading mb-6">
              Bulk Order <span className="text-brand-green">Request</span>
            </h2>
            <p className="text-brand-muted leading-relaxed mb-8">
              Whether you run a restaurant, food retail business, or you&apos;re sending a large
              shipment to family abroad — we cater to bulk orders with competitive pricing
              and flexible arrangements.
            </p>
            <ul className="space-y-4 mb-10">
              {perks.map(perk => (
                <li key={perk} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-brand-green flex-shrink-0 mt-0.5" />
                  <span className="text-brand-dark text-sm">{perk}</span>
                </li>
              ))}
            </ul>

            <div
              className="rounded-2xl p-6 border border-brand-green/20"
              style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Package2 className="text-brand-green" size={24} />
                <span className="font-semibold text-brand-dark">Minimum Bulk Order</span>
              </div>
              <p className="text-brand-muted text-sm">
                We accept bulk orders from as little as 5kg per product. Larger quantities
                attract better pricing. Get in touch to discuss your specific needs.
              </p>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-8"
          >
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle size={56} className="text-brand-green mx-auto mb-4" />
                <h3 className="font-bold text-brand-dark text-xl mb-2">Request Received!</h3>
                <p className="text-brand-muted">
                  We&apos;ll review your bulk order request and get back to you within 24 hours via WhatsApp or email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-brand-dark text-xl mb-6">Submit Bulk Request</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-brand-dark mb-1.5 block">Business name</label>
                    <input className="input-field" placeholder="Optional" value={form.businessName} onChange={set('businessName')} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-dark mb-1.5 block">Contact name *</label>
                    <input required className="input-field" placeholder="Chioma Obi" value={form.contactName} onChange={set('contactName')} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-brand-dark mb-1.5 block">Email *</label>
                    <input required type="email" className="input-field" placeholder="you@email.com" value={form.email} onChange={set('email')} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-dark mb-1.5 block">Phone / WhatsApp *</label>
                    <input required className="input-field" placeholder="+234 xxx xxxx" value={form.phone} onChange={set('phone')} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1.5 block">Country *</label>
                  <input required className="input-field" placeholder="Nigeria / UK / USA" value={form.country} onChange={set('country')} />
                </div>

                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1.5 block">Products needed *</label>
                  <textarea
                    required
                    rows={3}
                    className="input-field resize-none"
                    placeholder="e.g. 20kg palm oil, 10kg egusi, 5kg crayfish..."
                    value={form.productRequests}
                    onChange={set('productRequests')}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-brand-dark mb-1.5 block">Estimated quantity *</label>
                    <input required className="input-field" placeholder="e.g. 50kg total" value={form.estimatedQuantity} onChange={set('estimatedQuantity')} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-dark mb-1.5 block">Delivery timeline</label>
                    <input className="input-field" placeholder="e.g. Within 2 weeks" value={form.deliveryTimeline} onChange={set('deliveryTimeline')} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1.5 block">Additional notes</label>
                  <textarea
                    rows={2}
                    className="input-field resize-none"
                    placeholder="Any special requirements..."
                    value={form.additionalNotes}
                    onChange={set('additionalNotes')}
                  />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button type="submit" disabled={submitting} className="btn-green w-full text-base py-3.5 disabled:opacity-60">
                  {submitting ? 'Submitting...' : 'Submit Bulk Order Request'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
