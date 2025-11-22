import { CartStore } from './cart-store';
import { LocalStorageCartStorage, type CartStorage } from './storage';
import type {
  CartItem,
  CartState,
  CartManagerOptions,
  Product,
  StateChangeCallback,
} from './types';

/**
 * CartManager - Public API for cart operations
 */
export class CartManager {
  private store: CartStore;
  private options: Required<Omit<CartManagerOptions, 'storage' | 'storageKey'>> & {
    storage?: CartStorage;
    storageKey: string;
  };

  constructor(options: CartManagerOptions = {}) {
    // Determine storage strategy (priority order):
    // 1. Use custom storage if provided (most flexible)
    // 2. Use localStorage if persist is true and no custom storage
    // 3. Use memory storage (no persistence) otherwise (default)
    let storage: CartStorage | undefined;
    
    if (options.storage) {
      // Custom storage provided - use it (allows IndexedDB, API, custom implementations, etc.)
      storage = options.storage;
    } else if (options.persist) {
      // Use localStorage as default persistence (only if explicitly requested)
      storage = new LocalStorageCartStorage(options.storageKey);
    }
    // If neither storage nor persist is provided, storage will be undefined
    // and CartStore will use MemoryCartStorage by default (no persistence)

    this.store = CartStore.getInstance(storage);
    this.options = {
      storage,
      storageKey: options.storageKey || 'vkecomblocks-cart',
      persist: options.persist ?? false, // Default: no persistence (safer for SSR)
      onStateChange: options.onStateChange || (() => {}),
      onError: options.onError || ((error) => console.error(error)),
    };

    // Subscribe to state changes
    this.store.subscribe((state) => {
      this.options.onStateChange(state);
    });
  }

  /**
   * Get current cart state
   */
  getState(): CartState {
    return this.store.getState();
  }

  /**
   * Subscribe to cart state changes
   */
  subscribe(callback: StateChangeCallback): () => void {
    return this.store.subscribe(callback);
  }

  /**
   * Add product to cart
   */
  addItem(product: Product, quantity: number = 1): void {
    try {
      this.store.addItem(product, quantity);
    } catch (error) {
      this.options.onError(
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  /**
   * Remove item from cart
   */
  removeItem(itemId: string): void {
    try {
      this.store.removeItem(itemId);
    } catch (error) {
      this.options.onError(
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  /**
   * Update item quantity
   */
  updateQuantity(itemId: string, quantity: number): void {
    try {
      this.store.updateQuantity(itemId, quantity);
    } catch (error) {
      this.options.onError(
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  /**
   * Clear all items from cart
   */
  clear(): void {
    try {
      this.store.clear();
    } catch (error) {
      this.options.onError(
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  /**
   * Get all cart items
   */
  getItems(): CartItem[] {
    return this.store.getState().items;
  }

  /**
   * Get total price
   */
  getTotal(): number {
    return this.store.getState().total;
  }

  /**
   * Get total item count
   */
  getItemCount(): number {
    return this.store.getState().itemCount;
  }
}

/**
 * Create a new cart manager instance
 */
export function createCartManager(
  options?: CartManagerOptions
): CartManager {
  return new CartManager(options);
}

