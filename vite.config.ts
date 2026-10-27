/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// GitHub Pages project site: base must match the repository name, not the brand.
// Current default keeps '/school/' (folder / expected repo). Brand is "planB".
// Override with VITE_BASE=/your-repo-name/ if the published repo name differs.
const base = process.env.VITE_BASE ?? '/school/';

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, '/');
          if (normalizedId.includes('/node_modules/xlsx/')) return 'xlsx';
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
  },
});
