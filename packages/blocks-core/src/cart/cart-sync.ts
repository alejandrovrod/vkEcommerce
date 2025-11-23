/**
 * Cart synchronization between tabs/windows
 * Uses BroadcastChannel API and Storage events
 */

import type { CartState } from './types';
import { CartStore } from './cart-store';

/**
 * Cart sync options
 */
export interface CartSyncOptions {
  /**
   * Channel name for BroadcastChannel
   */
  channelName?: string;
  
  /**
   * Enable storage events (for cross-tab sync)
   */
  enableStorageEvents?: boolean;
  
  /**
   * On sync error callback
   */
  onError?: (error: Error) => void;
}

/**
 * Cart synchronization manager
 */
export class CartSync {
  private channel: BroadcastChannel | null = null;
  private store: CartStore;
  private options: Required<Omit<CartSyncOptions, 'onError'>> & {
    onError?: (error: Error) => void;
  };
  private storageListener: ((e: StorageEvent) => void) | null = null;
  private isInitialized: boolean = false;

  constructor(store: CartStore, options: CartSyncOptions = {}) {
    this.store = store;
    this.options = {
      channelName: options.channelName || 'vkecomblocks-cart-sync',
      enableStorageEvents: options.enableStorageEvents ?? true,
      onError: options.onError,
    };
  }

  /**
   * Initialize synchronization
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Initialize BroadcastChannel if available
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(this.options.channelName);
        this.channel.onmessage = (event) => {
          this.handleBroadcastMessage(event.data);
        };
      } catch (error) {
        this.options.onError?.(
          error instanceof Error ? error : new Error('Failed to initialize BroadcastChannel')
        );
      }
    }

    // Setup storage events listener
    if (this.options.enableStorageEvents && typeof window !== 'undefined') {
      this.storageListener = (e: StorageEvent) => {
        if (e.key === 'vkecomblocks-cart' && e.newValue) {
          try {
            const state = JSON.parse(e.newValue) as CartState;
            this.handleStorageSync(state);
          } catch (error) {
            // Ignore parse errors from other sources
          }
        }
      };
      window.addEventListener('storage', this.storageListener);
    }

    // Subscribe to cart changes and broadcast them
    this.store.subscribe((state) => {
      this.broadcastState(state);
    });

    this.isInitialized = true;
  }

  /**
   * Stop synchronization
   */
  stop(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }

    if (this.storageListener && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = null;
    }

    this.isInitialized = false;
  }

  /**
   * Broadcast cart state to other tabs
   */
  private broadcastState(state: CartState): void {
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'cart-update',
          state,
          timestamp: Date.now(),
        });
      } catch (error) {
        this.options.onError?.(
          error instanceof Error ? error : new Error('Failed to broadcast cart state')
        );
      }
    }
  }

  /**
   * Handle broadcast message from other tabs
   */
  private handleBroadcastMessage(data: { type: string; state: CartState; timestamp: number }): void {
    if (data.type === 'cart-update' && data.state) {
      // Only sync if the remote state is newer (to avoid conflicts)
      const currentState = this.store.getState();
      const currentTimestamp = this.getStateTimestamp(currentState);
      
      if (data.timestamp > currentTimestamp) {
        this.syncState(data.state);
      }
    }
  }

  /**
   * Handle storage sync event
   */
  private handleStorageSync(state: CartState): void {
    // Storage events are fired when localStorage changes in other tabs
    // We should sync the state, but be careful about conflicts
    this.syncState(state);
  }

  /**
   * Sync state from remote source
   */
  private syncState(state: CartState): void {
    try {
      // Temporarily disable sync to avoid infinite loop
      const currentItems = this.store.getState().items;
      
      // Only sync if state is actually different
      if (JSON.stringify(currentItems) !== JSON.stringify(state.items)) {
        // Clear current items and add remote items
        this.store.clear();
        state.items.forEach((item) => {
          this.store.addItem(item.product, item.quantity);
        });
      }
    } catch (error) {
      this.options.onError?.(
        error instanceof Error ? error : new Error('Failed to sync cart state')
      );
    }
  }

  /**
   * Get timestamp from state (using latest addedAt or current time)
   */
  private getStateTimestamp(state: CartState): number {
    if (state.items.length === 0) {
      return 0;
    }
    return Math.max(...state.items.map((item) => item.addedAt));
  }
}





