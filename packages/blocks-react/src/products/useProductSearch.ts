/**
 * React hook for product search
 */

import { useState, useCallback } from 'react';
import { ProductSearch } from '@vk/blocks-core';
import type { Product, SearchOptions, SearchResult } from '@vk/blocks-core';

/**
 * Use product search hook return type
 */
export interface UseProductSearchReturn {
  /**
   * Search results
   */
  results: SearchResult;
  
  /**
   * Search query
   */
  query: string;
  
  /**
   * Set search query
   */
  setQuery: (query: string) => void;
  
  /**
   * Search options
   */
  options: SearchOptions;
  
  /**
   * Update search options
   */
  setOptions: (options: Partial<SearchOptions>) => void;
  
  /**
   * Perform search
   */
  search: (products: Product[], options?: SearchOptions) => void;
  
  /**
   * Clear search
   */
  clear: () => void;
}

/**
 * React hook for product search
 */
export function useProductSearch(initialOptions?: SearchOptions): UseProductSearchReturn {
  const [query, setQuery] = useState(initialOptions?.query || '');
  const [options, setOptionsState] = useState<SearchOptions>(initialOptions || {});
  const [results, setResults] = useState<SearchResult>({
    products: [],
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  });

  const search = useCallback((products: Product[], searchOptions?: SearchOptions) => {
    const finalOptions: SearchOptions = {
      ...options,
      ...searchOptions,
      query: searchOptions?.query ?? query,
    };
    
    const result = ProductSearch.search(products, finalOptions);
    setResults(result);
  }, [options, query]);

  const setOptions = useCallback((newOptions: Partial<SearchOptions>) => {
    setOptionsState((prev) => ({ ...prev, ...newOptions }));
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setOptionsState(initialOptions || {});
    setResults({
      products: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    });
  }, [initialOptions]);

  return {
    results,
    query,
    setQuery,
    options,
    setOptions,
    search,
    clear,
  };
}

