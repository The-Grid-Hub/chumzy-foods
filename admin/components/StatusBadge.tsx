const STATUS_STYLES: Record<string, string> = {
  // order statuses
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
  // bulk-order statuses
  new: 'bg-amber-100 text-amber-800',
  contacted: 'bg-blue-100 text-blue-800',
  closed: 'bg-stone-200 text-stone-700',
  // generic
  approved: 'bg-green-100 text-green-800',
  unread: 'bg-amber-100 text-amber-800',
  read: 'bg-stone-200 text-stone-700',
}

export default function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? 'bg-stone-200 text-stone-700'
  return <span className={`badge capitalize ${style}`}>{status}</span>
}
