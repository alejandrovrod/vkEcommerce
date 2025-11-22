/**
 * Tests for Mercado Pago adapter
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MercadoPagoAdapter } from '../checkout/mercado-pago-adapter';
import type { CheckoutSession, MercadoPagoAdapterOptions } from '../checkout/types';

describe('MercadoPagoAdapter', () => {
  let adapter: MercadoPagoAdapter;
  let mockSession: CheckoutSession;

  beforeEach(() => {
    adapter = new MercadoPagoAdapter({
      accessToken: 'test-access-token',
      publicKey: 'test-public-key',
    });

    mockSession = {
      id: 'session-123',
      status: 'pending',
      subtotal: 100,
      tax: 21,
      shipping: 10,
      total: 131,
      currency: 'ARS',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      shippingAddress: {
        street: 'Av. Corrientes 123',
        city: 'Buenos Aires',
        postalCode: 'C1043',
        country: 'AR',
        recipientName: 'Juan Pérez',
      },
      paymentMethod: {
        method: 'mercado_pago',
      },
    };
  });

  describe('createPayment', () => {
    it('should create payment preference', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 'pref-123',
          init_point: 'https://www.mercadopago.com/checkout/v1/redirect?pref_id=pref-123',
        }),
      });

      const result = await adapter.createPayment(mockSession);
      expect(result.id).toBe('pref-123');
      expect(result.initPoint || result.init_point).toBeDefined();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Invalid request' }),
      });

      await expect(adapter.createPayment(mockSession)).rejects.toThrow();
    });
  });

  describe('processPayment', () => {
    it('should process payment', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 'payment-123',
          status: 'approved',
          status_detail: 'accredited',
          transaction_amount: 131,
          currency_id: 'ARS',
        }),
      });

      const result = await adapter.processPayment('payment-123', mockSession);
      expect(result.success).toBe(true);
      expect(result.paymentId).toBe('payment-123');
    });
  });

  describe('verifyPayment', () => {
    it('should verify payment status', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 'payment-123',
          status: 'approved',
          status_detail: 'accredited',
          transaction_amount: 131,
          currency_id: 'ARS',
        }),
      });

      const result = await adapter.verifyPayment('payment-123');
      expect(result.success).toBe(true);
      expect(result.paymentId).toBe('payment-123');
    });
  });
});

