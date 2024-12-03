/** @type {import('tailwindcss').Config} */
const { convertCompilerOptionsFromJson } = require('typescript');

module.exports = {
  content: [
    './layouts/**/*.html',
    './assets/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'terminal-green': 'var(--terminal-green)',
        'terminal-bg': 'var(--terminal-bg)',
        'terminal-text': 'var(--terminal-text)',
        'terminal-header': 'var(--terminal-header)',
        terminal: {
          green: '#00ff00',
          text: '#00ff00',
          muted: '#666666',
          highlight: '#303030',
        }
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
    require('tailwind-scrollbar'),
  ],
  corePlugins: {
    preflight: false,
  }
}
