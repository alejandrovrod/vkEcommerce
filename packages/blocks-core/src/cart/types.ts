/**
 * Product type with common fields and support for dynamic properties
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Cart item with product and quantity
 */
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: number;
}

/**
 * Cart state
 */
export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

/**
 * Options for cart manager
 */
export interface CartManagerOptions {
  /**
   * Custom storage implementation. If provided, this will be used instead of default storage.
   * Useful for custom persistence strategies (IndexedDB, API, sessionStorage, etc.)
   */
  storage?: import('./storage').CartStorage;
  
  /**
   * Storage key for default localStorage implementation.
   * Only used if `storage` is not provided and `persist` is true.
   * @default 'vkecomblocks-cart'
   */
  storageKey?: string;
  
  /**
   * Enable persistence using localStorage (default implementation).
   * Only used if `storage` is not provided.
   * @default false
   */
  persist?: boolean;
  
  /**
   * Callback fired when cart state changes
   */
  onStateChange?: (state: CartState) => void;
  
  /**
   * Error callback for handling errors
   */
  onError?: (error: Error) => void;
}

/**
 * Callback function type for state changes
 */
export type StateChangeCallback = (state: CartState) => void;

/**
 * Error callback function type
 */
export type ErrorCallback = (error: Error) => void;





