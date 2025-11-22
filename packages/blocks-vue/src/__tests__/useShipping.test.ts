/**
 * Tests for useShipping composable
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { useShipping } from '../shipping/useShipping';
import type { ShippingAddress } from '@vk/blocks-core';

const mockAddress: ShippingAddress = {
  street: 'Av. Corrientes 123',
  city: 'Buenos Aires',
  postalCode: 'C1043',
  country: 'AR',
  recipientName: 'Juan Pérez',
};

describe('useShipping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize shipping', () => {
    const wrapper = mount({
      setup() {
        const shipping = useShipping();
        return { shipping };
      },
      template: '<div></div>',
    });

    expect(wrapper.vm.shipping.address.value).toBeNull();
    expect(wrapper.vm.shipping.selectedOption.value).toBeNull();
  });

  it('should set shipping address', () => {
    const wrapper = mount({
      setup() {
        const shipping = useShipping();
        shipping.setShippingAddress(mockAddress);
        return { shipping };
      },
      template: '<div></div>',
    });

    expect(wrapper.vm.shipping.address.value).toEqual(mockAddress);
  });

  it('should get available shipping options', async () => {
    const wrapper = mount({
      setup() {
        const shipping = useShipping();
        return { shipping };
      },
      template: '<div></div>',
    });

    await wrapper.vm.$nextTick();
    const options = wrapper.vm.shipping.getAvailableOptions();
    expect(Array.isArray(options)).toBe(true);
  });
});

