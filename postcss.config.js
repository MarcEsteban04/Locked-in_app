/**
 * Tailwind 4 runs as a PostCSS plugin, and this file is what actually makes it
 * run. NativeWind's metro transformer hands `.css` to Expo's own CSS pipeline
 * (for native it compiles the *result* of that pipeline), so without a PostCSS
 * config the `@import 'tailwindcss'` and `@theme` blocks in src/global.css pass
 * straight through unprocessed and no utility classes are ever generated.
 */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
