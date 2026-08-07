const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

/**
 * NativeWind v5 has no `input` option — `src/global.css` is picked up because it
 * is imported from the root layout, and `.css` is registered as a source ext here.
 */
module.exports = withNativewind(getDefaultConfig(__dirname));
