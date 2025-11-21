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
 * In-memory storage implementation (no persistence)
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

