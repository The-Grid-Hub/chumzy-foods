import { Phone, Mail, MapPin } from 'lucide-react'
import { BUSINESS_EMAIL, BUSINESS_PHONE, BUSINESS_ADDRESS, WHATSAPP_URL, NAV_LINKS } from '@/lib/constants'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: 'linear-gradient(135deg, #0F3D1A 0%, #1A5C2A 100%)' }}>
      <div className="content-wrap py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <div className="text-white font-bold text-2xl tracking-wide">CHUMZY</div>
              <div className="text-brand-amber text-xs font-semibold tracking-[0.15em] uppercase">
                Raw Food Materials
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Fresh, authentic Nigerian raw food ingredients delivered to households,
              vendors, and Nigerians in the diaspora. Quality you can trust, every time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-brand-amber text-sm no-underline transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${BUSINESS_PHONE}`}
                  className="flex items-center gap-3 text-white/70 hover:text-brand-amber text-sm no-underline transition-colors"
                >
                  <Phone size={14} className="text-brand-amber flex-shrink-0" />
                  {BUSINESS_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BUSINESS_EMAIL}`}
                  className="flex items-center gap-3 text-white/70 hover:text-brand-amber text-sm no-underline transition-colors"
                >
                  <Mail size={14} className="text-brand-amber flex-shrink-0" />
                  {BUSINESS_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <MapPin size={14} className="text-brand-amber flex-shrink-0 mt-0.5" />
                {BUSINESS_ADDRESS}
              </li>
            </ul>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block bg-brand-amber hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="content-wrap py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/50 text-xs">
            © {year} Chumzy Raw Food Materials. All rights reserved.
          </p>
          <p className="text-white/50 text-xs">
            Gwagwalada, Abuja, Nigeria
          </p>
        </div>
      </div>
    </footer>
  )
}
