/**
 * Tests for useWishlist composable
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { useWishlist } from '../wishlist/useWishlist';
import type { Product } from '@vk/blocks-core';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Test Product',
  price: 100,
  description: 'Test description',
  image: 'https://example.com/image.jpg',
};

describe('useWishlist', () => {
  beforeEach(() => {
    // Reset wishlist state
    const wrapper = mount({
      setup() {
        const wishlist = useWishlist();
        wishlist.clear();
        return { wishlist };
      },
      template: '<div></div>',
    });
  });

  it('should initialize with empty wishlist', () => {
    const wrapper = mount({
      setup() {
        const wishlist = useWishlist();
        return { wishlist };
      },
      template: '<div></div>',
    });

    expect(wrapper.vm.wishlist.items.value).toHaveLength(0);
    expect(wrapper.vm.wishlist.itemCount.value).toBe(0);
  });

  it('should add product to wishlist', () => {
    const wrapper = mount({
      setup() {
        const wishlist = useWishlist();
        wishlist.addItem(mockProduct);
        return { wishlist };
      },
      template: '<div></div>',
    });

    expect(wrapper.vm.wishlist.items.value).toHaveLength(1);
    expect(wrapper.vm.wishlist.itemCount.value).toBe(1);
  });

  it('should remove item from wishlist', () => {
    const wrapper = mount({
      setup() {
        const wishlist = useWishlist();
        wishlist.addItem(mockProduct);
        const itemId = wishlist.items.value[0].id;
        wishlist.removeItem(itemId);
        return { wishlist };
      },
      template: '<div></div>',
    });

    expect(wrapper.vm.wishlist.items.value).toHaveLength(0);
  });

  it('should check if product is in wishlist', () => {
    const wrapper = mount({
      setup() {
        const wishlist = useWishlist();
        const hasBefore = wishlist.hasProduct('prod-1');
        wishlist.addItem(mockProduct);
        const hasAfter = wishlist.hasProduct('prod-1');
        return { hasBefore, hasAfter };
      },
      template: '<div></div>',
    });

    expect(wrapper.vm.hasBefore).toBe(false);
    expect(wrapper.vm.hasAfter).toBe(true);
  });
});

