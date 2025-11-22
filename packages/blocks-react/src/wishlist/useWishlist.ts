/**
 * React hook for wishlist management
 */

import { useState, useEffect, useCallback } from 'react';
import { createWishlistManager } from '@vk/blocks-core';
import type { WishlistItem, WishlistState, WishlistOptions, Product } from '@vk/blocks-core';

/**
 * Use wishlist hook return type
 */
export interface UseWishlistReturn {
  /**
   * Wishlist items
   */
  items: WishlistItem[];
  
  /**
   * Item count
   */
  itemCount: number;
  
  /**
   * Add product to wishlist
   */
  addItem: (product: Product, notes?: string, metadata?: Record<string, unknown>) => void;
  
  /**
   * Remove item from wishlist
   */
  removeItem: (itemId: string) => void;
  
  /**
   * Remove product from wishlist by product ID
   */
  removeProduct: (productId: string) => void;
  
  /**
   * Check if product is in wishlist
   */
  hasProduct: (productId: string) => boolean;
  
  /**
   * Get wishlist item by product ID
   */
  getItemByProductId: (productId: string) => WishlistItem | undefined;
  
  /**
   * Clear all items
   */
  clear: () => void;
  
  /**
   * Update item notes
   */
  updateItemNotes: (itemId: string, notes?: string) => void;
}

/**
 * React hook for wishlist
 */
export function useWishlist(options?: WishlistOptions): UseWishlistReturn {
  const [manager] = useState(() => createWishlistManager(options));
  const [state, setState] = useState<WishlistState>(() => manager.getState());

  useEffect(() => {
    const unsubscribe = manager.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, [manager]);

  const addItem = useCallback(
    (product: Product, notes?: string, metadata?: Record<string, unknown>) => {
      manager.addItem(product, notes, metadata);
    },
    [manager]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      manager.removeItem(itemId);
    },
    [manager]
  );

  const removeProduct = useCallback(
    (productId: string) => {
      manager.removeProduct(productId);
    },
    [manager]
  );

  const hasProduct = useCallback(
    (productId: string) => manager.hasProduct(productId),
    [manager]
  );

  const getItemByProductId = useCallback(
    (productId: string) => manager.getItemByProductId(productId),
    [manager]
  );

  const clear = useCallback(() => {
    manager.clear();
  }, [manager]);

  const updateItemNotes = useCallback(
    (itemId: string, notes?: string) => {
      manager.updateItemNotes(itemId, notes);
    },
    [manager]
  );

  return {
    items: state.items,
    itemCount: state.itemCount,
    addItem,
    removeItem,
    removeProduct,
    hasProduct,
    getItemByProductId,
    clear,
    updateItemNotes,
  };
}

