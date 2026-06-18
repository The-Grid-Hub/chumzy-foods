'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch, ApiError } from '@/lib/api'
import type { Order } from '@/lib/types'
import { ORDER_STATUSES } from '@/lib/types'
import { formatDate, orderTotal } from '@/lib/format'
import StatusBadge from '@/components/StatusBadge'
import {
  Loading,
  ErrorState,
  EmptyState,
  PageHeader,
} from '@/components/PageState'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    const query = filter ? `?status=${filter}` : ''
    apiFetch<Order[]>(`/api/admin/orders${query}`)
      .then(setOrders)
      .catch(err =>
        setError(err instanceof ApiError ? err.message : 'Failed to load orders')
      )
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} order${orders.length === 1 ? '' : 's'}`}
        action={
          <select
            className="input-field !w-auto"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map(s => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
        }
      />

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} />
      ) : orders.length === 0 ? (
        <EmptyState message="No orders found." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left text-brand-muted">
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr
                    key={o.id}
                    onClick={() => router.push(`/orders/${o.id}`)}
                    className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60 cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-brand-dark">#{o.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-brand-dark">{o.customerName}</div>
                      <div className="text-xs text-brand-muted">{o.country}</div>
                    </td>
                    <td className="px-4 py-3 text-brand-dark">{orderTotal(o)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {formatDate(o.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
