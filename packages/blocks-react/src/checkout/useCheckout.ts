/**
 * React hook for checkout management
 */

import { useState, useEffect, useCallback } from 'react';
import { createCheckoutManager } from '@vk/blocks-core';
import type {
  CheckoutSession,
  CheckoutOptions,
  ShippingAddress,
  BillingAddress,
  PaymentMethodDetails,
  PaymentResult,
} from '@vk/blocks-core';

/**
 * Checkout hook return type
 */
export interface UseCheckoutReturn {
  /**
   * Current checkout session
   */
  session: CheckoutSession | null;
  
  /**
   * Checkout status
   */
  status: CheckoutSession['status'] | null;
  
  /**
   * Initialize checkout session
   */
  initializeSession: (subtotal: number, cartId?: string, metadata?: Record<string, unknown>) => void;
  
  /**
   * Set shipping address
   */
  setShippingAddress: (address: ShippingAddress) => { valid: boolean; errors: Array<{ field: string; message: string }> };
  
  /**
   * Set billing address
   */
  setBillingAddress: (address: BillingAddress) => { valid: boolean; errors: Array<{ field: string; message: string }> };
  
  /**
   * Set payment method
   */
  setPaymentMethod: (method: PaymentMethodDetails) => void;
  
  /**
   * Update totals
   */
  updateTotals: (subtotal: number, shipping?: number, taxRate?: number) => void;
  
  /**
   * Create payment preference
   */
  createPayment: () => Promise<{ id: string; initPoint?: string; [key: string]: unknown }>;
  
  /**
   * Process payment
   */
  processPayment: (paymentId: string) => Promise<PaymentResult>;
  
  /**
   * Verify payment
   */
  verifyPayment: (paymentId: string) => Promise<PaymentResult>;
  
  /**
   * Cancel checkout
   */
  cancel: () => void;
  
  /**
   * Reset checkout
   */
  reset: () => void;
  
  /**
   * Validate checkout
   */
  validate: () => { valid: boolean; errors: Array<{ field: string; message: string }> };
  
  /**
   * Loading state
   */
  loading: boolean;
  
  /**
   * Error state
   */
  error: Error | null;
}

/**
 * React hook for checkout
 */
export function useCheckout(options?: CheckoutOptions): UseCheckoutReturn {
  const [manager] = useState(() => createCheckoutManager(options));
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to session changes
  useEffect(() => {
    const unsubscribe = manager.getSession()
      ? () => {}
      : () => {
          // Setup status change listener if not already done
          const originalOnStatusChange = options?.onStatusChange;
          if (originalOnStatusChange) {
            // Manager already has the callback, just update state
          }
        };

    // Initial state
    setSession(manager.getSession());

    return unsubscribe;
  }, [manager, options]);

  // Setup status change callback
  useEffect(() => {
    const originalOnStatusChange = options?.onStatusChange;
    if (originalOnStatusChange) {
      const unsubscribe = manager.subscribe((updatedSession) => {
        setSession(updatedSession);
        originalOnStatusChange(updatedSession);
      });
      return unsubscribe;
    }

    // Recreate manager with enhanced callback
    // Note: In a real implementation, you might want to update the manager's callback
    // For now, we'll rely on the session state updates
  }, [options]);

  const initializeSession = useCallback(
    (subtotal: number, cartId?: string, metadata?: Record<string, unknown>) => {
      try {
        const newSession = manager.initializeSession(subtotal, cartId, metadata);
        setSession(newSession);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [manager]
  );

  const setShippingAddress = useCallback(
    (address: ShippingAddress) => {
      try {
        const result = manager.setShippingAddress(address);
        setSession(manager.getSession());
        setError(null);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return { valid: false, errors: [{ field: 'general', message: error.message }] };
      }
    },
    [manager]
  );

  const setBillingAddress = useCallback(
    (address: BillingAddress) => {
      try {
        const result = manager.setBillingAddress(address);
        setSession(manager.getSession());
        setError(null);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return { valid: false, errors: [{ field: 'general', message: error.message }] };
      }
    },
    [manager]
  );

  const setPaymentMethod = useCallback(
    (method: PaymentMethodDetails) => {
      try {
        manager.setPaymentMethod(method);
        setSession(manager.getSession());
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [manager]
  );

  const updateTotals = useCallback(
    (subtotal: number, shipping?: number, taxRate?: number) => {
      try {
        manager.updateTotals(subtotal, shipping, taxRate);
        setSession(manager.getSession());
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [manager]
  );

  const createPayment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await manager.createPayment();
      setSession(manager.getSession());
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [manager]);

  const processPayment = useCallback(
    async (paymentId: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await manager.processPayment(paymentId);
        setSession(manager.getSession());
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

  const verifyPayment = useCallback(
    async (paymentId: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await manager.verifyPayment(paymentId);
        setSession(manager.getSession());
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

  const cancel = useCallback(() => {
    try {
      manager.cancel();
      setSession(manager.getSession());
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    }
  }, [manager]);

  const reset = useCallback(() => {
    manager.reset();
    setSession(null);
    setError(null);
  }, [manager]);

  const validate = useCallback(() => {
    try {
      return manager.validateCheckout();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return { valid: false, errors: [{ field: 'general', message: error.message }] };
    }
  }, [manager]);

  return {
    session,
    status: session?.status || null,
    initializeSession,
    setShippingAddress,
    setBillingAddress,
    setPaymentMethod,
    updateTotals,
    createPayment,
    processPayment,
    verifyPayment,
    cancel,
    reset,
    validate,
    loading,
    error,
  };
}

