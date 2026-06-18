import { Loader2, AlertCircle, Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-20 text-brand-muted">
      <Loader2 size={20} className="animate-spin" />
      {label}
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-20 text-brand-red">
      <AlertCircle size={28} />
      <p className="font-medium">{message}</p>
    </div>
  )
}

export function EmptyState({
  message,
  children,
}: {
  message: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-brand-muted">
      <Inbox size={32} />
      <p>{message}</p>
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">{title}</h1>
        {subtitle && <p className="text-brand-muted text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
