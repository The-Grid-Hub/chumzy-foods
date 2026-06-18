'use client'

import { useEffect, useState } from 'react'
import { Trash2, MailOpen, Mail } from 'lucide-react'
import { apiFetch, ApiError } from '@/lib/api'
import type { ContactMessage } from '@/lib/types'
import { formatDateTime } from '@/lib/format'
import {
  Loading,
  ErrorState,
  EmptyState,
  PageHeader,
} from '@/components/PageState'
import ConfirmDialog from '@/components/ConfirmDialog'

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)
  const [target, setTarget] = useState<ContactMessage | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    apiFetch<ContactMessage[]>('/api/admin/contact')
      .then(setMessages)
      .catch(err =>
        setError(err instanceof ApiError ? err.message : 'Failed to load messages')
      )
      .finally(() => setLoading(false))
  }, [])

  async function setRead(msg: ContactMessage, read: boolean) {
    setBusyId(msg.id)
    setActionError('')
    try {
      const updated = await apiFetch<ContactMessage>(
        `/api/admin/contact/${msg.id}/read`,
        { method: 'PATCH', body: { read } }
      )
      setMessages(prev => prev.map(m => (m.id === msg.id ? updated : m)))
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
      await apiFetch(`/api/admin/contact/${target.id}`, { method: 'DELETE' })
      setMessages(prev => prev.filter(m => m.id !== target.id))
      setTarget(null)
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <div>
      <PageHeader
        title="Messages"
        subtitle={`${messages.length} message${messages.length === 1 ? '' : 's'} · ${unread} unread`}
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
      ) : messages.length === 0 ? (
        <EmptyState message="No messages yet." />
      ) : (
        <div className="space-y-3">
          {messages.map(m => (
            <div
              key={m.id}
              className={`card p-5 ${!m.read ? 'border-l-4 border-l-brand-amber' : ''}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-dark">{m.subject}</span>
                    {!m.read && (
                      <span className="badge bg-amber-100 text-amber-800">Unread</span>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {m.name} · {m.email}
                    {m.phone ? ` · ${m.phone}` : ''} · {formatDateTime(m.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn-ghost !py-1.5"
                    disabled={busyId === m.id}
                    onClick={() => setRead(m, !m.read)}
                  >
                    {m.read ? (
                      <>
                        <Mail size={16} /> Mark unread
                      </>
                    ) : (
                      <>
                        <MailOpen size={16} /> Mark read
                      </>
                    )}
                  </button>
                  <button
                    className="btn-danger !py-1.5"
                    onClick={() => setTarget(m)}
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-brand-dark mt-3 whitespace-pre-wrap">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!target}
        title="Delete message"
        message={`Delete the message from "${target?.name}"? This cannot be undone.`}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </div>
  )
}
