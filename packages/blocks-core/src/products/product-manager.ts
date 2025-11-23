/**
 * Product manager - Main API for product operations
 */

import type { Product, ProductManagerOptions, SearchOptions, SearchResult } from './types';
import { ProductSearch } from './product-search';

/**
 * Product manager class
 */
export class ProductManager {
  private products: Product[] = [];
  private options: Required<Omit<ProductManagerOptions, 'products' | 'onUpdate' | 'onError'>> & {
    products?: Product[] | (() => Promise<Product[]>) | (() => Product[]);
    onUpdate?: (products: Product[]) => void;
    onError?: (error: Error) => void;
  };
  private cache: Map<string, { result: SearchResult; timestamp: number }> = new Map();
  private initialized: boolean = false;

  constructor(options: ProductManagerOptions = {}) {
    this.options = {
      products: options.products,
      enableCache: options.enableCache ?? true,
      cacheTTL: options.cacheTTL || 5 * 60 * 1000, // 5 minutes default
      onUpdate: options.onUpdate,
      onError: options.onError || ((error) => console.error('[ProductManager]', error)),
    };

    // Initialize products if provided as array
    if (Array.isArray(this.options.products)) {
      this.products = [...this.options.products];
      this.initialized = true;
    }
  }

  /**
   * Initialize products (load from async source if needed)
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      if (typeof this.options.products === 'function') {
        const result = this.options.products();
        if (result instanceof Promise) {
          this.products = await result;
        } else {
          this.products = result;
        }
      } else if (Array.isArray(this.options.products)) {
        this.products = [...this.options.products];
      }

      this.initialized = true;
      this.notifyUpdate();
    } catch (error) {
      this.options.onError?.(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Get all products
   */
  getAllProducts(): Product[] {
    return [...this.products];
  }

  /**
   * Get product by ID
   */
  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  /**
   * Get product by SKU
   */
  getProductBySku(sku: string): Product | undefined {
    return this.products.find((p) => p.sku === sku);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(categoryId: string): Product[] {
    return this.products.filter((p) => p.categoryId === categoryId);
  }

  /**
   * Get products by tag
   */
  getProductsByTag(tag: string): Product[] {
    return this.products.filter((p) => p.tags?.includes(tag));
  }

  /**
   * Add product
   */
  addProduct(product: Product): void {
    // Check if product already exists
    if (this.products.some((p) => p.id === product.id)) {
      throw new Error(`Product with id ${product.id} already exists`);
    }

    this.products.push({
      ...product,
      createdAt: product.createdAt || Date.now(),
      updatedAt: Date.now(),
    });

    this.clearCache();
    this.notifyUpdate();
  }

  /**
   * Update product
   */
  updateProduct(id: string, updates: Partial<Product>): void {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }

    this.products[index] = {
      ...this.products[index],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: Date.now(),
    };

    this.clearCache();
    this.notifyUpdate();
  }

  /**
   * Remove product
   */
  removeProduct(id: string): void {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }

    this.products.splice(index, 1);
    this.clearCache();
    this.notifyUpdate();
  }

  /**
   * Search products
   */
  search(options: SearchOptions = {}): SearchResult {
    // Check cache
    if (this.options.enableCache) {
      const cacheKey = this.getCacheKey(options);
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.options.cacheTTL) {
        return cached.result;
      }
    }

    const result = ProductSearch.search(this.products, options);

    // Store in cache
    if (this.options.enableCache) {
      const cacheKey = this.getCacheKey(options);
      this.cache.set(cacheKey, {
        result,
        timestamp: Date.now(),
      });
    }

    return result;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Set products (replace all)
   */
  setProducts(products: Product[]): void {
    this.products = [...products];
    this.clearCache();
    this.notifyUpdate();
  }

  /**
   * Get cache key for search options
   */
  private getCacheKey(options: SearchOptions): string {
    return JSON.stringify({
      query: options.query,
      filters: options.filters,
      sort: options.sort,
      page: options.page,
      pageSize: options.pageSize,
      includeOutOfStock: options.includeOutOfStock,
    });
  }

  /**
   * Notify update
   */
  private notifyUpdate(): void {
    if (this.options.onUpdate) {
      this.options.onUpdate([...this.products]);
    }
  }
}

/**
 * Create a product manager instance
 */
export function createProductManager(options?: ProductManagerOptions): ProductManager {
  return new ProductManager(options);
}





