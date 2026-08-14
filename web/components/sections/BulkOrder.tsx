'use client'
import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { Package2, CheckCircle, AlertCircle } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/constants'
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

const REQUIRED: { field: keyof BulkOrderForm; label: string }[] = [
  { field: 'contactName', label: 'Contact name' },
  { field: 'email', label: 'Email' },
  { field: 'phone', label: 'Phone / WhatsApp' },
  { field: 'country', label: 'Country' },
  { field: 'productRequests', label: 'Products needed' },
  { field: 'estimatedQuantity', label: 'Estimated quantity' },
]

type Errors = Partial<Record<keyof BulkOrderForm, string>>

function validate(form: BulkOrderForm): Errors {
  const errors: Errors = {}
  for (const { field, label } of REQUIRED) {
    if (!(form[field] ?? '').trim()) errors[field] = `${label} is required`
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address'
  }
  return errors
}

function buildBulkWhatsAppUrl(form: BulkOrderForm): string {
  const msg = [
    'Hello Chumzy! I would like to request a bulk order:',
    '',
    form.businessName ? `Business: ${form.businessName}` : null,
    `Contact: ${form.contactName}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    `Country: ${form.country}`,
    `Products: ${form.productRequests}`,
    `Estimated quantity: ${form.estimatedQuantity}`,
    form.deliveryTimeline ? `Timeline: ${form.deliveryTimeline}` : null,
    form.additionalNotes ? `Notes: ${form.additionalNotes}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join('\n')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export default function BulkOrder() {
  const [form, setForm] = useState<BulkOrderForm>(initialForm)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const uid = useId()

  const fieldId = (field: keyof BulkOrderForm) => `${uid}-${field}`
  const errorId = (field: keyof BulkOrderForm) => `${uid}-${field}-error`

  const set =
    (field: keyof BulkOrderForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }))
      // Clear the error as soon as the user starts fixing it.
      setErrors(prev => (prev[field] ? { ...prev, [field]: undefined } : prev))
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.getElementById(fieldId(Object.keys(found)[0] as keyof BulkOrderForm))?.focus()
      return
    }
    setSent(true)
    // Same-tab navigation — window.open in a submit handler gets blocked by
    // popup blockers on some mobile browsers.
    window.location.href = buildBulkWhatsAppUrl(form)
  }

  /** Shared props for an input/textarea so label, error and control stay wired. */
  const controlProps = (field: keyof BulkOrderForm) => ({
    id: fieldId(field),
    value: form[field] ?? '',
    onChange: set(field),
    'aria-invalid': errors[field] ? (true as const) : undefined,
    'aria-describedby': errors[field] ? errorId(field) : undefined,
  })

  const FieldError = ({ field }: { field: keyof BulkOrderForm }) =>
    errors[field] ? (
      <p id={errorId(field)} className="flex items-center gap-1.5 text-brand-red text-xs mt-1.5">
        <AlertCircle size={13} aria-hidden="true" />
        {errors[field]}
      </p>
    ) : null

  return (
    <section id="bulk" className="py-24 bg-brand-cream-dark">
      <div className="content-wrap">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-amber font-semibold text-sm uppercase tracking-widest mb-3 block">
              Wholesale &amp; Bulk
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
                  <CheckCircle
                    size={18}
                    aria-hidden="true"
                    className="text-brand-green flex-shrink-0 mt-0.5"
                  />
                  <span className="text-brand-dark text-sm">{perk}</span>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl p-6 border border-brand-green/20 bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center gap-3 mb-3">
                <Package2 className="text-brand-green" size={24} aria-hidden="true" />
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
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <h3 className="font-bold text-brand-dark text-xl mb-6">Submit Bulk Request</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={fieldId('businessName')} className="text-sm font-medium text-brand-dark mb-1.5 block">
                    Business name
                  </label>
                  <input className="input-field" placeholder="Optional" {...controlProps('businessName')} />
                </div>
                <div>
                  <label htmlFor={fieldId('contactName')} className="text-sm font-medium text-brand-dark mb-1.5 block">
                    Contact name <span aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input className="input-field" placeholder="Chioma Obi" {...controlProps('contactName')} />
                  <FieldError field="contactName" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={fieldId('email')} className="text-sm font-medium text-brand-dark mb-1.5 block">
                    Email <span aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className="input-field"
                    placeholder="you@email.com"
                    {...controlProps('email')}
                  />
                  <FieldError field="email" />
                </div>
                <div>
                  <label htmlFor={fieldId('phone')} className="text-sm font-medium text-brand-dark mb-1.5 block">
                    Phone / WhatsApp <span aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className="input-field"
                    placeholder="+234 xxx xxxx"
                    {...controlProps('phone')}
                  />
                  <FieldError field="phone" />
                </div>
              </div>

              <div>
                <label htmlFor={fieldId('country')} className="text-sm font-medium text-brand-dark mb-1.5 block">
                  Country <span aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  autoComplete="country-name"
                  className="input-field"
                  placeholder="Nigeria / UK / USA"
                  {...controlProps('country')}
                />
                <FieldError field="country" />
              </div>

              <div>
                <label htmlFor={fieldId('productRequests')} className="text-sm font-medium text-brand-dark mb-1.5 block">
                  Products needed <span aria-hidden="true">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  placeholder="e.g. 20kg palm oil, 10kg egusi, 5kg crayfish..."
                  {...controlProps('productRequests')}
                />
                <FieldError field="productRequests" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={fieldId('estimatedQuantity')} className="text-sm font-medium text-brand-dark mb-1.5 block">
                    Estimated quantity <span aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input className="input-field" placeholder="e.g. 50kg total" {...controlProps('estimatedQuantity')} />
                  <FieldError field="estimatedQuantity" />
                </div>
                <div>
                  <label htmlFor={fieldId('deliveryTimeline')} className="text-sm font-medium text-brand-dark mb-1.5 block">
                    Delivery timeline
                  </label>
                  <input className="input-field" placeholder="e.g. Within 2 weeks" {...controlProps('deliveryTimeline')} />
                </div>
              </div>

              <div>
                <label htmlFor={fieldId('additionalNotes')} className="text-sm font-medium text-brand-dark mb-1.5 block">
                  Additional notes
                </label>
                <textarea
                  rows={2}
                  className="input-field resize-none"
                  placeholder="Any special requirements..."
                  {...controlProps('additionalNotes')}
                />
              </div>

              <button type="submit" className="btn-green w-full text-base py-3.5">
                Request via WhatsApp
              </button>

              <p aria-live="polite" className="text-sm text-center min-h-5">
                {sent ? (
                  <span className="text-brand-green font-medium">
                    Opening WhatsApp with your request…
                  </span>
                ) : Object.keys(errors).length > 0 ? (
                  <span className="text-brand-red">
                    Please fix the highlighted fields.
                  </span>
                ) : (
                  <span className="text-brand-muted">
                    Your details are sent as a WhatsApp message — nothing is stored on this site.
                  </span>
                )}
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
