/**
 * Shipping module types
 */

/**
 * Shipping address
 */
export interface ShippingAddress {
  street: string;
  streetNumber?: string;
  apartment?: string;
  city: string;
  state?: string;
  province?: string;
  postalCode: string;
  country: string;
  recipientName: string;
  phone?: string;
  email?: string;
  notes?: string;
}

/**
 * Shipping option type
 */
export type ShippingOptionType = 'standard' | 'express' | 'economy' | 'overnight' | 'pickup';

/**
 * Shipping option
 */
export interface ShippingOption {
  id: string;
  name: string;
  type: ShippingOptionType;
  estimatedDays?: {
    min: number;
    max: number;
  };
  description?: string;
}

/**
 * Shipping rate
 */
export interface ShippingRate {
  option: ShippingOption;
  cost: number;
  currency: string;
  estimatedDays?: {
    min: number;
    max: number;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Shipping calculation request
 */
export interface ShippingCalculationRequest {
  address: ShippingAddress;
  items: Array<{
    weight?: number; // in kg
    dimensions?: {
      length?: number; // in cm
      width?: number;
      height?: number;
    };
    quantity: number;
    value?: number; // for insurance
  }>;
  options?: ShippingOptionType[];
}

/**
 * Shipping calculation result
 */
export interface ShippingCalculationResult {
  rates: ShippingRate[];
  errors?: Array<{
    field: string;
    message: string;
  }>;
  metadata?: Record<string, unknown>;
}

/**
 * Shipping provider interface
 */
export interface ShippingProvider {
  /**
   * Provider name
   */
  name: string;
  
  /**
   * Calculate shipping rates
   */
  calculateRates(request: ShippingCalculationRequest): Promise<ShippingCalculationResult>;
  
  /**
   * Validate address
   */
  validateAddress(address: ShippingAddress): Promise<{
    valid: boolean;
    normalized?: ShippingAddress;
    errors?: Array<{ field: string; message: string }>;
  }>;
  
  /**
   * Get available shipping options
   */
  getAvailableOptions(): ShippingOption[];
}

/**
 * Shipping manager options
 */
export interface ShippingManagerOptions {
  /**
   * Default shipping provider
   */
  defaultProvider?: ShippingProvider;
  
  /**
   * Additional providers (for fallback or comparison)
   */
  providers?: ShippingProvider[];
  
  /**
   * Default currency
   */
  currency?: string;
  
  /**
   * Enable address validation
   */
  enableValidation?: boolean;
  
  /**
   * On error callback
   */
  onError?: (error: Error) => void;
}

/**
 * LATAM country codes
 */
export type LATAMCountry = 
  | 'AR' // Argentina
  | 'BR' // Brazil
  | 'CL' // Chile
  | 'CO' // Colombia
  | 'MX' // Mexico
  | 'PE' // Peru
  | 'UY' // Uruguay
  | 'VE'; // Venezuela

/**
 * Shipping zone configuration
 */
export interface ShippingZone {
  country: LATAMCountry | string;
  regions?: string[]; // States, provinces, etc.
  postalCodeRanges?: Array<{
    from: string;
    to: string;
  }>;
  rates: Array<{
    weightRange?: {
      min: number;
      max: number;
    };
    cost: number;
    type: ShippingOptionType;
  }>;
}





