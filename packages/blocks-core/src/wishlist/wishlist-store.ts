/**
 * WishlistStore - Singleton store for wishlist state management
 */

import type { WishlistItem, WishlistState, WishlistStateChangeCallback } from './types';
import { MemoryCartStorage, type CartStorage } from '../cart/storage';

/**
 * WishlistStore - Singleton store for wishlist state
 */
export class WishlistStore {
  private static instance: WishlistStore | null = null;
  private items: WishlistItem[] = [];
  private listeners: Set<WishlistStateChangeCallback> = new Set();
  private storage: CartStorage;

  private constructor(storage?: CartStorage) {
    this.storage = storage || new MemoryCartStorage();
    this.loadFromStorage();
  }

  /**
   * Get or create the singleton instance
   */
  static getInstance(storage?: CartStorage): WishlistStore {
    if (!WishlistStore.instance) {
      WishlistStore.instance = new WishlistStore(storage);
    }
    return WishlistStore.instance;
  }

  /**
   * Reset instance (for testing)
   */
  static resetInstance(): void {
    WishlistStore.instance = null;
  }

  /**
   * Get current state
   */
  getState(): WishlistState {
    return {
      items: [...this.items],
      itemCount: this.items.length,
    };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback: WishlistStateChangeCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Add product to wishlist
   */
  addItem(product: Product, notes?: string, metadata?: Record<string, unknown>): void {
    // Check if product already in wishlist
    if (this.items.some((item) => item.product.id === product.id)) {
      return; // Already in wishlist
    }

    const item: WishlistItem = {
      id: `wishlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      product,
      addedAt: Date.now(),
      notes,
      metadata,
    };

    this.items.push(item);
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Remove item from wishlist
   */
  removeItem(itemId: string): void {
    const index = this.items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      return;
    }

    this.items.splice(index, 1);
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Remove product from wishlist by product ID
   */
  removeProduct(productId: string): void {
    const index = this.items.findIndex((item) => item.product.id === productId);
    if (index === -1) {
      return;
    }

    this.items.splice(index, 1);
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Check if product is in wishlist
   */
  hasProduct(productId: string): boolean {
    return this.items.some((item) => item.product.id === productId);
  }

  /**
   * Get wishlist item by product ID
   */
  getItemByProductId(productId: string): WishlistItem | undefined {
    return this.items.find((item) => item.product.id === productId);
  }

  /**
   * Clear all items
   */
  clear(): void {
    this.items = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Update item notes
   */
  updateItemNotes(itemId: string, notes?: string): void {
    const item = this.items.find((item) => item.id === itemId);
    if (!item) {
      return;
    }

    item.notes = notes;
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * Load from storage
   */
  private loadFromStorage(): void {
    try {
      const stored = this.storage.load();
      if (stored && stored.items) {
        // Convert cart items to wishlist items
        this.items = stored.items.map((cartItem) => ({
          id: cartItem.id,
          product: cartItem.product,
          addedAt: cartItem.addedAt,
          notes: undefined,
          metadata: undefined,
        }));
      }
    } catch (error) {
      console.warn('[WishlistStore] Failed to load from storage:', error);
    }
  }

  /**
   * Save to storage
   */
  private saveToStorage(): void {
    try {
      // Convert wishlist items to cart state format for storage
      const state = {
        items: this.items.map((item) => ({
          id: item.id,
          product: item.product,
          quantity: 1, // Wishlist items always have quantity 1
          addedAt: item.addedAt,
        })),
        total: 0,
        itemCount: this.items.length,
      };
      this.storage.save(state);
    } catch (error) {
      console.warn('[WishlistStore] Failed to save to storage:', error);
    }
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((callback) => {
      try {
        callback(state);
      } catch (error) {
        console.error('[WishlistStore] Error in listener:', error);
      }
    });
  }
}

// Import Product type
import type { Product } from '../cart/types';





