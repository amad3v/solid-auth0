import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      name: 'solid-auth0',
      formats: ['es', 'umd'],
      fileName: 'main',
    },
    sourcemap: true,
  },
  plugins: [dts({ rollupTypes: true, tsconfigPath: './tsconfig.json' }), solidPlugin()],
});
