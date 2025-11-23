/**
 * React hook for product management
 */

import { useState, useEffect, useCallback } from 'react';
import { createProductManager, ProductSearch } from '@alejandrovrod/blocks-core';
import type { Product, ProductManagerOptions, ProductFilter, ProductSort } from '@alejandrovrod/blocks-core';

/**
 * Use products hook return type
 */
export interface UseProductsReturn {
  /**
   * All products
   */
  products: Product[];
  
  /**
   * Loading state
   */
  loading: boolean;
  
  /**
   * Error state
   */
  error: Error | null;
  
  /**
   * Get product by ID
   */
  getProductById: (id: string) => Product | undefined;
  
  /**
   * Get product by SKU
   */
  getProductBySku: (sku: string) => Product | undefined;
  
  /**
   * Get products by category
   */
  getProductsByCategory: (categoryId: string) => Product[];
  
  /**
   * Get products by tag
   */
  getProductsByTag: (tag: string) => Product[];
  
  /**
   * Add product
   */
  addProduct: (product: Product) => void;
  
  /**
   * Update product
   */
  updateProduct: (id: string, updates: Partial<Product>) => void;
  
  /**
   * Remove product
   */
  removeProduct: (id: string) => void;
  
  /**
   * Set products
   */
  setProducts: (products: Product[]) => void;
  
  /**
   * Set filters
   */
  setFilters: (filters: import('@alejandrovrod/blocks-core').ProductFilter) => void;
  
  /**
   * Set search query
   */
  setSearchQuery: (query: string) => void;
  
  /**
   * Set sort options
   */
  setSortBy: (sort: import('@alejandrovrod/blocks-core').ProductSort) => void;
}

/**
 * React hook for products
 */
export function useProducts(options?: ProductManagerOptions): UseProductsReturn {
  const [manager] = useState(() => createProductManager(options));
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize manager
  useEffect(() => {
    const initialize = async () => {
      try {
        await manager.initialize();
        setProducts(manager.getAllProducts() as Product[]);
        setLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setLoading(false);
      }
    };

    initialize();
  }, [manager]);

  // Subscribe to updates
  useEffect(() => {
    // Note: ProductManager doesn't have a subscribe method yet
    // For now, we'll rely on manual updates
  }, [manager, options]);

  const getProductById = useCallback(
    (id: string) => manager.getProductById(id) as Product | undefined,
    [manager]
  );

  const getProductBySku = useCallback(
    (sku: string) => manager.getProductBySku(sku) as Product | undefined,
    [manager]
  );

  const getProductsByCategory = useCallback(
    (categoryId: string) => {
      const result = manager.getProductsByCategory(categoryId);
      return result as Product[];
    },
    [manager]
  );

  const getProductsByTag = useCallback(
    (tag: string) => {
      const result = manager.getProductsByTag(tag);
      return result as Product[];
    },
    [manager]
  );

  const addProduct = useCallback(
    (product: Product) => {
      try {
        manager.addProduct(product);
        setProducts(manager.getAllProducts() as Product[]);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [manager]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      try {
        manager.updateProduct(id, updates);
        setProducts(manager.getAllProducts() as Product[]);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [manager]
  );

  const removeProduct = useCallback(
    (id: string) => {
      try {
        manager.removeProduct(id);
        setProducts(manager.getAllProducts() as Product[]);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [manager]
  );

  const setProductsList = useCallback(
    (newProducts: Product[]) => {
      try {
        manager.setProducts(newProducts);
        setProducts(manager.getAllProducts() as Product[]);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      }
    },
    [manager]
  );

  const setFilters = useCallback(
    (filters: ProductFilter) => {
      const result = ProductSearch.search(manager.getAllProducts(), { filters });
      setProducts(result.products as Product[]);
    },
    [manager]
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      const result = ProductSearch.search(manager.getAllProducts(), { query });
      setProducts(result.products as Product[]);
    },
    [manager]
  );

  const setSortBy = useCallback(
    (sort: ProductSort) => {
      const result = ProductSearch.search(manager.getAllProducts(), { sort });
      setProducts(result.products as Product[]);
    },
    [manager]
  );

  return {
    products,
    loading,
    error,
    getProductById,
    getProductBySku,
    getProductsByCategory,
    getProductsByTag,
    addProduct,
    updateProduct,
    removeProduct,
    setProducts: setProductsList,
    setFilters,
    setSearchQuery,
    setSortBy,
  };
}


