/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mont: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#0a0a0f',
        secondary: '#2a2a3c',
        accent: '#5b7cf7',
        textPrimary: '#ffffff',
        textSecondary: '#a0a0b0',
      },
    },
  },
  plugins: [],
}