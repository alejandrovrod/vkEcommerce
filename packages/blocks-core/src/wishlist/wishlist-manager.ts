/**
 * Wishlist manager - Public API for wishlist operations
 */

import { WishlistStore } from './wishlist-store';
import { LocalStorageCartStorage, type CartStorage } from '../cart/storage';
import type {
  WishlistItem,
  WishlistState,
  WishlistOptions,
  WishlistStateChangeCallback,
} from './types';
import type { Product } from '../cart/types';

/**
 * Wishlist manager class
 */
export class WishlistManager {
  private store: WishlistStore;
  private options: Required<Omit<WishlistOptions, 'storage' | 'storageKey'>> & {
    storage?: CartStorage;
    storageKey: string;
  };

  constructor(options: WishlistOptions = {}) {
    // Determine storage strategy (same as cart)
    let storage: CartStorage | undefined;

    if (options.storage) {
      storage = options.storage;
    } else if (options.persist) {
      storage = new LocalStorageCartStorage(options.storageKey);
    }

    this.store = WishlistStore.getInstance(storage);
    this.options = {
      storage,
      storageKey: options.storageKey || 'vkecomblocks-wishlist',
      persist: options.persist ?? false,
      onStateChange: options.onStateChange || (() => {}),
      onError: options.onError || ((error) => console.error(error)),
      enableSync: options.enableSync ?? false,
    };

    // Subscribe to state changes
    this.store.subscribe((state) => {
      this.options.onStateChange(state);
    });
  }

  /**
   * Get current wishlist state
   */
  getState(): WishlistState {
    return this.store.getState();
  }

  /**
   * Subscribe to wishlist state changes
   */
  subscribe(callback: WishlistStateChangeCallback): () => void {
    return this.store.subscribe(callback);
  }

  /**
   * Add product to wishlist
   */
  addItem(product: Product, notes?: string, metadata?: Record<string, unknown>): void {
    try {
      this.store.addItem(product, notes, metadata);
    } catch (error) {
      this.options.onError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Remove item from wishlist
   */
  removeItem(itemId: string): void {
    try {
      this.store.removeItem(itemId);
    } catch (error) {
      this.options.onError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Remove product from wishlist by product ID
   */
  removeProduct(productId: string): void {
    try {
      this.store.removeProduct(productId);
    } catch (error) {
      this.options.onError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Check if product is in wishlist
   */
  hasProduct(productId: string): boolean {
    return this.store.hasProduct(productId);
  }

  /**
   * Get wishlist item by product ID
   */
  getItemByProductId(productId: string): WishlistItem | undefined {
    return this.store.getItemByProductId(productId);
  }

  /**
   * Get all wishlist items
   */
  getItems(): WishlistItem[] {
    return this.store.getState().items;
  }

  /**
   * Get item count
   */
  getItemCount(): number {
    return this.store.getState().itemCount;
  }

  /**
   * Clear all items
   */
  clear(): void {
    try {
      this.store.clear();
    } catch (error) {
      this.options.onError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Update item notes
   */
  updateItemNotes(itemId: string, notes?: string): void {
    try {
      this.store.updateItemNotes(itemId, notes);
    } catch (error) {
      this.options.onError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
}

/**
 * Create a wishlist manager instance
 */
export function createWishlistManager(options?: WishlistOptions): WishlistManager {
  return new WishlistManager(options);
}





