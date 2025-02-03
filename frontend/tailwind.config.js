const {
  smallMobile,
  mobile,
  tablet,
  desktop,
  mediumDesktop,
  bigDesktop,
  hugeDesktop,
} = require('./src/constants/screensizes');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}', './src/lib/**/*{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: `${smallMobile}px`,
        sm: `${mobile}px`,
        md: `${tablet}px`,
        lg: `${desktop}px`,
        xl: `${mediumDesktop}px`,
        '2xl': `${bigDesktop}px`,
        '3xl': `${hugeDesktop}px`,
      },
      boxShadow: {
        100: '0px 2px 2px rgba(25, 40, 81, 0.05)',
        200: '0px 4px 4px rgba(25, 40, 81, 0.05)',
        300: '0px 8px 8px rgba(25, 40, 81, 0.05)',
        400: '0px 16px 16px rgba(25, 40, 81, 0.05)',
        500: '-1px 8px 24px 0px rgba(0, 0, 0, 0.15)',
        '500-reverse': '1px -8px 24px 0px rgba(0, 0, 0, 0.15)',
        dark: '0px 1px 6px rgba(0, 0, 0, 0.25)',
        button: '0px 1px 1px 0px rgba(0, 0, 0, 0.25)',
      },
      fontFamily: {
        body: 'var(--font-inter)',
      },
      fontSize: Object.fromEntries(Array.from({ length: 58 }, (_, i) => [i + 1, `${i + 1}px`])),
      lineHeight: {
        tight: '100%',
        normal: '125%',
        loose: '150%',
      },
      borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '8px',
      },
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: {
          blue: 'rgb(var(--color-accent-blue) / <alpha-value>)',
        },
        gray: {
          100: 'rgb(var(--color-gray-100) / <alpha-value>)',
          200: 'rgb(var(--color-gray-200) / <alpha-value>)',
          300: 'rgb(var(--color-gray-300) / <alpha-value>)',
          400: 'rgb(var(--color-gray-400) / <alpha-value>)',
          500: 'rgb(var(--color-gray-500) / <alpha-value>)',
          600: 'rgb(var(--color-gray-600) / <alpha-value>)',
          700: 'rgb(var(--color-gray-700) / <alpha-value>)',
          800: 'rgb(var(--color-gray-800) / <alpha-value>)',
        },
        neutral: {
          default: 'rgb(var(--color-neutral-default) / <alpha-value>)',
          150: 'rgb(var(--color-neutral-150) / <alpha-value>)',
          200: 'rgb(var(--color-neutral-200) / <alpha-value>)',
          300: 'rgb(var(--color-neutral-300) / <alpha-value>)',
          400: 'rgb(var(--color-neutral-400) / <alpha-value>)',
          500: 'rgb(var(--color-neutral-500) / <alpha-value>)',
          800: 'rgb(var(--color-neutral-800) / <alpha-value>)',
          900: 'rgb(var(--color-neutral-900) / <alpha-value>)',
        },
        green: {
          100: 'rgb(var(--color-green-100) / <alpha-value>)',
          300: 'rgb(var(--color-green-300) / <alpha-value>)',
          500: 'rgb(var(--color-green-500) / <alpha-value>)',
          600: 'rgb(var(--color-green-600) / <alpha-value>)',
          700: 'rgb(var(--color-green-700) / <alpha-value>)',
        },
        yellow: {
          100: 'rgb(var(--color-yellow-100) / <alpha-value>)',
          300: 'rgb(var(--color-yellow-300) / <alpha-value>)',
          500: 'rgb(var(--color-yellow-500) / <alpha-value>)',
          600: 'rgb(var(--color-yellow-600) / <alpha-value>)',
          700: 'rgb(var(--color-yellow-700) / <alpha-value>)',
        },
        red: {
          100: 'rgb(var(--color-red-100) / <alpha-value>)',
          300: 'rgb(var(--color-red-300) / <alpha-value>)',
          500: 'rgb(var(--color-red-500) / <alpha-value>)',
          600: 'rgb(var(--color-red-600) / <alpha-value>)',
          700: 'rgb(var(--color-red-700) / <alpha-value>)',
        },
        blue: {
          100: 'rgb(var(--color-blue-100) / <alpha-value>)',
          300: 'rgb(var(--color-blue-300) / <alpha-value>)',
          500: 'rgb(var(--color-blue-500) / <alpha-value>)',
          600: 'rgb(var(--color-blue-600) / <alpha-value>)',
          700: 'rgb(var(--color-blue-700) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
  ],
};
