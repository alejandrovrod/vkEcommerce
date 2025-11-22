/**
 * Vue composable for product management
 */

import { ref, computed, onMounted } from 'vue';
import { ProductManager, createProductManager, ProductSearch } from '@vk/blocks-core';
import type { Product, ProductManagerOptions, ProductFilter, ProductSort } from '@vk/blocks-core';

/**
 * Use products composable return type
 */
export interface UseProductsReturn {
  products: Readonly<import('vue').Ref<Product[]>>;
  loading: Readonly<import('vue').Ref<boolean>>;
  error: Readonly<import('vue').Ref<Error | null>>;
  getProductById: (id: string) => Product | undefined;
  getProductBySku: (sku: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  getProductsByTag: (tag: string) => Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  setProducts: (products: Product[]) => void;
  setFilters: (filters: import('@vk/blocks-core').ProductFilter) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: import('@vk/blocks-core').ProductSort) => void;
}

/**
 * Vue composable for products
 */
export function useProducts(options?: ProductManagerOptions): UseProductsReturn {
  const manager = createProductManager(options);
  const products = ref<Product[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  onMounted(async () => {
    try {
      await manager.initialize();
      products.value = manager.getAllProducts();
      loading.value = false;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      loading.value = false;
    }
  });

  const getProductById = (id: string) => manager.getProductById(id);
  const getProductBySku = (sku: string) => manager.getProductBySku(sku);
  const getProductsByCategory = (categoryId: string) => manager.getProductsByCategory(categoryId);
  const getProductsByTag = (tag: string): Product[] => manager.getProductsByTag(tag);

  const addProduct = (product: Product) => {
    try {
      manager.addProduct(product);
      products.value = manager.getAllProducts();
      error.value = null;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      throw errObj;
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    try {
      manager.updateProduct(id, updates);
      products.value = manager.getAllProducts();
      error.value = null;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      throw errObj;
    }
  };

  const removeProduct = (id: string) => {
    try {
      manager.removeProduct(id);
      products.value = manager.getAllProducts();
      error.value = null;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      throw errObj;
    }
  };

  const setProducts = (newProducts: Product[]) => {
    try {
      manager.setProducts(newProducts);
      products.value = manager.getAllProducts();
      error.value = null;
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      error.value = errObj;
      throw errObj;
    }
  };

  const setFilters = (filters: ProductFilter) => {
    const result = ProductSearch.search(manager.getAllProducts(), { filters });
    products.value = result.products;
  };

  const setSearchQuery = (query: string) => {
    const result = ProductSearch.search(manager.getAllProducts(), { query });
    products.value = result.products;
  };

  const setSortBy = (sort: ProductSort) => {
    const result = ProductSearch.search(manager.getAllProducts(), { sort });
    products.value = result.products;
  };

  return {
    products: readonly(products),
    loading: readonly(loading),
    error: readonly(error),
    getProductById,
    getProductBySku,
    getProductsByCategory,
    getProductsByTag,
    addProduct,
    updateProduct,
    removeProduct,
    setProducts,
    setFilters,
    setSearchQuery,
    setSortBy,
  };
}

import { readonly } from 'vue';

