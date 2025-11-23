import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CartStore } from '../cart/cart-store';
import { CartManager, createCartManager } from '../cart/cart-manager';
import { MemoryCartStorage, LocalStorageCartStorage } from '../cart/storage';
import type { Product } from '../cart/types';

describe('CartStore', () => {
  beforeEach(() => {
    CartStore.resetInstance();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const store1 = CartStore.getInstance();
      const store2 = CartStore.getInstance();
      expect(store1).toBe(store2);
    });

    it('should reset instance correctly', () => {
      const store1 = CartStore.getInstance();
      CartStore.resetInstance();
      const store2 = CartStore.getInstance();
      expect(store1).not.toBe(store2);
    });
  });

  describe('addItem', () => {
    it('should add a new item to the cart', () => {
      const store = CartStore.getInstance();
      const product: Product = {
        id: '1',
        name: 'Test Product',
        price: 10,
      };

      store.addItem(product, 2);
      const state = store.getState();

      expect(state.items).toHaveLength(1);
      expect(state.items[0].product).toEqual(product);
      expect(state.items[0].quantity).toBe(2);
    });

    it('should update quantity for existing product', () => {
      const store = CartStore.getInstance();
      const product: Product = {
        id: '1',
        name: 'Test Product',
        price: 10,
      };

      store.addItem(product, 2);
      store.addItem(product, 3);
      const state = store.getState();

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it('should throw error for invalid quantity', () => {
      const store = CartStore.getInstance();
      const product: Product = {
        id: '1',
        name: 'Test Product',
        price: 10,
      };

      expect(() => store.addItem(product, 0)).toThrow();
      expect(() => store.addItem(product, -1)).toThrow();
    });
  });

  describe('removeItem', () => {
    it('should remove item by id', () => {
      const store = CartStore.getInstance();
      const product: Product = {
        id: '1',
        name: 'Test Product',
        price: 10,
      };

      store.addItem(product, 1);
      const state1 = store.getState();
      const itemId = state1.items[0].id;

      store.removeItem(itemId);
      const state2 = store.getState();

      expect(state2.items).toHaveLength(0);
    });

    it('should not throw if item does not exist', () => {
      const store = CartStore.getInstance();
      expect(() => store.removeItem('non-existent')).not.toThrow();
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const store = CartStore.getInstance();
      const product: Product = {
        id: '1',
        name: 'Test Product',
        price: 10,
      };

      store.addItem(product, 2);
      const state1 = store.getState();
      const itemId = state1.items[0].id;

      store.updateQuantity(itemId, 5);
      const state2 = store.getState();

      expect(state2.items[0].quantity).toBe(5);
    });

    it('should remove item if quantity is 0', () => {
      const store = CartStore.getInstance();
      const product: Product = {
        id: '1',
        name: 'Test Product',
        price: 10,
      };

      store.addItem(product, 2);
      const state1 = store.getState();
      const itemId = state1.items[0].id;

      store.updateQuantity(itemId, 0);
      const state2 = store.getState();

      expect(state2.items).toHaveLength(0);
    });
  });

  describe('clear', () => {
    it('should remove all items', () => {
      const store = CartStore.getInstance();
      const product1: Product = { id: '1', name: 'Product 1', price: 10 };
      const product2: Product = { id: '2', name: 'Product 2', price: 20 };

      store.addItem(product1, 1);
      store.addItem(product2, 2);
      store.clear();

      const state = store.getState();
      expect(state.items).toHaveLength(0);
      expect(state.total).toBe(0);
      expect(state.itemCount).toBe(0);
    });
  });

  describe('calculations', () => {
    it('should calculate total correctly', () => {
      const store = CartStore.getInstance();
      const product1: Product = { id: '1', name: 'Product 1', price: 10 };
      const product2: Product = { id: '2', name: 'Product 2', price: 20 };

      store.addItem(product1, 2);
      store.addItem(product2, 3);

      const state = store.getState();
      expect(state.total).toBe(10 * 2 + 20 * 3); // 80
    });

    it('should calculate item count correctly', () => {
      const store = CartStore.getInstance();
      const product1: Product = { id: '1', name: 'Product 1', price: 10 };
      const product2: Product = { id: '2', name: 'Product 2', price: 20 };

      store.addItem(product1, 2);
      store.addItem(product2, 3);

      const state = store.getState();
      expect(state.itemCount).toBe(5);
    });
  });

  describe('subscriptions', () => {
    it('should notify subscribers on state change', () => {
      const store = CartStore.getInstance();
      const callback = vi.fn();

      store.subscribe(callback);
      expect(callback).toHaveBeenCalledTimes(1);

      const product: Product = { id: '1', name: 'Product', price: 10 };
      store.addItem(product, 1);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should allow unsubscribing', () => {
      const store = CartStore.getInstance();
      const callback = vi.fn();

      const unsubscribe = store.subscribe(callback);
      unsubscribe();

      const product: Product = { id: '1', name: 'Product', price: 10 };
      store.addItem(product, 1);

      expect(callback).toHaveBeenCalledTimes(1); // Only initial call
    });
  });
});

describe('CartManager', () => {
  beforeEach(() => {
    CartStore.resetInstance();
  });

  it('should create instance with createCartManager', () => {
    const manager = createCartManager();
    expect(manager).toBeInstanceOf(CartManager);
  });

  it('should add items', () => {
    const manager = createCartManager();
    const product: Product = { id: '1', name: 'Product', price: 10 };

    manager.addItem(product, 2);
    const items = manager.getItems();

    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('should remove items', () => {
    const manager = createCartManager();
    const product: Product = { id: '1', name: 'Product', price: 10 };

    manager.addItem(product, 1);
    const itemId = manager.getItems()[0].id;
    manager.removeItem(itemId);

    expect(manager.getItems()).toHaveLength(0);
  });

  it('should update quantity', () => {
    const manager = createCartManager();
    const product: Product = { id: '1', name: 'Product', price: 10 };

    manager.addItem(product, 1);
    const itemId = manager.getItems()[0].id;
    manager.updateQuantity(itemId, 5);

    expect(manager.getItems()[0].quantity).toBe(5);
  });

  it('should clear cart', () => {
    const manager = createCartManager();
    const product: Product = { id: '1', name: 'Product', price: 10 };

    manager.addItem(product, 1);
    manager.clear();

    expect(manager.getItems()).toHaveLength(0);
    expect(manager.getTotal()).toBe(0);
  });

  it('should call onStateChange callback', () => {
    const onStateChange = vi.fn();
    const manager = new CartManager({ onStateChange });
    const product: Product = { id: '1', name: 'Product', price: 10 };

    manager.addItem(product, 1);

    expect(onStateChange).toHaveBeenCalled();
  });

  it('should call onError callback on error', () => {
    const onError = vi.fn();
    const manager = new CartManager({ onError });
    const product: Product = { id: '1', name: 'Product', price: 10 };

    try {
      manager.addItem(product, 0);
    } catch {
      // Expected to throw
    }

    expect(onError).toHaveBeenCalled();
  });

  it('should get state correctly', () => {
    const manager = createCartManager();
    const product: Product = { id: '1', name: 'Product', price: 10 };

    manager.addItem(product, 2);
    const state = manager.getState();

    expect(state.items).toHaveLength(1);
    expect(state.total).toBe(20);
    expect(state.itemCount).toBe(2);
  });
});

describe('Storage', () => {
  describe('MemoryCartStorage', () => {
    it('should save and load state', () => {
      const storage = new MemoryCartStorage();
      const state = {
        items: [],
        total: 0,
        itemCount: 0,
      };

      storage.save(state);
      const loaded = storage.load();

      expect(loaded).toEqual(state);
    });

    it('should clear state', () => {
      const storage = new MemoryCartStorage();
      const state = {
        items: [],
        total: 0,
        itemCount: 0,
      };

      storage.save(state);
      storage.clear();
      const loaded = storage.load();

      expect(loaded).toBeNull();
    });
  });

  describe('LocalStorageCartStorage', () => {
    let store: Record<string, string>;

    beforeEach(() => {
      // Mock localStorage for both global and window
      store = {};
      const mockLocalStorage = {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          Object.keys(store).forEach((key) => delete store[key]);
        },
        length: 0,
        key: () => null,
      } as Storage;

      // Mock for Node.js environment
      global.localStorage = mockLocalStorage;
      
      // Mock for browser environment (window)
      (global as any).window = {
        localStorage: mockLocalStorage,
      };
    });

    afterEach(() => {
      // Clean up
      delete (global as any).window;
      delete (global as any).localStorage;
    });

    it('should save and load from localStorage', () => {
      const storage = new LocalStorageCartStorage('test-cart');
      const state = {
        items: [],
        total: 0,
        itemCount: 0,
      };

      storage.save(state);
      const loaded = storage.load();

      expect(loaded).toEqual(state);
    });

    it('should clear from localStorage', () => {
      const storage = new LocalStorageCartStorage('test-cart');
      const state = {
        items: [],
        total: 0,
        itemCount: 0,
      };

      storage.save(state);
      storage.clear();
      const loaded = storage.load();

      expect(loaded).toBeNull();
    });
  });
});





