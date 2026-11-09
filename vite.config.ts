/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// GitHub Pages project site: base must match the repository name, not the brand.
// Current default keeps '/school/' (folder / expected repo). Brand is "planB".
// Override with VITE_BASE=/your-repo-name/ if the published repo name differs.
const base = process.env.VITE_BASE ?? '/school/';
const buildId = getBuildId();

function getBuildId(): string {
  const fromEnvironment = process.env.PLANB_BUILD_ID ?? process.env.GITHUB_SHA;
  if (fromEnvironment) {
    const normalized = fromEnvironment.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 12);
    if (normalized) return normalized;
  }

  try {
    return execFileSync('git', ['rev-parse', '--short=12', 'HEAD'], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  }
}

function serviceWorkerPlugin(): Plugin {
  const templatePath = path.resolve(rootDir, 'src/pwa/service-worker.js');
  const template = readFileSync(templatePath, 'utf8');

  return {
    name: 'planb-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const precacheAssets = Object.values(bundle)
        .filter((output) => output.type === 'chunk'
          || (output.type === 'asset' && output.fileName.endsWith('.css')))
        .map((output) => `${base}${output.fileName}`);
      const source = template
        .replaceAll('__PLANB_BUILD_ID__', buildId)
        .replace('__PLANB_BASE_URL__', JSON.stringify(base))
        .replace('__PLANB_PRECACHED_ASSETS__', JSON.stringify(precacheAssets));

      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), serviceWorkerPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(buildId),
  },
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
