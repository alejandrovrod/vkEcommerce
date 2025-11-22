<template>
  <button
    type="button"
    :class="['vkecom-wishlist-button', { 'in-wishlist': inWishlist }, className]"
    :aria-label="inWishlist ? inWishlistLabel : notInWishlistLabel"
    @click="handleClick"
  >
    <slot>
      {{ inWishlist ? inWishlistLabel : notInWishlistLabel }}
    </slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWishlist } from './useWishlist';
import type { Product } from '@vk/blocks-core';

interface Props {
  product: Product;
  className?: string;
  inWishlistLabel?: string;
  notInWishlistLabel?: string;
  onAdd?: (product: Product) => void;
  onRemove?: (productId: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  inWishlistLabel: 'Remove from Wishlist',
  notInWishlistLabel: 'Add to Wishlist',
});

const wishlist = useWishlist();
const inWishlist = computed(() => wishlist.hasProduct(props.product.id));

const handleClick = () => {
  if (inWishlist.value) {
    wishlist.removeProduct(props.product.id);
    props.onRemove?.(props.product.id);
  } else {
    wishlist.addItem(props.product);
    props.onAdd?.(props.product);
  }
};
</script>

