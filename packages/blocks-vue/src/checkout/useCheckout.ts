/**
 * Vue composable for checkout management
 */

import { ref, computed } from 'vue';
import { createCheckoutManager } from '@alejandrovrod/blocks-core';
import type {
  CheckoutSession,
  CheckoutOptions,
  ShippingAddress,
  BillingAddress,
  PaymentMethodDetails,
  PaymentResult,
} from '@alejandrovrod/blocks-core';

/**
 * Use checkout composable return type
 */
export interface UseCheckoutReturn {
  /**
   * Current checkout session
   */
  session: Readonly<import('vue').Ref<CheckoutSession | null>>;
  
  /**
   * Checkout status
   */
  status: Readonly<import('vue').ComputedRef<CheckoutSession['status'] | null>>;
  
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
  loading: Readonly<import('vue').Ref<boolean>>;
  
  /**
   * Error state
   */
  error: Readonly<import('vue').Ref<Error | null>>;
}

/**
 * Vue composable for checkout
 */
export function useCheckout(options?: CheckoutOptions): UseCheckoutReturn {
  const manager = createCheckoutManager(options);
  const session = ref<CheckoutSession | null>(manager.getSession());
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Subscribe to status changes
  const statusChangeCallback = (updatedSession: CheckoutSession) => {
    session.value = updatedSession;
    if (options?.onStatusChange) {
      options.onStatusChange(updatedSession);
    }
  };

  // Setup status change callback
  const enhancedOptions: CheckoutOptions = {
    ...options,
    onStatusChange: statusChangeCallback,
  };

  // Recreate manager with enhanced callback
  const finalManager = createCheckoutManager(enhancedOptions);
  session.value = finalManager.getSession();

  const status = computed(() => session.value?.status || null);

  const initializeSession = (subtotal: number, cartId?: string, metadata?: Record<string, unknown>) => {
    try {
      const newSession = finalManager.initializeSession(subtotal, cartId, metadata);
      session.value = newSession;
      error.value = null;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      throw errObj;
    }
  };

  const setShippingAddress = (address: ShippingAddress) => {
    try {
      const result = finalManager.setShippingAddress(address);
      session.value = finalManager.getSession();
      error.value = null;
      return result;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      return { valid: false, errors: [{ field: 'general', message: errObj.message }] };
    }
  };

  const setBillingAddress = (address: BillingAddress) => {
    try {
      const result = finalManager.setBillingAddress(address);
      session.value = finalManager.getSession();
      error.value = null;
      return result;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      return { valid: false, errors: [{ field: 'general', message: errObj.message }] };
    }
  };

  const setPaymentMethod = (method: PaymentMethodDetails) => {
    try {
      finalManager.setPaymentMethod(method);
      session.value = finalManager.getSession();
      error.value = null;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      throw errObj;
    }
  };

  const updateTotals = (subtotal: number, shipping?: number, taxRate?: number) => {
    try {
      finalManager.updateTotals(subtotal, shipping, taxRate);
      session.value = finalManager.getSession();
      error.value = null;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      throw errObj;
    }
  };

  const createPayment = async () => {
    loading.value = true;
    error.value = null;
    try {
      const result = await finalManager.createPayment();
      session.value = finalManager.getSession();
      return result;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      throw errObj;
    } finally {
      loading.value = false;
    }
  };

  const processPayment = async (paymentId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await finalManager.processPayment(paymentId);
      session.value = finalManager.getSession();
      return result;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      throw errObj;
    } finally {
      loading.value = false;
    }
  };

  const verifyPayment = async (paymentId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await finalManager.verifyPayment(paymentId);
      session.value = finalManager.getSession();
      return result;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      throw errObj;
    } finally {
      loading.value = false;
    }
  };

  const cancel = () => {
    try {
      finalManager.cancel();
      session.value = finalManager.getSession();
      error.value = null;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
    }
  };

  const reset = () => {
    finalManager.reset();
    session.value = null;
    error.value = null;
  };

  const validate = () => {
    try {
      return finalManager.validateCheckout();
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      return { valid: false, errors: [{ field: 'general', message: errObj.message }] };
    }
  };

  return {
    session: readonly(session),
    status,
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
    loading: readonly(loading),
    error: readonly(error),
  };
}

// Import readonly
import { readonly } from 'vue';


