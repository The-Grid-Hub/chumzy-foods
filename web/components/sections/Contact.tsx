'use client'
import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, AlertCircle } from 'lucide-react'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import {
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_ADDRESS,
  BUSINESS_NAME,
  PHONE_TEL_HREF,
  WHATSAPP_NUMBER,
  WHATSAPP_URL,
  GOOGLE_MAPS_URL,
  GOOGLE_MAPS_EMBED_URL,
} from '@/lib/constants'

const contactInfo = [
  { icon: Phone, label: 'Phone / WhatsApp', value: BUSINESS_PHONE, href: PHONE_TEL_HREF },
  { icon: Mail, label: 'Email', value: BUSINESS_EMAIL, href: `mailto:${BUSINESS_EMAIL}` },
  { icon: MapPin, label: 'Location', value: BUSINESS_ADDRESS, href: GOOGLE_MAPS_URL },
]

export default function Contact() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<'name' | 'message' | null>(null)
  const uid = useId()

  const nameId = `${uid}-name`
  const messageId = `${uid}-message`
  const errorId = `${uid}-error`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('name')
      document.getElementById(nameId)?.focus()
      return
    }
    if (!message.trim()) {
      setError('message')
      document.getElementById(messageId)?.focus()
      return
    }
    setError(null)
    const text = `Hello Chumzy! My name is ${name.trim()}.\n\n${message.trim()}`
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
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
          <span className="text-brand-amber-cta font-semibold text-sm uppercase tracking-widest mb-3 block">
            Get in Touch
          </span>
          <h2 className="section-heading mb-4">Contact Us</h2>
          <p className="section-subheading mx-auto">
            Have a question? Want to place a large order? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6 mb-8">
              {contactInfo.map(({ icon: Icon, label, value, href }) => {
                const isExternal = href.startsWith('http')
                return (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-brand-green" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-xs text-brand-muted uppercase tracking-wider mb-0.5">{label}</div>
                      {/* Underlined: colour alone is not a sufficient link cue. */}
                      <a
                        href={href}
                        className="text-brand-dark font-medium underline underline-offset-4 decoration-brand-green/40 hover:decoration-brand-green hover:text-brand-green transition-colors"
                        {...(isExternal
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {value}
                        {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-base no-underline"
            >
              <WhatsAppIcon size={20} />
              Chat on WhatsApp for the fastest response
              <span className="sr-only">(opens WhatsApp in a new tab)</span>
            </a>

            <p className="text-brand-muted text-sm mt-4 mb-8">
              We typically respond within a few hours on WhatsApp. For email enquiries, allow up to 24 hours.
            </p>

            {/* Short message form — composes a WhatsApp message, the same
                pattern as the cart and bulk-order flows. */}
            <form onSubmit={handleSubmit} noValidate className="card p-6 space-y-4">
              <h3 className="font-bold text-brand-dark text-lg">Send us a message</h3>

              <div>
                <label htmlFor={nameId} className="text-sm font-medium text-brand-dark mb-1.5 block">
                  Your name <span aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  id={nameId}
                  value={name}
                  onChange={e => {
                    setName(e.target.value)
                    if (error === 'name') setError(null)
                  }}
                  autoComplete="name"
                  className="input-field"
                  placeholder="Chioma Obi"
                  aria-invalid={error === 'name' || undefined}
                  aria-describedby={error === 'name' ? errorId : undefined}
                />
              </div>

              <div>
                <label htmlFor={messageId} className="text-sm font-medium text-brand-dark mb-1.5 block">
                  Message <span aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <textarea
                  id={messageId}
                  rows={3}
                  value={message}
                  onChange={e => {
                    setMessage(e.target.value)
                    if (error === 'message') setError(null)
                  }}
                  className="input-field resize-none"
                  placeholder="Ask about a product, pricing, or delivery to your country…"
                  aria-invalid={error === 'message' || undefined}
                  aria-describedby={error === 'message' ? errorId : undefined}
                />
              </div>

              {error && (
                <p id={errorId} className="flex items-center gap-1.5 text-brand-red text-xs">
                  <AlertCircle size={13} aria-hidden="true" />
                  {error === 'name' ? 'Please enter your name' : 'Please enter a message'}
                </p>
              )}

              <button
                type="submit"
                className="btn-green w-full inline-flex items-center justify-center gap-2"
              >
                <WhatsAppIcon size={18} />
                Send via WhatsApp
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-3"
          >
            <div className="card relative min-h-[320px] flex-1">
              <iframe
                title={`Map of ${BUSINESS_NAME}, ${BUSINESS_ADDRESS}`}
                src={GOOGLE_MAPS_EMBED_URL}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            {/* Fallback for anyone whose browser blocks the embed. */}
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-green font-medium underline underline-offset-4 self-start"
            >
              Open in Google Maps
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
