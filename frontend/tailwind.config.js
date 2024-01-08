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
        button: '1px 1px 1px rgba(0, 0, 0, 0.15), -1px -1px 1px rgba(25, 40, 81, 0.15)',
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
        primary: '#173A5F',
        secondary: '#415A77',
        accent: {
          blue: '#778DA9',
        },
        gray: {
          300: '#D1D1D1',
          500: '#767676',
          600: '#494949',
          700: '#212121',
          800: '#1A1A1A',
        },
        neutral: {
          default: '#E0E1DD',
          150: '#F7F9FC',
          200: '#F8F8F8',
          300: '#EFF0F5',
          400: '#DCE0EB',
          800: '#959595',
          900: '#494949',
        },
        green: {
          100: '#ECF5F3',
          300: '#A8DBCD',
          500: '#00853D',
          600: '#229575',
          700: '#1D6E5E',
        },
        yellow: {
          100: '#FCEFD4',
          300: '#F6C669',
          500: '#F2AE29',
          600: '#C28B21',
          700: '#916819',
        },
        red: {
          100: '#F6E5E7',
          300: '#E0919A',
          500: '#CD3F50',
          600: '#AE1D32',
          700: '#8A182A',
        },
        blue: {
          100: '#ECF0FB',
          300: '#7A97E4',
          500: '#416BD8',
          600: '#2A4DA8',
          700: '#274082',
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
