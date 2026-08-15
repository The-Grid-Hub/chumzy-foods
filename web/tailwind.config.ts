import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // `sans` is the default for all body copy; `serif` is opt-in for headings.
        sans: ['var(--font-raleway)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          green: '#1A5C2A',
          'green-dark': '#0F3D1A',
          'green-light': '#2E7D44',
          amber: '#D97706',
          'amber-light': '#F59E0B',
          /** CTA amber — 5.0:1 with white. `amber` itself is only 3.2:1 and
              cannot carry button text. */
          'amber-cta': '#B45309',
          /** Hover for `amber-cta` — 7.1:1 with white. */
          'amber-cta-dark': '#92400E',
          /** Amber for text on the dark green surfaces — 4.8:1 against the
              light end of the header/hero gradient. `amber` is 2.5:1 there. */
          'amber-bright': '#FBBF24',
          cream: '#FFFBF5',
          'cream-dark': '#FEF3E2',
          red: '#B91C1C',
          dark: '#1C1917',
          muted: '#78716C',
          /** Bright WhatsApp green — accents and icons only; ~2:1 with white. */
          whatsapp: '#25D366',
          /** Dark WhatsApp teal — 7.7:1 with white, safe for text surfaces. */
          'whatsapp-dark': '#075E54',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0F3D1A 0%, #1A5C2A 100%)',
        'brand-gradient-hero':
          'linear-gradient(135deg, #0F3D1A 0%, #1A5C2A 60%, #2E7D44 100%)',
      },
    },
  },
  plugins: [],
}

export default config
