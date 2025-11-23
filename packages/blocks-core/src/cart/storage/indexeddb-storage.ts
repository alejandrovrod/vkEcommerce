import type { CartState } from '../types';
import type { CartStorage } from '../storage';

/**
 * IndexedDB storage implementation for cart persistence
 * More robust than localStorage, supports larger data and better performance
 * 
 * Note: IndexedDB is async, so this implementation uses a cache for sync operations.
 * The cache is updated asynchronously in the background.
 * 
 * @example
 * ```typescript
 * const storage = new IndexedDBCartStorage('my-store', 'cart');
 * // Initialize async (call this before using)
 * await storage.initialize();
 * const manager = createCartManager({ storage });
 * ```
 */
export class IndexedDBCartStorage implements CartStorage {
  private dbName: string;
  private storeName: string;
  private db: IDBDatabase | null = null;
  private cache: CartState | null = null;
  private initPromise: Promise<void> | null = null;
  private initialized: boolean = false;

  constructor(dbName: string = 'vkecomblocks-db', storeName: string = 'cart') {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  /**
   * Initialize IndexedDB connection and load initial state
   * Call this before using the storage
   */
  async initialize(): Promise<void> {
    if (this.initialized && this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not available'));
        return;
      }

      const request = window.indexedDB.open(this.dbName, 1);

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error}`));
      };

      request.onsuccess = async () => {
        this.db = request.result;
        // Load initial state into cache
        try {
          this.cache = await this.loadAsync();
          this.initialized = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });

    return this.initPromise;
  }

  private async saveAsync(state: CartState): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }
    if (!this.db) throw new Error('IndexedDB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(state, 'cart-state');

      request.onerror = () => {
        reject(new Error(`Failed to save cart to IndexedDB: ${request.error}`));
      };

      request.onsuccess = () => {
        this.cache = state; // Update cache
        resolve();
      };
    });
  }

  private async loadAsync(): Promise<CartState | null> {
    if (!this.db) {
      await this.initialize();
    }
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get('cart-state');

      request.onerror = () => {
        reject(new Error(`Failed to load cart from IndexedDB: ${request.error}`));
      };

      request.onsuccess = () => {
        const result = (request.result as CartState) || null;
        this.cache = result;
        resolve(result);
      };
    });
  }

  private async clearAsync(): Promise<void> {
    if (!this.db) {
      await this.initialize();
    }
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete('cart-state');

      request.onerror = () => {
        reject(new Error(`Failed to clear cart from IndexedDB: ${request.error}`));
      };

      request.onsuccess = () => {
        this.cache = null;
        resolve();
      };
    });
  }

  // Sync methods for CartStorage interface (use cache for immediate response)
  save(state: CartState): void {
    this.cache = state; // Update cache immediately for sync access
    // Save asynchronously in background (fire and forget)
    this.saveAsync(state).catch((error) => {
      console.error('IndexedDB save error:', error);
    });
  }

  load(): CartState | null {
    // Return cached value (will be null until initialize() is called)
    // For proper async loading, call initialize() first
    return this.cache;
  }

  clear(): void {
    this.cache = null; // Clear cache immediately
    // Clear asynchronously in background (fire and forget)
    this.clearAsync().catch((error) => {
      console.error('IndexedDB clear error:', error);
    });
  }
}





