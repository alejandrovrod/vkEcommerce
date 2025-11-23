/**
 * Shipping calculator
 * Main interface for calculating shipping costs
 */

import type {
  ShippingAddress,
  ShippingCalculationRequest,
  ShippingCalculationResult,
  ShippingProvider,
  ShippingRate,
  ShippingOption,
} from './types';
import { GenericShippingProvider } from './shipping-providers/generic-provider';

/**
 * Shipping calculator class
 */
export class ShippingCalculator {
  private providers: ShippingProvider[];
  private defaultProvider: ShippingProvider;

  constructor(providers: ShippingProvider[] = [], defaultProvider?: ShippingProvider) {
    this.providers = providers.length > 0 ? providers : [new GenericShippingProvider()];
    this.defaultProvider = defaultProvider || this.providers[0];
  }

  /**
   * Add provider
   */
  addProvider(provider: ShippingProvider): void {
    this.providers.push(provider);
  }

  /**
   * Set default provider
   */
  setDefaultProvider(provider: ShippingProvider): void {
    if (!this.providers.includes(provider)) {
      this.providers.push(provider);
    }
    this.defaultProvider = provider;
  }

  /**
   * Calculate shipping rates using default provider
   */
  async calculate(request: ShippingCalculationRequest): Promise<ShippingCalculationResult> {
    return this.calculateWithProvider(request, this.defaultProvider);
  }

  /**
   * Calculate shipping rates with specific provider
   */
  async calculateWithProvider(
    request: ShippingCalculationRequest,
    provider: ShippingProvider
  ): Promise<ShippingCalculationResult> {
    try {
      return await provider.calculateRates(request);
    } catch (error) {
      return {
        rates: [],
        errors: [
          {
            field: 'calculation',
            message: error instanceof Error ? error.message : 'Failed to calculate shipping',
          },
        ],
      };
    }
  }

  /**
   * Calculate shipping rates from all providers and return best options
   */
  async calculateFromAllProviders(request: ShippingCalculationRequest): Promise<{
    provider: string;
    result: ShippingCalculationResult;
  }[]> {
    const results = await Promise.allSettled(
      this.providers.map(async (provider) => ({
        provider: provider.name,
        result: await provider.calculateRates(request),
      }))
    );

    return results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<{ provider: string; result: ShippingCalculationResult }>).value);
  }

  /**
   * Get cheapest rate from all providers
   */
  async getCheapestRate(request: ShippingCalculationRequest): Promise<ShippingRate | null> {
    const results = await this.calculateFromAllProviders(request);
    
    let cheapest: ShippingRate | null = null;
    let cheapestCost = Infinity;

    results.forEach(({ result }) => {
      result.rates.forEach((rate) => {
        if (rate.cost < cheapestCost) {
          cheapestCost = rate.cost;
          cheapest = rate;
        }
      });
    });

    return cheapest;
  }

  /**
   * Validate address
   */
  async validateAddress(address: ShippingAddress, provider?: ShippingProvider): Promise<{
    valid: boolean;
    normalized?: ShippingAddress;
    errors?: Array<{ field: string; message: string }>;
  }> {
    const targetProvider = provider || this.defaultProvider;
    return targetProvider.validateAddress(address);
  }

  /**
   * Get all available shipping options from all providers
   */
  getAllOptions(): Array<ShippingOption> {
    const optionsMap = new Map<string, ShippingOption>();
    
    this.providers.forEach((provider) => {
      provider.getAvailableOptions().forEach((option) => {
        if (!optionsMap.has(option.id)) {
          optionsMap.set(option.id, option);
        }
      });
    });

    return Array.from(optionsMap.values());
  }
}





