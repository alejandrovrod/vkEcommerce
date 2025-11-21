import { Injectable, signal, computed } from '@angular/core';
import {
  createCartManager,
  type CartManager,
  type CartState,
  type Product,
  type CartManagerOptions,
} from '@vk/blocks-core';

/**
 * Angular service for cart management using Signals
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private manager: CartManager;
  
  // Signal for cart state
  private _state = signal<CartState>({
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Public readonly signal
  public readonly state = this._state.asReadonly();

  // Computed signals for convenience
  public readonly items = computed(() => this.state().items);
  public readonly total = computed(() => this.state().total);
  public readonly itemCount = computed(() => this.state().itemCount);

  constructor() {
    this.manager = createCartManager({
      onStateChange: (state: CartState) => {
        this._state.set(state);
      },
    });

    // Initialize with current state
    this._state.set(this.manager.getState());
  }

  /**
   * Initialize with custom options
   */
  initialize(options?: CartManagerOptions): void {
    this.manager = createCartManager({
      ...options,
      onStateChange: (state: CartState) => {
        this._state.set(state);
        options?.onStateChange?.(state);
      },
    });
    this._state.set(this.manager.getState());
  }


  /**
   * Add product to cart
   */
  addItem(product: Product, quantity: number = 1): void {
    this.manager.addItem(product, quantity);
  }

  /**
   * Remove item from cart
   */
  removeItem(itemId: string): void {
    this.manager.removeItem(itemId);
  }

  /**
   * Update item quantity
   */
  updateQuantity(itemId: string, quantity: number): void {
    this.manager.updateQuantity(itemId, quantity);
  }

  /**
   * Clear all items from cart
   */
  clear(): void {
    this.manager.clear();
  }
}

