/**
 * React hook for cart history
 */

import { useState, useEffect, useCallback } from 'react';
import { CartHistory } from '@alejandrovrod/blocks-core';
import type { CartHistoryOptions, CartHistoryEntry, CartState } from '@alejandrovrod/blocks-core';

/**
 * React hook for cart history
 */
export function useCartHistory(options?: CartHistoryOptions) {
  const [history] = useState(() => new CartHistory(options));
  const [entries, setEntries] = useState<CartHistoryEntry[]>([]);

  useEffect(() => {
    setEntries(history.getEntries());

    // Subscribe to history changes if callback provided
    if (options?.onHistoryChange) {
      // Note: CartHistory doesn't have a subscribe method yet
      // We'll need to poll or trigger manually
    }
  }, [history, options]);

  const addState = useCallback(
    (state: CartState, label?: string, metadata?: Record<string, unknown>) => {
      history.addState(state, label, metadata);
      setEntries(history.getEntries());
    },
    [history]
  );

  const restoreState = useCallback(
    (id: string) => {
      return history.restoreState(id);
    },
    [history]
  );

  const removeEntry = useCallback(
    (id: string) => {
      history.removeEntry(id);
      setEntries(history.getEntries());
    },
    [history]
  );

  const clear = useCallback(() => {
    history.clear();
    setEntries([]);
  }, [history]);

  const getLatest = useCallback(() => {
    return history.getLatest();
  }, [history]);

  return {
    entries,
    addState,
    restoreState,
    removeEntry,
    clear,
    getLatest,
  };
}


