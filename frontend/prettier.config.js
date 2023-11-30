/**@type {import('prettier').Config} */
const config = {
  plugins: [require('prettier-plugin-tailwindcss')],
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
};

module.exports = config;
