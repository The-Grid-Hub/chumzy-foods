'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { apiFetch, ApiError } from '@/lib/api'
import type { Product } from '@/lib/types'
import ProductForm from '@/components/ProductForm'
import { Loading, ErrorState } from '@/components/PageState'

export default function EditProductPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // No admin GET-by-id endpoint; pull the list and pick the product.
    apiFetch<Product[]>('/api/admin/products')
      .then(list => {
        const found = list.find(p => p.id === id)
        if (!found) setError('Product not found')
        else setProduct(found)
      })
      .catch(err =>
        setError(err instanceof ApiError ? err.message : 'Failed to load product')
      )
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div>
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-brand-muted hover:text-brand-dark mb-4"
      >
        <ArrowLeft size={16} /> Back to products
      </Link>
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Edit product</h1>
      {loading ? (
        <Loading />
      ) : error || !product ? (
        <ErrorState message={error || 'Product not found'} />
      ) : (
        <ProductForm product={product} />
      )}
    </div>
  )
}
