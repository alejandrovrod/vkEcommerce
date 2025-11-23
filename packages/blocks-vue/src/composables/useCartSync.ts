/**
 * Vue composable for cart synchronization between tabs
 */

import { ref, onUnmounted } from 'vue';
import { CartSync } from '@alejandrovrod/blocks-core';
import type { CartSyncOptions } from '@alejandrovrod/blocks-core';
import { CartStore } from '@alejandrovrod/blocks-core';

/**
 * Vue composable for cart synchronization
 */
export function useCartSync(options?: CartSyncOptions) {
  const isSyncing = ref(false);
  let sync: CartSync | null = null;

  if (options) {
    const store = CartStore.getInstance();
    sync = new CartSync(store, options);
    sync.initialize();
    isSyncing.value = true;
  }

  onUnmounted(() => {
    if (sync) {
      sync.stop();
      sync = null;
      isSyncing.value = false;
    }
  });

  return {
    isSyncing,
  };
}


