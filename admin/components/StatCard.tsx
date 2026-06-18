import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  href?: string
  accent?: string // tailwind text color class for the icon
  hint?: string
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  href,
  accent = 'text-brand-green',
  hint,
}: StatCardProps) {
  const inner = (
    <div className="card p-5 h-full transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-brand-muted">{label}</p>
          <p className="text-3xl font-bold text-brand-dark mt-1">{value}</p>
          {hint && <p className="text-xs text-brand-muted mt-1">{hint}</p>}
        </div>
        <span className={`p-2 rounded-lg bg-stone-50 ${accent}`}>
          <Icon size={22} />
        </span>
      </div>
    </div>
  )

  return href ? <Link href={href}>{inner}</Link> : inner
}
