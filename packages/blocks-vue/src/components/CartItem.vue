<template>
  <div
    :class="['vkecom-cart-item', className]"
    :data-item-id="item.id"
    itemscope
    itemtype="https://schema.org/Product"
  >
    <slot>
      <div class="vkecom-cart-item-image">
        <slot name="image" :item="item">
          <img
            v-if="item.product.image"
            :src="item.product.image"
            :alt="item.product.name"
            loading="lazy"
            itemprop="image"
          />
          <div v-else class="vkecom-cart-item-image-placeholder">No image</div>
        </slot>
      </div>

      <div class="vkecom-cart-item-details">
        <slot name="title" :item="item">
          <h3 class="vkecom-cart-item-name" itemprop="name">
            {{ item.product.name }}
          </h3>
        </slot>

        <p
          v-if="item.product.description"
          class="vkecom-cart-item-description"
          itemprop="description"
        >
          {{ item.product.description }}
        </p>

        <div
          class="vkecom-cart-item-price"
          itemprop="offers"
          itemscope
          itemtype="https://schema.org/Offer"
        >
          <slot name="price" :item="item">
            <span class="vkecom-cart-item-price-unit">
              ${{ item.product.price.toFixed(2) }}
            </span>
            <span class="vkecom-cart-item-price-total">
              Total: ${{ (item.product.price * item.quantity).toFixed(2) }}
            </span>
            <meta itemprop="price" :content="item.product.price.toString()" />
            <meta itemprop="priceCurrency" content="USD" />
          </slot>
        </div>
      </div>

      <div class="vkecom-cart-item-quantity">
        <slot
          name="quantity"
          :item="item"
          :onIncrease="handleIncrease"
          :onDecrease="handleDecrease"
        >
          <button
            type="button"
            class="vkecom-cart-item-quantity-decrease"
            @click="handleDecrease"
            :aria-label="`Decrease quantity of ${item.product.name}`"
          >
            -
          </button>
          <span
            class="vkecom-cart-item-quantity-value"
            :aria-label="`Quantity: ${item.quantity}`"
          >
            {{ item.quantity }}
          </span>
          <button
            type="button"
            class="vkecom-cart-item-quantity-increase"
            @click="handleIncrease"
            :aria-label="`Increase quantity of ${item.product.name}`"
          >
            +
          </button>
        </slot>
      </div>

      <slot name="remove" :item="item" :onRemove="handleRemove">
        <button
          type="button"
          class="vkecom-cart-item-remove"
          @click="handleRemove"
          :aria-label="`Remove ${item.product.name} from cart`"
        >
          Remove
        </button>
      </slot>
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { CartItem as CartItemType } from '@alejandrovrod/blocks-core';

export interface CartItemProps {
  item: CartItemType;
  className?: string;
}

const props = withDefaults(defineProps<CartItemProps>(), {
  className: '',
});

const emit = defineEmits<{
  increase: [itemId: string];
  decrease: [itemId: string];
  remove: [itemId: string];
}>();

const handleIncrease = () => {
  emit('increase', props.item.id);
};

const handleDecrease = () => {
  emit('decrease', props.item.id);
};

const handleRemove = () => {
  emit('remove', props.item.id);
};
</script>


