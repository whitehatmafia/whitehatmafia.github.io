/** @type {import('tailwindcss').Config} */
const { convertCompilerOptionsFromJson } = require('typescript');

module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.{html,md}',
    './themes/**/layouts/**/*.html', 
    './assets/css/**/*.css',
    './assets/ts/**/*.ts'
  ],
  theme: {
    extend: {
      colors: {
        'terminal-green': 'var(--terminal-green)',
        'terminal-bg': 'var(--terminal-bg)',
        terminal: {
          green: '#00ff00',
          text: '#00ff00',
          // Add more terminal-specific colors
          muted: '#666666',
          highlight: '#303030',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      }
    },
  },
  darkMode: 'class', // Enable dark mode
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')  // Fixed: using correct package path
  ],
  corePlugins: {
    preflight: false,
  }
}
