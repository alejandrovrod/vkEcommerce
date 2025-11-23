/**
 * API storage implementation for cart persistence
 * Allows persisting cart to server via API
 */

import type { CartState } from './types';
import type { CartStorage } from './storage';

/**
 * API storage options
 */
export interface APIStorageOptions {
  /**
   * API endpoint URL for saving cart
   */
  saveUrl: string;
  
  /**
   * API endpoint URL for loading cart
   */
  loadUrl?: string;
  
  /**
   * API endpoint URL for clearing cart
   */
  clearUrl?: string;
  
  /**
   * HTTP method for save (default: POST)
   */
  saveMethod?: 'POST' | 'PUT' | 'PATCH';
  
  /**
   * HTTP method for load (default: GET)
   */
  loadMethod?: 'GET' | 'POST';
  
  /**
   * HTTP method for clear (default: DELETE)
   */
  clearMethod?: 'DELETE' | 'POST';
  
  /**
   * Headers to include in requests
   */
  headers?: Record<string, string>;
  
  /**
   * Function to get authentication token (e.g., from auth context)
   */
  getAuthToken?: () => string | null | Promise<string | null>;
  
  /**
   * Function to transform state before saving
   */
  transformSave?: (state: CartState) => unknown;
  
  /**
   * Function to transform response when loading
   */
  transformLoad?: (response: unknown) => CartState | null;
  
  /**
   * Enable local cache (fallback to localStorage)
   */
  enableCache?: boolean;
  
  /**
   * Cache key for localStorage fallback
   */
  cacheKey?: string;
  
  /**
   * On error callback
   */
  onError?: (error: Error) => void;
}

/**
 * API storage implementation
 * Persists cart state to server via API calls
 */
export class APICartStorage implements CartStorage {
  private options: Required<Omit<APIStorageOptions, 'getAuthToken' | 'transformSave' | 'transformLoad' | 'onError'>> & {
    getAuthToken?: () => string | null | Promise<string | null>;
    transformSave?: (state: CartState) => unknown;
    transformLoad?: (response: unknown) => CartState | null;
    onError?: (error: Error) => void;
  };
  private cache: CartState | null = null;

  constructor(options: APIStorageOptions) {
    this.options = {
      saveUrl: options.saveUrl,
      loadUrl: options.loadUrl || options.saveUrl,
      clearUrl: options.clearUrl || options.saveUrl,
      saveMethod: options.saveMethod || 'POST',
      loadMethod: options.loadMethod || 'GET',
      clearMethod: options.clearMethod || 'DELETE',
      headers: options.headers || {},
      getAuthToken: options.getAuthToken,
      transformSave: options.transformSave,
      transformLoad: options.transformLoad,
      enableCache: options.enableCache ?? true,
      cacheKey: options.cacheKey || 'vkecomblocks-cart-api-cache',
      onError: options.onError,
    };
  }

  /**
   * Save cart state to API
   */
  save(state: CartState): void {
    // Save to cache immediately for fast access
    if (this.options.enableCache) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(this.options.cacheKey, JSON.stringify(state));
        }
      } catch (error) {
        // Ignore cache errors
      }
    }

    // Save to API asynchronously (fire and forget)
    this.saveAsync(state).catch((error) => {
      this.options.onError?.(
        error instanceof Error ? error : new Error('Failed to save cart to API')
      );
    });
  }

  /**
   * Save cart state to API (async)
   */
  async saveAsync(state: CartState): Promise<void> {
    try {
      const body = this.options.transformSave ? this.options.transformSave(state) : state;
      const headers = await this.buildHeaders();
      
      const response = await fetch(this.options.saveUrl, {
        method: this.options.saveMethod,
        headers: {
          'Content-Type': 'application/json',
          ...this.options.headers,
          ...headers,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`API save failed: ${response.statusText}`);
      }

      // Update cache with response if available
      const responseData = await response.json();
      if (responseData && this.options.enableCache) {
        const transformed = this.options.transformLoad
          ? this.options.transformLoad(responseData)
          : (responseData as CartState);
        if (transformed) {
          this.cache = transformed;
        }
      }
    } catch (error) {
      this.options.onError?.(
        error instanceof Error ? error : new Error('Failed to save cart to API')
      );
      throw error;
    }
  }

  /**
   * Load cart state from API
   */
  load(): CartState | null {
    // Return cache if available (for synchronous access)
    if (this.cache) {
      return this.cache;
    }

    // Try to load from localStorage cache
    if (this.options.enableCache && typeof window !== 'undefined' && window.localStorage) {
      try {
        const cached = window.localStorage.getItem(this.options.cacheKey);
        if (cached) {
          const state = JSON.parse(cached) as CartState;
          this.cache = state;
          return state;
        }
      } catch (error) {
        // Ignore cache errors
      }
    }

    // Return null for synchronous load (API is async)
    // Use loadAsync for actual API loading
    return null;
  }

  /**
   * Load cart state from API (async)
   */
  async loadAsync(): Promise<CartState | null> {
    try {
      const headers = await this.buildHeaders();
      const url = this.options.loadMethod === 'GET' 
        ? this.options.loadUrl 
        : this.options.loadUrl;

      const response = await fetch(url, {
        method: this.options.loadMethod,
        headers: {
          'Content-Type': 'application/json',
          ...this.options.headers,
          ...headers,
        },
        ...(this.options.loadMethod !== 'GET' ? {
          body: JSON.stringify({}),
        } : {}),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No cart found, return empty state
          return null;
        }
        throw new Error(`API load failed: ${response.statusText}`);
      }

      const data = await response.json();
      const state = this.options.transformLoad
        ? this.options.transformLoad(data)
        : (data as CartState);

      if (state) {
        this.cache = state;
        
        // Update cache
        if (this.options.enableCache && typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.setItem(this.options.cacheKey, JSON.stringify(state));
          } catch (error) {
            // Ignore cache errors
          }
        }
      }

      return state;
    } catch (error) {
      this.options.onError?.(
        error instanceof Error ? error : new Error('Failed to load cart from API')
      );
      return null;
    }
  }

  /**
   * Clear cart from API
   */
  clear(): void {
    // Clear cache
    this.cache = null;
    if (this.options.enableCache && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(this.options.cacheKey);
      } catch (error) {
        // Ignore cache errors
      }
    }

    // Clear from API asynchronously
    this.clearAsync().catch((error) => {
      this.options.onError?.(
        error instanceof Error ? error : new Error('Failed to clear cart from API')
      );
    });
  }

  /**
   * Clear cart from API (async)
   */
  async clearAsync(): Promise<void> {
    try {
      const headers = await this.buildHeaders();
      
      const response = await fetch(this.options.clearUrl, {
        method: this.options.clearMethod,
        headers: {
          'Content-Type': 'application/json',
          ...this.options.headers,
          ...headers,
        },
      });

      if (!response.ok && response.status !== 404) {
        throw new Error(`API clear failed: ${response.statusText}`);
      }
    } catch (error) {
      this.options.onError?.(
        error instanceof Error ? error : new Error('Failed to clear cart from API')
      );
      throw error;
    }
  }

  /**
   * Build headers with authentication
   */
  private async buildHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    if (this.options.getAuthToken) {
      const token = await this.options.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }
}





