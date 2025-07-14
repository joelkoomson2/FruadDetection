/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'blue-accent': '#2563eb',
        'blue-accent-hover': '#1d4ed8',
        'card-bg': '#181c24',
        'main-bg': '#0a0a0a',
      },
    },
  },
  plugins: [],
}