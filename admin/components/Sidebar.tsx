'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  Boxes,
  Mail,
  LogOut,
  Leaf,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/bulk-orders', label: 'Bulk Orders', icon: Boxes },
  { href: '/messages', label: 'Messages', icon: Mail },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <aside className="w-64 shrink-0 bg-brand-green-dark text-white flex flex-col min-h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-white/10">
        <Leaf size={22} className="text-brand-amber-light" />
        <div className="leading-tight">
          <p className="font-bold">Chumzy Admin</p>
          <p className="text-[11px] text-white/60">Raw Foods</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(href)
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  )
}
