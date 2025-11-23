/**
 * Tests for useWishlist hook
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useWishlist } from '../wishlist/useWishlist';
import type { Product } from '@alejandrovrod/blocks-core';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Test Product',
  price: 100,
  description: 'Test description',
  image: 'https://example.com/image.jpg',
};

describe('useWishlist', () => {
  beforeEach(() => {
    // Reset WishlistStore singleton
    const { WishlistStore } = require('@alejandrovrod/blocks-core');
    if (WishlistStore.resetInstance) {
      WishlistStore.resetInstance();
    }
  });

  it('should initialize with empty wishlist', () => {
    const { result } = renderHook(() => useWishlist());
    
    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should add product to wishlist', async () => {
    const { result } = renderHook(() => useWishlist());
    
    act(() => {
      result.current.addItem(mockProduct);
    });
    
    await waitFor(() => {
      expect(result.current.items.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.itemCount).toBe(1);
    expect(result.current.items[0].product).toEqual(mockProduct);
  });

  it('should not add duplicate products', async () => {
    const { result } = renderHook(() => useWishlist());
    
    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });
    
    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
    });
  });

  it('should remove item from wishlist', async () => {
    const { result } = renderHook(() => useWishlist());
    
    act(() => {
      result.current.addItem(mockProduct);
    });
    
    await waitFor(() => {
      expect(result.current.items.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
    
    const itemId = result.current.items[0].id;
    act(() => {
      result.current.removeItem(itemId);
    });
    
    await waitFor(() => {
      expect(result.current.items.length).toBe(0);
    }, { timeout: 2000 });
    
    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should check if product is in wishlist', async () => {
    const { result } = renderHook(() => useWishlist());
    
    expect(result.current.hasProduct('prod-1')).toBe(false);
    
    act(() => {
      result.current.addItem(mockProduct);
    });
    
    await waitFor(() => {
      expect(result.current.hasProduct('prod-1')).toBe(true);
    }, { timeout: 2000 });
    
    expect(result.current.hasProduct('prod-1')).toBe(true);
  });

  it('should clear wishlist', async () => {
    const { result } = renderHook(() => useWishlist());
    
    act(() => {
      result.current.addItem(mockProduct);
    });
    
    await waitFor(() => {
      expect(result.current.items.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
    
    act(() => {
      result.current.clear();
    });
    
    await waitFor(() => {
      expect(result.current.items.length).toBe(0);
    }, { timeout: 2000 });
    
    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should add item with notes', async () => {
    const { result } = renderHook(() => useWishlist());
    
    act(() => {
      result.current.addItem(mockProduct, 'Remember to check reviews');
    });
    
    await waitFor(() => {
      expect(result.current.items.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
    
    expect(result.current.items[0].notes).toBe('Remember to check reviews');
  });
});


