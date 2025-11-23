<template>
  <div :class="['vkecom-product-list', className]">
    <div v-if="products.length === 0" :class="['vkecom-product-list-empty']">
      <slot name="empty">
        <p>{{ emptyMessage }}</p>
      </slot>
    </div>
    <div v-else role="list">
      <div
        v-for="(product, index) in products"
        :key="product.id"
        role="listitem"
        class="vkecom-product-list-item"
      >
        <slot name="item" :product="product" :index="index">
          <div class="vkecom-product-item">
            <img
              v-if="product.image"
              :src="product.image"
              :alt="product.name"
              class="vkecom-product-item-image"
            />
            <div class="vkecom-product-item-details">
              <h3 class="vkecom-product-item-name">{{ product.name }}</h3>
              <p v-if="product.description" class="vkecom-product-item-description">
                {{ product.description }}
              </p>
              <div class="vkecom-product-item-price">${{ product.price.toFixed(2) }}</div>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@alejandrovrod/blocks-core';

interface Props {
  products: Product[];
  className?: string;
  emptyMessage?: string;
}

withDefaults(defineProps<Props>(), {
  emptyMessage: 'No products found',
});
</script>


