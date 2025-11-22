/**
 * React hook for shipping calculation
 */

import { useState, useCallback } from 'react';
import { ShippingManager, createShippingManager } from '@vk/blocks-core';
import type {
  ShippingAddress,
  ShippingCalculationRequest,
  ShippingCalculationResult,
  ShippingManagerOptions,
  ShippingRate,
} from '@vk/blocks-core';

/**
 * Use shipping hook return type
 */
export interface UseShippingReturn {
  /**
   * Shipping rates
   */
  rates: ShippingRate[];
  
  /**
   * Loading state
   */
  loading: boolean;
  
  /**
   * Error state
   */
  error: Error | null;
  
  /**
   * Calculate shipping rates
   */
  calculate: (request: ShippingCalculationRequest) => Promise<ShippingCalculationResult>;
  
  /**
   * Get cheapest rate
   */
  getCheapestRate: (request: ShippingCalculationRequest) => Promise<ShippingRate | null>;
  
  /**
   * Validate address
   */
  validateAddress: (address: ShippingAddress) => Promise<{
    valid: boolean;
    normalized?: ShippingAddress;
    errors?: Array<{ field: string; message: string }>;
  }>;
  
  /**
   * Get available shipping options
   */
  getAvailableOptions: () => import('@vk/blocks-core').ShippingOption[];
  
  /**
   * Current shipping address
   */
  address: ShippingAddress | null;
  
  /**
   * Selected shipping option
   */
  selectedOption: import('@vk/blocks-core').ShippingOption | null;
  
  /**
   * Set shipping address
   */
  setShippingAddress: (address: ShippingAddress) => void;
  
  /**
   * Select shipping option
   */
  selectShippingOption: (optionId: string) => void;
}

/**
 * React hook for shipping
 */
export function useShipping(options?: ShippingManagerOptions): UseShippingReturn {
  const [manager] = useState(() => createShippingManager(options));
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [address, setAddress] = useState<ShippingAddress | null>(null);
  const [selectedOption, setSelectedOption] = useState<import('@vk/blocks-core').ShippingOption | null>(null);

  const calculate = useCallback(
    async (request: ShippingCalculationRequest) => {
      setLoading(true);
      setError(null);
      try {
        const result = await manager.calculateRates(request);
        setRates(result.rates);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [manager]
  );

  const getCheapestRate = useCallback(
    async (request: ShippingCalculationRequest) => {
      setLoading(true);
      setError(null);
      try {
        const rate = await manager.getCheapestRate(request);
        return rate;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [manager]
  );

  const validateAddress = useCallback(
    async (address: ShippingAddress) => {
      setError(null);
      try {
        return await manager.validateAddress(address);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return {
          valid: false,
          errors: [{ field: 'general', message: error.message }],
        };
      }
    },
    [manager]
  );

  const getAvailableOptions = useCallback(() => {
    return manager.getAvailableOptions();
  }, [manager]);

  const setShippingAddress = useCallback((newAddress: ShippingAddress) => {
    setAddress(newAddress);
  }, []);

  const selectShippingOption = useCallback((optionId: string) => {
    const options = manager.getAvailableOptions();
    const option = options.find(opt => opt.id === optionId);
    setSelectedOption(option || null);
  }, [manager]);

  return {
    rates,
    loading,
    error,
    address,
    selectedOption,
    calculate,
    getCheapestRate,
    validateAddress,
    getAvailableOptions,
    setShippingAddress,
    selectShippingOption,
  };
}

