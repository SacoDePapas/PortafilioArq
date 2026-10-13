import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const invariantShim = fileURLToPath(new URL('./src/shims/invariant.js', import.meta.url));
const warningShim = fileURLToPath(new URL('./src/shims/warning.js', import.meta.url));
const cssUtilsShim = fileURLToPath(new URL('./src/shims/css-in-js-utils.js', import.meta.url));
const cssUtilsDirectory = fileURLToPath(new URL('./node_modules/css-in-js-utils/es/', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^fbjs\/lib\/invariant$/, replacement: invariantShim },
      { find: /^fbjs\/lib\/warning$/, replacement: warningShim },
      { find: /^css-in-js-utils$/, replacement: cssUtilsShim },
      { find: /^css-in-js-utils\/lib\/hyphenateProperty$/, replacement: `${cssUtilsDirectory}hyphenateProperty.js` },
      { find: /^css-in-js-utils\/lib\/isPrefixedValue$/, replacement: `${cssUtilsDirectory}isPrefixedValue.js` },
      { find: 'react-native', replacement: 'react-native-web' },
    ],
  },
  server: { proxy: { '/api': 'http://localhost:3001' } },
});
