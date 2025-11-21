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
  storageKey?: string;
  persist?: boolean;
  onStateChange?: (state: CartState) => void;
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

