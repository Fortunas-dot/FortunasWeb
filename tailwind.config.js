/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        fortunas: {
          dark: '#0A0A0A',
          gray: '#6B7280',
          light: '#F9FAFB',
        }
      }
    },
  },
  plugins: [],
}
