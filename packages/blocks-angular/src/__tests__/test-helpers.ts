import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Helper to load component template for testing
 */
export function loadComponentTemplate(componentName: string): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const templatePath = resolve(__dirname, `../components/${componentName}.component.html`);
  return readFileSync(templatePath, 'utf-8');
}
