/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hemo: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48', // Primary Blood Red
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          dark: '#1e2229',
          card: '#ffffff',
          bg: '#f8fafc',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#115e3b',
          900: '#0e3825', // Primary Dark Emerald
          950: '#062416', // Darkest Pine Green
        },
      },
    },
  },
  plugins: [],
}
