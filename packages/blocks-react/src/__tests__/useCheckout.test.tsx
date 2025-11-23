/**
 * Tests for useCheckout hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useCheckout } from '../checkout/useCheckout';
import type { CheckoutOptions } from '@alejandrovrod/blocks-core';

// Mock fetch for Mercado Pago API calls
global.fetch = vi.fn();

describe('useCheckout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize checkout', () => {
    const { result } = renderHook(() => useCheckout());
    expect(result.current.session).toBeNull();
    expect(result.current.status).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should initialize session', () => {
    const { result } = renderHook(() => useCheckout());
    
    act(() => {
      result.current.initializeSession(100, 'cart-123');
    });
    
    expect(result.current.session).toBeDefined();
    expect(result.current.session?.subtotal).toBe(100);
    expect(result.current.session?.cartId).toBe('cart-123');
    expect(result.current.status).toBe('pending');
  });

  it('should set shipping address', () => {
    const { result } = renderHook(() => useCheckout());
    
    act(() => {
      result.current.initializeSession(100);
    });
    
    const address = {
      street: 'Av. Corrientes 123',
      city: 'Buenos Aires',
      postalCode: 'C1043',
      country: 'AR',
      recipientName: 'Juan Pérez',
    };
    
    let validation;
    act(() => {
      validation = result.current.setShippingAddress(address);
    });
    
    expect(validation.valid).toBe(true);
    expect(result.current.session?.shippingAddress).toEqual(address);
  });

  it('should set payment method', () => {
    const { result } = renderHook(() => useCheckout());
    
    act(() => {
      result.current.initializeSession(100);
      result.current.setPaymentMethod({ method: 'mercado_pago' });
    });
    
    expect(result.current.session?.paymentMethod?.method).toBe('mercado_pago');
  });

  it('should create payment', async () => {
    const options: CheckoutOptions = {
      mercadoPagoAccessToken: 'test-token',
      mercadoPagoPublicKey: 'test-key',
    };
    
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'pref-123',
        init_point: 'https://www.mercadopago.com/checkout/v1/redirect?pref_id=pref-123',
      }),
    });

    const { result } = renderHook(() => useCheckout(options));
    
    act(() => {
      result.current.initializeSession(100);
    });
    
    const address = {
      street: 'Av. Corrientes 123',
      city: 'Buenos Aires',
      postalCode: 'C1043',
      country: 'AR',
      recipientName: 'Juan Pérez',
    };
    
    act(() => {
      result.current.setShippingAddress(address);
      result.current.setPaymentMethod({ method: 'mercado_pago' });
    });

    let payment;
    await act(async () => {
      payment = await result.current.createPayment();
    });
    
    expect(payment.id).toBe('pref-123');
  });

  it('should validate checkout', () => {
    const { result } = renderHook(() => useCheckout());
    
    act(() => {
      result.current.initializeSession(100);
    });
    
    const address = {
      street: 'Av. Corrientes 123',
      city: 'Buenos Aires',
      postalCode: 'C1043',
      country: 'AR',
      recipientName: 'Juan Pérez',
    };
    
    act(() => {
      result.current.setShippingAddress(address);
      result.current.setPaymentMethod({ method: 'mercado_pago' });
    });
    
    const validation = result.current.validate();
    expect(validation.valid).toBe(true);
  });

  it('should cancel checkout', () => {
    const { result } = renderHook(() => useCheckout());
    
    act(() => {
      result.current.initializeSession(100);
      result.current.cancel();
    });
    
    expect(result.current.status).toBe('cancelled');
  });

  it('should reset checkout', () => {
    const { result } = renderHook(() => useCheckout());
    
    act(() => {
      result.current.initializeSession(100);
      result.current.reset();
    });
    
    expect(result.current.session).toBeNull();
  });
});


