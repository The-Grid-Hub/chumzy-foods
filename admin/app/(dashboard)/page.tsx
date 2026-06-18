'use client'

import { useEffect, useState } from 'react'
import { Package, ShoppingBag, Star, Boxes, Mail } from 'lucide-react'
import { apiFetch, ApiError } from '@/lib/api'
import type { DashboardStats } from '@/lib/types'
import StatCard from '@/components/StatCard'
import StatusBadge from '@/components/StatusBadge'
import { Loading, ErrorState, PageHeader } from '@/components/PageState'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<DashboardStats>('/api/admin/stats')
      .then(setStats)
      .catch(err =>
        setError(err instanceof ApiError ? err.message : 'Failed to load stats')
      )
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />
  if (error || !stats) return <ErrorState message={error || 'No data'} />

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your store content and activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Products"
          value={stats.products}
          icon={Package}
          href="/products"
        />
        <StatCard
          label="Total orders"
          value={stats.orders.total}
          icon={ShoppingBag}
          href="/orders"
          accent="text-blue-600"
        />
        <StatCard
          label="Pending reviews"
          value={stats.pendingReviews}
          icon={Star}
          href="/reviews"
          accent="text-amber-500"
          hint="Awaiting moderation"
        />
        <StatCard
          label="New bulk requests"
          value={stats.newBulkRequests}
          icon={Boxes}
          href="/bulk-orders"
          accent="text-indigo-600"
        />
        <StatCard
          label="Unread messages"
          value={stats.unreadMessages}
          icon={Mail}
          href="/messages"
          accent="text-purple-600"
        />
      </div>

      <div className="card p-5 mt-6">
        <h2 className="font-semibold text-brand-dark mb-4">Orders by status</h2>
        {Object.keys(stats.orders.byStatus).length === 0 ? (
          <p className="text-sm text-brand-muted">No orders yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.orders.byStatus).map(([status, count]) => (
              <div
                key={status}
                className="flex items-center gap-2 rounded-lg border border-stone-100 px-3 py-2"
              >
                <StatusBadge status={status} />
                <span className="font-semibold text-brand-dark">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
