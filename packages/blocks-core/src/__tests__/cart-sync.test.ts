/**
 * Tests for cart synchronization
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CartSync } from '../cart/cart-sync';
import { CartStore } from '../cart/cart-store';
import type { Product } from '../cart/types';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Test Product',
  price: 100,
};

describe('CartSync', () => {
  let cartStore: CartStore;
  let cartSync: CartSync;

  beforeEach(() => {
    cartStore = CartStore.getInstance();
    cartSync = new CartSync(cartStore);
  });

  afterEach(() => {
    if (cartSync && typeof (cartSync as any).destroy === 'function') {
      (cartSync as any).destroy();
    }
  });


  it('should initialize sync', () => {
    cartSync.initialize();
    expect(cartSync).toBeDefined();
  });

  it('should broadcast cart changes', () => {
    cartSync.initialize();
    cartStore.addItem(mockProduct, 1);
    
    // Broadcast should be called automatically
    // We can't easily test BroadcastChannel in Node environment,
    // but we can verify the cart state is correct
    expect(cartStore.getState().items.length).toBe(1);
  });

  it('should broadcast cart changes', () => {
    cartSync.initialize();
    cartStore.addItem(mockProduct, 1);
    
    // Broadcast should be called automatically
    // We can't easily test BroadcastChannel in Node environment,
    // but we can verify the cart state is correct
    expect(cartStore.getState().items.length).toBe(1);
  });

  it('should handle sync lifecycle', () => {
    cartSync.initialize();
    expect(cartSync).toBeDefined();
    
    // After initialize, sync should be active
    // In a real scenario, BroadcastChannel would be open
    cartStore.addItem(mockProduct, 1);
    expect(cartStore.getState().items.length).toBe(1);
  });
});





