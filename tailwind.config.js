/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.html',
    './assets/**/*.{js,ts,jsx,tsx,css}',
  ],
  theme: {
    extend: {
      // ...existing theme extensions...
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
  corePlugins: {
    preflight: false,
  }
}
