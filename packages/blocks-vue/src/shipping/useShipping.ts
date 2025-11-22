/**
 * Vue composable for shipping calculation
 */

import { ref, computed } from 'vue';
import { ShippingManager, createShippingManager } from '@vk/blocks-core';
import type {
  ShippingAddress,
  ShippingCalculationRequest,
  ShippingCalculationResult,
  ShippingManagerOptions,
  ShippingRate,
} from '@vk/blocks-core';

/**
 * Use shipping composable return type
 */
export interface UseShippingReturn {
  rates: Readonly<import('vue').Ref<ShippingRate[]>>;
  loading: Readonly<import('vue').Ref<boolean>>;
  error: Readonly<import('vue').Ref<Error | null>>;
  address: Readonly<import('vue').Ref<ShippingAddress | null>>;
  selectedOption: Readonly<import('vue').Ref<import('@vk/blocks-core').ShippingOption | null>>;
  calculate: (request: ShippingCalculationRequest) => Promise<ShippingCalculationResult>;
  getCheapestRate: (request: ShippingCalculationRequest) => Promise<ShippingRate | null>;
  validateAddress: (address: ShippingAddress) => Promise<{
    valid: boolean;
    normalized?: ShippingAddress;
    errors?: Array<{ field: string; message: string }>;
  }>;
  getAvailableOptions: () => import('@vk/blocks-core').ShippingOption[];
  setShippingAddress: (address: ShippingAddress) => void;
  selectShippingOption: (optionId: string) => void;
}

/**
 * Vue composable for shipping
 */
export function useShipping(options?: ShippingManagerOptions): UseShippingReturn {
  const manager = createShippingManager(options);
  const rates = ref<ShippingRate[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const address = ref<ShippingAddress | null>(null);
  const selectedOption = ref<import('@vk/blocks-core').ShippingOption | null>(null);

  const calculate = async (request: ShippingCalculationRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await manager.calculateRates(request);
      rates.value = result.rates;
      return result;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      throw errObj;
    } finally {
      loading.value = false;
    }
  };

  const getCheapestRate = async (request: ShippingCalculationRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const rate = await manager.getCheapestRate(request);
      return rate;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const validateAddress = async (address: ShippingAddress) => {
    error.value = null;
    try {
      return await manager.validateAddress(address);
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      return {
        valid: false,
        errors: [{ field: 'general', message: errObj.message }],
      };
    }
  };

  const getAvailableOptions = () => manager.getAvailableOptions();

  const setShippingAddress = (newAddress: ShippingAddress) => {
    address.value = newAddress;
  };

  const selectShippingOption = (optionId: string) => {
    const options = manager.getAvailableOptions();
    const option = options.find(opt => opt.id === optionId);
    selectedOption.value = option || null;
  };

  return {
    rates: readonly(rates) as any,
    loading: readonly(loading),
    error: readonly(error),
    address: readonly(address),
    selectedOption: readonly(selectedOption),
    calculate,
    getCheapestRate,
    validateAddress,
    getAvailableOptions,
    setShippingAddress,
    selectShippingOption,
  };
}

import { readonly } from 'vue';

