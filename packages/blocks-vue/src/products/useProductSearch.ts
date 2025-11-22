/**
 * Vue composable for product search
 */

import { ref, computed } from 'vue';
import { ProductSearch } from '@vk/blocks-core';
import type { Product, SearchOptions, SearchResult } from '@vk/blocks-core';

/**
 * Use product search composable return type
 */
export interface UseProductSearchReturn {
  results: import('vue').Ref<SearchResult>;
  query: import('vue').Ref<string>;
  setQuery: (query: string) => void;
  options: import('vue').Ref<SearchOptions>;
  setOptions: (options: Partial<SearchOptions>) => void;
  search: (products: Product[], options?: SearchOptions) => void;
  clear: () => void;
}

/**
 * Vue composable for product search
 */
export function useProductSearch(initialOptions?: SearchOptions): UseProductSearchReturn {
  const query = ref(initialOptions?.query || '');
  const options = ref<SearchOptions>(initialOptions || {});
  const results = ref<SearchResult>({
    products: [],
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 0,
  });

  const search = (products: Product[], searchOptions?: SearchOptions) => {
    const finalOptions: SearchOptions = {
      ...options.value,
      ...searchOptions,
      query: searchOptions?.query ?? query.value,
    };
    
    const result = ProductSearch.search(products, finalOptions);
    results.value = result;
  };

  const setQuery = (newQuery: string) => {
    query.value = newQuery;
  };

  const setOptions = (newOptions: Partial<SearchOptions>) => {
    options.value = { ...options.value, ...newOptions };
  };

  const clear = () => {
    query.value = '';
    options.value = initialOptions || {};
    results.value = {
      products: [],
      total: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0,
    };
  };

  return {
    results: readonly(results),
    query: readonly(query),
    setQuery,
    options: readonly(options),
    setOptions,
    search,
    clear,
  };
}

import { readonly } from 'vue';

