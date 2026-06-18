'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch, ApiError } from '@/lib/api'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import type { Product, ProductInput } from '@/lib/types'

interface ProductFormProps {
  // When editing, the existing product; omit for "create".
  product?: Product
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product

  const [form, setForm] = useState<ProductInput>({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    category: product?.category ?? PRODUCT_CATEGORIES[0],
    packagingSize: product?.packagingSize ?? '',
    priceNgn: product?.priceNgn ?? '',
    priceUsd: product?.priceUsd ?? '',
    priceGbp: product?.priceGbp ?? '',
    inStock: product?.inStock ?? true,
    imageUrl: product?.imageUrl ?? '',
    featured: product?.featured ?? false,
  })
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function onNameChange(value: string) {
    set('name', value)
    if (!slugTouched) set('slug', slugify(value))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.slug || !form.description || !form.category || !form.packagingSize) {
      setError('Name, slug, description, category and packaging size are required.')
      return
    }

    setSaving(true)
    const payload: ProductInput = {
      ...form,
      priceNgn: form.priceNgn || null,
      priceUsd: form.priceUsd || null,
      priceGbp: form.priceGbp || null,
      imageUrl: form.imageUrl || null,
    }

    try {
      if (isEdit) {
        await apiFetch(`/api/admin/products/${product.id}`, {
          method: 'PUT',
          body: payload,
        })
      } else {
        await apiFetch('/api/admin/products', { method: 'POST', body: payload })
      }
      router.push('/products')
      router.refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 max-w-3xl space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-brand-red text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Name *</label>
          <input
            className="input-field"
            value={form.name}
            onChange={e => onNameChange(e.target.value)}
            placeholder="Palm Oil"
          />
        </div>
        <div>
          <label className="label">Slug *</label>
          <input
            className="input-field"
            value={form.slug}
            onChange={e => {
              setSlugTouched(true)
              set('slug', e.target.value)
            }}
            placeholder="palm-oil"
          />
        </div>
      </div>

      <div>
        <label className="label">Description *</label>
        <textarea
          className="input-field min-h-[100px]"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Short product description…"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Category *</label>
          <select
            className="input-field"
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {PRODUCT_CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Packaging size *</label>
          <input
            className="input-field"
            value={form.packagingSize}
            onChange={e => set('packagingSize', e.target.value)}
            placeholder="1L, 500g, 1 carton…"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Price (₦ NGN)</label>
          <input
            className="input-field"
            inputMode="decimal"
            value={form.priceNgn ?? ''}
            onChange={e => set('priceNgn', e.target.value)}
            placeholder="5000.00"
          />
        </div>
        <div>
          <label className="label">Price ($ USD)</label>
          <input
            className="input-field"
            inputMode="decimal"
            value={form.priceUsd ?? ''}
            onChange={e => set('priceUsd', e.target.value)}
            placeholder="6.50"
          />
        </div>
        <div>
          <label className="label">Price (£ GBP)</label>
          <input
            className="input-field"
            inputMode="decimal"
            value={form.priceGbp ?? ''}
            onChange={e => set('priceGbp', e.target.value)}
            placeholder="5.10"
          />
        </div>
      </div>

      <div>
        <label className="label">Image URL</label>
        <input
          className="input-field"
          value={form.imageUrl ?? ''}
          onChange={e => set('imageUrl', e.target.value)}
          placeholder="https://…"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-brand-dark cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#1A5C2A]"
            checked={form.inStock}
            onChange={e => set('inStock', e.target.checked)}
          />
          In stock
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-brand-dark cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#1A5C2A]"
            checked={form.featured}
            onChange={e => set('featured', e.target.checked)}
          />
          Featured
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-green" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => router.push('/products')}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
