'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ui/ProductCard'
import { useCart } from '@/lib/cart-context'
import { API_BASE, PRODUCT_CATEGORIES, CURRENCIES } from '@/lib/constants'
import type { Product } from '@/lib/types'
import type { CurrencyCode } from '@/lib/constants'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState('All')
  const { currency, setCurrency } = useCart()

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/products`)
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data: Product[] = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('Failed to load products from', `${API_BASE}/api/products`, err)
      setError('We couldn’t load our products right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const filtered = category === 'All'
    ? products
    : products.filter(p => p.category === category)

  return (
    <section id="products" className="py-24 bg-brand-cream">
      <div className="content-wrap">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-brand-amber font-semibold text-sm uppercase tracking-widest mb-3 block">
            Our Products
          </span>
          <h2 className="section-heading mb-4">Fresh Nigerian Ingredients</h2>
          <p className="section-subheading mx-auto">
            Authentic raw food materials sourced fresh and delivered to your door.
            Available for retail and bulk orders.
          </p>
        </motion.div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {PRODUCT_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
                style={
                  category === cat
                    ? { background: '#1A5C2A', color: 'white' }
                    : { background: 'white', color: '#78716C', border: '1px solid #e7e5e4' }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Currency switcher */}
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value as CurrencyCode)}
            className="input-field w-auto text-sm py-2"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card h-80 animate-pulse">
                <div className="h-48 bg-stone-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-stone-100 rounded w-1/3" />
                  <div className="h-4 bg-stone-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-brand-muted mb-4">{error}</p>
            <button onClick={loadProducts} className="btn-green">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-brand-muted">
            No products found in this category.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
