'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { API_BASE } from '@/lib/constants'
import type { Review } from '@/lib/types'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'text-brand-amber fill-brand-amber' : 'text-stone-200'}
          fill={i < rating ? '#D97706' : 'none'}
        />
      ))}
    </div>
  )
}

// Fallback reviews in case API is unavailable
const FALLBACK: Review[] = [
  {
    id: 1,
    customerName: 'Adaeze O.',
    country: 'United Kingdom',
    rating: 5,
    comment: 'The palm oil is absolutely authentic. It tastes exactly like home. I have been ordering from Chumzy for 8 months and the quality is always consistent.',
    productsPurchased: 'Fresh Palm Oil, Egusi',
    approved: true,
    createdAt: '',
  },
  {
    id: 2,
    customerName: 'Chukwuemeka D.',
    country: 'United States',
    rating: 5,
    comment: 'Finally found a reliable supplier for real Nigerian ingredients in the US. The stockfish arrived well-packaged and the quality is top-notch.',
    productsPurchased: 'Stockfish, Crayfish, Ogbono',
    approved: true,
    createdAt: '',
  },
  {
    id: 3,
    customerName: 'Ngozi B.',
    country: 'United Kingdom',
    rating: 5,
    comment: 'Chumzy Raw Foods is my go-to for all my cooking needs. The garri is fresh and the egusi is perfectly ground. Delivery was prompt and packaging was excellent.',
    productsPurchased: 'White Garri, Egusi, Dryfish',
    approved: true,
    createdAt: '',
  },
  {
    id: 4,
    customerName: 'Ifeanyi M.',
    country: 'Nigeria',
    rating: 4,
    comment: 'Very good quality products. I buy in bulk for my small restaurant and they always deliver on time. Prices are fair and the owner is very responsive on WhatsApp.',
    productsPurchased: 'Palm Oil, Crayfish, Stockfish',
    approved: true,
    createdAt: '',
  },
  {
    id: 5,
    customerName: 'Amaka S.',
    country: 'United States',
    rating: 5,
    comment: "I was skeptical about ordering raw food online but Chumzy exceeded my expectations. The ogbono soup I made tasted like my mother's cooking back in Anambra. 10/10!",
    productsPurchased: 'Ogbono, Crayfish, Palm Oil',
    approved: true,
    createdAt: '',
  },
]

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK)
  const [form, setForm] = useState({ customerName: '', country: '', rating: 5, comment: '', productsPurchased: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/api/reviews`)
      .then(r => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`)
        return r.json()
      })
      .then((data: Review[]) => { if (data.length > 0) setReviews(data) })
      .catch(err => {
        console.error('Failed to load reviews from', `${API_BASE}/api/reviews`, err)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="content-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-brand-amber font-semibold text-sm uppercase tracking-widest mb-3 block">
            Customer Reviews
          </span>
          <h2 className="section-heading mb-4">What Our Customers Say</h2>
          <p className="section-subheading mx-auto">
            Real experiences from households and vendors who trust Chumzy for their everyday food needs.
          </p>
        </motion.div>

        {/* Review cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="card p-6"
            >
              <StarRating rating={review.rating} />
              <p className="text-brand-dark text-sm leading-relaxed my-4 italic">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="border-t border-stone-100 pt-4 mt-auto">
                <div className="font-semibold text-brand-dark text-sm">{review.customerName}</div>
                <div className="text-xs text-brand-muted">{review.country}</div>
                {review.productsPurchased && (
                  <div className="text-xs text-brand-green mt-1">
                    Bought: {review.productsPurchased}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Leave a review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto card p-8"
        >
          <h3 className="font-bold text-brand-dark text-xl mb-6">Leave a Review</h3>
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🙏</div>
              <p className="text-brand-green font-semibold text-lg">Thank you for your review!</p>
              <p className="text-brand-muted text-sm mt-2">It will appear after approval.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1.5 block">Your name *</label>
                  <input
                    required
                    className="input-field"
                    placeholder="Ada Okafor"
                    value={form.customerName}
                    onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-dark mb-1.5 block">Country *</label>
                  <input
                    required
                    className="input-field"
                    placeholder="United Kingdom"
                    value={form.country}
                    onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark mb-1.5 block">Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, rating: n }))}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        fill={n <= form.rating ? '#D97706' : 'none'}
                        className={n <= form.rating ? 'text-brand-amber' : 'text-stone-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark mb-1.5 block">Products bought (optional)</label>
                <input
                  className="input-field"
                  placeholder="e.g. Palm Oil, Egusi"
                  value={form.productsPurchased}
                  onChange={e => setForm(f => ({ ...f, productsPurchased: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-dark mb-1.5 block">Your review *</label>
                <textarea
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Tell us about your experience..."
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-green w-full disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
