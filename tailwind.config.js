const defaultConfig = require('tailwindcss/defaultConfig')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_posts/*.md',
    './*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        system: defaultTheme.fontFamily.sans,
      },
      colors: {
        // Callout box colors
        tip: {
          border: '#10b981',
          bg: '#ecfdf5',
          'bg-dark': '#064e3b',
        },
        warning: {
          border: '#f59e0b',
          bg: '#fffbeb',
          'bg-dark': '#78350f',
        },
        note: {
          border: '#3b82f6',
          bg: '#eff6ff',
          'bg-dark': '#1e3a5f',
        },
        important: {
          border: '#8b5cf6',
          bg: '#f5f3ff',
          'bg-dark': '#4c1d95',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
