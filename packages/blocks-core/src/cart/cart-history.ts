/**
 * Cart history - Track and restore previous cart states
 */

import type { CartState } from './types';

/**
 * Cart history entry
 */
export interface CartHistoryEntry {
  id: string;
  state: CartState;
  timestamp: number;
  label?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Cart history options
 */
export interface CartHistoryOptions {
  /**
   * Maximum number of history entries to keep
   */
  maxEntries?: number;
  
  /**
   * Enable persistence (localStorage)
   */
  persist?: boolean;
  
  /**
   * Storage key for persistence
   */
  storageKey?: string;
  
  /**
   * On history change callback
   */
  onHistoryChange?: (entries: CartHistoryEntry[]) => void;
}

/**
 * Cart history manager
 */
export class CartHistory {
  private entries: CartHistoryEntry[] = [];
  private options: Required<Omit<CartHistoryOptions, 'onHistoryChange'>> & {
    onHistoryChange?: (entries: CartHistoryEntry[]) => void;
  };

  constructor(options: CartHistoryOptions = {}) {
    this.options = {
      maxEntries: options.maxEntries || 10,
      persist: options.persist ?? true,
      storageKey: options.storageKey || 'vkecomblocks-cart-history',
      onHistoryChange: options.onHistoryChange,
    };

    if (this.options.persist) {
      this.loadFromStorage();
    }
  }

  /**
   * Add state to history
   */
  addState(state: CartState, label?: string, metadata?: Record<string, unknown>): void {
    const entry: CartHistoryEntry = {
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      state: {
        items: state.items.map((item) => ({ ...item })),
        total: state.total,
        itemCount: state.itemCount,
      },
      timestamp: Date.now(),
      label,
      metadata,
    };

    this.entries.unshift(entry);

    // Keep only max entries
    if (this.entries.length > this.options.maxEntries) {
      this.entries = this.entries.slice(0, this.options.maxEntries);
    }

    this.saveToStorage();
    this.notifyChange();
  }

  /**
   * Get all history entries
   */
  getEntries(): CartHistoryEntry[] {
    return [...this.entries];
  }

  /**
   * Get history entry by ID
   */
  getEntry(id: string): CartHistoryEntry | undefined {
    return this.entries.find((entry) => entry.id === id);
  }

  /**
   * Restore state from history entry
   */
  restoreState(id: string): CartState | null {
    const entry = this.getEntry(id);
    if (!entry) {
      return null;
    }

    return {
      items: entry.state.items.map((item) => ({ ...item })),
      total: entry.state.total,
      itemCount: entry.state.itemCount,
    };
  }

  /**
   * Remove history entry
   */
  removeEntry(id: string): boolean {
    const index = this.entries.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return false;
    }

    this.entries.splice(index, 1);
    this.saveToStorage();
    this.notifyChange();
    return true;
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.entries = [];
    this.saveToStorage();
    this.notifyChange();
  }

  /**
   * Get latest entry
   */
  getLatest(): CartHistoryEntry | null {
    return this.entries.length > 0 ? this.entries[0] : null;
  }

  /**
   * Save to storage
   */
  private saveToStorage(): void {
    if (!this.options.persist || typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      window.localStorage.setItem(this.options.storageKey, JSON.stringify(this.entries));
    } catch (error) {
      console.warn('[CartHistory] Failed to save to storage:', error);
    }
  }

  /**
   * Load from storage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      const stored = window.localStorage.getItem(this.options.storageKey);
      if (stored) {
        this.entries = JSON.parse(stored) as CartHistoryEntry[];
        // Ensure we don't exceed max entries
        if (this.entries.length > this.options.maxEntries) {
          this.entries = this.entries.slice(0, this.options.maxEntries);
        }
      }
    } catch (error) {
      console.warn('[CartHistory] Failed to load from storage:', error);
    }
  }

  /**
   * Notify change
   */
  private notifyChange(): void {
    if (this.options.onHistoryChange) {
      this.options.onHistoryChange([...this.entries]);
    }
  }
}





