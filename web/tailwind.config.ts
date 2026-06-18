import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#1A5C2A',
          'green-dark': '#0F3D1A',
          'green-light': '#2E7D44',
          amber: '#D97706',
          'amber-light': '#F59E0B',
          cream: '#FFFBF5',
          'cream-dark': '#FEF3E2',
          red: '#B91C1C',
          dark: '#1C1917',
          muted: '#78716C',
        },
      },
    },
  },
  plugins: [],
}

export default config
