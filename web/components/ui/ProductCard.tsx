'use client'
import { useState } from 'react'
import { ShoppingCart, Check, Package } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import type { Product } from '@/lib/types'
import { CURRENCIES } from '@/lib/constants'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addItem, currency } = useCart()
  const [added, setAdded] = useState(false)

  const currencyInfo = CURRENCIES.find(c => c.code === currency)!

  const price =
    currency === 'NGN'
      ? product.priceNgn
      : currency === 'GBP'
      ? product.priceGbp
      : product.priceUsd

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="card flex flex-col h-full transition-shadow duration-300 hover:shadow-md">
      {/* Image placeholder */}
      <div
        className="relative h-48 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fef3e2 100%)' }}
      >
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-brand-green/40">
            <Package size={48} />
            <span className="text-xs text-brand-muted">{product.category}</span>
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 badge bg-brand-amber text-white text-[10px]">
            Popular
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-3 right-3 badge bg-stone-200 text-stone-500 text-[10px]">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-xs text-brand-muted uppercase tracking-wider mb-1.5">{product.category}</span>
        <h3 className="font-bold text-brand-dark text-base mb-2 leading-snug">{product.name}</h3>
        <p className="text-brand-muted text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
          {product.description}
        </p>

        <div className="text-xs text-brand-muted mb-4">
          <span className="font-medium text-brand-dark">Pack sizes: </span>
          {product.packagingSize}
        </div>

        <div className="flex items-center justify-between">
          <div>
            {price ? (
              <span className="text-xl font-extrabold text-brand-green">
                {currencyInfo.symbol}{parseFloat(price).toLocaleString()}
              </span>
            ) : (
              <span className="text-sm text-brand-muted">Price on request</span>
            )}
            <span className="text-xs text-brand-muted ml-1">/ unit</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: added ? '#1A5C2A' : '#D97706',
              color: 'white',
            }}
          >
            {added ? <Check size={14} /> : <ShoppingCart size={14} />}
            {added ? 'Added' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
