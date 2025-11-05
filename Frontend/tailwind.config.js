/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores institucionales
        primary: {
          DEFAULT: '#479E8C',
          light: '#3EBDAC',
          dark: '#0D1C1A',
        },
        secondary: {
          DEFAULT: '#F7FCFA',
          light: '#E5F5F2',
          medium: '#CFE8E3',
        },
        text: {
          primary: '#0D1C1A',
          secondary: '#479E8C',
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#F7FCFA',
          light: '#E5F5F2',
          gray: '#E5E8EB',
        }
      }
    },
  },
  plugins: [],
}

