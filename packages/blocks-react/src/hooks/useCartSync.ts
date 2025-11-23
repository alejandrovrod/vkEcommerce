/**
 * React hook for cart synchronization between tabs
 */

import { useEffect, useRef } from 'react';
import { CartSync } from '@alejandrovrod/blocks-core';
import type { CartSyncOptions } from '@alejandrovrod/blocks-core';

/**
 * React hook for cart synchronization
 */
export function useCartSync(options?: CartSyncOptions) {
  const syncRef = useRef<CartSync | null>(null);

  useEffect(() => {
    // Get the cart manager instance from the cart store
    if (!syncRef.current) {
      const { CartStore } = require('@alejandrovrod/blocks-core');
      const store = CartStore.getInstance();
      syncRef.current = new CartSync(store, options);
      syncRef.current.initialize();
    }

    return () => {
      if (syncRef.current) {
        syncRef.current.stop();
        syncRef.current = null;
      }
    };
  }, [options]);

  return {
    isSyncing: syncRef.current !== null,
  };
}


