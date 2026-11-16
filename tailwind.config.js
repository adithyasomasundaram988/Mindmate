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
        navy: {
          950: '#070d18',
          900: '#0c1527', // Unified Mild Muted Navy for Patient & Caregiver dark mode
          850: '#111d35',
          800: '#162544',
          700: '#223558',
          600: '#334b77',
        },
        ivory: {
          50: '#fbfbfa',
          100: '#f5f5f0',
          200: '#e8e8df',
        },
        teal: {
          DEFAULT: '#0d9488',
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
