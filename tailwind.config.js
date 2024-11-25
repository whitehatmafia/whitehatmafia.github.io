const { convertCompilerOptionsFromJson } = require('typescript');

module.exports = {
  content: [
    './layouts/**/*.html',
    './content/**/*.md',
    './themes/**/layouts/**/*.html', 
    './assets/css/**/*.css',
    './assets/ts/**/*.ts'
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#1a1b1d',
          green: '#00ff00',
          text: '#00ff00',
          // Add more terminal-specific colors
          muted: '#666666',
          highlight: '#303030',
        }
      },
      fontFamily: {
        mono: ['Courier New', 'Consolas', 'Monaco', 'monospace'], // Extended fallbacks
      },
      spacing: {
        'terminal': '1rem',
      }
    },
  },
  darkMode: 'class', // Enable dark mode
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss/aspect-ratio'),
    require('tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),

  ],
  corePlugins: {
    preflight: false,
  }
}
