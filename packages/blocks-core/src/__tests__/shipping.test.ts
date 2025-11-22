/**
 * Tests for shipping module
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ShippingManager } from '../shipping/shipping-manager';
import { ShippingCalculator } from '../shipping/shipping-calculator';
import { GenericShippingProvider } from '../shipping/shipping-providers/generic-provider';
import type { ShippingAddress, ShippingCalculationRequest } from '../shipping/types';

const mockAddress: ShippingAddress = {
  street: 'Av. Corrientes 123',
  city: 'Buenos Aires',
  postalCode: 'C1043',
  country: 'AR',
  recipientName: 'Juan Pérez',
};

const mockRequest: ShippingCalculationRequest = {
  address: mockAddress,
  items: [
    {
      weight: 1,
      quantity: 2,
      value: 100,
    },
  ],
};

describe('ShippingManager', () => {
  let manager: ShippingManager;

  beforeEach(() => {
    manager = new ShippingManager();
  });

  describe('getAvailableOptions', () => {
    it('should return available shipping options', () => {
      const options = manager.getAvailableOptions();
      expect(Array.isArray(options)).toBe(true);
    });
  });

  describe('calculateRates', () => {
    it('should calculate shipping rates', async () => {
      const result = await manager.calculateRates(mockRequest);
      expect(result.rates).toBeDefined();
      expect(Array.isArray(result.rates)).toBe(true);
    });
  });
});

describe('ShippingCalculator', () => {
  it('should calculate rates with providers', async () => {
    const provider = new GenericShippingProvider({
      name: 'Test Provider',
      options: [
        {
          id: 'standard',
          name: 'Standard',
          type: 'standard',
          cost: 10,
        },
      ],
    });

    const calculator = new ShippingCalculator([provider], provider);
    const result = await calculator.calculate(mockRequest);
    expect(result.rates).toBeDefined();
    expect(Array.isArray(result.rates)).toBe(true);
  });
});

describe('GenericShippingProvider', () => {
  it('should calculate shipping cost', async () => {
    const provider = new GenericShippingProvider({
      name: 'Test Provider',
      options: [
        {
          id: 'standard',
          name: 'Standard',
          type: 'standard',
          cost: 10,
        },
      ],
    });

    const result = await provider.calculateRates(mockRequest);
    expect(result).toBeDefined();
    expect(result.rates).toBeDefined();
    expect(Array.isArray(result.rates)).toBe(true);
    if (result.rates && result.rates.length > 0) {
      expect(result.rates[0].cost).toBeGreaterThan(0);
    }
  });
});

