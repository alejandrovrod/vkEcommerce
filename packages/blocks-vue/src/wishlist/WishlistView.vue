<template>
  <div :class="['vkecom-wishlist-view', className]">
    <div v-if="wishlist.items.length === 0" :class="['vkecom-wishlist-view-empty']">
      <slot name="empty">
        <p>{{ emptyMessage }}</p>
      </slot>
    </div>
    <template v-else>
      <slot name="header" />
      <div class="vkecom-wishlist-list" role="list">
        <div
          v-for="item in wishlist.items"
          :key="item.id"
          role="listitem"
          class="vkecom-wishlist-item"
        >
          <slot name="item" :item="item" :on-remove="() => wishlist.removeItem(item.id)">
            <div class="vkecom-wishlist-item-content">
              <img
                v-if="item.product.image"
                :src="item.product.image"
                :alt="item.product.name"
                class="vkecom-wishlist-item-image"
              />
              <div class="vkecom-wishlist-item-details">
                <h3 class="vkecom-wishlist-item-name">{{ item.product.name }}</h3>
                <p v-if="item.product.description" class="vkecom-wishlist-item-description">
                  {{ item.product.description }}
                </p>
                <div class="vkecom-wishlist-item-price">${{ item.product.price.toFixed(2) }}</div>
              </div>
              <button
                type="button"
                @click="wishlist.removeItem(item.id)"
                class="vkecom-wishlist-item-remove"
                :aria-label="`Remove ${item.product.name} from wishlist`"
              >
                Remove
              </button>
            </div>
          </slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useWishlist } from './useWishlist';

interface Props {
  className?: string;
  emptyMessage?: string;
}

withDefaults(defineProps<Props>(), {
  emptyMessage: 'Your wishlist is empty',
});

const wishlist = useWishlist();
</script>

