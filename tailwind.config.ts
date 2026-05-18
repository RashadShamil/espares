import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Refined emerald — softer, easier on the eye, still authoritative
          green:        '#2D6A4F',
          'green-dark': '#1F4D38',
          'green-light': '#3A8263',
          'green-muted': 'rgba(45,106,79,0.08)',
          'green-pale':  '#EAF4EF',
          // Warm amber-gold — replaces harsh mustard
          gold:         '#C8963E',
          'gold-light': '#E0AE5A',
          'gold-pale':  '#FDF6EA',
          // Neutral surfaces
          light: '#F7F8F6',
          ink:   '#111916',
          'ink-soft': '#1C2B22',
        }
      },
      fontFamily: {
        mono: ['var(--font-roboto-mono)', 'Roboto Mono', 'Courier New', 'monospace'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':        '0 1px 4px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover':  '0 8px 28px -4px rgba(45,106,79,0.14), 0 4px 8px -2px rgba(0,0,0,0.06)',
        'green-glow':  '0 0 28px rgba(45,106,79,0.2)',
        'gold-glow':   '0 0 24px rgba(200,150,62,0.22)',
        'nav':         '0 4px 24px rgba(0,0,0,0.07)',
        'form':        '0 2px 16px rgba(0,0,0,0.08)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
        'scan-line': {
          '0%':   { top: '0%' },
          '100%': { top: '100%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.65' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.45s ease-out',
        'fade-in':    'fade-in 0.35s ease-out',
        'shimmer':    'shimmer 2s infinite linear',
        'scan-line':  'scan-line 2s linear infinite',
        'float':      'float 4s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.5s ease-in-out infinite',
      },
      backgroundImage: {
        'grid-subtle': 'linear-gradient(rgba(45,106,79,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(45,106,79,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '32px 32px',
      },
    }
  },
  plugins: [],
};
export default config;