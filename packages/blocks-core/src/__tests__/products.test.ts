/**
 * Tests for products module
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ProductManager } from '../products/product-manager';
import { ProductSearch } from '../products/product-search';
import { ProductFilterHelper } from '../products/product-filter';
import { ProductSorter } from '../products/product-sorter';
import type { Product, ProductFilter, ProductSort, ProductManagerOptions } from '../products/types';

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

describe('ProductManager', () => {
  let manager: ProductManager;

  beforeEach(() => {
    manager = new ProductManager({
      products: mockProducts,
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      await manager.initialize();
      const products = manager.getAllProducts();
      expect(products).toHaveLength(3);
    });
  });

  describe('getProductById', () => {
    it('should return product by id', async () => {
      await manager.initialize();
      const product = manager.getProductById('1');
      expect(product).toBeDefined();
      expect(product?.name).toBe('Product 1');
    });

    it('should return undefined for non-existent id', async () => {
      await manager.initialize();
      const product = manager.getProductById('999');
      expect(product).toBeUndefined();
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category', async () => {
      await manager.initialize();
      const products = manager.getProductsByCategory('cat-1');
      expect(products).toHaveLength(2);
      expect(products.every(p => p.categoryId === 'cat-1')).toBe(true);
    });
  });

  describe('addProduct', () => {
    it('should add a new product', async () => {
      await manager.initialize();
      const newProduct: Product = {
        id: '4',
        name: 'Product 4',
        price: 300,
      };
      manager.addProduct(newProduct);
      expect(manager.getAllProducts()).toHaveLength(4);
      const addedProduct = manager.getProductById('4');
      expect(addedProduct).toBeDefined();
      expect(addedProduct?.id).toBe('4');
      expect(addedProduct?.name).toBe('Product 4');
      expect(addedProduct?.price).toBe(300);
    });
  });

  describe('updateProduct', () => {
    it('should update existing product', async () => {
      await manager.initialize();
      manager.updateProduct('1', { price: 150 });
      const product = manager.getProductById('1');
      expect(product?.price).toBe(150);
    });
  });

  describe('removeProduct', () => {
    it('should remove product', async () => {
      await manager.initialize();
      manager.removeProduct('1');
      expect(manager.getAllProducts()).toHaveLength(2);
      expect(manager.getProductById('1')).toBeUndefined();
    });
  });
});

describe('ProductSearch', () => {
  it('should search products by query', () => {
    const result = ProductSearch.search(mockProducts, { query: 'Product 1' });
    // Search might match multiple products if "Product" is in the name
    expect(result.products.length).toBeGreaterThanOrEqual(1);
    // But at least one should be "Product 1"
    const product1 = result.products.find(p => p.name === 'Product 1');
    expect(product1).toBeDefined();
    expect(product1?.name).toBe('Product 1');
  });

  it('should return paginated results', () => {
    const result = ProductSearch.search(mockProducts, {
      query: 'Product',
      page: 1,
      pageSize: 2,
    });
    expect(result.products.length).toBeLessThanOrEqual(2);
    expect(result.total).toBeGreaterThanOrEqual(2);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(2);
  });

  it('should filter products', () => {
    const result = ProductSearch.search(mockProducts, { query: 'Product' });
    expect(result.products.length).toBeGreaterThan(0);
  });
});

describe('ProductFilterHelper', () => {
  it('should filter by price range', () => {
    const filter: ProductFilter = {
      priceRange: { min: 100, max: 150 },
    };
    const filtered = ProductFilterHelper.filter(mockProducts, filter);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].price).toBe(100);
  });

  it('should filter by category', () => {
    const filter: ProductFilter = {
      categories: ['cat-1'],
    };
    const filtered = ProductFilterHelper.filter(mockProducts, filter);
    expect(filtered).toHaveLength(2);
    expect(filtered.every(p => p.categoryId === 'cat-1')).toBe(true);
  });

  it('should filter by tags', () => {
    const filter: ProductFilter = {
      tags: ['tag1'],
    };
    const filtered = ProductFilterHelper.filter(mockProducts, filter);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(p => p.tags?.includes('tag1'))).toBe(true);
  });

  it('should filter in stock products', () => {
    const filter: ProductFilter = {
      inStock: true,
    };
    const filtered = ProductFilterHelper.filter(mockProducts, filter);
    expect(filtered.every(p => p.inStock !== false && (p.stock === undefined || p.stock > 0))).toBe(true);
  });
});

describe('ProductSorter', () => {
  it('should sort by price ascending', () => {
    const sort: ProductSort = {
      field: 'price',
      direction: 'asc',
    };
    const sorted = ProductSorter.sort(mockProducts, sort);
    expect(sorted[0].price).toBe(50);
    expect(sorted[sorted.length - 1].price).toBe(200);
  });

  it('should sort by price descending', () => {
    const sort: ProductSort = {
      field: 'price',
      direction: 'desc',
    };
    const sorted = ProductSorter.sort(mockProducts, sort);
    expect(sorted[0].price).toBe(200);
    expect(sorted[sorted.length - 1].price).toBe(50);
  });

  it('should sort by name', () => {
    const sort: ProductSort = {
      field: 'name',
      direction: 'asc',
    };
    const sorted = ProductSorter.sort(mockProducts, sort);
    expect(sorted[0].name).toBe('Product 1');
  });
});

