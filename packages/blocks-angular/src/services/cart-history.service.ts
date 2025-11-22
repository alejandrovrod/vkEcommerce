/**
 * Angular service for cart history
 */

import { Injectable, signal, computed } from '@angular/core';
import { CartHistory } from '@vk/blocks-core';
import type { CartHistoryOptions, CartHistoryEntry, CartState } from '@vk/blocks-core';

/**
 * Angular service for cart history
 */
@Injectable({
  providedIn: 'root',
})
export class CartHistoryService {
  private history: CartHistory;
  private entriesSignal = signal<CartHistoryEntry[]>([]);

  // Public readonly signals
  readonly entries = this.entriesSignal.asReadonly();
  readonly latest = computed(() => {
    const entries = this.entriesSignal();
    return entries.length > 0 ? entries[0] : null;
  });

  constructor(options?: CartHistoryOptions) {
    const enhancedOptions: CartHistoryOptions = {
      ...options,
      onHistoryChange: (entries) => {
        this.entriesSignal.set(entries);
        options?.onHistoryChange?.(entries);
      },
    };

    this.history = new CartHistory(enhancedOptions);
    this.entriesSignal.set(this.history.getEntries());
  }

  /**
   * Add state to history
   */
  addState(state: CartState, label?: string, metadata?: Record<string, unknown>): void {
    this.history.addState(state, label, metadata);
    this.entriesSignal.set(this.history.getEntries());
  }

  /**
   * Restore state from history
   */
  restoreState(id: string): CartState | null {
    return this.history.restoreState(id);
  }

  /**
   * Remove history entry
   */
  removeEntry(id: string): void {
    this.history.removeEntry(id);
    this.entriesSignal.set(this.history.getEntries());
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history.clear();
    this.entriesSignal.set([]);
  }
}

