<template>
  <form :class="['vkecom-checkout-form', className]" @submit.prevent="handleSubmit">
    <div v-if="!renderFields" class="vkecom-checkout-shipping">
      <h3>Shipping Address</h3>
      <input
        v-model="shippingAddress.street"
        type="text"
        placeholder="Street"
        class="vkecom-checkout-field"
      />
      <input
        v-model="shippingAddress.city"
        type="text"
        placeholder="City"
        class="vkecom-checkout-field"
      />
      <input
        v-model="shippingAddress.postalCode"
        type="text"
        placeholder="Postal Code"
        class="vkecom-checkout-field"
      />
      <input
        v-model="shippingAddress.country"
        type="text"
        placeholder="Country"
        class="vkecom-checkout-field"
      />
    </div>

    <label v-if="!renderFields" class="vkecom-checkout-same-address">
      <input v-model="useSameAddress" type="checkbox" />
      Use same address for billing
    </label>

    <div v-if="!useSameAddress && !renderFields" class="vkecom-checkout-billing">
      <h3>Billing Address</h3>
      <input
        v-model="billingAddress.street"
        type="text"
        placeholder="Street"
        class="vkecom-checkout-field"
      />
      <input
        v-model="billingAddress.city"
        type="text"
        placeholder="City"
        class="vkecom-checkout-field"
      />
      <input
        v-model="billingAddress.postalCode"
        type="text"
        placeholder="Postal Code"
        class="vkecom-checkout-field"
      />
    </div>

    <div v-if="!renderFields" class="vkecom-checkout-payment">
      <h3>Payment Method</h3>
      <select v-model="paymentMethod.method" class="vkecom-checkout-field">
        <option value="">Select payment method</option>
        <option value="credit_card">Credit Card</option>
        <option value="debit_card">Debit Card</option>
        <option value="mercado_pago">Mercado Pago</option>
      </select>
    </div>

    <slot name="fields" :shipping-address="shippingAddress" :billing-address="billingAddress" :payment-method="paymentMethod" :on-shipping-change="handleShippingChange" :on-billing-change="handleBillingChange" :on-payment-change="handlePaymentChange" />

    <button
      v-if="!renderSubmit"
      type="submit"
      :disabled="checkout.loading || !checkout.session || checkout.status !== 'pending'"
      class="vkecom-checkout-submit"
    >
      {{ checkout.loading ? 'Processing...' : 'Complete Checkout' }}
    </button>

    <slot name="submit" :loading="checkout.loading" :disabled="!checkout.session || checkout.status !== 'pending'" :on-submit="handleSubmit" />

    <div v-if="checkout.error" class="vkecom-checkout-error">
      {{ checkout.error.message }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCheckout } from './useCheckout';
import type { ShippingAddress, BillingAddress, PaymentMethodDetails } from '@vk/blocks-core';

interface Props {
  subtotal: number;
  cartId?: string;
  className?: string;
  onComplete?: (sessionId: string) => void;
  onError?: (error: Error) => void;
  renderFields?: (props: {
    shippingAddress: Partial<ShippingAddress>;
    billingAddress: Partial<BillingAddress>;
    paymentMethod: Partial<PaymentMethodDetails>;
    onShippingChange: (address: Partial<ShippingAddress>) => void;
    onBillingChange: (address: Partial<BillingAddress>) => void;
    onPaymentChange: (method: Partial<PaymentMethodDetails>) => void;
  }) => unknown;
  renderSubmit?: (props: { loading: boolean; disabled: boolean; onSubmit: () => void }) => unknown;
}

const props = defineProps<Props>();

const checkout = useCheckout();
const shippingAddress = ref<Partial<ShippingAddress>>({});
const billingAddress = ref<Partial<BillingAddress>>({});
const paymentMethod = ref<Partial<PaymentMethodDetails>>({});
const useSameAddress = ref(true);

// Initialize checkout session
watch(() => props.subtotal, () => {
  checkout.initialize(props.subtotal, props.cartId);
}, { immediate: true });

const handleSubmit = async () => {
  try {
    const shippingResult = checkout.setShippingAddress(shippingAddress.value as ShippingAddress);
    if (!shippingResult.valid) {
      props.onError?.(new Error(shippingResult.errors.map(e => e.message).join(', ')));
      return;
    }

    const billing = useSameAddress.value ? (shippingAddress.value as BillingAddress) : billingAddress.value;
    const billingResult = checkout.setBillingAddress(billing as BillingAddress);
    if (!billingResult.valid) {
      props.onError?.(new Error(billingResult.errors.map(e => e.message).join(', ')));
      return;
    }

    if (paymentMethod.value.method) {
      checkout.setPaymentMethod(paymentMethod.value as PaymentMethodDetails);
    }

    const validation = checkout.validate();
    if (!validation.valid) {
      props.onError?.(new Error(validation.errors.map(e => e.message).join(', ')));
      return;
    }

    await checkout.createPayment();
    props.onComplete?.(checkout.session.value?.id || '');
  } catch (error) {
    props.onError?.(error instanceof Error ? error : new Error(String(error)));
  }
};

const handleShippingChange = (address: Partial<ShippingAddress>) => {
  shippingAddress.value = address;
  if (useSameAddress.value) {
    billingAddress.value = address;
  }
};

const handleBillingChange = (address: Partial<BillingAddress>) => {
  billingAddress.value = address;
};

const handlePaymentChange = (method: Partial<PaymentMethodDetails>) => {
  paymentMethod.value = method;
};
</script>

