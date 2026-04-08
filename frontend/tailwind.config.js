/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        medical: {
          blue: '#2563eb',
          teal: '#0d9488',
        }
      }
    },
  },
  plugins: [],
}
