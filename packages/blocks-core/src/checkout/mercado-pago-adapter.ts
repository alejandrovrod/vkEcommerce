/**
 * Mercado Pago adapter for payment processing
 * Handles Mercado Pago SDK integration and API calls
 */

import { BasePaymentProcessor } from './payment-processor';
import type {
  CheckoutSession,
  PaymentResult,
  MercadoPagoPreference,
  MercadoPagoPaymentResponse,
  MercadoPagoWebhookPayload,
} from './types';

/**
 * Mercado Pago adapter options
 */
export interface MercadoPagoAdapterOptions {
  /**
   * Public key for frontend SDK
   */
  publicKey?: string;
  
  /**
   * Access token for backend API calls
   */
  accessToken?: string;
  
  /**
   * API base URL (default: https://api.mercadopago.com)
   */
  apiBaseUrl?: string;
  
  /**
   * Locale (default: es-AR)
   */
  locale?: string;
}

/**
 * Mercado Pago payment processor adapter
 */
export class MercadoPagoAdapter extends BasePaymentProcessor {
  private options: Required<Omit<MercadoPagoAdapterOptions, 'publicKey' | 'accessToken'>> & {
    publicKey?: string;
    accessToken?: string;
  };

  constructor(options: MercadoPagoAdapterOptions = {}) {
    super();
    this.options = {
      publicKey: options.publicKey,
      accessToken: options.accessToken,
      apiBaseUrl: options.apiBaseUrl || 'https://api.mercadopago.com',
      locale: options.locale || 'es-AR',
    };
  }

  /**
   * Create a Mercado Pago preference
   */
  async createPayment(session: CheckoutSession): Promise<{ id: string; initPoint?: string; [key: string]: unknown }> {
    const validation = this.validatePayment(session);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid payment data');
    }

    if (!this.options.accessToken) {
      throw new Error('Mercado Pago access token is required for creating preferences');
    }

    const preference: MercadoPagoPreference = this.buildPreference(session);

    try {
      const response = await fetch(`${this.options.apiBaseUrl}/checkout/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.options.accessToken}`,
        },
        body: JSON.stringify(preference),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create Mercado Pago preference');
      }

      const data = await response.json();
      return {
        id: data.id,
        initPoint: data.init_point,
        sandboxInitPoint: data.sandbox_init_point,
        ...data,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to create Mercado Pago preference'
      );
    }
  }

  /**
   * Process a payment (for direct API payments)
   */
  async processPayment(paymentId: string, _session: CheckoutSession): Promise<PaymentResult> {
    if (!this.options.accessToken) {
      return this.createPaymentResult(false, paymentId, 'failed', 'Access token required');
    }

    try {
      const response = await fetch(`${this.options.apiBaseUrl}/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.options.accessToken}`,
        },
      });

      if (!response.ok) {
        return this.createPaymentResult(false, paymentId, 'failed', 'Payment not found');
      }

      const payment: MercadoPagoPaymentResponse = await response.json();
      return this.mapPaymentStatus(payment);
    } catch (error) {
      return this.createPaymentResult(
        false,
        paymentId,
        'failed',
        error instanceof Error ? error.message : 'Failed to process payment'
      );
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(paymentId: string): Promise<PaymentResult> {
    return this.processPayment(paymentId, {} as CheckoutSession);
  }

  /**
   * Handle webhook notification
   */
  async handleWebhook(payload: unknown): Promise<PaymentResult> {
    try {
      const webhook = payload as MercadoPagoWebhookPayload;
      
      if (webhook.type === 'payment') {
        const paymentId = webhook.data.id;
        
        if (!this.options.accessToken) {
          return this.createPaymentResult(false, paymentId, 'failed', 'Access token required');
        }

        const response = await fetch(`${this.options.apiBaseUrl}/v1/payments/${paymentId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.options.accessToken}`,
          },
        });

        if (!response.ok) {
          return this.createPaymentResult(false, paymentId, 'failed', 'Payment not found');
        }

        const payment: MercadoPagoPaymentResponse = await response.json();
        return this.mapPaymentStatus(payment);
      }

      return this.createPaymentResult(false, 'unknown', 'pending', 'Unknown webhook type');
    } catch (error) {
      return this.createPaymentResult(
        false,
        'unknown',
        'failed',
        error instanceof Error ? error.message : 'Failed to handle webhook'
      );
    }
  }

  /**
   * Build Mercado Pago preference from checkout session
   */
  private buildPreference(session: CheckoutSession): MercadoPagoPreference {
    const preference: MercadoPagoPreference = {
      items: [],
      external_reference: session.id,
    };

    // Add items from session metadata or build from total
    if (session.metadata?.items && Array.isArray(session.metadata.items)) {
      preference.items = session.metadata.items as MercadoPagoPreference['items'];
    } else {
      // Fallback: create a single item from total
      preference.items = [
        {
          id: 'checkout',
          title: 'Order',
          quantity: 1,
          unit_price: session.total,
          currency_id: session.currency || 'ARS',
        },
      ];
    }

    // Add payer information if available
    if (session.billingAddress) {
      preference.payer = {
        name: session.billingAddress.recipientName.split(' ')[0] || '',
        surname: session.billingAddress.recipientName.split(' ').slice(1).join(' ') || '',
        email: session.metadata?.email as string,
        phone: session.billingAddress.phone
          ? {
              number: session.billingAddress.phone,
            }
          : undefined,
        address: {
          street_name: session.billingAddress.street,
          street_number: session.billingAddress.streetNumber
            ? parseInt(session.billingAddress.streetNumber, 10)
            : undefined,
          zip_code: session.billingAddress.postalCode,
        },
        identification: session.billingAddress.taxId
          ? {
              type: 'DNI', // Default, can be configured
              number: session.billingAddress.taxId,
            }
          : undefined,
      };
    }

    // Add URLs
    if (session.metadata?.successUrl) {
      preference.back_urls = {
        success: session.metadata.successUrl as string,
        failure: session.metadata.failureUrl as string,
        pending: session.metadata.pendingUrl as string,
      };
    }

    if (session.metadata?.autoReturn) {
      preference.auto_return = session.metadata.autoReturn as 'approved' | 'all';
    }

    // Add webhook URL
    if (session.metadata?.webhookUrl) {
      preference.notification_url = session.metadata.webhookUrl as string;
    }

    return preference;
  }

  /**
   * Map Mercado Pago payment status to checkout status
   */
  private mapPaymentStatus(payment: MercadoPagoPaymentResponse): PaymentResult {
    let status: CheckoutSession['status'] = 'pending';
    
    switch (payment.status) {
      case 'approved':
        status = 'completed';
        break;
      case 'rejected':
      case 'cancelled':
      case 'refunded':
      case 'charged_back':
        status = 'failed';
        break;
      case 'pending':
      case 'in_process':
        status = 'processing';
        break;
      default:
        status = 'pending';
    }

    return this.createPaymentResult(
      status === 'completed',
      payment.id.toString(),
      status,
      payment.status_detail,
      {
        transactionAmount: payment.transaction_amount,
        currencyId: payment.currency_id,
        paymentMethodId: payment.payment_method_id,
        paymentTypeId: payment.payment_type_id,
        dateCreated: payment.date_created,
        dateApproved: payment.date_approved,
        payer: payment.payer,
      }
    );
  }
}





