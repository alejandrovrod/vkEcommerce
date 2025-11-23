import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import CartSummary from '../components/CartSummary.vue';
import { useCart } from '../composables/useCart';
import { CartStore } from '@alejandrovrod/blocks-core';
import { flushPromises } from '@vue/test-utils';

// Mock useCart composable
vi.mock('../composables/useCart', () => ({
  useCart: vi.fn(),
}));

const mockUseCart = useCart as ReturnType<typeof vi.fn>;

describe('CartSummary', () => {
  beforeEach(() => {
    CartStore.resetInstance();
    vi.clearAllMocks();
  });

  it('should render item count', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      total: computed(() => 50),
      itemCount: computed(() => 3),
    });

    const wrapper = mount(CartSummary);
    await flushPromises();

    expect(wrapper.text()).toContain('3 items');
  });

  it('should render singular "item" when count is 1', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      total: computed(() => 10),
      itemCount: computed(() => 1),
    });

    const wrapper = mount(CartSummary);
    await flushPromises();

    expect(wrapper.text()).toContain('1 item');
  });

  it('should render subtotal', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      total: computed(() => 50),
      itemCount: computed(() => 2),
    });

    const wrapper = mount(CartSummary);
    await flushPromises();

    expect(wrapper.text()).toContain('Subtotal:');
    expect(wrapper.find('.vkecom-cart-summary-subtotal').text()).toContain('$50.00');
  });

  it('should render tax when enabled', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      total: computed(() => 100),
      itemCount: computed(() => 1),
    });

    const wrapper = mount(CartSummary, {
      props: {
        showTax: true,
        taxRate: 0.1,
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('Tax:');
    expect(wrapper.find('.vkecom-cart-summary-tax').text()).toContain('$10.00');
  });

  it('should render shipping when enabled', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      total: computed(() => 50),
      itemCount: computed(() => 1),
    });

    const wrapper = mount(CartSummary, {
      props: {
        showShipping: true,
        shippingCost: 5.99,
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('Shipping:');
    expect(wrapper.find('.vkecom-cart-summary-shipping').text()).toContain('$5.99');
  });

  it('should render total', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      total: computed(() => 50),
      itemCount: computed(() => 1),
    });

    const wrapper = mount(CartSummary);
    await flushPromises();

    expect(wrapper.text()).toContain('Total:');
    expect(wrapper.find('.vkecom-cart-summary-total').text()).toContain('$50.00');
  });

  it('should emit checkout event when checkout button is clicked', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      total: computed(() => 50),
      itemCount: computed(() => 1),
    });

    const wrapper = mount(CartSummary, {
      slots: {
        checkout: ({ onCheckout }: { onCheckout: () => void }) => {
          return h('button', { onClick: onCheckout }, 'Checkout');
        },
      },
    });
    await flushPromises();

    const checkoutButton = wrapper.find('button');
    await checkoutButton.trigger('click');

    expect(wrapper.emitted('checkout')).toBeTruthy();
  });

  it('should render with custom className', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      total: computed(() => 50),
      itemCount: computed(() => 1),
    });

    const wrapper = mount(CartSummary, {
      props: {
        className: 'custom-summary',
      },
    });
    await flushPromises();

    expect(wrapper.classes()).toContain('custom-summary');
  });

  it('should use custom formatPrice function', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      total: computed(() => 50.5),
      itemCount: computed(() => 1),
    });

    const formatPrice = (price: number) => `€${price.toFixed(2)}`;

    const wrapper = mount(CartSummary, {
      props: {
        formatPrice,
      },
    });
    await flushPromises();

    expect(wrapper.find('.vkecom-cart-summary-subtotal').text()).toContain('€50.50');
  });

  it('should hide item count when showItemCount is false', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      total: computed(() => 50),
      itemCount: computed(() => 3),
    });

    const wrapper = mount(CartSummary, {
      props: {
        showItemCount: false,
      },
    });
    await flushPromises();

    expect(wrapper.find('.vkecom-cart-summary-item-count').exists()).toBe(false);
  });
});


