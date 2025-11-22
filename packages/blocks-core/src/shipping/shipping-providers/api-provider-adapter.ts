/**
 * API provider adapter
 * Allows integration with external shipping APIs
 */

import type {
  ShippingProvider,
  ShippingAddress,
  ShippingOption,
  ShippingRate,
  ShippingCalculationRequest,
  ShippingCalculationResult,
} from '../types';

/**
 * API provider adapter options
 */
export interface APIProviderAdapterOptions {
  /**
   * Provider name
   */
  name: string;
  
  /**
   * API base URL
   */
  apiBaseUrl: string;
  
  /**
   * API key or authentication token
   */
  apiKey?: string;
  
  /**
   * Custom headers
   */
  headers?: Record<string, string>;
  
  /**
   * Function to transform request to API format
   */
  transformRequest?: (request: ShippingCalculationRequest) => unknown;
  
  /**
   * Function to transform API response to ShippingCalculationResult
   */
  transformResponse?: (response: unknown) => ShippingCalculationResult;
  
  /**
   * Function to validate address via API
   */
  validateAddressApi?: (address: ShippingAddress) => Promise<{
    valid: boolean;
    normalized?: ShippingAddress;
    errors?: Array<{ field: string; message: string }>;
  }>;
  
  /**
   * Available shipping options
   */
  options?: ShippingOption[];
}

/**
 * API provider adapter implementation
 */
export class APIProviderAdapter implements ShippingProvider {
  name: string;
  private options: {
    apiBaseUrl: string;
    apiKey?: string;
    headers?: Record<string, string>;
    transformRequest?: (request: ShippingCalculationRequest) => unknown;
    transformResponse?: (response: unknown) => ShippingCalculationResult;
    validateAddressApi?: (address: ShippingAddress) => Promise<{
      valid: boolean;
      normalized?: ShippingAddress;
      errors?: Array<{ field: string; message: string }>;
    }>;
    options: ShippingOption[];
  };

  constructor(options: APIProviderAdapterOptions) {
    this.name = options.name;
    this.options = {
      apiBaseUrl: options.apiBaseUrl,
      apiKey: options.apiKey,
      headers: options.headers,
      transformRequest: options.transformRequest,
      transformResponse: options.transformResponse,
      validateAddressApi: options.validateAddressApi,
      options: options.options || [],
    };
  }

  /**
   * Calculate shipping rates via API
   */
  async calculateRates(request: ShippingCalculationRequest): Promise<ShippingCalculationResult> {
    try {
      // Transform request if custom transformer provided
      const apiRequest = this.options.transformRequest
        ? this.options.transformRequest(request)
        : this.defaultTransformRequest(request);

      // Build headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...this.options.headers,
      };

      if (this.options.apiKey) {
        headers.Authorization = `Bearer ${this.options.apiKey}`;
      }

      // Make API call
      const response = await fetch(`${this.options.apiBaseUrl}/calculate`, {
        method: 'POST',
        headers,
        body: JSON.stringify(apiRequest),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const apiResponse = await response.json();

      // Transform response if custom transformer provided
      if (this.options.transformResponse) {
        return this.options.transformResponse(apiResponse);
      }

      return this.defaultTransformResponse(apiResponse);
    } catch (error) {
      return {
        rates: [],
        errors: [
          {
            field: 'api',
            message: error instanceof Error ? error.message : 'Failed to calculate shipping rates',
          },
        ],
      };
    }
  }

  /**
   * Validate address via API
   */
  async validateAddress(address: ShippingAddress): Promise<{
    valid: boolean;
    normalized?: ShippingAddress;
    errors?: Array<{ field: string; message: string }>;
  }> {
    if (this.options.validateAddressApi) {
      return this.options.validateAddressApi(address);
    }

    // Default: basic validation
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
   * Default request transformer
   */
  private defaultTransformRequest(request: ShippingCalculationRequest): unknown {
    return {
      address: request.address,
      items: request.items,
      options: request.options,
    };
  }

  /**
   * Default response transformer
   */
  private defaultTransformResponse(response: unknown): ShippingCalculationResult {
    // Try to parse common API response formats
    if (typeof response === 'object' && response !== null) {
      const resp = response as Record<string, unknown>;
      
      if (Array.isArray(resp.rates)) {
        return {
          rates: resp.rates as ShippingRate[],
          errors: resp.errors as ShippingCalculationResult['errors'],
          metadata: resp.metadata as Record<string, unknown>,
        };
      }
    }

    // Fallback: return empty result
    return {
      rates: [],
      errors: [{ field: 'response', message: 'Invalid API response format' }],
    };
  }
}

