import type { CartItem, CartState, StateChangeCallback } from './types';
import { MemoryCartStorage, type CartStorage } from './storage';

/**
 * CartStore - Singleton store for cart state management
 */
export class CartStore {
  private static instance: CartStore | null = null;
  private items: CartItem[] = [];
  private listeners: Set<StateChangeCallback> = new Set();
  private storage: CartStorage;

  private constructor(storage?: CartStorage) {
    this.storage = storage || new MemoryCartStorage();
    this.loadFromStorage();
  }

  /**
   * Get or create the singleton instance
   */
  static getInstance(storage?: CartStorage): CartStore {
    if (!CartStore.instance) {
      CartStore.instance = new CartStore(storage);
    }
    return CartStore.instance;
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  static resetInstance(): void {
    CartStore.instance = null;
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback: StateChangeCallback): () => void {
    this.listeners.add(callback);
    // Immediately call with current state
    callback(this.getState());

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Get current cart state
   */
  getState(): CartState {
    return {
      items: [...this.items],
      total: this.calculateTotal(),
      itemCount: this.calculateItemCount(),
    };
  }

  /**
   * Add item to cart
   */
  addItem(product: CartItem['product'], quantity: number = 1): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const existingItemIndex = this.items.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      this.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        addedAt: Date.now(),
      };
      this.items.push(newItem);
    }

    this.notifyListeners();
    this.saveToStorage();
  }

  /**
   * Remove item from cart
   */
  removeItem(itemId: string): void {
    const index = this.items.findIndex((item) => item.id === itemId);
    if (index >= 0) {
      this.items.splice(index, 1);
      this.notifyListeners();
      this.saveToStorage();
    }
  }

  /**
   * Update item quantity
   */
  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const item = this.items.find((item) => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.notifyListeners();
      this.saveToStorage();
    }
  }

  /**
   * Clear all items from cart
   */
  clear(): void {
    this.items = [];
    this.notifyListeners();
    this.saveToStorage();
  }

  /**
   * Calculate total price
   */
  private calculateTotal(): number {
    return this.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  /**
   * Calculate total item count
   */
  private calculateItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((callback) => {
      try {
        callback(state);
      } catch (error) {
        console.error('Error in cart state listener:', error);
      }
    });
  }

  /**
   * Save state to storage
   */
  private saveToStorage(): void {
    try {
      this.storage.save(this.getState());
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
    }
  }

  /**
   * Load state from storage
   */
  private loadFromStorage(): void {
    try {
      const saved = this.storage.load();
      if (saved && Array.isArray(saved.items)) {
        this.items = saved.items;
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
    }
  }
}

