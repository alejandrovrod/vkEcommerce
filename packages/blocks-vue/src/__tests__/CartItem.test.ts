import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CartItem from '../components/CartItem.vue';
import { CartStore } from '@alejandrovrod/blocks-core';
import type { CartItem as CartItemType } from '@alejandrovrod/blocks-core';

const mockCartItem: CartItemType = {
  id: '1',
  product: {
    id: 'prod-1',
    name: 'Test Product',
    price: 29.99,
    image: 'https://example.com/image.jpg',
    description: 'Test description',
  },
  quantity: 2,
  addedAt: Date.now(),
};

describe('CartItem', () => {
  beforeEach(() => {
    CartStore.resetInstance();
  });

  it('should render cart item information', () => {
    const wrapper = mount(CartItem, {
      props: {
        item: mockCartItem,
      },
    });

    expect(wrapper.text()).toContain('Test Product');
    expect(wrapper.text()).toContain('Test description');
    expect(wrapper.text()).toContain('$29.99');
    expect(wrapper.text()).toContain('Total: $59.98');
    expect(wrapper.text()).toContain('2');
  });

  it('should render with custom className', () => {
    const wrapper = mount(CartItem, {
      props: {
        item: mockCartItem,
        className: 'custom-class',
      },
    });

    expect(wrapper.classes()).toContain('custom-class');
  });

  it('should emit increase event when increase button is clicked', async () => {
    const wrapper = mount(CartItem, {
      props: {
        item: mockCartItem,
      },
    });

    const increaseButton = wrapper.find('.vkecom-cart-item-quantity-increase');
    await increaseButton.trigger('click');

    expect(wrapper.emitted('increase')).toBeTruthy();
    expect(wrapper.emitted('increase')?.[0]).toEqual(['1']);
  });

  it('should emit decrease event when decrease button is clicked', async () => {
    const wrapper = mount(CartItem, {
      props: {
        item: mockCartItem,
      },
    });

    const decreaseButton = wrapper.find('.vkecom-cart-item-quantity-decrease');
    await decreaseButton.trigger('click');

    expect(wrapper.emitted('decrease')).toBeTruthy();
    expect(wrapper.emitted('decrease')?.[0]).toEqual(['1']);
  });

  it('should emit remove event when remove button is clicked', async () => {
    const wrapper = mount(CartItem, {
      props: {
        item: mockCartItem,
      },
    });

    const removeButton = wrapper.find('.vkecom-cart-item-remove');
    await removeButton.trigger('click');

    expect(wrapper.emitted('remove')).toBeTruthy();
    expect(wrapper.emitted('remove')?.[0]).toEqual(['1']);
  });

  it('should render placeholder when no image', () => {
    const itemWithoutImage: CartItemType = {
      ...mockCartItem,
      product: { ...mockCartItem.product, image: undefined },
    };

    const wrapper = mount(CartItem, {
      props: {
        item: itemWithoutImage,
      },
    });

    expect(wrapper.text()).toContain('No image');
  });

  it('should have semantic HTML structure', () => {
    const wrapper = mount(CartItem, {
      props: {
        item: mockCartItem,
      },
    });

    const item = wrapper.find('[itemscope]');
    expect(item.exists()).toBe(true);
    expect(item.attributes('itemtype')).toBe('https://schema.org/Product');
  });

  it('should render custom slots', () => {
    const wrapper = mount(CartItem, {
      props: {
        item: mockCartItem,
      },
      slots: {
        default: '<div data-testid="custom-content">Custom UI</div>',
      },
    });

    expect(wrapper.find('[data-testid="custom-content"]').exists()).toBe(true);
  });
});


