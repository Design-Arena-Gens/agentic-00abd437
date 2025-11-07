/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5b6cff',
          50: '#eef0ff',
          100: '#e0e4ff',
          200: '#c4caff',
          300: '#a2aaff',
          400: '#7d87ff',
          500: '#5b6cff',
          600: '#3a4bf0',
          700: '#2a38c1',
          800: '#222e99',
          900: '#1f2a7a'
        }
      }
    },
  },
  plugins: [],
}
