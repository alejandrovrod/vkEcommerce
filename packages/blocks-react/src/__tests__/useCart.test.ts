import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCart } from '../hooks/useCart';
import { CartStore } from '@vk/blocks-core';
import type { Product } from '@vk/blocks-core';

describe('useCart', () => {
  beforeEach(() => {
    CartStore.resetInstance();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10,
    };

    act(() => {
      result.current.addItem(product, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product).toEqual(product);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.total).toBe(20);
    expect(result.current.itemCount).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart());
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10,
    };

    act(() => {
      result.current.addItem(product, 1);
    });

    const itemId = result.current.items[0].id;

    act(() => {
      result.current.removeItem(itemId);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart());
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10,
    };

    act(() => {
      result.current.addItem(product, 1);
    });

    const itemId = result.current.items[0].id;

    act(() => {
      result.current.updateQuantity(itemId, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.total).toBe(50);
    expect(result.current.itemCount).toBe(5);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart());
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10,
    };

    act(() => {
      result.current.addItem(product, 2);
    });

    act(() => {
      result.current.clear();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should update state when cart changes', async () => {
    const { result } = renderHook(() => useCart());
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10,
    };

    act(() => {
      result.current.addItem(product, 1);
    });

    await waitFor(() => {
      expect(result.current.items).toHaveLength(1);
    });
  });
});

