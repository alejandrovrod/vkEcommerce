/**
 * Tests for wishlist module
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { WishlistManager, createWishlistManager } from '../wishlist/wishlist-manager';
import type { Product } from '../cart/types';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Test Product',
  price: 100,
  description: 'Test description',
  image: 'https://example.com/image.jpg',
};

describe('WishlistManager', () => {
  let manager: WishlistManager;

  beforeEach(() => {
    manager = createWishlistManager();
    // Clear wishlist before each test
    manager.clear();
  });

  describe('addItem', () => {
    it('should add product to wishlist', () => {
      manager.addItem(mockProduct);
      const state = manager.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].product).toEqual(mockProduct);
      expect(state.itemCount).toBe(1);
    });

    it('should not add duplicate products', () => {
      manager.addItem(mockProduct);
      manager.addItem(mockProduct);
      const state = manager.getState();
      expect(state.items).toHaveLength(1);
    });

    it('should add item with notes', () => {
      manager.addItem(mockProduct, 'Remember to check reviews');
      const state = manager.getState();
      expect(state.items).toHaveLength(1);
      const item = state.items[0];
      expect(item).toBeDefined();
      // Notes should be stored in the item
      expect(item.notes).toBeDefined();
      expect(item.notes).toBe('Remember to check reviews');
    });
  });

  describe('removeItem', () => {
    it('should remove item from wishlist', () => {
      manager.addItem(mockProduct);
      const itemId = manager.getState().items[0].id;
      manager.removeItem(itemId);
      const state = manager.getState();
      expect(state.items).toHaveLength(0);
      expect(state.itemCount).toBe(0);
    });
  });

  describe('hasProduct', () => {
    it('should check if product is in wishlist', () => {
      expect(manager.hasProduct('prod-1')).toBe(false);
      manager.addItem(mockProduct);
      expect(manager.hasProduct('prod-1')).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all items', () => {
      manager.addItem(mockProduct);
      manager.clear();
      const state = manager.getState();
      expect(state.items).toHaveLength(0);
      expect(state.itemCount).toBe(0);
    });
  });

  describe('updateItemNotes', () => {
    it('should update item notes', () => {
      manager.addItem(mockProduct);
      const itemId = manager.getState().items[0].id;
      manager.updateItemNotes(itemId, 'Updated notes');
      const item = manager.getState().items[0];
      expect(item.notes).toBe('Updated notes');
    });
  });
});

describe('createWishlistManager', () => {
  it('should create manager with default options', () => {
    const manager = createWishlistManager();
    expect(manager).toBeInstanceOf(WishlistManager);
  });
});





