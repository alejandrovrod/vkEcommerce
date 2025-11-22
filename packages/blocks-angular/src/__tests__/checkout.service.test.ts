/**
 * Tests for CheckoutService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CheckoutService } from '../checkout/checkout.service';
import type { CheckoutOptions, ShippingAddress } from '@vk/blocks-core';

// Mock fetch for Mercado Pago API calls
global.fetch = vi.fn();

describe('CheckoutService', () => {
  let service: CheckoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckoutService],
    });
    service = TestBed.inject(CheckoutService);
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize session', () => {
    service.initializeSession(100, 'cart-123');
    expect(service.session()).toBeDefined();
    expect(service.session()?.subtotal).toBe(100);
    expect(service.session()?.cartId).toBe('cart-123');
    expect(service.status()).toBe('pending');
  });

  it('should set shipping address', () => {
    service.initializeSession(100);
    const address: ShippingAddress = {
      street: 'Av. Corrientes 123',
      city: 'Buenos Aires',
      postalCode: 'C1043',
      country: 'AR',
      recipientName: 'Juan Pérez',
    };
    
    const result = service.setShippingAddress(address);
    expect(result.valid).toBe(true);
    expect(service.session()?.shippingAddress).toEqual(address);
  });

  it('should set payment method', () => {
    service.initializeSession(100);
    service.setPaymentMethod({ method: 'mercado_pago' });
    expect(service.session()?.paymentMethod?.method).toBe('mercado_pago');
  });

  it('should update totals', () => {
    service.initializeSession(100);
    service.updateTotals(150, 20, 0.21);
    
    const session = service.session();
    expect(session?.subtotal).toBe(150);
    expect(session?.shipping).toBe(20);
    expect(session?.tax).toBe(31.5);
    expect(session?.total).toBe(201.5);
  });

  it('should validate checkout', () => {
    service.initializeSession(100);
    const address: ShippingAddress = {
      street: 'Av. Corrientes 123',
      city: 'Buenos Aires',
      postalCode: 'C1043',
      country: 'AR',
      recipientName: 'Juan Pérez',
    };
    service.setShippingAddress(address);
    service.setPaymentMethod({ method: 'mercado_pago' });
    
    const validation = service.validateCheckout();
    expect(validation.valid).toBe(true);
  });

  it('should cancel checkout', () => {
    service.initializeSession(100);
    service.cancel();
    expect(service.status()).toBe('cancelled');
  });

  it('should reset checkout', () => {
    service.initializeSession(100);
    service.reset();
    expect(service.session()).toBeNull();
  });
});

