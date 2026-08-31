'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ShoppingCart } from 'lucide-react'
import WhatsAppIcon from '@/components/ui/WhatsAppIcon'
import { NAV_LINKS, WHATSAPP_URL, BUSINESS_NAME } from '@/lib/constants'
import { useCart } from '@/lib/cart-context'
import logo from '@/public/assets/logo/navbar-wordmark.png'

const MOBILE_MENU_ID = 'mobile-nav'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { totalItems } = useCart()

  useEffect(() => {
    // rAF-throttled: the raw scroll event fires far more often than `scrolled`
    // can change.
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60)
        ticking = false
      })
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMenuOpen((open) => {
        if (open) toggleRef.current?.focus()
        return false
      })
    }
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
      className={`on-dark sticky top-0 z-50 bg-brand-gradient transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_2px_24px_rgba(15,61,26,0.3)]' : ''
      }`}
    >
      <nav ref={navRef} aria-label="Primary">
        <div className="content-wrap flex items-center justify-between h-[70px]">
          <a href="#home" className="flex items-center no-underline">
            {/* Sized off the asset's proportions, not the box: "CHUMZY" is only 23%
                of the PNG's height, so h-14 is what puts it at a ~13px cap height —
                level with the nav links beside it. `sizes` tracks the 134px render
                width; the source is 1200px and would otherwise ship an oversized
                variant. */}
            <Image
              src={logo}
              alt={BUSINESS_NAME}
              priority
              quality={100}
              sizes="140px"
              className="h-10 sm:h-14 w-auto"
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold tracking-wide text-white/80 hover:text-brand-amber-bright no-underline transition-colors duration-200 rounded-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-brand-amber-cta hover:bg-brand-amber-cta-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200 no-underline"
            >
              <WhatsAppIcon size={14} />
              Order on WhatsApp
              <span className="sr-only">(opens WhatsApp in a new tab)</span>
            </a>

            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors no-underline"
            >
              <ShoppingCart size={18} aria-hidden="true" />
              <span className="sr-only">
                View cart, {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-brand-amber-cta text-white text-[11px] font-bold flex items-center justify-center"
                >
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              ref={toggleRef}
              type="button"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls={MOBILE_MENU_ID}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile menu — `hidden` (not just max-height:0) so the links leave the
            tab order and the a11y tree when collapsed. */}
        <div
          id={MOBILE_MENU_ID}
          hidden={!menuOpen}
          className="lg:hidden border-t border-white/10"
        >
          <div className="content-wrap py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-white/80 hover:text-brand-amber-bright no-underline py-3 px-2 rounded transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 bg-brand-amber-cta hover:bg-brand-amber-cta-dark text-white font-semibold py-3 rounded-lg transition-colors duration-200 no-underline"
            >
              <WhatsAppIcon size={16} />
              Order on WhatsApp
              <span className="sr-only">(opens WhatsApp in a new tab)</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
