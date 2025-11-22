<template>
  <form :class="['vkecom-address-form', className]" @submit.prevent="handleSubmit">
    <slot
      name="fields"
      :address="address"
      :on-change="handleChange"
      :errors="errors"
    >
      <div class="vkecom-address-field">
        <label>
          Recipient Name *
          <input
            v-model="address.recipientName"
            type="text"
            :class="['vkecom-address-input', { error: errors.some((e) => e.field === 'recipientName') }]"
          />
          <span v-if="showErrors && errors.find((e) => e.field === 'recipientName')" class="vkecom-address-error">
            {{ errors.find((e) => e.field === 'recipientName')?.message }}
          </span>
        </label>
      </div>

      <div class="vkecom-address-field">
        <label>
          Street *
          <input
            v-model="address.street"
            type="text"
            :class="['vkecom-address-input', { error: errors.some((e) => e.field === 'street') }]"
          />
          <span v-if="showErrors && errors.find((e) => e.field === 'street')" class="vkecom-address-error">
            {{ errors.find((e) => e.field === 'street')?.message }}
          </span>
        </label>
      </div>

      <div class="vkecom-address-field">
        <label>
          City *
          <input
            v-model="address.city"
            type="text"
            :class="['vkecom-address-input', { error: errors.some((e) => e.field === 'city') }]"
          />
          <span v-if="showErrors && errors.find((e) => e.field === 'city')" class="vkecom-address-error">
            {{ errors.find((e) => e.field === 'city')?.message }}
          </span>
        </label>
      </div>

      <div class="vkecom-address-field">
        <label>
          Postal Code *
          <input
            v-model="address.postalCode"
            type="text"
            :class="['vkecom-address-input', { error: errors.some((e) => e.field === 'postalCode') }]"
          />
          <span v-if="showErrors && errors.find((e) => e.field === 'postalCode')" class="vkecom-address-error">
            {{ errors.find((e) => e.field === 'postalCode')?.message }}
          </span>
        </label>
      </div>

      <div class="vkecom-address-field">
        <label>
          Country *
          <input
            v-model="address.country"
            type="text"
            :class="['vkecom-address-input', { error: errors.some((e) => e.field === 'country') }]"
          />
          <span v-if="showErrors && errors.find((e) => e.field === 'country')" class="vkecom-address-error">
            {{ errors.find((e) => e.field === 'country')?.message }}
          </span>
        </label>
      </div>
    </slot>

    <slot name="submit" :on-submit="handleSubmit" :disabled="errors.length > 0">
      <button type="submit" class="vkecom-address-submit">Continue</button>
    </slot>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ShippingAddress } from '@vk/blocks-core';

interface Props {
  initialAddress?: Partial<ShippingAddress>;
  onSubmit: (address: ShippingAddress) => void;
  className?: string;
  showErrors?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showErrors: true,
});

const address = ref<Partial<ShippingAddress>>(props.initialAddress || {});
const errors = ref<Array<{ field: string; message: string }>>([]);

const validate = (): boolean => {
  const newErrors: Array<{ field: string; message: string }> = [];

  if (!address.value.street || address.value.street.trim().length === 0) {
    newErrors.push({ field: 'street', message: 'Street is required' });
  }

  if (!address.value.city || address.value.city.trim().length === 0) {
    newErrors.push({ field: 'city', message: 'City is required' });
  }

  if (!address.value.postalCode || address.value.postalCode.trim().length === 0) {
    newErrors.push({ field: 'postalCode', message: 'Postal code is required' });
  }

  if (!address.value.country || address.value.country.trim().length === 0) {
    newErrors.push({ field: 'country', message: 'Country is required' });
  }

  if (!address.value.recipientName || address.value.recipientName.trim().length === 0) {
    newErrors.push({ field: 'recipientName', message: 'Recipient name is required' });
  }

  errors.value = newErrors;
  return newErrors.length === 0;
};

const handleSubmit = () => {
  if (validate()) {
    props.onSubmit(address.value as ShippingAddress);
  }
};

const handleChange = (field: keyof ShippingAddress, value: string) => {
  address.value = { ...address.value, [field]: value };
  errors.value = errors.value.filter((err) => err.field !== field);
};

watch(() => props.initialAddress, (newAddress) => {
  if (newAddress) {
    address.value = { ...address.value, ...newAddress };
  }
}, { deep: true });
</script>

