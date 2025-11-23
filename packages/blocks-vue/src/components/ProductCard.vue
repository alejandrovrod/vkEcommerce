<template>
  <article
    v-if="!$slots.default"
    :class="['vkecom-product-card', className]"
    itemscope
    itemtype="https://schema.org/Product"
  >
    <slot name="image" :product="product">
      <div class="vkecom-product-image">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          loading="lazy"
          itemprop="image"
        />
        <div
          v-else
          class="vkecom-product-image-placeholder"
          aria-hidden="true"
        >
          No image
        </div>
      </div>
    </slot>

    <div class="vkecom-product-content">
      <slot name="title" :product="product">
        <h3 class="vkecom-product-title" itemprop="name">
          {{ product.name }}
        </h3>
      </slot>

      <p
        v-if="product.description"
        class="vkecom-product-description"
        itemprop="description"
      >
        {{ product.description }}
      </p>

      <slot name="price" :product="product">
        <div
          class="vkecom-product-price"
          itemprop="offers"
          itemscope
          itemtype="https://schema.org/Offer"
        >
          <span
            class="vkecom-product-price-value"
            itemprop="price"
            :content="product.price.toString()"
          >
            ${{ product.price.toFixed(2) }}
          </span>
          <meta itemprop="priceCurrency" content="USD" />
        </div>
      </slot>

      <slot name="button" :product="product" :onAddToCart="handleAddToCart">
        <button
          type="button"
          class="vkecom-product-button"
          @click="handleAddToCart"
          :aria-label="`Add ${product.name} to cart`"
        >
          Add to Cart
        </button>
      </slot>
    </div>
  </article>

  <div v-else :class="['vkecom-product-card', className]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useCart } from '../composables/useCart';
import type { Product } from '@alejandrovrod/blocks-core';

export interface ProductCardProps {
  product: Product;
  className?: string;
  quantity?: number;
}

const props = withDefaults(defineProps<ProductCardProps>(), {
  className: '',
  quantity: 1,
});

const emit = defineEmits<{
  addToCart: [product: Product];
}>();

const { addItem } = useCart();

const handleAddToCart = () => {
  addItem(props.product, props.quantity);
  emit('addToCart', props.product);
};
</script>









