'use client'

import { useEffect, useState } from 'react'
import { Star, Check, X, Trash2 } from 'lucide-react'
import { apiFetch, ApiError } from '@/lib/api'
import type { Review } from '@/lib/types'
import { formatDate } from '@/lib/format'
import StatusBadge from '@/components/StatusBadge'
import {
  Loading,
  ErrorState,
  EmptyState,
  PageHeader,
} from '@/components/PageState'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)
  const [target, setTarget] = useState<Review | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    apiFetch<Review[]>('/api/admin/reviews')
      .then(setReviews)
      .catch(err =>
        setError(err instanceof ApiError ? err.message : 'Failed to load reviews')
      )
      .finally(() => setLoading(false))
  }, [])

  async function setApproved(review: Review, approved: boolean) {
    setBusyId(review.id)
    setActionError('')
    try {
      const updated = await apiFetch<Review>(`/api/admin/reviews/${review.id}`, {
        method: 'PATCH',
        body: { approved },
      })
      setReviews(prev => prev.map(r => (r.id === review.id ? updated : r)))
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
      await apiFetch(`/api/admin/reviews/${target.id}`, { method: 'DELETE' })
      setReviews(prev => prev.filter(r => r.id !== target.id))
      setTarget(null)
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const pending = reviews.filter(r => !r.approved).length

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle={`${reviews.length} review${reviews.length === 1 ? '' : 's'} · ${pending} pending`}
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
      ) : reviews.length === 0 ? (
        <EmptyState message="No reviews yet." />
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-dark">
                      {r.customerName}
                    </span>
                    <span className="text-xs text-brand-muted">{r.country}</span>
                    <StatusBadge status={r.approved ? 'approved' : 'pending'} />
                  </div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < r.rating
                            ? 'text-brand-amber fill-brand-amber'
                            : 'text-stone-300'
                        }
                      />
                    ))}
                    <span className="text-xs text-brand-muted ml-2">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {r.approved ? (
                    <button
                      className="btn-ghost !py-1.5"
                      disabled={busyId === r.id}
                      onClick={() => setApproved(r, false)}
                    >
                      <X size={16} /> Unapprove
                    </button>
                  ) : (
                    <button
                      className="btn-green !py-1.5"
                      disabled={busyId === r.id}
                      onClick={() => setApproved(r, true)}
                    >
                      <Check size={16} /> Approve
                    </button>
                  )}
                  <button
                    className="btn-danger !py-1.5"
                    onClick={() => setTarget(r)}
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-brand-dark mt-3">{r.comment}</p>
              {r.productsPurchased && (
                <p className="text-xs text-brand-muted mt-2">
                  Purchased: {r.productsPurchased}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        title="Delete review"
        message={`Delete the review from "${target?.customerName}"? This cannot be undone.`}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  )
}
