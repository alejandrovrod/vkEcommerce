/**
 * Shipping manager - Main API for shipping operations
 */

import type {
  ShippingAddress,
  ShippingCalculationRequest,
  ShippingCalculationResult,
  ShippingManagerOptions,
  ShippingProvider,
  ShippingRate,
} from './types';
import { ShippingCalculator } from './shipping-calculator';
import { GenericShippingProvider } from './shipping-providers/generic-provider';

/**
 * Shipping manager class
 */
export class ShippingManager {
  private calculator: ShippingCalculator;
  private options: Required<Omit<ShippingManagerOptions, 'defaultProvider' | 'providers'>> & {
    defaultProvider?: ShippingProvider;
    providers?: ShippingProvider[];
  };

  constructor(options: ShippingManagerOptions = {}) {
    // Setup providers
    const providers: ShippingProvider[] = [];
    
    if (options.defaultProvider) {
      providers.push(options.defaultProvider);
    }
    
    if (options.providers) {
      providers.push(...options.providers);
    }
    
    // If no providers provided, use generic
    if (providers.length === 0) {
      providers.push(new GenericShippingProvider({ currency: options.currency }));
    }

    this.calculator = new ShippingCalculator(providers, options.defaultProvider || providers[0]);
    
    this.options = {
      currency: options.currency || 'USD',
      enableValidation: options.enableValidation ?? true,
      onError: options.onError || ((error) => console.error('[ShippingManager]', error)),
      defaultProvider: options.defaultProvider,
      providers: options.providers,
    };
  }

  /**
   * Calculate shipping rates
   */
  async calculateRates(request: ShippingCalculationRequest): Promise<ShippingCalculationResult> {
    try {
      // Validate address if enabled
      if (this.options.enableValidation) {
        const validation = await this.calculator.validateAddress(request.address);
        if (!validation.valid) {
          return {
            rates: [],
            errors: validation.errors,
          };
        }
        
        // Use normalized address if available
        if (validation.normalized) {
          request.address = validation.normalized;
        }
      }

      return await this.calculator.calculate(request);
    } catch (error) {
      this.options.onError?.(error instanceof Error ? error : new Error(String(error)));
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
   * Calculate shipping rates from all providers
   */
  async calculateFromAllProviders(request: ShippingCalculationRequest): Promise<{
    provider: string;
    result: ShippingCalculationResult;
  }[]> {
    try {
      return await this.calculator.calculateFromAllProviders(request);
    } catch (error) {
      this.options.onError?.(error instanceof Error ? error : new Error(String(error)));
      return [];
    }
  }

  /**
   * Get cheapest shipping rate
   */
  async getCheapestRate(request: ShippingCalculationRequest): Promise<ShippingRate | null> {
    try {
      return await this.calculator.getCheapestRate(request);
    } catch (error) {
      this.options.onError?.(error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  }

  /**
   * Validate address
   */
  async validateAddress(address: ShippingAddress): Promise<{
    valid: boolean;
    normalized?: ShippingAddress;
    errors?: Array<{ field: string; message: string }>;
  }> {
    try {
      return await this.calculator.validateAddress(address);
    } catch (error) {
      this.options.onError?.(error instanceof Error ? error : new Error(String(error)));
      return {
        valid: false,
        errors: [
          {
            field: 'validation',
            message: error instanceof Error ? error.message : 'Failed to validate address',
          },
        ],
      };
    }
  }

  /**
   * Get all available shipping options
   */
  getAvailableOptions(): ShippingOption[] {
    return this.calculator.getAllOptions();
  }

  /**
   * Add provider
   */
  addProvider(provider: ShippingProvider): void {
    this.calculator.addProvider(provider);
  }

  /**
   * Set default provider
   */
  setDefaultProvider(provider: ShippingProvider): void {
    this.calculator.setDefaultProvider(provider);
  }
}

// Import ShippingOption type
import type { ShippingOption } from './types';

/**
 * Create a shipping manager instance
 */
export function createShippingManager(options?: ShippingManagerOptions): ShippingManager {
  return new ShippingManager(options);
}

