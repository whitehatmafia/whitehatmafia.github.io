/** @type {import('tailwindcss').Config} */
const { convertCompilerOptionsFromJson } = require('typescript');

module.exports = {
  content: [
    './layouts/**/*.html',
    './assets/**/*.{js,ts,jsx,tsx,css}',
  ],
  theme: {
    extend: {
      colors: {
        // Remove custom colors and use Tailwind's built-in colors
      },
      boxShadow: {
        'terminal': '0 0 30px rgba(16, 185, 129, 0.2)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s infinite',
        'fade-in-down': 'fade-in-down 0.3s ease-out',
      },
    },
  },
  darkMode: 'class', // Enable dark mode
  plugins: [
    require('@tailwindcss/forms'),
  ],
  corePlugins: {
    preflight: false,
  }
}
