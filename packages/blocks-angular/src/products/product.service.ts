/**
 * Angular service for product management using Signals
 */

import { Injectable, signal, computed } from '@angular/core';
import { ProductManager, createProductManager } from '@vk/blocks-core';
import { ProductSearch } from '@vk/blocks-core';
import type { Product, ProductManagerOptions, SearchOptions, SearchResult, ProductFilter, ProductSort } from '@vk/blocks-core';

/**
 * Angular service for products
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private manager: ProductManager;
  private productsSignal = signal<Product[]>([]);
  private loadingSignal = signal(true);
  private errorSignal = signal<Error | null>(null);

  // Public readonly signals
  readonly products = this.productsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    // Initialize with empty manager - use initialize() method to set products
    this.manager = createProductManager();
  }

  getProductById(id: string): Product | undefined {
    return this.manager.getProductById(id);
  }

  getProductBySku(sku: string): Product | undefined {
    return this.manager.getProductBySku(sku);
  }

  getProductsByCategory(categoryId: string): Product[] {
    return this.manager.getProductsByCategory(categoryId);
  }

  getProductsByTag(tag: string): Product[] {
    return this.manager.getProductsByTag(tag);
  }

  addProduct(product: Product): void {
    try {
      this.manager.addProduct(product);
      this.productsSignal.set(this.manager.getAllProducts());
      this.errorSignal.set(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      throw err;
    }
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    try {
      this.manager.updateProduct(id, updates);
      this.productsSignal.set(this.manager.getAllProducts());
      this.errorSignal.set(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      throw err;
    }
  }

  removeProduct(id: string): void {
    try {
      this.manager.removeProduct(id);
      this.productsSignal.set(this.manager.getAllProducts());
      this.errorSignal.set(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      throw err;
    }
  }

  setProducts(products: Product[]): void {
    try {
      this.manager.setProducts(products);
      this.productsSignal.set(this.manager.getAllProducts());
      this.errorSignal.set(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      throw err;
    }
  }

  /**
   * Initialize with products (public method)
   */
  async initialize(options?: ProductManagerOptions): Promise<void> {
    try {
      this.loadingSignal.set(true);
      if (options) {
        // Create new manager with options
        const enhancedOptions: ProductManagerOptions = {
          ...options,
          onUpdate: (products) => {
            this.productsSignal.set(products);
            options.onUpdate?.(products);
          },
        };
        this.manager = createProductManager(enhancedOptions);
      }
      await this.manager.initialize();
      // Reset search state
      this.currentFilters = undefined;
      this.currentQuery = undefined;
      this.currentSort = undefined;
      this.currentPage = 1;
      this.currentPageSize = 20;
      this.productsSignal.set(this.manager.getAllProducts());
      this.loadingSignal.set(false);
      this.errorSignal.set(null);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.errorSignal.set(err);
      this.loadingSignal.set(false);
      throw err;
    }
  }

  /**
   * Search products with filters, sorting, and pagination
   */
  search(options: SearchOptions): SearchResult {
    return ProductSearch.search(this.manager.getAllProducts(), options);
  }

  /**
   * Set filters and update products
   */
  setFilters(filters: ProductFilter): void {
    const result = this.search({ filters });
    this.productsSignal.set(result.products);
  }

  /**
   * Set search query and update products
   */
  setSearchQuery(query: string): void {
    const result = this.search({ query });
    this.productsSignal.set(result.products);
  }

  /**
   * Set sort options and update products
   */
  setSortBy(sort: ProductSort): void {
    const result = this.search({ sort });
    this.productsSignal.set(result.products);
  }

  /**
   * Set page and update products
   */
  setPage(page: number, pageSize?: number): void {
    const result = this.search({ page, pageSize });
    this.productsSignal.set(result.products);
  }

  /**
   * Set page size and update products
   */
  setLimit(pageSize: number): void {
    const result = this.search({ pageSize });
    this.productsSignal.set(result.products);
  }

  /**
   * Refresh products
   */
  refreshProducts(): void {
    this.productsSignal.set(this.manager.getAllProducts());
  }

  /**
   * Get total pages (computed from current search)
   */
  totalPages(): number {
    const result = this.search({ 
      filters: this.currentFilters,
      query: this.currentQuery,
      sort: this.currentSort,
      pageSize: this.currentPageSize,
    });
    return result.totalPages;
  }
}

