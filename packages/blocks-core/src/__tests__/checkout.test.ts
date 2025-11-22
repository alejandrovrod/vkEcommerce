/**
 * Tests for checkout module
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CheckoutManager, createCheckoutManager } from '../checkout/checkout-manager';
import type { CheckoutOptions, ShippingAddress, BillingAddress, PaymentMethodDetails, CheckoutSession } from '../checkout/types';

describe('CheckoutManager', () => {
  let manager: CheckoutManager;

  beforeEach(() => {
    manager = createCheckoutManager();
  });

  describe('initializeSession', () => {
    it('should initialize a checkout session', () => {
      const session = manager.initializeSession(100, 'cart-123');
      expect(session).toBeDefined();
      expect(session.status).toBe('pending');
      expect(session.subtotal).toBe(100);
      expect(session.cartId).toBe('cart-123');
    });

    it('should calculate totals with tax and shipping', () => {
      const managerWithTax = createCheckoutManager({ taxRate: 0.21, shippingCost: 10 });
      const session = managerWithTax.initializeSession(100);
      expect(session.subtotal).toBe(100);
      expect(session.tax).toBe(21);
      expect(session.shipping).toBe(10);
      expect(session.total).toBe(131);
    });
  });

  describe('setShippingAddress', () => {
    it('should set shipping address', () => {
      manager.initializeSession(100);
      const address: ShippingAddress = {
        street: 'Av. Corrientes 123',
        city: 'Buenos Aires',
        postalCode: 'C1043',
        country: 'AR',
        recipientName: 'Juan Pérez',
      };
      const result = manager.setShippingAddress(address);
      expect(result.valid).toBe(true);
      expect(manager.getSession()?.shippingAddress).toEqual(address);
    });

    it('should validate required fields', () => {
      manager.initializeSession(100);
      const address: Partial<ShippingAddress> = {
        street: 'Av. Corrientes 123',
        // Missing required fields
      };
      const result = manager.setShippingAddress(address as ShippingAddress);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('setBillingAddress', () => {
    it('should set billing address', () => {
      manager.initializeSession(100);
      const address: BillingAddress = {
        street: 'Av. Corrientes 123',
        city: 'Buenos Aires',
        postalCode: 'C1043',
        country: 'AR',
        recipientName: 'Juan Pérez',
        taxId: '20-12345678-9',
      };
      const result = manager.setBillingAddress(address);
      expect(result.valid).toBe(true);
      expect(manager.getSession()?.billingAddress).toEqual(address);
    });
  });

  describe('setPaymentMethod', () => {
    it('should set payment method', () => {
      manager.initializeSession(100);
      const method: PaymentMethodDetails = {
        method: 'mercado_pago',
      };
      manager.setPaymentMethod(method);
      expect(manager.getSession()?.paymentMethod).toEqual(method);
    });
  });

  describe('updateTotals', () => {
    it('should update totals', () => {
      manager.initializeSession(100);
      manager.updateTotals(150, 20, 0.21);
      const session = manager.getSession();
      expect(session?.subtotal).toBe(150);
      expect(session?.shipping).toBe(20);
      expect(session?.tax).toBe(31.5);
      expect(session?.total).toBe(201.5);
    });
  });

  describe('validateCheckout', () => {
    it('should validate complete checkout', () => {
      manager.initializeSession(100);
      const shippingAddress: ShippingAddress = {
        street: 'Av. Corrientes 123',
        city: 'Buenos Aires',
        postalCode: 'C1043',
        country: 'AR',
        recipientName: 'Juan Pérez',
      };
      manager.setShippingAddress(shippingAddress);
      manager.setPaymentMethod({ method: 'mercado_pago' });
      
      const result = manager.validateCheckout();
      expect(result.valid).toBe(true);
    });

    it('should fail validation if shipping address is missing', () => {
      manager.initializeSession(100);
      const result = manager.validateCheckout();
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field === 'shippingAddress')).toBe(true);
    });
  });

  describe('createPayment', () => {
    it('should create payment preference', async () => {
      const options: CheckoutOptions = {
        mercadoPagoAccessToken: 'test-token',
        mercadoPagoPublicKey: 'test-key',
      };
      const managerWithMP = createCheckoutManager(options);
      managerWithMP.initializeSession(100);
      
      const shippingAddress: ShippingAddress = {
        street: 'Av. Corrientes 123',
        city: 'Buenos Aires',
        postalCode: 'C1043',
        country: 'AR',
        recipientName: 'Juan Pérez',
      };
      managerWithMP.setShippingAddress(shippingAddress);
      managerWithMP.setPaymentMethod({ method: 'mercado_pago' });

      // Mock fetch for Mercado Pago API
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 'pref-123',
          init_point: 'https://www.mercadopago.com/checkout/v1/redirect?pref_id=pref-123',
        }),
      });

      const result = await managerWithMP.createPayment();
      expect(result.id).toBe('pref-123');
      expect(result.initPoint || result.init_point).toBeDefined();
    });
  });

  describe('cancel', () => {
    it('should cancel checkout', () => {
      manager.initializeSession(100);
      manager.cancel();
      expect(manager.getSession()?.status).toBe('cancelled');
    });
  });

  describe('reset', () => {
    it('should reset checkout session', () => {
      manager.initializeSession(100);
      manager.reset();
      expect(manager.getSession()).toBeNull();
    });
  });
});

describe('createCheckoutManager', () => {
  it('should create manager with default options', () => {
    const manager = createCheckoutManager();
    expect(manager).toBeInstanceOf(CheckoutManager);
  });

  it('should create manager with custom options', () => {
    const options: CheckoutOptions = {
      currency: 'USD',
      taxRate: 0.1,
      shippingCost: 5,
    };
    const manager = createCheckoutManager(options);
    expect(manager).toBeInstanceOf(CheckoutManager);
  });
});

