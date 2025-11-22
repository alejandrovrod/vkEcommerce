/**
 * Checkout module types
 */

/**
 * Payment method types
 */
export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'digital_wallet' | 'mercado_pago';

/**
 * Checkout session status
 */
export type CheckoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

// Import ShippingAddress from shipping module
import type { ShippingAddress } from '../shipping/types';

/**
 * Billing address (can be same as shipping)
 */
export interface BillingAddress extends ShippingAddress {
  taxId?: string; // CUIT, RUT, etc. for LATAM
}

// Re-export for convenience
export type { ShippingAddress };

/**
 * Payment method details
 */
export interface PaymentMethodDetails {
  method: PaymentMethod;
  installments?: number;
  issuer?: string;
  cardToken?: string;
  payerId?: string;
}

/**
 * Checkout session
 */
export interface CheckoutSession {
  id: string;
  cartId?: string;
  status: CheckoutStatus;
  shippingAddress?: ShippingAddress;
  billingAddress?: BillingAddress;
  paymentMethod?: PaymentMethodDetails;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  currency: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  failureReason?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Mercado Pago preference data
 */
export interface MercadoPagoPreference {
  items: Array<{
    id: string;
    title: string;
    description?: string;
    quantity: number;
    unit_price: number;
    currency_id?: string;
  }>;
  payer?: {
    name?: string;
    surname?: string;
    email?: string;
    phone?: {
      area_code?: string;
      number?: string;
    };
    address?: {
      street_name?: string;
      street_number?: number;
      zip_code?: string;
    };
    identification?: {
      type?: string;
      number?: string;
    };
  };
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  auto_return?: 'approved' | 'all';
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>;
    excluded_payment_types?: Array<{ id: string }>;
    installments?: number;
  };
  statement_descriptor?: string;
  external_reference?: string;
  notification_url?: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
}

/**
 * Mercado Pago payment response
 */
export interface MercadoPagoPaymentResponse {
  id: string;
  status: string;
  status_detail: string;
  transaction_amount: number;
  currency_id: string;
  payment_method_id: string;
  payment_type_id: string;
  date_created: string;
  date_approved?: string;
  payer: {
    id: string;
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  external_reference?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Webhook payload from Mercado Pago
 */
export interface MercadoPagoWebhookPayload {
  action: string;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: string;
  user_id: string;
}

/**
 * Checkout options
 */
export interface CheckoutOptions {
  /**
   * Currency code (ISO 4217)
   */
  currency?: string;
  
  /**
   * Tax rate (0-1, e.g., 0.21 for 21%)
   */
  taxRate?: number;
  
  /**
   * Shipping cost (can be calculated separately)
   */
  shippingCost?: number;
  
  /**
   * Discount amount or percentage
   */
  discount?: {
    type: 'amount' | 'percentage';
    value: number;
    code?: string;
  };
  
  /**
   * Mercado Pago public key (for frontend SDK)
   */
  mercadoPagoPublicKey?: string;
  
  /**
   * Mercado Pago access token (for backend API calls)
   */
  mercadoPagoAccessToken?: string;
  
  /**
   * Callback for when checkout status changes
   */
  onStatusChange?: (session: CheckoutSession) => void;
  
  /**
   * Callback for errors
   */
  onError?: (error: Error) => void;
  
  /**
   * Success URL (for redirect after payment)
   */
  successUrl?: string;
  
  /**
   * Failure URL (for redirect after failed payment)
   */
  failureUrl?: string;
  
  /**
   * Pending URL (for redirect after pending payment)
   */
  pendingUrl?: string;
  
  /**
   * Webhook URL for payment notifications
   */
  webhookUrl?: string;
  
  /**
   * Auto return after payment (Mercado Pago)
   */
  autoReturn?: 'approved' | 'all';
  
  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Payment processor interface (extensible for other gateways)
 */
export interface PaymentProcessor {
  /**
   * Create a payment preference/order
   */
  createPayment(session: CheckoutSession): Promise<{ id: string; initPoint?: string; [key: string]: unknown }>;
  
  /**
   * Process a payment
   */
  processPayment(paymentId: string, session: CheckoutSession): Promise<PaymentResult>;
  
  /**
   * Verify payment status
   */
  verifyPayment(paymentId: string): Promise<PaymentResult>;
  
  /**
   * Handle webhook notification
   */
  handleWebhook(payload: unknown): Promise<PaymentResult>;
}

/**
 * Payment result
 */
export interface PaymentResult {
  success: boolean;
  paymentId: string;
  status: CheckoutStatus;
  message?: string;
  data?: Record<string, unknown>;
}

/**
 * Checkout validation result
 */
export interface CheckoutValidationResult {
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
}

