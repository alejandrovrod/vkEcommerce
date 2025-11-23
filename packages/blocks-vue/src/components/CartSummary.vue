<template>
  <div :class="['vkecom-cart-summary', className]">
    <div v-if="showItemCount" class="vkecom-cart-summary-item-count">
      <slot name="itemCount" :count="itemCount">
        <span>
          {{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}
        </span>
      </slot>
    </div>

    <div v-if="showSubtotal" class="vkecom-cart-summary-subtotal">
      <slot name="subtotal" :subtotal="subtotal">
        <span class="vkecom-cart-summary-label">Subtotal:</span>
        <span class="vkecom-cart-summary-value">{{ formatPrice(subtotal) }}</span>
      </slot>
    </div>

    <div v-if="showTax && taxRate > 0" class="vkecom-cart-summary-tax">
      <slot name="tax" :tax="tax">
        <span class="vkecom-cart-summary-label">Tax:</span>
        <span class="vkecom-cart-summary-value">{{ formatPrice(tax) }}</span>
      </slot>
    </div>

    <div v-if="showShipping" class="vkecom-cart-summary-shipping">
      <slot name="shipping" :shipping="shipping">
        <span class="vkecom-cart-summary-label">Shipping:</span>
        <span class="vkecom-cart-summary-value">{{ formatPrice(shipping) }}</span>
      </slot>
    </div>

    <div v-if="showTotal" class="vkecom-cart-summary-total">
      <slot name="total" :total="finalTotal">
        <span class="vkecom-cart-summary-label">Total:</span>
        <span class="vkecom-cart-summary-value">{{ formatPrice(finalTotal) }}</span>
      </slot>
    </div>

    <div v-if="$slots.checkout" class="vkecom-cart-summary-checkout">
      <slot name="checkout" :onCheckout="handleCheckout" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCart } from '../composables/useCart';
import type { CartManagerOptions } from '@alejandrovrod/blocks-core';

export interface CartSummaryProps {
  className?: string;
  cartOptions?: CartManagerOptions;
  showItemCount?: boolean;
  showSubtotal?: boolean;
  showTax?: boolean;
  taxRate?: number;
  showShipping?: boolean;
  shippingCost?: number;
  showTotal?: boolean;
  formatPrice?: (price: number) => string;
}

const props = withDefaults(defineProps<CartSummaryProps>(), {
  className: '',
  showItemCount: true,
  showSubtotal: true,
  showTax: false,
  taxRate: 0,
  showShipping: false,
  shippingCost: 0,
  showTotal: true,
  formatPrice: (price) => `$${price.toFixed(2)}`,
});

const emit = defineEmits<{
  checkout: [];
}>();

const { total, itemCount } = useCart(props.cartOptions);

const subtotal = computed(() => total.value);
const tax = computed(() => subtotal.value * props.taxRate);
const shipping = computed(() => (props.showShipping ? props.shippingCost : 0));
const finalTotal = computed(() => subtotal.value + tax.value + shipping.value);

const handleCheckout = () => {
  emit('checkout');
};
</script>


