import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    testTimeout: 10000, // 10 seconds timeout per test
    hookTimeout: 10000, // 10 seconds timeout for hooks
  },
  logLevel: 'warn',
  onConsoleLog: (log, type) => {
    // Suppress CJS deprecation warning
    if (log.includes('CJS build of Vite') || log.includes('deprecated')) {
      return false;
    }
    return true;
  },
});


