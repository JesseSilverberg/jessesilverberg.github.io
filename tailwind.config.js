const defaultConfig = require('tailwindcss/defaultConfig')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'media',
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        system: defaultTheme.fontFamily.sans,
      },
    },
  },
  variants: {},
  plugins: [],
}
