/**
 * Products module types
 */

/**
 * Product category
 */
export interface ProductCategory {
  id: string;
  name: string;
  slug?: string;
  parentId?: string;
  description?: string;
  image?: string;
}

/**
 * Product attribute (dynamic attributes like size, color, etc.)
 */
export interface ProductAttribute {
  name: string;
  value: string | number;
  displayName?: string;
}

/**
 * Product variant (e.g., different sizes, colors)
 */
export interface ProductVariant {
  id: string;
  sku?: string;
  name?: string;
  price?: number;
  compareAtPrice?: number;
  stock?: number;
  attributes?: ProductAttribute[];
  image?: string;
  barcode?: string;
}

/**
 * Product image
 */
export interface ProductImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  isPrimary?: boolean;
}

/**
 * Product (extended from cart Product)
 */
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  images?: ProductImage[];
  sku?: string;
  barcode?: string;
  stock?: number;
  inStock?: boolean;
  categoryId?: string;
  category?: ProductCategory;
  tags?: string[];
  attributes?: ProductAttribute[];
  variants?: ProductVariant[];
  weight?: number; // in kg
  dimensions?: {
    length?: number; // in cm
    width?: number;
    height?: number;
  };
  metadata?: Record<string, unknown>;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Product filter options
 */
export interface ProductFilter {
  /**
   * Price range
   */
  priceRange?: {
    min?: number;
    max?: number;
  };
  
  /**
   * Category IDs
   */
  categories?: string[];
  
  /**
   * Tags
   */
  tags?: string[];
  
  /**
   * Stock availability
   */
  inStock?: boolean;
  
  /**
   * Custom attribute filters
   */
  attributes?: Array<{
    name: string;
    values: (string | number)[];
  }>;
  
  /**
   * Search text (for text search)
   */
  searchText?: string;
  
  /**
   * Vendor/brand filter
   */
  vendor?: string;
  
  /**
   * Rating filter (min rating)
   */
  minRating?: number;
}

/**
 * Product sort option
 */
export type ProductSortField = 'price' | 'name' | 'relevance' | 'createdAt' | 'updatedAt' | 'rating' | 'popularity';
export type SortDirection = 'asc' | 'desc';

export interface ProductSort {
  field: ProductSortField;
  direction: SortDirection;
}

/**
 * Search options
 */
export interface SearchOptions {
  /**
   * Search query text
   */
  query?: string;
  
  /**
   * Filters to apply
   */
  filters?: ProductFilter;
  
  /**
   * Sort options
   */
  sort?: ProductSort;
  
  /**
   * Pagination
   */
  page?: number;
  pageSize?: number;
  
  /**
   * Include out of stock products
   */
  includeOutOfStock?: boolean;
}

/**
 * Search result
 */
export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  facets?: SearchFacets;
}

/**
 * Search facets (for filtering UI)
 */
export interface SearchFacets {
  categories?: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  priceRanges?: Array<{
    min: number;
    max: number;
    count: number;
  }>;
  attributes?: Array<{
    name: string;
    values: Array<{
      value: string | number;
      count: number;
    }>;
  }>;
  tags?: Array<{
    tag: string;
    count: number;
  }>;
}

/**
 * Product manager options
 */
export interface ProductManagerOptions {
  /**
   * Products data source (array of products or async function)
   */
  products?: Product[] | (() => Promise<Product[]>) | (() => Product[]);
  
  /**
   * Enable caching
   */
  enableCache?: boolean;
  
  /**
   * Cache TTL in milliseconds
   */
  cacheTTL?: number;
  
  /**
   * On products update callback
   */
  onUpdate?: (products: Product[]) => void;
  
  /**
   * On error callback
   */
  onError?: (error: Error) => void;
}

/**
 * Product relevance score (for search)
 */
export interface ProductRelevance {
  product: Product;
  score: number;
  matchedFields?: string[];
}

