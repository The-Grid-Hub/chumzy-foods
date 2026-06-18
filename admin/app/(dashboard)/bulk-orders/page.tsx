'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { apiFetch, ApiError } from '@/lib/api'
import type { BulkOrderRequest } from '@/lib/types'
import { BULK_STATUSES } from '@/lib/types'
import { formatDate } from '@/lib/format'
import StatusBadge from '@/components/StatusBadge'
import {
  Loading,
  ErrorState,
  EmptyState,
  PageHeader,
} from '@/components/PageState'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function BulkOrdersPage() {
  const [requests, setRequests] = useState<BulkOrderRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)
  const [target, setTarget] = useState<BulkOrderRequest | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    apiFetch<BulkOrderRequest[]>('/api/admin/bulk-orders')
      .then(setRequests)
      .catch(err =>
        setError(err instanceof ApiError ? err.message : 'Failed to load requests')
      )
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(req: BulkOrderRequest, status: string) {
    setBusyId(req.id)
    setActionError('')
    try {
      const updated = await apiFetch<BulkOrderRequest>(
        `/api/admin/bulk-orders/${req.id}/status`,
        { method: 'PATCH', body: { status } }
      )
      setRequests(prev => prev.map(r => (r.id === req.id ? updated : r)))
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Update failed')
    } finally {
      setBusyId(null)
    }
  }

  async function confirmDelete() {
    if (!target) return
    setDeleting(true)
    setActionError('')
    try {
      await apiFetch(`/api/admin/bulk-orders/${target.id}`, { method: 'DELETE' })
      setRequests(prev => prev.filter(r => r.id !== target.id))
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
        title="Bulk Orders"
        subtitle={`${requests.length} request${requests.length === 1 ? '' : 's'}`}
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
      ) : requests.length === 0 ? (
        <EmptyState message="No bulk-order requests yet." />
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-dark">
                      {r.businessName || r.contactName}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {r.contactName} · {r.email} · {r.phone} · {r.country}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="input-field !w-auto !py-2"
                    value={BULK_STATUSES.includes(r.status as never) ? r.status : ''}
                    disabled={busyId === r.id}
                    onChange={e => updateStatus(r, e.target.value)}
                  >
                    {!BULK_STATUSES.includes(r.status as never) && (
                      <option value="">{r.status}</option>
                    )}
                    {BULK_STATUSES.map(s => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn-danger !py-2"
                    onClick={() => setTarget(r)}
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm mt-4">
                <Field label="Products" value={r.productRequests} />
                <Field label="Est. quantity" value={r.estimatedQuantity} />
                <Field label="Timeline" value={r.deliveryTimeline ?? '—'} />
                <Field label="Notes" value={r.additionalNotes ?? '—'} />
              </dl>
              <p className="text-xs text-brand-muted mt-3">
                Submitted {formatDate(r.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        title="Delete request"
        message={`Delete the bulk-order request from "${target?.contactName}"?`}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-brand-muted w-28 shrink-0">{label}</dt>
      <dd className="text-brand-dark break-words">{value}</dd>
    </div>
  )
}
