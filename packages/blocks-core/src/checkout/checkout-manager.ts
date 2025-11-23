/**
 * Checkout manager - Main API for checkout operations
 */

import type {
  CheckoutSession,
  CheckoutOptions,
  ShippingAddress,
  BillingAddress,
  PaymentMethodDetails,
  PaymentResult,
  CheckoutValidationResult,
} from './types';
import { MercadoPagoAdapter } from './mercado-pago-adapter';
import type { PaymentProcessor } from './types';

/**
 * Checkout manager class
 */
export class CheckoutManager {
  private session: CheckoutSession | null = null;
  private options: Required<Omit<CheckoutOptions, 'mercadoPagoPublicKey' | 'mercadoPagoAccessToken' | 'onStatusChange' | 'onError' | 'metadata' | 'discount' | 'successUrl' | 'failureUrl' | 'pendingUrl' | 'webhookUrl'>> & {
    mercadoPagoPublicKey?: string;
    mercadoPagoAccessToken?: string;
    onStatusChange?: (session: CheckoutSession) => void;
    onError?: (error: Error) => void;
    metadata?: Record<string, unknown>;
    discount?: CheckoutOptions['discount'];
    successUrl?: string;
    failureUrl?: string;
    pendingUrl?: string;
    webhookUrl?: string;
  };
  private paymentProcessor: PaymentProcessor | null = null;

  constructor(options: CheckoutOptions = {}) {
    this.options = {
      currency: options.currency || 'ARS',
      taxRate: options.taxRate ?? 0,
      shippingCost: options.shippingCost ?? 0,
      discount: options.discount,
      mercadoPagoPublicKey: options.mercadoPagoPublicKey,
      mercadoPagoAccessToken: options.mercadoPagoAccessToken,
      onStatusChange: options.onStatusChange,
      onError: options.onError || ((error) => console.error('[CheckoutManager]', error)),
      successUrl: options.successUrl,
      failureUrl: options.failureUrl,
      pendingUrl: options.pendingUrl,
      webhookUrl: options.webhookUrl,
      autoReturn: options.autoReturn || 'approved',
      metadata: options.metadata,
    };

    // Initialize payment processor if Mercado Pago credentials are provided
    if (this.options.mercadoPagoAccessToken) {
      this.paymentProcessor = new MercadoPagoAdapter({
        accessToken: this.options.mercadoPagoAccessToken,
        publicKey: this.options.mercadoPagoPublicKey,
      });
    }
  }

  /**
   * Set custom payment processor
   */
  setPaymentProcessor(processor: PaymentProcessor): void {
    this.paymentProcessor = processor;
  }

  /**
   * Initialize a new checkout session
   */
  initializeSession(
    subtotal: number,
    cartId?: string,
    metadata?: Record<string, unknown>
  ): CheckoutSession {
    const now = Date.now();
    const tax = subtotal * this.options.taxRate;
    const shipping = this.options.shippingCost;
    const discountAmount = this.calculateDiscount(subtotal + tax + shipping);
    const total = subtotal + tax + shipping - discountAmount;

    this.session = {
      id: `checkout_${now}_${Math.random().toString(36).substr(2, 9)}`,
      cartId,
      status: 'pending',
      subtotal,
      tax,
      shipping,
      discount: discountAmount,
      total,
      currency: this.options.currency,
      createdAt: now,
      updatedAt: now,
      metadata: {
        ...this.options.metadata,
        ...metadata,
        successUrl: this.options.successUrl,
        failureUrl: this.options.failureUrl,
        pendingUrl: this.options.pendingUrl,
        webhookUrl: this.options.webhookUrl,
        autoReturn: this.options.autoReturn,
      },
    };

    return this.session;
  }

  /**
   * Get current checkout session
   */
  getSession(): CheckoutSession | null {
    return this.session;
  }

  /**
   * Set shipping address
   */
  setShippingAddress(address: ShippingAddress): CheckoutValidationResult {
    if (!this.session) {
      return { valid: false, errors: [{ field: 'session', message: 'No active checkout session' }] };
    }

    const validation = this.validateAddress(address);
    if (!validation.valid) {
      return validation;
    }

    this.session.shippingAddress = address;
    this.session.updatedAt = Date.now();
    this.notifyStatusChange();

    return { valid: true, errors: [] };
  }

  /**
   * Set billing address
   */
  setBillingAddress(address: BillingAddress): CheckoutValidationResult {
    if (!this.session) {
      return { valid: false, errors: [{ field: 'session', message: 'No active checkout session' }] };
    }

    const validation = this.validateAddress(address);
    if (!validation.valid) {
      return validation;
    }

    this.session.billingAddress = address;
    this.session.updatedAt = Date.now();
    this.notifyStatusChange();

    return { valid: true, errors: [] };
  }

  /**
   * Set payment method
   */
  setPaymentMethod(method: PaymentMethodDetails): void {
    if (!this.session) {
      throw new Error('No active checkout session');
    }

    this.session.paymentMethod = method;
    this.session.updatedAt = Date.now();
    this.notifyStatusChange();
  }

  /**
   * Update totals (e.g., when shipping cost changes)
   */
  updateTotals(subtotal: number, shipping?: number, taxRate?: number): void {
    if (!this.session) {
      throw new Error('No active checkout session');
    }

    this.session.subtotal = subtotal;
    
    if (taxRate !== undefined) {
      this.options.taxRate = taxRate;
    }
    
    if (shipping !== undefined) {
      this.session.shipping = shipping;
      this.options.shippingCost = shipping;
    }

    const tax = this.session.subtotal * this.options.taxRate;
    const discountAmount = this.calculateDiscount(this.session.subtotal + tax + this.session.shipping);
    const total = this.session.subtotal + tax + this.session.shipping - discountAmount;

    this.session.tax = tax;
    this.session.discount = discountAmount;
    this.session.total = total;
    this.session.updatedAt = Date.now();
    this.notifyStatusChange();
  }

  /**
   * Create payment preference (for Mercado Pago)
   */
  async createPayment(): Promise<{ id: string; initPoint?: string; [key: string]: unknown }> {
    if (!this.session) {
      throw new Error('No active checkout session');
    }

    if (!this.paymentProcessor) {
      throw new Error('Payment processor not configured');
    }

    const validation = this.validateCheckout();
    if (!validation.valid) {
      throw new Error(`Checkout validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    try {
      this.session.status = 'processing';
      this.session.updatedAt = Date.now();
      this.notifyStatusChange();

      const result = await this.paymentProcessor.createPayment(this.session);
      
      // Store payment preference ID in metadata
      if (this.session.metadata) {
        this.session.metadata.paymentPreferenceId = result.id;
      }

      return result;
    } catch (error) {
      this.session.status = 'failed';
      this.session.failureReason = error instanceof Error ? error.message : 'Unknown error';
      this.session.updatedAt = Date.now();
      this.notifyStatusChange();
      
      this.options.onError?.(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Process payment
   */
  async processPayment(paymentId: string): Promise<PaymentResult> {
    if (!this.session) {
      throw new Error('No active checkout session');
    }

    if (!this.paymentProcessor) {
      throw new Error('Payment processor not configured');
    }

    try {
      this.session.status = 'processing';
      this.session.updatedAt = Date.now();
      this.notifyStatusChange();

      const result = await this.paymentProcessor.processPayment(paymentId, this.session);
      
      this.session.status = result.status;
      if (result.success) {
        this.session.completedAt = Date.now();
      } else {
        this.session.failureReason = result.message;
      }
      this.session.updatedAt = Date.now();
      this.notifyStatusChange();

      return result;
    } catch (error) {
      this.session.status = 'failed';
      this.session.failureReason = error instanceof Error ? error.message : 'Unknown error';
      this.session.updatedAt = Date.now();
      this.notifyStatusChange();
      
      this.options.onError?.(error instanceof Error ? error : new Error(String(error)));
      
      return {
        success: false,
        paymentId,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(paymentId: string): Promise<PaymentResult> {
    if (!this.paymentProcessor) {
      throw new Error('Payment processor not configured');
    }

    try {
      const result = await this.paymentProcessor.verifyPayment(paymentId);
      
      if (this.session) {
        this.session.status = result.status;
        if (result.success) {
          this.session.completedAt = Date.now();
        }
        this.session.updatedAt = Date.now();
        this.notifyStatusChange();
      }

      return result;
    } catch (error) {
      this.options.onError?.(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Handle webhook notification
   */
  async handleWebhook(payload: unknown): Promise<PaymentResult> {
    if (!this.paymentProcessor) {
      throw new Error('Payment processor not configured');
    }

    try {
      const result = await this.paymentProcessor.handleWebhook(payload);
      
      if (this.session) {
        this.session.status = result.status;
        if (result.success) {
          this.session.completedAt = Date.now();
        }
        this.session.updatedAt = Date.now();
        this.notifyStatusChange();
      }

      return result;
    } catch (error) {
      this.options.onError?.(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Cancel checkout session
   */
  cancel(): void {
    if (!this.session) {
      return;
    }

    this.session.status = 'cancelled';
    this.session.updatedAt = Date.now();
    this.notifyStatusChange();
  }

  /**
   * Reset checkout session
   */
  reset(): void {
    this.session = null;
  }

  /**
   * Validate checkout before payment
   */
  validateCheckout(): CheckoutValidationResult {
    const errors: Array<{ field: string; message: string }> = [];

    if (!this.session) {
      return { valid: false, errors: [{ field: 'session', message: 'No active checkout session' }] };
    }

    if (!this.session.shippingAddress) {
      errors.push({ field: 'shippingAddress', message: 'Shipping address is required' });
    } else {
      const addressValidation = this.validateAddress(this.session.shippingAddress);
      if (!addressValidation.valid) {
        errors.push(...addressValidation.errors);
      }
    }

    if (!this.session.paymentMethod) {
      errors.push({ field: 'paymentMethod', message: 'Payment method is required' });
    }

    if (this.session.total <= 0) {
      errors.push({ field: 'total', message: 'Total must be greater than zero' });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate address
   */
  private validateAddress(address: ShippingAddress | BillingAddress): CheckoutValidationResult {
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

    if (!address.recipientName || address.recipientName.trim().length === 0) {
      errors.push({ field: 'recipientName', message: 'Recipient name is required' });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate discount
   */
  private calculateDiscount(amount: number): number {
    if (!this.options.discount) {
      return 0;
    }

    if (this.options.discount.type === 'amount') {
      return Math.min(this.options.discount.value, amount);
    }

    // Percentage
    return amount * (this.options.discount.value / 100);
  }

  /**
   * Notify status change
   */
  private notifyStatusChange(): void {
    if (this.session && this.options.onStatusChange) {
      this.options.onStatusChange(this.session);
    }
  }
}

/**
 * Create a checkout manager instance
 */
export function createCheckoutManager(options?: CheckoutOptions): CheckoutManager {
  return new CheckoutManager(options);
}





