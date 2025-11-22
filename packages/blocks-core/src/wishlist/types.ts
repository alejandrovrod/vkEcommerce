/**
 * Wishlist module types
 */

import type { Product } from '../cart/types';

/**
 * Wishlist item
 */
export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: number;
  notes?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Wishlist state
 */
export interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}

/**
 * Wishlist options
 */
export interface WishlistOptions {
  /**
   * Custom storage implementation
   */
  storage?: import('../cart/storage').CartStorage;
  
  /**
   * Storage key for default localStorage implementation
   */
  storageKey?: string;
  
  /**
   * Enable persistence using localStorage
   */
  persist?: boolean;
  
  /**
   * Callback fired when wishlist state changes
   */
  onStateChange?: (state: WishlistState) => void;
  
  /**
   * Error callback
   */
  onError?: (error: Error) => void;
  
  /**
   * Enable sync between tabs/windows
   */
  enableSync?: boolean;
}

/**
 * Callback function type for state changes
 */
export type WishlistStateChangeCallback = (state: WishlistState) => void;

