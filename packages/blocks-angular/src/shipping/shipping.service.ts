/**
 * Angular service for shipping calculation using Signals
 */

import { Injectable, signal } from '@angular/core';
import { ShippingManager, createShippingManager } from '@vk/blocks-core';
import type {
  ShippingAddress,
  ShippingCalculationRequest,
  ShippingCalculationResult,
  ShippingRate,
} from '@vk/blocks-core';

/**
 * Angular service for shipping
 */
@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  private manager: ShippingManager;
  private ratesSignal = signal<ShippingRate[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<Error | null>(null);

  // Public readonly signals
  readonly rates = this.ratesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    // Initialize with default options
    this.manager = createShippingManager();
  }

  /**
   * Calculate shipping rates
   */
  async calculateRates(request: ShippingCalculationRequest): Promise<ShippingCalculationResult> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const result = await this.manager.calculateRates(request);
      this.ratesSignal.set(result.rates);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      throw err;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Get cheapest shipping rate
   */
  async getCheapestRate(request: ShippingCalculationRequest): Promise<ShippingRate | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const rate = await this.manager.getCheapestRate(request);
      return rate;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      return null;
    } finally {
      this.loadingSignal.set(false);
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
    this.errorSignal.set(null);
    try {
      return await this.manager.validateAddress(address);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      return {
        valid: false,
        errors: [{ field: 'general', message: err.message }],
      };
    }
  }

  /**
   * Get available shipping options
   */
  getAvailableOptions(): import('@vk/blocks-core').ShippingOption[] {
    return this.manager.getAvailableOptions();
  }

  // Local state management for address and selected option
  private addressSignal = signal<ShippingAddress | null>(null);
  private selectedOptionSignal = signal<import('@vk/blocks-core').ShippingOption | null>(null);

  /**
   * Set shipping address (local state)
   */
  setShippingAddress(address: ShippingAddress): void {
    this.addressSignal.set(address);
  }

  /**
   * Get current shipping address
   */
  address(): ShippingAddress | null {
    return this.addressSignal();
  }

  /**
   * Select shipping option (local state)
   */
  selectShippingOption(optionId: string): void {
    const options = this.manager.getAvailableOptions();
    const option = options.find(opt => opt.id === optionId);
    this.selectedOptionSignal.set(option || null);
  }

  /**
   * Get selected shipping option
   */
  selectedOption(): import('@vk/blocks-core').ShippingOption | null {
    return this.selectedOptionSignal();
  }
}

