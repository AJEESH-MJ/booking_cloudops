module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f8ff',
          100: '#eaf1ff',
          500: '#0366d6'
        }
      }
    },
  },
  plugins: [],
}
