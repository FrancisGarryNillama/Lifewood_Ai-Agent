/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ── Lifewood Full Brand Palette ───────────────────────────────
        lifewood: {
          // Background & Neutrals
          paper:          '#F5EEDB',  // warm parchment
          white:          '#FFFFFF',
          seaSalt:        '#F9F7F7',
          // Gold / Amber scale
          goldenBrown:    '#C17110',  // deep gold
          harvest:        '#E89131',  // harvest orange
          saffaron:       '#FFB347',  // saffron
          earthYellow:    '#FFC370',  // earth yellow
          champagne:      '#F4D0A4',  // champagne
          // Forest Green scale
          darkSerpent:    '#133020',  // darkest forest
          castletonGreen: '#034E34',  // castleton green
          fernGreen:      '#417256',  // fern green
          camouflage:     '#708E7C',  // camoufage green
          iceGreen:       '#9CAFA4',  // ice green
          // Gray scale
          charcoal:       '#666666',
          asphalt:        '#999999',
          silver:         '#CCCCCC',
          platinum:       '#E6E6E6',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        'lifewood-sm':  '0 1px 3px 0 rgba(19,48,32,0.08), 0 1px 2px -1px rgba(19,48,32,0.04)',
        'lifewood':     '0 4px 16px 0 rgba(19,48,32,0.10), 0 2px 6px -2px rgba(19,48,32,0.06)',
        'lifewood-lg':  '0 20px 40px -8px rgba(19,48,32,0.18), 0 8px 16px -4px rgba(19,48,32,0.08)',
        'gold':         '0 4px 16px 0 rgba(193,113,16,0.25)',
        'green':        '0 4px 16px 0 rgba(3,78,52,0.30)',
      },
      animation: {
        'fade-up':      'fadeUp 0.5s ease-out both',
        'fade-in':      'fadeIn 0.4s ease-out both',
        'slide-left':   'slideLeft 0.5s cubic-bezier(0.32,0.72,0,1) both',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideLeft: { from: { opacity: 0, transform: 'translateX(32px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}