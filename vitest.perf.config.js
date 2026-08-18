import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Tests de charge/perf front : déterministes, rendu jsdom sous volume de
// données (ex: liste de notifications), pas de vrai réseau. Séparé du run
// par défaut pour ne jamais ralentir `npm test`.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.js'],
    css: false,
    include: ['test/performance/**/*.perf-spec.jsx', 'test/performance/**/*.perf-spec.js'],
    testTimeout: 30000,
  },
});
