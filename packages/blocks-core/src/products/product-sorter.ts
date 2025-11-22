/**
 * Product sorting system
 */

import type { Product, ProductSort } from './types';

/**
 * Product sorter implementation
 */
export class ProductSorter {
  /**
   * Sort products based on sort criteria
   */
  static sort(products: Product[], sort: ProductSort): Product[] {
    const sorted = [...products];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'price':
          comparison = a.price - b.price;
          break;

        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;

        case 'relevance':
          // Relevance is typically calculated during search
          // Fallback to name if not available
          comparison = a.name.localeCompare(b.name);
          break;

        case 'createdAt':
          comparison = (a.createdAt || 0) - (b.createdAt || 0);
          break;

        case 'updatedAt':
          comparison = (a.updatedAt || 0) - (b.updatedAt || 0);
          break;

        case 'rating':
          const ratingA = (a.metadata?.rating as number) || 0;
          const ratingB = (b.metadata?.rating as number) || 0;
          comparison = ratingA - ratingB;
          break;

        case 'popularity':
          const popularityA = (a.metadata?.popularity as number) || 0;
          const popularityB = (b.metadata?.popularity as number) || 0;
          comparison = popularityA - popularityB;
          break;

        default:
          comparison = 0;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  /**
   * Sort products by multiple criteria (priority order)
   */
  static multiSort(products: Product[], sorts: ProductSort[]): Product[] {
    if (sorts.length === 0) {
      return products;
    }

    const sorted = [...products];

    sorted.sort((a, b) => {
      for (const sort of sorts) {
        let comparison = 0;

        switch (sort.field) {
          case 'price':
            comparison = a.price - b.price;
            break;

          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;

          case 'relevance':
            comparison = a.name.localeCompare(b.name);
            break;

          case 'createdAt':
            comparison = (a.createdAt || 0) - (b.createdAt || 0);
            break;

          case 'updatedAt':
            comparison = (a.updatedAt || 0) - (b.updatedAt || 0);
            break;

          case 'rating':
            const ratingA = (a.metadata?.rating as number) || 0;
            const ratingB = (b.metadata?.rating as number) || 0;
            comparison = ratingA - ratingB;
            break;

          case 'popularity':
            const popularityA = (a.metadata?.popularity as number) || 0;
            const popularityB = (b.metadata?.popularity as number) || 0;
            comparison = popularityA - popularityB;
            break;

          default:
            comparison = 0;
        }

        if (comparison !== 0) {
          return sort.direction === 'asc' ? comparison : -comparison;
        }
      }

      return 0;
    });

    return sorted;
  }
}

