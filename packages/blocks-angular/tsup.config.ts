import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['@angular/core', '@angular/common', '@angular/forms', 'rxjs', 'zone.js'],
  esbuildOptions(options) {
    options.legalComments = 'none';
    options.keepNames = true;
    // Prevent esbuild from inlining functions that might cause template parsing issues
    options.minifyIdentifiers = false;
  },
});

