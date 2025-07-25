/** @type {import('tailwindcss').Config} */
export default {
 content: [
  "./index.html",
  "./src/components/**/*.{js,ts,jsx,tsx}",
  "./src/pages/**/*.{js,ts,jsx,tsx}",
  "./src/*.{js,ts,jsx,tsx}",
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