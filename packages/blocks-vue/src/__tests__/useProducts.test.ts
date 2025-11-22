/**
 * Tests for useProducts composable
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { useProducts } from '../products/useProducts';
import type { Product } from '@vk/blocks-core';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    price: 100,
    description: 'Description 1',
    categoryId: 'cat-1',
    tags: ['tag1', 'tag2'],
    inStock: true,
    stock: 10,
  },
  {
    id: '2',
    name: 'Product 2',
    price: 200,
    description: 'Description 2',
    categoryId: 'cat-2',
    tags: ['tag2', 'tag3'],
    inStock: true,
    stock: 5,
  },
];

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with products', async () => {
    const wrapper = mount({
      setup() {
        const products = useProducts({ products: mockProducts });
        return { products };
      },
      template: '<div></div>',
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.products.products.value).toBeDefined();
    expect(wrapper.vm.products.products.value.length).toBeGreaterThan(0);
  });

  it('should filter products by category', async () => {
    const wrapper = mount({
      setup() {
        const products = useProducts({ products: mockProducts });
        return { products };
      },
      template: '<div></div>',
    });

    await wrapper.vm.$nextTick();
    // Wait for products to be initialized
    await wrapper.vm.$nextTick();
    
    wrapper.vm.products.setFilters({ categories: ['cat-1'] });
    await wrapper.vm.$nextTick();
    
    const filtered = wrapper.vm.products.products.value;
    // After filtering, all products should have categoryId 'cat-1'
    if (filtered.length > 0) {
      expect(filtered.every((p: Product) => p.categoryId === 'cat-1')).toBe(true);
    }
  });

  it('should search products', async () => {
    const wrapper = mount({
      setup() {
        const products = useProducts({ products: mockProducts });
        products.setSearchQuery('Product 1');
        return { products };
      },
      template: '<div></div>',
    });

    await wrapper.vm.$nextTick();
    const searched = wrapper.vm.products.products.value;
    expect(searched.length).toBeGreaterThanOrEqual(1);
    const product1 = searched.find((p: Product) => p.name === 'Product 1');
    expect(product1).toBeDefined();
    expect(product1?.name).toBe('Product 1');
  });

  it('should sort products by price', async () => {
    const wrapper = mount({
      setup() {
        const products = useProducts({ products: mockProducts });
        products.setSortBy({ field: 'price', direction: 'asc' });
        return { products };
      },
      template: '<div></div>',
    });

    await wrapper.vm.$nextTick();
    const sorted = wrapper.vm.products.products.value;
    if (sorted.length > 1) {
      expect(sorted[0].price).toBeLessThanOrEqual(sorted[1].price);
    }
  });
});

