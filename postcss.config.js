module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.HUGO_ENVIRONMENT === 'production'
      ? { cssnano: { preset: 'default' } }
      : {})
  }
}
