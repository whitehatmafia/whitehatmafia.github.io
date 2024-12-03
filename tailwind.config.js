/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './assets/**/*.{js,ts,jsx,tsx,css}',
    './content/**/*.md'
  ],
  theme: {
    extend: {
      animation: {
        'matrix': 'matrix 5s linear infinite',
      },
      keyframes: {
        matrix: {
          '0%': { transform: 'translateY(-50%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(50%)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
