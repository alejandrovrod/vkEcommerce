import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductCard from '../components/ProductCard.vue';
import { CartStore } from '@alejandrovrod/blocks-core';
import type { Product } from '@alejandrovrod/blocks-core';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  image: 'https://example.com/image.jpg',
  description: 'Test description',
};

describe('ProductCard', () => {
  beforeEach(() => {
    CartStore.resetInstance();
  });

  it('should render product information', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
    });

    expect(wrapper.text()).toContain('Test Product');
    expect(wrapper.text()).toContain('$29.99');
    expect(wrapper.text()).toContain('Test description');
    expect(wrapper.find('img').attributes('alt')).toBe('Test Product');
  });

  it('should render with custom className', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        className: 'custom-class',
      },
    });

    expect(wrapper.classes()).toContain('custom-class');
  });

  it('should render custom children', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      slots: {
        default: '<div data-testid="custom-content">Custom Content</div>',
      },
    });

    expect(wrapper.find('[data-testid="custom-content"]').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('Test Product');
  });

  it('should render custom image slot', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      slots: {
        image: '<div data-testid="custom-image">Custom Image</div>',
      },
    });

    expect(wrapper.find('[data-testid="custom-image"]').exists()).toBe(true);
    expect(wrapper.find('img').exists()).toBe(false);
  });

  it('should render custom title slot', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      slots: {
        title: '<h1 data-testid="custom-title">Custom Title</h1>',
      },
    });

    expect(wrapper.find('[data-testid="custom-title"]').exists()).toBe(true);
    expect(wrapper.find('h3').exists()).toBe(false);
  });

  it('should render custom price slot', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      slots: {
        price: '<span data-testid="custom-price">Custom Price</span>',
      },
    });

    expect(wrapper.find('[data-testid="custom-price"]').exists()).toBe(true);
  });

  it('should render custom button slot', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
      slots: {
        button: '<button data-testid="custom-button">Custom Button</button>',
      },
    });

    expect(wrapper.find('[data-testid="custom-button"]').exists()).toBe(true);
    expect(wrapper.find('.vkecom-product-button').exists()).toBe(false);
  });

  it('should emit addToCart event when button is clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
    });

    const button = wrapper.find('.vkecom-product-button');
    await button.trigger('click');

    expect(wrapper.emitted('addToCart')).toBeTruthy();
    expect(wrapper.emitted('addToCart')?.[0]).toEqual([mockProduct]);
  });

  it('should call onAddToCart callback', async () => {
    const onAddToCart = vi.fn();
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        onAddToCart,
      },
    });

    const button = wrapper.find('.vkecom-product-button');
    await button.trigger('click');

    expect(wrapper.emitted('addToCart')).toBeTruthy();
  });

  it('should use custom quantity when adding to cart', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
        quantity: 3,
      },
    });

    const button = wrapper.find('.vkecom-product-button');
    await button.trigger('click');

    // Verify the cart has the correct quantity
    const cartState = CartStore.getInstance().getState();
    const item = cartState.items.find((i) => i.product.id === mockProduct.id);
    expect(item?.quantity).toBe(3);
  });

  it('should render placeholder when no image', () => {
    const productWithoutImage: Product = {
      id: '2',
      name: 'No Image Product',
      price: 10,
    };

    const wrapper = mount(ProductCard, {
      props: {
        product: productWithoutImage,
      },
    });

    expect(wrapper.text()).toContain('No image');
    expect(wrapper.find('img').exists()).toBe(false);
  });

  it('should have semantic HTML structure', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
    });

    const article = wrapper.find('article[itemscope]');
    expect(article.exists()).toBe(true);
    expect(article.attributes('itemtype')).toBe('https://schema.org/Product');
  });

  it('should have accessible button with aria-label', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
    });

    const button = wrapper.find('.vkecom-product-button');
    expect(button.attributes('aria-label')).toBe('Add Test Product to cart');
  });
});








