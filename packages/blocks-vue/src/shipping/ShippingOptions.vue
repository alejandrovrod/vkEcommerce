<template>
  <div :class="['vkecom-shipping-options', className]">
    <div v-if="rates.length === 0" :class="['vkecom-shipping-options-empty']">
      <p>No shipping options available</p>
    </div>
    <div v-else role="radiogroup">
      <label
        v-for="rate in rates"
        :key="rate.option.id"
        :class="['vkecom-shipping-option', { selected: selectedRateId === rate.option.id }]"
      >
        <input
          type="radio"
          name="shipping-option"
          :value="rate.option.id"
          :checked="selectedRateId === rate.option.id"
          @change="onSelect(rate)"
        />
        <div class="vkecom-shipping-option-content">
          <div class="vkecom-shipping-option-name">{{ rate.option.name }}</div>
          <div class="vkecom-shipping-option-cost">
            ${{ rate.cost.toFixed(2) }} {{ rate.currency }}
          </div>
          <div v-if="rate.estimatedDays" class="vkecom-shipping-option-days">
            {{ rate.estimatedDays.min }}-{{ rate.estimatedDays.max }} days
          </div>
        </div>
      </label>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ShippingRate } from '@alejandrovrod/blocks-core';

interface Props {
  rates: ShippingRate[];
  selectedRateId?: string;
  onSelect: (rate: ShippingRate) => void;
  className?: string;
}

defineProps<Props>();
</script>


