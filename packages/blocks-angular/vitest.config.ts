import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/__tests__/**/*.test.ts'],
  },
  resolve: {
    conditions: ['default', 'import', 'module', 'browser', 'style'],
  },
  optimizeDeps: {
    include: [
      '@angular/core',
      '@angular/common',
      '@angular/compiler',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      'zone.js',
    ],
  },
  esbuild: {
    target: 'es2020',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        useDefineForClassFields: false,
      } as any,
    },
  },
});


