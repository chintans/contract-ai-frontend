/// <reference types="vitest" />

import angular from '@analogjs/vite-plugin-angular';

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      angular(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
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
  };
});
