'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { apiFetch, ApiError } from '@/lib/api'
import type { OrderWithItems, OrderStatus } from '@/lib/types'
import { ORDER_STATUSES } from '@/lib/types'
import { formatDateTime } from '@/lib/format'
import StatusBadge from '@/components/StatusBadge'
import { Loading, ErrorState } from '@/components/PageState'

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const [order, setOrder] = useState<OrderWithItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    apiFetch<OrderWithItems>(`/api/admin/orders/${id}`)
      .then(setOrder)
      .catch(err =>
        setError(err instanceof ApiError ? err.message : 'Failed to load order')
      )
      .finally(() => setLoading(false))
  }, [id])

  async function updateStatus(status: OrderStatus) {
    if (!order) return
    setSaving(true)
    setActionError('')
    try {
      const updated = await apiFetch<OrderWithItems>(
        `/api/admin/orders/${id}/status`,
        { method: 'PATCH', body: { status } }
      )
      setOrder(prev => (prev ? { ...prev, status: updated.status } : prev))
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (error || !order) return <ErrorState message={error || 'Order not found'} />

  return (
    <div className="max-w-4xl">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1 text-sm text-brand-muted hover:text-brand-dark mb-4"
      >
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Order #{order.id}</h1>
          <p className="text-sm text-brand-muted mt-1">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <select
            className="input-field !w-auto"
            value={order.status}
            disabled={saving}
            onChange={e => updateStatus(e.target.value as OrderStatus)}
          >
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionError && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-brand-red text-sm px-4 py-3 mb-4">
          {actionError}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <h2 className="font-semibold text-brand-dark mb-3">Customer</h2>
          <dl className="space-y-1.5 text-sm">
            <Row label="Name" value={order.customerName} />
            <Row label="Email" value={order.customerEmail} />
            <Row label="Phone" value={order.customerPhone} />
            <Row label="Country" value={order.country} />
            <Row label="Address" value={order.address} />
          </dl>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-brand-dark mb-3">Payment</h2>
          <dl className="space-y-1.5 text-sm">
            <Row label="Method" value={order.paymentMethod} />
            <Row label="Total (₦)" value={order.totalNgn ?? '—'} />
            <Row label="Total ($)" value={order.totalUsd ?? '—'} />
            <Row label="Total (£)" value={order.totalGbp ?? '—'} />
            <Row label="Notes" value={order.notes ?? '—'} />
          </dl>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-stone-100">
          <h2 className="font-semibold text-brand-dark">Items</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-brand-muted border-b border-stone-100">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Qty</th>
              <th className="px-5 py-3 font-medium">Unit price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id} className="border-b border-stone-50 last:border-0">
                <td className="px-5 py-3 text-brand-dark">{item.productName}</td>
                <td className="px-5 py-3">{item.quantity}</td>
                <td className="px-5 py-3">
                  {item.currency} {item.unitPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-brand-muted w-24 shrink-0">{label}</dt>
      <dd className="text-brand-dark break-words">{value}</dd>
    </div>
  )
}
