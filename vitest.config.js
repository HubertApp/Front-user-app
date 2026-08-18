import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Config Vitest séparée de vite.config.js (pas besoin du plugin Tailwind ni
// des options de dev-server pour exécuter des tests en jsdom). Le dossier
// test/performance est exclu par défaut : il a son propre run via
// `npm run test:perf` (voir vitest.perf.config.js), pour ne jamais le mêler
// à la CI unitaire/intégration (même logique que jest-perf.json côté MS-*).
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.js'],
    css: false,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'test/performance/**',
    ],
  },
});
