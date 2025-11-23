import { useState, useEffect, useCallback } from 'react';
import { createCartManager, type CartManager, type CartState, type Product, type CartManagerOptions } from '@alejandrovrod/blocks-core';

/**
 * Hook to manage cart state in React
 * @param options - Optional cart manager options
 * @returns Cart state and methods
 */
export function useCart(options?: CartManagerOptions) {
  const [state, setState] = useState<CartState>(() => {
    try {
      const manager = createCartManager({
        ...options,
        onError: (error) => {
          // Log error but don't throw - allow component to render with empty state
          console.error('Cart error:', error);
          options?.onError?.(error);
        },
      });
      return manager.getState();
    } catch (error) {
      // If initialization fails, return empty state
      console.error('Failed to initialize cart:', error);
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };
    }
  });

  const [manager] = useState<CartManager>(() => {
    try {
      return createCartManager({
        ...options,
        onError: (error) => {
          console.error('Cart error:', error);
          options?.onError?.(error);
        },
      });
    } catch (error) {
      console.error('Failed to create cart manager:', error);
      // Return a manager with no persistence as fallback
      return createCartManager({ persist: false });
    }
  });

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


