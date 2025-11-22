/**
 * Generic shipping provider
 * Calculates shipping based on weight, volume, and distance
 */

import type {
  ShippingProvider,
  ShippingAddress,
  ShippingOption,
  ShippingRate,
  ShippingCalculationRequest,
  ShippingCalculationResult,
  ShippingOptionType,
} from '../types';

/**
 * Generic provider options
 */
export interface GenericProviderOptions {
  /**
   * Base cost for standard shipping
   */
  baseCost?: number;
  
  /**
   * Cost per kg
   */
  costPerKg?: number;
  
  /**
   * Cost per cubic cm
   */
  costPerCubicCm?: number;
  
  /**
   * Multipliers for different shipping types
   */
  typeMultipliers?: Record<ShippingOptionType, number>;
  
  /**
   * Available shipping options
   */
  options?: ShippingOption[];
  
  /**
   * Currency
   */
  currency?: string;
}

/**
 * Generic shipping provider implementation
 */
export class GenericShippingProvider implements ShippingProvider {
  name = 'Generic';
  private options: Required<Omit<GenericProviderOptions, 'typeMultipliers' | 'options'>> & {
    typeMultipliers: Record<ShippingOptionType, number>;
    options: ShippingOption[];
    currency: string;
  };

  constructor(options: GenericProviderOptions = {}) {
    this.options = {
      baseCost: options.baseCost ?? 5.0,
      costPerKg: options.costPerKg ?? 2.0,
      costPerCubicCm: options.costPerCubicCm ?? 0.001,
      typeMultipliers: {
        standard: 1.0,
        express: 2.0,
        economy: 0.7,
        overnight: 3.0,
        pickup: 0.0,
        ...options.typeMultipliers,
      },
      options: options.options || this.getDefaultOptions(),
      currency: options.currency || 'USD',
    };
  }

  /**
   * Calculate shipping rates
   */
  async calculateRates(request: ShippingCalculationRequest): Promise<ShippingCalculationResult> {
    const rates: ShippingRate[] = [];
    const requestedTypes = request.options || ['standard'];

    // Calculate total weight and volume
    let totalWeight = 0;
    let totalVolume = 0;

    request.items.forEach((item) => {
      if (item.weight) {
        totalWeight += item.weight * item.quantity;
      }
      if (item.dimensions) {
        const volume = (item.dimensions.length || 0) * (item.dimensions.width || 0) * (item.dimensions.height || 0);
        totalVolume += volume * item.quantity;
      }
    });

    // Calculate base cost
    const weightCost = totalWeight * this.options.costPerKg;
    const volumeCost = totalVolume * this.options.costPerCubicCm;
    const baseCost = this.options.baseCost + weightCost + volumeCost;

    // Generate rates for each requested type
    this.options.options.forEach((option) => {
      if (requestedTypes.includes(option.type)) {
        const multiplier = this.options.typeMultipliers[option.type];
        const cost = baseCost * multiplier;

        rates.push({
          option,
          cost: Math.round(cost * 100) / 100, // Round to 2 decimals
          currency: this.options.currency,
          estimatedDays: option.estimatedDays,
        });
      }
    });

    return { rates };
  }

  /**
   * Validate address
   */
  async validateAddress(address: ShippingAddress): Promise<{
    valid: boolean;
    normalized?: ShippingAddress;
    errors?: Array<{ field: string; message: string }>;
  }> {
    const errors: Array<{ field: string; message: string }> = [];

    if (!address.street || address.street.trim().length === 0) {
      errors.push({ field: 'street', message: 'Street is required' });
    }

    if (!address.city || address.city.trim().length === 0) {
      errors.push({ field: 'city', message: 'City is required' });
    }

    if (!address.postalCode || address.postalCode.trim().length === 0) {
      errors.push({ field: 'postalCode', message: 'Postal code is required' });
    }

    if (!address.country || address.country.trim().length === 0) {
      errors.push({ field: 'country', message: 'Country is required' });
    }

    if (!address.recipientName || address.recipientName.trim().length === 0) {
      errors.push({ field: 'recipientName', message: 'Recipient name is required' });
    }

    return {
      valid: errors.length === 0,
      normalized: errors.length === 0 ? address : undefined,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Get available shipping options
   */
  getAvailableOptions(): ShippingOption[] {
    return [...this.options.options];
  }

  /**
   * Get default shipping options
   */
  private getDefaultOptions(): ShippingOption[] {
    return [
      {
        id: 'standard',
        name: 'Standard Shipping',
        type: 'standard',
        estimatedDays: { min: 5, max: 10 },
        description: 'Standard shipping (5-10 business days)',
      },
      {
        id: 'express',
        name: 'Express Shipping',
        type: 'express',
        estimatedDays: { min: 2, max: 5 },
        description: 'Express shipping (2-5 business days)',
      },
      {
        id: 'economy',
        name: 'Economy Shipping',
        type: 'economy',
        estimatedDays: { min: 10, max: 15 },
        description: 'Economy shipping (10-15 business days)',
      },
    ];
  }
}

