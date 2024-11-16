module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'cssnano': {
      preset: 'default',
    },
    '@fullhuman/postcss-purgecss': {
      content: [
        './layouts/**/*.html',
        './content/**/*.md',
        './themes/**/layouts/**/*.html'
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    },
    'postcss-import': {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'nesting-rules': true
      }
    }
  }
}
