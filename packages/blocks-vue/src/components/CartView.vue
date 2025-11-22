<template>
  <div :class="['vkecom-cart-view', className]">
    <div v-if="$slots.header" class="vkecom-cart-header">
      <slot name="header" />
    </div>

    <div v-if="items.length === 0" class="vkecom-cart-empty">
      <slot name="empty">
        <p>{{ emptyMessage }}</p>
      </slot>
    </div>

    <template v-else>
      <div class="vkecom-cart-list" role="list">
        <div
          v-for="item in items"
          :key="item.id"
          role="listitem"
        >
          <slot name="item" :item="item">
            <CartItem
              :item="item"
              @increase="handleIncrease"
              @decrease="handleDecrease"
              @remove="handleRemove"
            />
          </slot>
        </div>
      </div>

      <div v-if="$slots.footer" class="vkecom-cart-footer">
        <slot name="footer" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '../composables/useCart';
import { useCartSync } from '../composables/useCartSync';
import CartItem from './CartItem.vue';
import type { CartManagerOptions, CartSyncOptions, CartHistoryOptions } from '@vk/blocks-core';

export interface CartViewProps {
  className?: string;
  emptyMessage?: string;
  cartOptions?: CartManagerOptions;
  enableSync?: boolean;
  syncOptions?: CartSyncOptions;
  enableHistory?: boolean;
  historyOptions?: CartHistoryOptions;
}

const props = withDefaults(defineProps<CartViewProps>(), {
  className: '',
  emptyMessage: 'Your cart is empty',
  enableSync: false,
  enableHistory: false,
});

const { items, removeItem, updateQuantity } = useCart(props.cartOptions);

// Enable cart synchronization if requested
useCartSync(props.enableSync ? props.syncOptions : undefined);

const handleIncrease = (itemId: string) => {
  const item = items.value.find((i) => i.id === itemId);
  if (item) {
    updateQuantity(itemId, item.quantity + 1);
  }
};

const handleDecrease = (itemId: string) => {
  const item = items.value.find((i) => i.id === itemId);
  if (item) {
    if (item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    } else {
      removeItem(itemId);
    }
  }
};

const handleRemove = (itemId: string) => {
  removeItem(itemId);
};
</script>

