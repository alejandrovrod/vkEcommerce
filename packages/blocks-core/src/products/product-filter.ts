/**
 * Product filtering system
 */

import type { Product, ProductFilter as ProductFilterType } from './types';

/**
 * Product filter implementation
 */
export class ProductFilterHelper {
  /**
   * Filter products based on filter criteria
   */
  static filter(products: Product[], filters: ProductFilterType): Product[] {
    let filtered = [...products];

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter((product) => {
        const price = product.price;
        const min = filters.priceRange?.min ?? 0;
        const max = filters.priceRange?.max ?? Infinity;
        return price >= min && price <= max;
      });
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((product) => {
        return product.categoryId && filters.categories?.includes(product.categoryId);
      });
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((product) => {
        return product.tags && filters.tags?.some((tag) => product.tags?.includes(tag));
      });
    }

    // Stock availability filter
    if (filters.inStock !== undefined) {
      filtered = filtered.filter((product) => {
        if (filters.inStock) {
          return product.inStock !== false && (product.stock === undefined || product.stock > 0);
        }
        return product.inStock === false || product.stock === 0;
      });
    }

    // Attribute filters
    if (filters.attributes && filters.attributes.length > 0) {
      filtered = filtered.filter((product) => {
        return filters.attributes?.every((filterAttr) => {
          // Check product attributes
          const productAttr = product.attributes?.find((attr) => attr.name === filterAttr.name);
          if (productAttr && filterAttr.values.includes(productAttr.value)) {
            return true;
          }

          // Check variant attributes
          if (product.variants) {
            return product.variants.some((variant) => {
              const variantAttr = variant.attributes?.find((attr) => attr.name === filterAttr.name);
              return variantAttr && filterAttr.values.includes(variantAttr.value);
            });
          }

          return false;
        });
      });
    }

    // Vendor filter
    if (filters.vendor) {
      filtered = filtered.filter((product) => {
        return product.metadata?.vendor === filters.vendor;
      });
    }

    // Rating filter
    if (filters.minRating !== undefined) {
      filtered = filtered.filter((product) => {
        const rating = product.metadata?.rating as number | undefined;
        return rating !== undefined && rating >= filters.minRating!;
      });
    }

    return filtered;
  }

  /**
   * Get available filter values from products (for facets)
   */
  static getFacets(products: Product[]): {
    categories: Map<string, number>;
    priceRanges: Array<{ min: number; max: number; count: number }>;
    attributes: Map<string, Map<string | number, number>>;
    tags: Map<string, number>;
  } {
    const categories = new Map<string, number>();
    const priceRanges: Array<{ min: number; max: number; count: number }> = [];
    const attributes = new Map<string, Map<string | number, number>>();
    const tags = new Map<string, number>();

    // Collect all prices for range calculation
    const prices = products.map((p) => p.price).filter((p) => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    // Create price ranges (5 ranges)
    if (minPrice < maxPrice) {
      const rangeSize = (maxPrice - minPrice) / 5;
      for (let i = 0; i < 5; i++) {
        const min = minPrice + rangeSize * i;
        const max = i === 4 ? maxPrice : minPrice + rangeSize * (i + 1);
        const count = products.filter((p) => p.price >= min && p.price < max).length;
        if (count > 0) {
          priceRanges.push({ min, max, count });
        }
      }
    }

    // Collect categories, tags, and attributes
    products.forEach((product) => {
      // Categories
      if (product.categoryId) {
        categories.set(product.categoryId, (categories.get(product.categoryId) || 0) + 1);
      }

      // Tags
      if (product.tags) {
        product.tags.forEach((tag) => {
          tags.set(tag, (tags.get(tag) || 0) + 1);
        });
      }

      // Attributes
      if (product.attributes) {
        product.attributes.forEach((attr) => {
          if (!attributes.has(attr.name)) {
            attributes.set(attr.name, new Map());
          }
          const attrMap = attributes.get(attr.name)!;
          attrMap.set(attr.value, (attrMap.get(attr.value) || 0) + 1);
        });
      }

      // Variant attributes
      if (product.variants) {
        product.variants.forEach((variant) => {
          if (variant.attributes) {
            variant.attributes.forEach((attr) => {
              if (!attributes.has(attr.name)) {
                attributes.set(attr.name, new Map());
              }
              const attrMap = attributes.get(attr.name)!;
              attrMap.set(attr.value, (attrMap.get(attr.value) || 0) + 1);
            });
          }
        });
      }
    });

    return {
      categories,
      priceRanges,
      attributes,
      tags,
    };
  }
}





