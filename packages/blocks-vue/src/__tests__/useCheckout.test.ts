/**
 * Tests for useCheckout composable
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { useCheckout } from '../checkout/useCheckout';
import type { CheckoutOptions } from '@vk/blocks-core';

// Mock fetch for Mercado Pago API calls
global.fetch = vi.fn();

describe('useCheckout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize checkout', () => {
    const wrapper = mount({
      setup() {
        const checkout = useCheckout();
        return { checkout };
      },
      template: '<div></div>',
    });

    expect(wrapper.vm.checkout.session.value).toBeNull();
    expect(wrapper.vm.checkout.status.value).toBeNull();
    expect(wrapper.vm.checkout.loading.value).toBe(false);
  });

  it('should initialize session', () => {
    const wrapper = mount({
      setup() {
        const checkout = useCheckout();
        checkout.initializeSession(100, 'cart-123');
        return { checkout };
      },
      template: '<div></div>',
    });

    expect(wrapper.vm.checkout.session.value).toBeDefined();
    expect(wrapper.vm.checkout.session.value?.subtotal).toBe(100);
    expect(wrapper.vm.checkout.session.value?.cartId).toBe('cart-123');
    expect(wrapper.vm.checkout.status.value).toBe('pending');
  });

  it('should set shipping address', () => {
    const wrapper = mount({
      setup() {
        const checkout = useCheckout();
        checkout.initializeSession(100);
        
        const address = {
          street: 'Av. Corrientes 123',
          city: 'Buenos Aires',
          postalCode: 'C1043',
          country: 'AR',
          recipientName: 'Juan Pérez',
        };
        
        const validation = checkout.setShippingAddress(address);
        return { checkout, validation };
      },
      template: '<div></div>',
    });

    expect(wrapper.vm.validation.valid).toBe(true);
    expect(wrapper.vm.checkout.session.value?.shippingAddress).toBeDefined();
  });

  it('should set payment method', () => {
    const wrapper = mount({
      setup() {
        const checkout = useCheckout();
        checkout.initializeSession(100);
        checkout.setPaymentMethod({ method: 'mercado_pago' });
        return { checkout };
      },
      template: '<div></div>',
    });

    expect(wrapper.vm.checkout.session.value?.paymentMethod?.method).toBe('mercado_pago');
  });
});

