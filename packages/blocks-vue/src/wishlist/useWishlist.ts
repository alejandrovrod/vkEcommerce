/**
 * Vue composable for wishlist management
 */

import { ref, computed, onUnmounted } from 'vue';
import { createWishlistManager } from '@vk/blocks-core';
import type { WishlistItem, WishlistState, WishlistOptions, Product } from '@vk/blocks-core';

/**
 * Use wishlist composable return type
 */
export interface UseWishlistReturn {
  items: Readonly<import('vue').Ref<WishlistItem[]>>;
  itemCount: Readonly<import('vue').ComputedRef<number>>;
  addItem: (product: Product, notes?: string, metadata?: Record<string, unknown>) => void;
  removeItem: (itemId: string) => void;
  removeProduct: (productId: string) => void;
  hasProduct: (productId: string) => boolean;
  getItemByProductId: (productId: string) => WishlistItem | undefined;
  clear: () => void;
  updateItemNotes: (itemId: string, notes?: string) => void;
}

/**
 * Vue composable for wishlist
 */
export function useWishlist(options?: WishlistOptions): UseWishlistReturn {
  const manager = createWishlistManager(options);
  const state = ref<WishlistState>(manager.getState());

  const unsubscribe = manager.subscribe((newState) => {
    state.value = newState;
  });

  onUnmounted(() => {
    unsubscribe();
  });

  const itemCount = computed(() => state.value.itemCount);

  const addItem = (product: Product, notes?: string, metadata?: Record<string, unknown>) => {
    manager.addItem(product, notes, metadata);
  };

  const removeItem = (itemId: string) => {
    manager.removeItem(itemId);
  };

  const removeProduct = (productId: string) => {
    manager.removeProduct(productId);
  };

  const hasProduct = (productId: string) => manager.hasProduct(productId);

  const getItemByProductId = (productId: string) => manager.getItemByProductId(productId);

  const clear = () => {
    manager.clear();
  };

  const updateItemNotes = (itemId: string, notes?: string) => {
    manager.updateItemNotes(itemId, notes);
  };

  const items = computed(() => state.value.items);

  return {
    items: readonly(items) as any,
    itemCount,
    addItem,
    removeItem,
    removeProduct,
    hasProduct,
    getItemByProductId,
    clear,
    updateItemNotes,
  };
}

import { readonly } from 'vue';

