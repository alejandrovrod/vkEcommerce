import type { CartState } from './types';

/**
 * Storage interface for cart persistence
 */
export interface CartStorage {
  save(state: CartState): void;
  load(): CartState | null;
  clear(): void;
}

/**
 * LocalStorage implementation for cart persistence
 */
export class LocalStorageCartStorage implements CartStorage {
  constructor(private key: string = 'vkecomblocks-cart') {}

  save(state: CartState): void {
    try {
      const serialized = JSON.stringify(state);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.key, serialized);
      }
    } catch (error) {
      throw new Error(`Failed to save cart to localStorage: ${error}`);
    }
  }

  load(): CartState | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(this.key);
        if (!item) return null;
        return JSON.parse(item) as CartState;
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to load cart from localStorage: ${error}`);
    }
  }

  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(this.key);
      }
    } catch (error) {
      throw new Error(`Failed to clear cart from localStorage: ${error}`);
    }
  }
}

/**
 * SessionStorage implementation for cart persistence
 * Data persists only for the browser session
 */
export class SessionStorageCartStorage implements CartStorage {
  constructor(private key: string = 'vkecomblocks-cart') {}

  save(state: CartState): void {
    try {
      const serialized = JSON.stringify(state);
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(this.key, serialized);
      }
    } catch (error) {
      throw new Error(`Failed to save cart to sessionStorage: ${error}`);
    }
  }

  load(): CartState | null {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const item = window.sessionStorage.getItem(this.key);
        if (!item) return null;
        return JSON.parse(item) as CartState;
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to load cart from sessionStorage: ${error}`);
    }
  }

  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(this.key);
      }
    } catch (error) {
      throw new Error(`Failed to clear cart from sessionStorage: ${error}`);
    }
  }
}

/**
 * In-memory storage implementation (no persistence)
 * Useful for SSR, testing, or when persistence is not needed
 */
export class MemoryCartStorage implements CartStorage {
  private state: CartState | null = null;

  save(state: CartState): void {
    this.state = state;
  }

  load(): CartState | null {
    return this.state;
  }

  clear(): void {
    this.state = null;
  }
}

/**
 * Async storage interface for API-based persistence
 * Useful for syncing cart with backend
 */
export interface AsyncCartStorage {
  save(state: CartState): Promise<void>;
  load(): Promise<CartState | null>;
  clear(): Promise<void>;
}

/**
 * Wrapper to convert async storage to sync storage
 * Note: This will block on async operations, use with caution
 */
export class AsyncStorageAdapter implements CartStorage {
  constructor(private asyncStorage: AsyncCartStorage) {}

  save(state: CartState): void {
    // Fire and forget - async operations should be handled by the user
    this.asyncStorage.save(state).catch((error) => {
      console.error('Failed to save cart asynchronously:', error);
    });
  }

  load(): CartState | null {
    // Cannot return async result synchronously
    // User should load initial state separately
    return null;
  }

  clear(): void {
    this.asyncStorage.clear().catch((error) => {
      console.error('Failed to clear cart asynchronously:', error);
    });
  }
}





