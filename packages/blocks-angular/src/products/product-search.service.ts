/**
 * Angular service for product search using Signals
 */

import { Injectable, signal, computed } from '@angular/core';
import { ProductSearch } from '@vk/blocks-core';
import type { Product, SearchOptions, SearchResult } from '@vk/blocks-core';

/**
 * Angular service for product search
 */
@Injectable({
  providedIn: 'root',
})
export class ProductSearchService {
  private querySignal = signal<string>('');
  private optionsSignal = signal<SearchOptions>({});
  private resultsSignal = signal<SearchResult>({
    products: [],
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  });

  // Public readonly signals
  readonly query = this.querySignal.asReadonly();
  readonly options = this.optionsSignal.asReadonly();
  readonly results = this.resultsSignal.asReadonly();

  constructor(initialOptions?: SearchOptions) {
    if (initialOptions) {
      this.optionsSignal.set(initialOptions);
      this.querySignal.set(initialOptions.query || '');
    }
  }

  /**
   * Set search query
   */
  setQuery(query: string): void {
    this.querySignal.set(query);
  }

  /**
   * Update search options
   */
  setOptions(options: Partial<SearchOptions>): void {
    this.optionsSignal.update((current) => ({ ...current, ...options }));
  }

  /**
   * Search products
   */
  search(products: Product[], searchOptions?: SearchOptions): void {
    const finalOptions: SearchOptions = {
      ...this.optionsSignal(),
      ...searchOptions,
      query: searchOptions?.query ?? this.querySignal(),
    };

    const result = ProductSearch.search(products, finalOptions);
    this.resultsSignal.set(result);
  }

  /**
   * Clear search
   */
  clear(): void {
    this.querySignal.set('');
    this.optionsSignal.set({});
    this.resultsSignal.set({
      products: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    });
  }
}

