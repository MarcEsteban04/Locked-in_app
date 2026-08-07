/**
 * `nativewind/babel` re-exports `react-native-css/babel`, which rewrites
 * `import { View } from 'react-native'` to the css-aware equivalents so every
 * primitive accepts `className`. It pairs with `withNativewind` in metro.config.js.
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'nativewind/babel'],
  };
};
