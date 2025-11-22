/**
 * Angular service for checkout management using Signals
 */

import { Injectable, signal, computed } from '@angular/core';
import { CheckoutManager, createCheckoutManager } from '@vk/blocks-core';
import type {
  CheckoutSession,
  CheckoutOptions,
  ShippingAddress,
  BillingAddress,
  PaymentMethodDetails,
  PaymentResult,
} from '@vk/blocks-core';

/**
 * Angular service for checkout
 */
@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private manager: CheckoutManager;
  private sessionSignal = signal<CheckoutSession | null>(null);
  private loadingSignal = signal(false);
  private errorSignal = signal<Error | null>(null);

  // Public readonly signals
  readonly session = this.sessionSignal.asReadonly();
  readonly status = computed(() => this.sessionSignal()?.status || null);
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    // Initialize with default options - can be configured via initialize() if needed
    this.manager = createCheckoutManager({
      onStatusChange: (session) => {
        this.sessionSignal.set(session);
      },
    });
    this.sessionSignal.set(this.manager.getSession());
  }

  /**
   * Initialize checkout session
   */
  initializeSession(subtotal: number, cartId?: string, metadata?: Record<string, unknown>): void {
    try {
      const session = this.manager.initializeSession(subtotal, cartId, metadata);
      this.sessionSignal.set(session);
      this.errorSignal.set(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      throw err;
    }
  }

  /**
   * Set shipping address
   */
  setShippingAddress(address: ShippingAddress): { valid: boolean; errors: Array<{ field: string; message: string }> } {
    try {
      const result = this.manager.setShippingAddress(address);
      this.sessionSignal.set(this.manager.getSession());
      this.errorSignal.set(null);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      return { valid: false, errors: [{ field: 'general', message: err.message }] };
    }
  }

  /**
   * Set billing address
   */
  setBillingAddress(address: BillingAddress): { valid: boolean; errors: Array<{ field: string; message: string }> } {
    try {
      const result = this.manager.setBillingAddress(address);
      this.sessionSignal.set(this.manager.getSession());
      this.errorSignal.set(null);
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      return { valid: false, errors: [{ field: 'general', message: err.message }] };
    }
  }

  /**
   * Set payment method
   */
  setPaymentMethod(method: PaymentMethodDetails): void {
    try {
      this.manager.setPaymentMethod(method);
      this.sessionSignal.set(this.manager.getSession());
      this.errorSignal.set(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      throw err;
    }
  }

  /**
   * Update totals
   */
  updateTotals(subtotal: number, shipping?: number, taxRate?: number): void {
    try {
      this.manager.updateTotals(subtotal, shipping, taxRate);
      this.sessionSignal.set(this.manager.getSession());
      this.errorSignal.set(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      throw err;
    }
  }

  /**
   * Create payment preference
   */
  async createPayment(): Promise<{ id: string; initPoint?: string; [key: string]: unknown }> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const result = await this.manager.createPayment();
      this.sessionSignal.set(this.manager.getSession());
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
   * Process payment
   */
  async processPayment(paymentId: string): Promise<PaymentResult> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const result = await this.manager.processPayment(paymentId);
      this.sessionSignal.set(this.manager.getSession());
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
   * Verify payment
   */
  async verifyPayment(paymentId: string): Promise<PaymentResult> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const result = await this.manager.verifyPayment(paymentId);
      this.sessionSignal.set(this.manager.getSession());
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
   * Cancel checkout
   */
  cancel(): void {
    try {
      this.manager.cancel();
      this.sessionSignal.set(this.manager.getSession());
      this.errorSignal.set(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
    }
  }

  /**
   * Reset checkout
   */
  reset(): void {
    this.manager.reset();
    this.sessionSignal.set(null);
    this.errorSignal.set(null);
  }

  /**
   * Validate checkout
   */
  validateCheckout(): { valid: boolean; errors: Array<{ field: string; message: string }> } {
    try {
      return this.manager.validateCheckout();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      return { valid: false, errors: [{ field: 'general', message: err.message }] };
    }
  }
}

