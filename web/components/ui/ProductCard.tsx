'use client'
import { useState } from 'react'
import { Package, Check, Plus } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useCart } from '@/lib/cart-context'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const [imageFailed, setImageFailed] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useCart()

  const handleAdd = () => {
    addItem(product)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1800)
  }

  return (
    <div className="card flex flex-col h-full transition-shadow duration-300 hover:shadow-md">
      <div
        className="relative h-48 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #fef3e2 100%)' }}
      >
        {product.imageUrl && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            // Decorative: the product name is already the adjacent <h3>.
            alt=""
            width={720}
            height={192}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-brand-green/40">
            <Package size={48} aria-hidden="true" />
            <span className="text-xs text-brand-muted">{product.category}</span>
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 badge bg-brand-amber-cta text-white text-[10px]">
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

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="mt-auto w-full min-h-11 inline-flex items-center justify-center gap-2
                     rounded-lg font-semibold text-sm transition-colors duration-200
                     bg-brand-green text-white hover:bg-brand-green-dark
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2
                     disabled:bg-stone-100 disabled:text-stone-500 disabled:cursor-not-allowed"
        >
          {justAdded ? (
            <>
              <Check size={16} aria-hidden="true" />
              Added
            </>
          ) : (
            <>
              <Plus size={16} aria-hidden="true" />
              {product.inStock ? 'Add to cart' : 'Out of stock'}
            </>
          )}
          <span className="sr-only">, {product.name}</span>
        </button>
        <span aria-live="polite" className="sr-only">
          {justAdded ? `${product.name} added to cart` : ''}
        </span>
      </div>
    </div>
  )
}
