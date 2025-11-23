/**
 * Tests for useShipping hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useShipping } from '../shipping/useShipping';
import type { ShippingAddress } from '@alejandrovrod/blocks-core';

const mockAddress: ShippingAddress = {
  street: 'Av. Corrientes 123',
  city: 'Buenos Aires',
  postalCode: 'C1043',
  country: 'AR',
  recipientName: 'Juan Pérez',
};

describe('useShipping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize shipping', () => {
    const { result } = renderHook(() => useShipping());
    
    expect(result.current.address).toBeNull();
    expect(result.current.selectedOption).toBeNull();
  });

  it('should set shipping address', () => {
    const { result } = renderHook(() => useShipping());
    
    result.current.setShippingAddress(mockAddress);
    
    expect(result.current.address).toEqual(mockAddress);
  });

  it('should get available shipping options', () => {
    const { result } = renderHook(() => useShipping());
    
    const options = result.current.getAvailableOptions();
    expect(Array.isArray(options)).toBe(true);
  });

  it('should select shipping option', () => {
    const { result } = renderHook(() => useShipping());
    
    const options = result.current.getAvailableOptions();
    if (options.length > 0) {
      result.current.selectShippingOption(options[0].id);
      expect(result.current.selectedOption?.id).toBe(options[0].id);
    }
  });

  it('should calculate shipping rates', async () => {
    const { result } = renderHook(() => useShipping());
    
    result.current.setShippingAddress(mockAddress);
    
    const rates = await result.current.calculate({
      address: mockAddress,
      items: [
        {
          weight: 1,
          quantity: 2,
          value: 100,
        },
      ],
    });
    
    expect(rates.rates).toBeDefined();
    expect(Array.isArray(rates.rates)).toBe(true);
  });
});


