import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ResourceLoader } from '@angular/compiler';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Suppress CJS deprecation warning from Vite
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const message = args[0] as string;
  if (typeof message === 'string' && (message.includes('CJS build of Vite') || message.includes('deprecated'))) {
    return;
  }
  originalWarn.apply(console, args);
};

/**
 * Custom ResourceLoader for Vitest that loads HTML templates from the filesystem
 */
class VitestResourceLoader extends ResourceLoader {
  get(url: string): Promise<string> {
    return new Promise((resolvePromise, reject) => {
      try {
        const cwd = process.cwd();
        const componentsDir = resolve(cwd, 'packages/blocks-angular/src/components');
        
        // Normalize the URL - remove leading ./ if present
        let templateName = url;
        if (templateName.startsWith('./')) {
          templateName = templateName.substring(2);
        }
        if (templateName.startsWith('/')) {
          templateName = templateName.substring(1);
        }
        
        // Primary path: resolve from components directory
        const primaryPath = resolve(componentsDir, templateName);
        
        console.log(`[VitestResourceLoader] Attempting to load: ${url}`);
        console.log(`[VitestResourceLoader] Resolved to: ${primaryPath}`);
        console.log(`[VitestResourceLoader] File exists: ${existsSync(primaryPath)}`);
        
        // Try primary path first
        if (existsSync(primaryPath)) {
          try {
            const content = readFileSync(primaryPath, 'utf-8');
            console.log(`[VitestResourceLoader] Successfully loaded template from: ${primaryPath}`);
            resolvePromise(content);
            return;
          } catch (readError) {
            console.error(`[VitestResourceLoader] Error reading ${primaryPath}:`, readError);
            // Continue to fallback
          }
        }
        
        // Fallback paths
        const fallbackPaths = [
          resolve(cwd, 'packages/blocks-angular/src/components', templateName),
          resolve(cwd, 'packages/blocks-angular/src', templateName),
        ];
        
        for (const filePath of fallbackPaths) {
          if (existsSync(filePath)) {
            try {
              const content = readFileSync(filePath, 'utf-8');
              console.log(`[VitestResourceLoader] Successfully loaded template from fallback: ${filePath}`);
              resolvePromise(content);
              return;
            } catch (readError) {
              // Continue to next path
            }
          }
        }

        // If we get here, template was not found
        const errorMsg = `Template not found: ${url}. Tried: ${primaryPath}`;
        console.error(`[VitestResourceLoader] ${errorMsg}`);
        reject(new Error(errorMsg));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`[VitestResourceLoader] Error loading template ${url}:`, errorMsg);
        reject(error instanceof Error ? error : new Error(errorMsg));
      }
    });
  }
}

// Initialize Angular testing environment
const testBed = getTestBed();
if (!testBed.platformRef) {
  testBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
}

// Configure custom ResourceLoader BEFORE any components are imported
// This ensures the ResourceLoader is available when Angular analyzes components
testBed.configureCompiler({
  providers: [
    { provide: ResourceLoader, useClass: VitestResourceLoader },
  ],
});

