import Image from 'next/image'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import {
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_ADDRESS,
  BUSINESS_NAME,
  PHONE_TEL_HREF,
  WHATSAPP_URL,
  NAV_LINKS,
} from '@/lib/constants'
import logo from '@/public/assets/logo/navbar-wordmark.png'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="on-dark bg-brand-gradient">
      <div className="content-wrap py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              {/* No 70px bar to fit here, so this goes large enough that the
                  tagline actually reads (~5.6px cap at h-20). */}
              <Image
                src={logo}
                alt={BUSINESS_NAME}
                quality={100}
                sizes="200px"
                className="h-16 sm:h-20 w-auto"
              />
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              Fresh, authentic Nigerian raw food ingredients delivered to households,
              vendors, and Nigerians in the diaspora. Quality you can trust, every time.
            </p>
          </div>

          {/* Quick Links — h2, since there is no h1/h2 ancestor in this landmark. */}
          <div>
            <h2 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Quick Links
            </h2>
            <ul className="space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-brand-amber text-sm no-underline transition-colors duration-200 rounded-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Contact Us
            </h2>
            <ul className="space-y-3">
              <li>
                <a
                  href={PHONE_TEL_HREF}
                  className="flex items-center gap-3 text-white/80 hover:text-brand-amber text-sm underline underline-offset-4 decoration-white/30 hover:decoration-brand-amber transition-colors"
                >
                  <Phone size={14} className="text-brand-amber flex-shrink-0" aria-hidden="true" />
                  {BUSINESS_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS_EMAIL}`}
                  className="flex items-center gap-3 text-white/80 hover:text-brand-amber text-sm underline underline-offset-4 decoration-white/30 hover:decoration-brand-amber transition-colors break-all"
                >
                  <Mail size={14} className="text-brand-amber flex-shrink-0" aria-hidden="true" />
                  {BUSINESS_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/80 text-sm">
                <MapPin size={14} className="text-brand-amber flex-shrink-0 mt-0.5" aria-hidden="true" />
                {BUSINESS_ADDRESS}
              </li>
            </ul>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 bg-brand-amber hover:bg-amber-600 text-white text-sm font-semibold px-5 min-h-11 rounded-lg transition-colors duration-200 no-underline"
            >
              <MessageCircle size={15} aria-hidden="true" />
              Chat on WhatsApp
              <span className="sr-only">(opens WhatsApp in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="content-wrap py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* white/70, not white/50 — the latter is ~2.5:1 on this gradient. */}
          <p className="text-white/70 text-xs">
            © {year} {BUSINESS_NAME}. All rights reserved.
          </p>
          <p className="text-white/70 text-xs">Gwagwalada, Abuja, Nigeria</p>
        </div>
      </div>
    </footer>
  )
}
