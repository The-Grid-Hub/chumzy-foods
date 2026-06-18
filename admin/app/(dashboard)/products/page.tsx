'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { apiFetch, ApiError } from '@/lib/api'
import type { Product } from '@/lib/types'
import { productPrices } from '@/lib/format'
import {
  Loading,
  ErrorState,
  EmptyState,
  PageHeader,
} from '@/components/PageState'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [target, setTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  function load() {
    setLoading(true)
    apiFetch<Product[]>('/api/admin/products')
      .then(setProducts)
      .catch(err =>
        setError(err instanceof ApiError ? err.message : 'Failed to load products')
      )
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function confirmDelete() {
    if (!target) return
    setDeleting(true)
    setActionError('')
    try {
      await apiFetch(`/api/admin/products/${target.id}`, { method: 'DELETE' })
      setProducts(prev => prev.filter(p => p.id !== target.id))
      setTarget(null)
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products.length} product${products.length === 1 ? '' : 's'}`}
        action={
          <Link href="/products/new" className="btn-green">
            <Plus size={18} /> New product
          </Link>
        }
      />

      {actionError && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-brand-red text-sm px-4 py-3 mb-4">
          {actionError}
        </div>
      )}

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} />
      ) : products.length === 0 ? (
        <EmptyState message="No products yet.">
          <Link href="/products/new" className="btn-green">
            <Plus size={18} /> Add your first product
          </Link>
        </EmptyState>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left text-brand-muted">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Prices</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr
                    key={p.id}
                    className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 font-medium text-brand-dark">
                        {p.name}
                        {p.featured && (
                          <Star
                            size={14}
                            className="text-brand-amber fill-brand-amber"
                          />
                        )}
                      </div>
                      <div className="text-xs text-brand-muted">{p.packagingSize}</div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">{p.category}</td>
                    <td className="px-4 py-3 text-brand-dark">{productPrices(p)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          p.inStock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {p.inStock ? 'In stock' : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn-ghost !px-2 !py-1.5"
                          onClick={() => router.push(`/products/${p.id}/edit`)}
                          aria-label="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn-danger !px-2 !py-1.5"
                          onClick={() => setTarget(p)}
                          aria-label="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        title="Delete product"
        message={`Delete "${target?.name}"? This cannot be undone.`}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  )
}
