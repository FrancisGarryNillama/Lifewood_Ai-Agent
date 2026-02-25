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
        // Lifewood Brand Colors
        lifewood: {
          paper: '#f5eedb',
          white: '#ffffff',
          seaSalt: '#f9f7f7',
          darkSerpent: '#133020',
          castletonGreen: '#046241',
          saffaron: '#ffb347',
          earthYellow: '#ffc370',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}