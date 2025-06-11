/// <reference types="vitest" />

import angular from '@analogjs/vite-plugin-angular';
import viteTsConfigPaths from 'vite-tsconfig-paths';

import { defineConfig } from 'vite';
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    angular(),
    viteTsConfigPaths(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules'],
        provider: 'istanbul',
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  })
);
