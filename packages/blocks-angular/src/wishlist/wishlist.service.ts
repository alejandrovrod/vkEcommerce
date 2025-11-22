/**
 * Angular service for wishlist management using Signals
 */

import { Injectable, signal, computed } from '@angular/core';
import { WishlistManager, createWishlistManager } from '@vk/blocks-core';
import type { WishlistItem, WishlistState, WishlistOptions, Product } from '@vk/blocks-core';

/**
 * Angular service for wishlist
 */
@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private manager: WishlistManager;
  private stateSignal = signal<WishlistState>({ items: [], itemCount: 0 });

  // Public readonly signals
  readonly state = this.stateSignal.asReadonly();
  readonly items = computed(() => this.stateSignal().items);
  readonly itemCount = computed(() => this.stateSignal().itemCount);

  constructor() {
    // Initialize with default options
    const enhancedOptions: WishlistOptions = {
      onStateChange: (state) => {
        this.stateSignal.set(state);
      },
    };

    this.manager = createWishlistManager(enhancedOptions);
    this.stateSignal.set(this.manager.getState());
  }

  /**
   * Add product to wishlist
   */
  addItem(product: Product, notes?: string, metadata?: Record<string, unknown>): void {
    this.manager.addItem(product, notes, metadata);
  }

  /**
   * Remove item from wishlist
   */
  removeItem(itemId: string): void {
    this.manager.removeItem(itemId);
  }

  /**
   * Remove product from wishlist by product ID
   */
  removeProduct(productId: string): void {
    this.manager.removeProduct(productId);
  }

  /**
   * Check if product is in wishlist
   */
  hasProduct(productId: string): boolean {
    return this.manager.hasProduct(productId);
  }

  /**
   * Get wishlist item by product ID
   */
  getItemByProductId(productId: string): WishlistItem | undefined {
    return this.manager.getItemByProductId(productId);
  }

  /**
   * Clear all items
   */
  clear(): void {
    this.manager.clear();
  }

  /**
   * Update item notes
   */
  updateItemNotes(itemId: string, notes?: string): void {
    this.manager.updateItemNotes(itemId, notes);
  }
}

