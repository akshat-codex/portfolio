/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        ink: '#0b0b0c',
        paper: '#f2f1ec',
        grey: '#8a8a86',
        rule: 'rgba(242, 241, 236, 0.14)',
        signal: '#ff4d00',
      },
      fontFamily: {
        sans: ['"Archivo Variable"', 'Archivo', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        quart: 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      borderRadius: {
        DEFAULT: '0',
      },
    },
  },
  plugins: [],
}
