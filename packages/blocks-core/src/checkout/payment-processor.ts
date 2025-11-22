/**
 * Generic payment processor interface
 * Can be extended for different payment gateways
 */

import type { CheckoutSession, PaymentResult, PaymentProcessor } from './types';

/**
 * Base payment processor implementation
 * Provides default behavior that can be overridden
 */
export abstract class BasePaymentProcessor implements PaymentProcessor {
  /**
   * Create a payment preference/order
   */
  abstract createPayment(session: CheckoutSession): Promise<{ id: string; initPoint?: string; [key: string]: unknown }>;

  /**
   * Process a payment
   */
  abstract processPayment(paymentId: string, session: CheckoutSession): Promise<PaymentResult>;

  /**
   * Verify payment status
   */
  abstract verifyPayment(paymentId: string): Promise<PaymentResult>;

  /**
   * Handle webhook notification
   */
  abstract handleWebhook(payload: unknown): Promise<PaymentResult>;

  /**
   * Validate payment data before processing
   */
  protected validatePayment(session: CheckoutSession): { valid: boolean; error?: string } {
    if (!session.total || session.total <= 0) {
      return { valid: false, error: 'Invalid total amount' };
    }

    if (!session.currency) {
      return { valid: false, error: 'Currency is required' };
    }

    if (!session.paymentMethod) {
      return { valid: false, error: 'Payment method is required' };
    }

    return { valid: true };
  }

  /**
   * Create a payment result
   */
  protected createPaymentResult(
    success: boolean,
    paymentId: string,
    status: CheckoutSession['status'],
    message?: string,
    data?: Record<string, unknown>
  ): PaymentResult {
    return {
      success,
      paymentId,
      status,
      message,
      data,
    };
  }
}

