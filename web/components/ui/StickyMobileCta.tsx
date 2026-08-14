'use client'
import { MessageCircle, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { WHATSAPP_URL } from '@/lib/constants'
import { useCart } from '@/lib/cart-context'

/**
 * Thumb-reach CTA bar for small screens, where the header CTA has scrolled away.
 * Hidden from `lg` up, where the sticky header keeps its own CTA visible.
 */
export default function StickyMobileCta() {
  const { totalItems } = useCart()

  return (
    <div
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-black/10
                 bg-white/95 backdrop-blur-sm px-4 py-3 flex gap-3
                 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp flex-1 min-h-11 text-sm"
      >
        <MessageCircle size={18} aria-hidden="true" />
        Order on WhatsApp
        <span className="sr-only">(opens WhatsApp in a new tab)</span>
      </a>
      <Link
        href="/cart"
        className="relative inline-flex items-center justify-center min-h-11 min-w-11
                   rounded-xl border-2 border-brand-green text-brand-green
                   transition-colors duration-200 hover:bg-brand-green hover:text-white"
      >
        <ShoppingCart size={20} aria-hidden="true" />
        <span className="sr-only">
          View cart, {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
        {totalItems > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full
                       bg-brand-amber text-white text-[11px] font-bold
                       flex items-center justify-center"
          >
            {totalItems}
          </span>
        )}
      </Link>
    </div>
  )
}
