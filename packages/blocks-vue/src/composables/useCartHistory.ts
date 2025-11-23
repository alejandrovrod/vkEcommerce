/**
 * Vue composable for cart history
 */

import { ref, computed } from 'vue';
import { CartHistory } from '@alejandrovrod/blocks-core';
import type { CartHistoryOptions, CartHistoryEntry, CartState } from '@alejandrovrod/blocks-core';

/**
 * Vue composable for cart history
 */
export function useCartHistory(options?: CartHistoryOptions) {
  const history = new CartHistory(options);
  const entries = ref<CartHistoryEntry[]>(history.getEntries());

  // Update entries when history changes
  const updateEntries = () => {
    entries.value = history.getEntries();
  };

  const addState = (state: CartState, label?: string, metadata?: Record<string, unknown>) => {
    history.addState(state, label, metadata);
    updateEntries();
  };

  const restoreState = (id: string): CartState | null => {
    return history.restoreState(id);
  };

  const removeEntry = (id: string) => {
    history.removeEntry(id);
    updateEntries();
  };

  const clear = () => {
    history.clear();
    updateEntries();
  };

  const getLatest = computed(() => history.getLatest());

  return {
    entries: computed(() => entries.value),
    addState,
    restoreState,
    removeEntry,
    clear,
    getLatest,
  };
}


