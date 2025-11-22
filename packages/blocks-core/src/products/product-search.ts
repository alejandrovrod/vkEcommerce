/**
 * Product search engine
 */

import type { Product, SearchOptions, SearchResult, ProductRelevance } from './types';
import { ProductFilterHelper } from './product-filter';
import { ProductSorter } from './product-sorter';

/**
 * Product search implementation
 */
export class ProductSearch {
  /**
   * Search products with text query, filters, and sorting
   */
  static search(products: Product[], options: SearchOptions = {}): SearchResult {
    let results = [...products];

    // Text search
    if (options.query && options.query.trim().length > 0) {
      results = this.textSearch(results, options.query);
    }

    // Apply filters
    if (options.filters) {
      results = ProductFilterHelper.filter(results, options.filters);
    }

    // Filter out of stock if needed
    if (!options.includeOutOfStock) {
      results = results.filter((product) => {
        return product.inStock !== false && (product.stock === undefined || product.stock > 0);
      });
    }

    // Apply sorting
    if (options.sort) {
      results = ProductSorter.sort(results, options.sort);
    } else {
      // Default sort by relevance if there was a text query
      if (options.query) {
        results = this.sortByRelevance(results, options.query);
      }
    }

    // Pagination
    const page = options.page || 1;
    const pageSize = options.pageSize || 20;
    const total = results.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = results.slice(startIndex, endIndex);

    // Generate facets
    const facets = this.generateFacets(products, options.filters);

    return {
      products: paginatedResults,
      total,
      page,
      pageSize,
      totalPages,
      facets,
    };
  }

  /**
   * Text search with relevance scoring
   */
  private static textSearch(products: Product[], query: string): Product[] {
    const searchTerms = query.toLowerCase().trim().split(/\s+/);
    const relevances: ProductRelevance[] = [];

    products.forEach((product) => {
      let score = 0;
      const matchedFields: string[] = [];

      // Search in name (highest weight)
      const nameMatches = this.countMatches(product.name.toLowerCase(), searchTerms);
      if (nameMatches > 0) {
        score += nameMatches * 10;
        matchedFields.push('name');
      }

      // Search in description
      if (product.description) {
        const descMatches = this.countMatches(product.description.toLowerCase(), searchTerms);
        if (descMatches > 0) {
          score += descMatches * 5;
          matchedFields.push('description');
        }
      }

      // Search in SKU
      if (product.sku) {
        const skuMatches = this.countMatches(product.sku.toLowerCase(), searchTerms);
        if (skuMatches > 0) {
          score += skuMatches * 8;
          matchedFields.push('sku');
        }
      }

      // Search in tags
      if (product.tags) {
        product.tags.forEach((tag) => {
          const tagMatches = this.countMatches(tag.toLowerCase(), searchTerms);
          if (tagMatches > 0) {
            score += tagMatches * 3;
            matchedFields.push('tags');
          }
        });
      }

      // Search in category name
      if (product.category?.name) {
        const catMatches = this.countMatches(product.category.name.toLowerCase(), searchTerms);
        if (catMatches > 0) {
          score += catMatches * 4;
          matchedFields.push('category');
        }
      }

      // Search in attributes
      if (product.attributes) {
        product.attributes.forEach((attr) => {
          const attrValue = String(attr.value).toLowerCase();
          const attrMatches = this.countMatches(attrValue, searchTerms);
          if (attrMatches > 0) {
            score += attrMatches * 2;
            matchedFields.push('attributes');
          }
        });
      }

      if (score > 0) {
        relevances.push({
          product,
          score,
          matchedFields: [...new Set(matchedFields)],
        });
      }
    });

    // Sort by relevance score (descending)
    relevances.sort((a, b) => b.score - a.score);

    return relevances.map((r) => r.product);
  }

  /**
   * Count how many search terms match in a text
   */
  private static countMatches(text: string, searchTerms: string[]): number {
    let matches = 0;
    searchTerms.forEach((term) => {
      if (text.includes(term)) {
        matches++;
      }
    });
    return matches;
  }

  /**
   * Sort by relevance (for when no explicit sort is provided)
   */
  private static sortByRelevance(products: Product[], _query: string): Product[] {
    // If products were already filtered by text search, they're already sorted by relevance
    // Otherwise, just return as-is
    return products;
  }

  /**
   * Generate search facets for filtering UI
   */
  private static generateFacets(
    products: Product[],
    _currentFilters?: SearchOptions['filters']
  ): SearchResult['facets'] {
    const facets = ProductFilterHelper.getFacets(products);

    return {
      categories: Array.from(facets.categories.entries()).map(([id, count]) => ({
        id,
        name: id, // In real implementation, would look up category name
        count,
      })),
      priceRanges: facets.priceRanges,
      attributes: Array.from(facets.attributes.entries()).map(([name, values]) => ({
        name,
        values: Array.from(values.entries()).map(([value, count]) => ({
          value,
          count,
        })),
      })),
      tags: Array.from(facets.tags.entries()).map(([tag, count]) => ({
        tag,
        count,
      })),
    };
  }
}

