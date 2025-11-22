import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CartView from '../components/CartView.vue';
import { useCart } from '../composables/useCart';
import { CartStore } from '@vk/blocks-core';
import type { Product } from '@vk/blocks-core';
import { flushPromises } from '@vue/test-utils';

// Mock useCart composable
vi.mock('../composables/useCart', () => ({
  useCart: vi.fn(),
}));

const mockUseCart = useCart as ReturnType<typeof vi.fn>;

describe('CartView', () => {
  beforeEach(() => {
    CartStore.resetInstance();
    vi.clearAllMocks();
  });

  it('should render empty cart message when cart is empty', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      items: computed(() => []),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    const wrapper = mount(CartView);
    await flushPromises();

    expect(wrapper.text()).toContain('Your cart is empty');
  });

  it('should render custom empty message', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      items: computed(() => []),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    const wrapper = mount(CartView, {
      props: {
        emptyMessage: 'No items in cart',
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('No items in cart');
  });

  it('should render cart items when cart has items', async () => {
    const { computed } = await import('vue');
    const product1: Product = { id: '1', name: 'Product 1', price: 10 };
    const product2: Product = { id: '2', name: 'Product 2', price: 20 };

    mockUseCart.mockReturnValue({
      items: computed(() => [
        {
          id: '1',
          product: product1,
          quantity: 2,
          addedAt: Date.now(),
        },
        {
          id: '2',
          product: product2,
          quantity: 1,
          addedAt: Date.now(),
        },
      ]),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    const wrapper = mount(CartView);
    await flushPromises();

    expect(wrapper.text()).toContain('Product 1');
    expect(wrapper.text()).toContain('Product 2');
  });

  it('should render with custom className', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      items: computed(() => []),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    const wrapper = mount(CartView, {
      props: {
        className: 'custom-cart',
      },
    });
    await flushPromises();

    expect(wrapper.classes()).toContain('custom-cart');
  });

  it('should render custom header slot', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      items: computed(() => []),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    const wrapper = mount(CartView, {
      slots: {
        header: '<h1>My Shopping Cart</h1>',
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('My Shopping Cart');
  });

  it('should render custom footer slot', async () => {
    const { computed } = await import('vue');
    const product: Product = { id: '1', name: 'Product 1', price: 10 };

    mockUseCart.mockReturnValue({
      items: computed(() => [
        {
          id: '1',
          product,
          quantity: 1,
          addedAt: Date.now(),
        },
      ]),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    const wrapper = mount(CartView, {
      slots: {
        footer: '<button>Proceed to Checkout</button>',
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain('Proceed to Checkout');
  });

  it('should render custom empty slot', async () => {
    const { computed } = await import('vue');
    mockUseCart.mockReturnValue({
      items: computed(() => []),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    const wrapper = mount(CartView, {
      slots: {
        empty: '<div data-testid="custom-empty">Custom empty state</div>',
      },
    });
    await flushPromises();

    expect(wrapper.find('[data-testid="custom-empty"]').exists()).toBe(true);
  });

  it('should have semantic HTML structure', async () => {
    const { computed } = await import('vue');
    const product: Product = { id: '1', name: 'Product 1', price: 10 };

    mockUseCart.mockReturnValue({
      items: computed(() => [
        {
          id: '1',
          product,
          quantity: 1,
          addedAt: Date.now(),
        },
      ]),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
    });

    const wrapper = mount(CartView);
    await flushPromises();

    const list = wrapper.find('.vkecom-cart-list[role="list"]');
    expect(list.exists()).toBe(true);
  });
});

