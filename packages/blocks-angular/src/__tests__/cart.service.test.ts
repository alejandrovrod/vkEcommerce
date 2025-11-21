import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartService } from '../services/cart.service';
import { CartStore } from '@vk/blocks-core';
import type { Product } from '@vk/blocks-core';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    CartStore.resetInstance();
    service = new CartService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty cart', () => {
    const state = service.state();
    expect(state.items).toEqual([]);
    expect(state.total).toBe(0);
    expect(state.itemCount).toBe(0);
  });

  it('should add item to cart', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10,
    };

    service.addItem(product, 2);
    const state = service.state();

    expect(state.items).toHaveLength(1);
    expect(state.items[0].product).toEqual(product);
    expect(state.items[0].quantity).toBe(2);
    expect(state.total).toBe(20);
    expect(state.itemCount).toBe(2);
  });

  it('should remove item from cart', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10,
    };

    service.addItem(product, 1);
    const itemId = service.items()[0].id;
    service.removeItem(itemId);

    expect(service.items()).toHaveLength(0);
    expect(service.total()).toBe(0);
  });

  it('should update item quantity', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10,
    };

    service.addItem(product, 1);
    const itemId = service.items()[0].id;
    service.updateQuantity(itemId, 5);

    expect(service.items()[0].quantity).toBe(5);
    expect(service.total()).toBe(50);
    expect(service.itemCount()).toBe(5);
  });

  it('should clear cart', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10,
    };

    service.addItem(product, 1);
    service.clear();

    expect(service.items()).toHaveLength(0);
    expect(service.total()).toBe(0);
    expect(service.itemCount()).toBe(0);
  });

  it('should update state signal when cart changes', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10,
    };

    // Initial state should be empty
    expect(service.state().items).toHaveLength(0);

    // Add item
    service.addItem(product, 1);

    // State should be updated
    expect(service.state().items).toHaveLength(1);
    expect(service.state().total).toBe(10);
  });

  it('should get items via computed signal', () => {
    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10,
    };

    service.addItem(product, 1);
    const items = service.items();

    expect(items).toHaveLength(1);
    expect(items[0].product).toEqual(product);
  });

  it('should get total via computed signal', () => {
    const product1: Product = { id: '1', name: 'Product 1', price: 10 };
    const product2: Product = { id: '2', name: 'Product 2', price: 20 };

    service.addItem(product1, 2);
    service.addItem(product2, 1);

    expect(service.total()).toBe(40);
  });

  it('should get item count via computed signal', () => {
    const product1: Product = { id: '1', name: 'Product 1', price: 10 };
    const product2: Product = { id: '2', name: 'Product 2', price: 20 };

    service.addItem(product1, 2);
    service.addItem(product2, 3);

    expect(service.itemCount()).toBe(5);
  });

  it('should initialize with custom options', () => {
    const onStateChange = vi.fn();
    const newService = new CartService();
    newService.initialize({ onStateChange });

    const product: Product = {
      id: '1',
      name: 'Test Product',
      price: 10,
    };

    newService.addItem(product, 1);

    expect(onStateChange).toHaveBeenCalled();
  });
});

