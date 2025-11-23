<template>
  <div :class="['vkecom-shipping-calculator', className]">
    <form @submit.prevent="handleSubmit">
      <slot
        name="address-form"
        :address="address"
        :on-change="handleAddressChange"
        :on-submit="handleSubmit"
      >
        <div class="vkecom-shipping-address-form">
          <input
            v-model="address.street"
            type="text"
            placeholder="Street"
            class="vkecom-shipping-field"
          />
          <input
            v-model="address.city"
            type="text"
            placeholder="City"
            class="vkecom-shipping-field"
          />
          <input
            v-model="address.postalCode"
            type="text"
            placeholder="Postal Code"
            class="vkecom-shipping-field"
          />
          <input
            v-model="address.country"
            type="text"
            placeholder="Country"
            class="vkecom-shipping-field"
          />
          <button type="submit" :disabled="shipping.loading" class="vkecom-shipping-calculate-button">
            {{ shipping.loading ? 'Calculating...' : 'Calculate Shipping' }}
          </button>
        </div>
      </slot>

      <div v-if="shipping.error" class="vkecom-shipping-error">
        {{ shipping.error.message }}
      </div>
    </form>

    <slot name="rates" :rates="shipping.rates" :loading="shipping.loading" :on-select="() => {}">
      <div v-if="shipping.rates.length > 0" class="vkecom-shipping-rates">
        <h3>Shipping Options</h3>
        <div
          v-for="rate in shipping.rates"
          :key="rate.option.id"
          class="vkecom-shipping-rate"
        >
          <div class="vkecom-shipping-rate-name">{{ rate.option.name }}</div>
          <div class="vkecom-shipping-rate-cost">
            ${{ rate.cost.toFixed(2) }} {{ rate.currency }}
          </div>
          <div v-if="rate.estimatedDays" class="vkecom-shipping-rate-days">
            {{ rate.estimatedDays.min }}-{{ rate.estimatedDays.max }} days
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useShipping } from './useShipping';
import type { ShippingAddress, ShippingCalculationRequest } from '@alejandrovrod/blocks-core';

interface Props {
  items: Array<{
    weight?: number;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
    };
    quantity: number;
    value?: number;
  }>;
  className?: string;
  onRatesCalculated?: (rates: import('@alejandrovrod/blocks-core').ShippingRate[]) => void;
}

const props = defineProps<Props>();

const shipping = useShipping();
const address = ref<Partial<ShippingAddress>>({});

const handleSubmit = async () => {
  if (!address.value.street || !address.value.city || !address.value.postalCode || !address.value.country) {
    return;
  }

  try {
    const request: ShippingCalculationRequest = {
      address: address.value as ShippingAddress,
      items: props.items,
    };

    const result = await shipping.calculate(request);
    props.onRatesCalculated?.(result.rates);
  } catch (error) {
    // Error handled by hook
  }
};

const handleAddressChange = (newAddress: Partial<ShippingAddress>) => {
  address.value = newAddress;
};
</script>


