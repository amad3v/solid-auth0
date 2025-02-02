import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { resolve, dirname } from 'pathe';
import dts from 'vite-plugin-dts';
import solidPlugin from 'vite-plugin-solid';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SolidAuth0',
      fileName: 'solid-auth0',
    },
    sourcemap: 'hidden',
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['@auth0/auth0-spa-js', 'solid-js'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          '@auth0/auth0-spa-js': 'Auth0SPA',
          'solid-js': 'SolidJS',
        },
      },
    },
  },
  plugins: [solidPlugin(), dts({ rollupTypes: true, tsconfigPath: './tsconfig.json' })],
});
