'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ui/ProductCard'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import { PRODUCTS } from '@/lib/products'

export default function Products() {
  const [category, setCategory] = useState('All')

  const filtered = category === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === category)

  return (
    <section id="products" className="py-24 bg-brand-cream">
      <div className="content-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-brand-amber-cta font-semibold text-sm uppercase tracking-widest mb-3 block">
            Our Products
          </span>
          <h2 className="section-heading mb-4">Fresh Nigerian Ingredients</h2>
          <p className="section-subheading mx-auto">
            Authentic raw food materials sourced fresh and delivered to your door.
            Available for retail and bulk orders.
          </p>
        </motion.div>

        <div
          role="group"
          aria-label="Filter products by category"
          className="flex flex-wrap gap-2 mb-10"
        >
          {PRODUCT_CATEGORIES.map(cat => {
            const active = category === cat
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(cat)}
                className={`text-sm font-semibold px-4 min-h-11 rounded-full border transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2
                  ${
                    active
                      ? 'bg-brand-green text-white border-brand-green'
                      : 'bg-white text-brand-muted border-stone-200 hover:border-brand-green hover:text-brand-green'
                  }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Announces the filtered count, which is otherwise a silent re-render. */}
        <p aria-live="polite" className="sr-only">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          {category === 'All' ? '' : ` in ${category}`}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-muted mb-4">
              No products in {category} yet.
            </p>
            <button
              type="button"
              onClick={() => setCategory('All')}
              className="btn-outline text-sm"
            >
              View all products
            </button>
          </div>
        ) : (
          <motion.div
            // Re-keyed on category so a filter change replays one clean enter
            // animation instead of half the grid popping.
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                // Capped so the last card in a 13-item grid isn't left waiting.
                transition={{ delay: Math.min(i, 8) * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
