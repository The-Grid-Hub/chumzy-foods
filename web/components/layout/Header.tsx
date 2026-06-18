'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Phone } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { NAV_LINKS, WHATSAPP_URL } from '@/lib/constants'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems } = useCart()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [])

  return (
    <header
      className="sticky top-0 z-50 transition-shadow duration-300"
      style={{
        background: 'linear-gradient(135deg, #0F3D1A 0%, #1A5C2A 100%)',
        boxShadow: scrolled ? '0 2px 24px rgba(15,61,26,0.3)' : 'none',
      }}
    >
      <nav ref={navRef} aria-label="Primary navigation">
        <div className="content-wrap flex items-center justify-between h-[70px]">
          {/* Logo */}
          <a href="#home" className="flex flex-col leading-none no-underline">
            <span className="text-white font-bold text-xl tracking-wide">CHUMZY</span>
            <span className="text-brand-amber text-[10px] font-semibold tracking-[0.15em] uppercase">
              Raw Food Materials
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold tracking-wide text-white/80 hover:text-brand-amber no-underline transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-brand-amber hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Phone size={14} />
              Order on WhatsApp
            </a>

            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
              aria-label={`Cart (${totalItems} items)`}
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 bg-brand-amber text-white text-[10px] font-bold rounded-full">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(v => !v)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className="lg:hidden overflow-hidden transition-all duration-300"
          style={{ maxHeight: menuOpen ? '400px' : '0', borderTop: menuOpen ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
        >
          <div className="content-wrap py-4 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-white/80 hover:text-brand-amber no-underline py-3 px-2 rounded transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 bg-brand-amber text-white font-semibold py-3 rounded-lg"
            >
              <Phone size={16} />
              Order on WhatsApp
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
