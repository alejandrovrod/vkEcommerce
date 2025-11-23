<template>
  <div :class="['vkecom-payment-method-selector', className]">
    <label
      v-for="method in methods"
      :key="method"
      :class="['vkecom-payment-method-option', { selected: value?.method === method }]"
    >
      <input
        type="radio"
        name="payment-method"
        :value="method"
        :checked="value?.method === method"
        @change="handleSelect(method)"
      />
      <span>{{ getMethodLabel(method) }}</span>
    </label>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PaymentMethodDetails, PaymentMethod } from '@alejandrovrod/blocks-core';

interface Props {
  value?: PaymentMethodDetails;
  methods?: PaymentMethod[];
  onChange: (method: PaymentMethodDetails) => void;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  methods: () => ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'digital_wallet', 'mercado_pago'],
});

const METHOD_LABELS: Record<PaymentMethod, string> = {
  credit_card: 'Credit Card',
  debit_card: 'Debit Card',
  bank_transfer: 'Bank Transfer',
  cash: 'Cash',
  digital_wallet: 'Digital Wallet',
  mercado_pago: 'Mercado Pago',
};

const getMethodLabel = (method: PaymentMethod): string => {
  return METHOD_LABELS[method] || method;
};

const handleSelect = (method: PaymentMethod) => {
  props.onChange({ method });
};
</script>


