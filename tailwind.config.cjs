/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        'dux-black': '#050505',
        'dux-yellow': '#FFD400'
      }
    }
  },
  plugins: []
}
