'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { REVIEWS, AVERAGE_RATING, REVIEW_COUNT } from '@/lib/reviews'

/**
 * Lucide SVGs are aria-hidden, so without role/aria-label the rating is silent
 * to screen readers and conveyed by colour alone.
 */
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className="flex gap-0.5"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          aria-hidden="true"
          className={
            i < rating
              ? 'text-brand-amber fill-brand-amber'
              : 'text-stone-300 fill-stone-100'
          }
        />
      ))}
    </div>
  )
}

export default function Reviews() {
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

          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-brand-cream-dark px-5 py-2.5">
            <StarRating rating={Math.round(AVERAGE_RATING)} size={16} />
            <span className="text-sm font-semibold text-brand-dark">
              {AVERAGE_RATING.toFixed(1)} out of 5
            </span>
            <span className="text-sm text-brand-muted">
              from {REVIEW_COUNT} reviews
            </span>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i, 5) * 0.07 }}
              // flex-col is what makes the mt-auto footer below actually work.
              className="card p-6 flex flex-col"
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
      </div>
    </section>
  )
}
