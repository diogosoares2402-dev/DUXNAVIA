module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        'dux-black': '#050505',
        'dux-yellow': '#FFD400',
        'dux-white': '#FFFFFF'
      },
      boxShadow: {
        'glow-yellow': '0 0 24px rgba(255,212,0,0.35), 0 4px 30px rgba(5,5,5,0.6)'
      }
    }
  },
  plugins: []
}
