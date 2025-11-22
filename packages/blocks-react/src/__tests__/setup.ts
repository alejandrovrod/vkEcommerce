import '@testing-library/jest-dom';

// Suppress CJS deprecation warning from Vite
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const message = args[0] as string;
  if (typeof message === 'string' && (message.includes('CJS build of Vite') || message.includes('deprecated'))) {
    return;
  }
  originalWarn.apply(console, args);
};

