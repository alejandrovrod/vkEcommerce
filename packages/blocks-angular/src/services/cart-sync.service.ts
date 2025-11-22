/**
 * Angular service for cart synchronization between tabs
 */

import { Injectable, signal } from '@angular/core';
import { CartSync, CartStore } from '@vk/blocks-core';
import type { CartSyncOptions } from '@vk/blocks-core';

/**
 * Angular service for cart synchronization
 */
@Injectable({
  providedIn: 'root',
})
export class CartSyncService {
  private sync: CartSync | null = null;
  private isSyncingSignal = signal(false);

  // Public readonly signal
  readonly isSyncing = this.isSyncingSignal.asReadonly();

  /**
   * Initialize cart synchronization
   */
  initialize(options?: CartSyncOptions): void {
    if (this.sync) {
      this.stop();
    }

    const store = CartStore.getInstance();
    this.sync = new CartSync(store, options);
    this.sync.initialize();
    this.isSyncingSignal.set(true);
  }

  /**
   * Stop cart synchronization
   */
  stop(): void {
    if (this.sync) {
      this.sync.stop();
      this.sync = null;
      this.isSyncingSignal.set(false);
    }
  }
}

