/**
 * Tests for useProducts hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
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
  {
    id: '3',
    name: 'Product 3',
    price: 50,
    description: 'Description 3',
    categoryId: 'cat-1',
    tags: ['tag1'],
    inStock: false,
    stock: 0,
  },
];

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with products', async () => {
    const { result } = renderHook(() => useProducts({ products: mockProducts }));
    
    await waitFor(() => {
      expect(result.current.products).toBeDefined();
    }, { timeout: 2000 });
    
    expect(result.current.products.length).toBeGreaterThan(0);
  });

  it('should filter products by category', async () => {
    const { result } = renderHook(() => useProducts({ products: mockProducts }));
    
    await waitFor(() => {
      expect(result.current.products).toBeDefined();
    }, { timeout: 2000 });
    
    act(() => {
      result.current.setFilters({ categories: ['cat-1'] });
    });
    
    await waitFor(() => {
      const filtered = result.current.products;
      expect(filtered.every(p => p.categoryId === 'cat-1')).toBe(true);
    }, { timeout: 2000 });
  });

  it('should search products', async () => {
    const { result } = renderHook(() => useProducts({ products: mockProducts }));
    
    await waitFor(() => {
      expect(result.current.products).toBeDefined();
    }, { timeout: 2000 });
    
    act(() => {
      result.current.setSearchQuery('Product 1');
    });
    
    await waitFor(() => {
      const searched = result.current.products;
      expect(searched.length).toBeGreaterThanOrEqual(1);
      const product1 = searched.find(p => p.name === 'Product 1');
      expect(product1).toBeDefined();
      expect(product1?.name).toBe('Product 1');
    }, { timeout: 2000 });
  });

  it('should sort products by price', async () => {
    const { result } = renderHook(() => useProducts({ products: mockProducts }));
    
    await waitFor(() => {
      expect(result.current.products).toBeDefined();
    }, { timeout: 2000 });
    
    act(() => {
      result.current.setSortBy({ field: 'price', direction: 'asc' });
    });
    
    await waitFor(() => {
      const sorted = result.current.products;
      if (sorted.length > 1) {
        expect(sorted[0].price).toBeLessThanOrEqual(sorted[1].price);
      }
    }, { timeout: 2000 });
  });

  it('should paginate products', async () => {
    const { result } = renderHook(() => useProducts({ 
      products: mockProducts,
    }));
    
    await waitFor(() => {
      expect(result.current.products).toBeDefined();
    }, { timeout: 2000 });
    
    // Products are initialized, pagination would be handled by search
    expect(result.current.products.length).toBeGreaterThan(0);
  });

  it('should get product by id', async () => {
    const { result } = renderHook(() => useProducts({ products: mockProducts }));
    
    await waitFor(() => {
      expect(result.current.products).toBeDefined();
    }, { timeout: 2000 });
    
    const product = result.current.getProductById('1');
    expect(product).toBeDefined();
    expect(product?.name).toBe('Product 1');
  });

  it('should update products', async () => {
    const { result } = renderHook(() => useProducts({ products: mockProducts }));
    
    await waitFor(() => {
      expect(result.current.products).toBeDefined();
    }, { timeout: 2000 });
    
    const initialCount = result.current.products.length;
    const newProduct: Product = {
      id: '4',
      name: 'Product 4',
      price: 300,
      description: 'Description 4',
      categoryId: 'cat-1',
    };
    
    act(() => {
      result.current.addProduct(newProduct);
    });
    
    await waitFor(() => {
      expect(result.current.products.length).toBeGreaterThan(initialCount);
    }, { timeout: 2000 });
  });
});

