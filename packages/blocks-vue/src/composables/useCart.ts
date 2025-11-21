import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  createCartManager,
  type CartManager,
  type CartState,
  type Product,
  type CartManagerOptions,
} from '@vk/blocks-core';

/**
 * Composable to manage cart state in Vue 3
 * @param options - Optional cart manager options
 * @returns Cart state and methods
 */
export function useCart(options?: CartManagerOptions) {
  // Initialize manager immediately
  const manager = createCartManager(options);
  
  // Initialize state with current cart state
  const state = ref<CartState>(manager.getState());

  // Subscribe immediately to state changes
  const unsubscribe = manager.subscribe((newState) => {
    state.value = newState;
  });

  // Clean up on unmount
  onUnmounted(() => {
    unsubscribe();
  });

  const items = computed(() => state.value.items);
  const total = computed(() => state.value.total);
  const itemCount = computed(() => state.value.itemCount);

  const addItem = (product: Product, quantity: number = 1) => {
    manager.addItem(product, quantity);
  };

  const removeItem = (itemId: string) => {
    manager.removeItem(itemId);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    manager.updateQuantity(itemId, quantity);
  };

  const clear = () => {
    manager.clear();
  };

  return {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };
}

