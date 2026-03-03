/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2D5A4A',
        secondary: '#F5F5F0',
        accent: '#00f5d4',
      }
    },
  },
  plugins: [],
}