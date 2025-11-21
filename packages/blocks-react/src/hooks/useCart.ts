import { useState, useEffect, useCallback } from 'react';
import { createCartManager, type CartManager, type CartState, type Product, type CartManagerOptions } from '@vk/blocks-core';

/**
 * Hook to manage cart state in React
 * @param options - Optional cart manager options
 * @returns Cart state and methods
 */
export function useCart(options?: CartManagerOptions) {
  const [state, setState] = useState<CartState>(() => {
    const manager = createCartManager(options);
    return manager.getState();
  });

  const [manager] = useState<CartManager>(() => createCartManager(options));

  useEffect(() => {
    const unsubscribe = manager.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, [manager]);

  const addItem = useCallback(
    (product: Product, quantity: number = 1) => {
      manager.addItem(product, quantity);
    },
    [manager]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      manager.removeItem(itemId);
    },
    [manager]
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      manager.updateQuantity(itemId, quantity);
    },
    [manager]
  );

  const clear = useCallback(() => {
    manager.clear();
  }, [manager]);

  return {
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };
}

