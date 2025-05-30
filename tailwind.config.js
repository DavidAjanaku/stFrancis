/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4B0082', // Indigo for church theme
        secondary: '#FFD700', // Gold for accents
      },
    },
  },
  plugins: [],
}