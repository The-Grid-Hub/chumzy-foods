'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, MessageCircle, CheckCircle } from 'lucide-react'
import { API_BASE, BUSINESS_EMAIL, BUSINESS_PHONE, BUSINESS_ADDRESS, WHATSAPP_URL } from '@/lib/constants'
import type { ContactForm } from '@/lib/types'

const contactInfo = [
  { icon: Phone, label: 'Phone / WhatsApp', value: BUSINESS_PHONE, href: `tel:${BUSINESS_PHONE}` },
  { icon: Mail, label: 'Email', value: BUSINESS_EMAIL, href: `mailto:${BUSINESS_EMAIL}` },
  { icon: MapPin, label: 'Location', value: BUSINESS_ADDRESS, href: undefined },
]

const initial: ContactForm = { name: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(initial)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (field: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      setError('Could not send message. Please use WhatsApp instead.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-brand-cream">
      <div className="content-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-brand-amber font-semibold text-sm uppercase tracking-widest mb-3 block">
            Get in Touch
          </span>
          <h2 className="section-heading mb-4">Contact Us</h2>
          <p className="section-subheading mx-auto">
            Have a question? Want to place a large order? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Info side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6 mb-10">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-brand-green" />
                  </div>
                  <div>
                    <div className="text-xs text-brand-muted uppercase tracking-wider mb-0.5">{label}</div>
                    {href ? (
                      <a href={href} className="text-brand-dark font-medium hover:text-brand-green transition-colors no-underline">
                        {value}
                      </a>
                    ) : (
                      <p className="text-brand-dark font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-white font-semibold px-6 py-4 rounded-xl transition-colors duration-200"
              style={{ background: '#25D366' }}
            >
              <MessageCircle size={20} />
              Chat on WhatsApp — fastest response
            </a>

            <p className="text-brand-muted text-sm mt-4">
              We typically respond within a few hours on WhatsApp. For email enquiries, allow up to 24 hours.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card p-8"
          >
            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle size={52} className="text-brand-green mx-auto mb-4" />
                <h3 className="font-bold text-brand-dark text-xl mb-2">Message Sent!</h3>
                <p className="text-brand-muted">We&apos;ll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-brand-dark mb-1.5 block">Name *</label>
                    <input required className="input-field" placeholder="Your name" value={form.name} onChange={set('name')} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-dark mb-1.5 block">Email *</label>
                    <input required type="email" className="input-field" placeholder="you@email.com" value={form.email} onChange={set('email')} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1.5 block">Phone</label>
                  <input className="input-field" placeholder="+234 xxx xxxx" value={form.phone} onChange={set('phone')} />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1.5 block">Subject *</label>
                  <select required className="input-field" value={form.subject} onChange={set('subject')}>
                    <option value="">Select a subject</option>
                    <option>Product inquiry</option>
                    <option>Pricing & availability</option>
                    <option>Bulk / wholesale order</option>
                    <option>Delivery inquiry</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1.5 block">Message *</label>
                  <textarea
                    required
                    rows={5}
                    className="input-field resize-none"
                    placeholder="Tell us what you need..."
                    value={form.message}
                    onChange={set('message')}
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" disabled={submitting} className="btn-green w-full py-3.5 disabled:opacity-60">
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
