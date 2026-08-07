/** @type {import('prettier').Config} */
module.exports = {
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  trailingComma: 'all',
  bracketSameLine: true,
  plugins: ['prettier-plugin-tailwindcss'],
  // Tailwind 4 has no tailwind.config.js — the plugin reads the token set
  // directly from the stylesheet to know how to sort utility classes.
  tailwindStylesheet: './src/global.css',
  tailwindFunctions: ['cn'],
};
