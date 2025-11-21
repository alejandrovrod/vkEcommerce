// Cart exports
export * from './cart/types';
export * from './cart/cart-store';
export * from './cart/cart-manager';
export * from './cart/storage';

// Explicit type exports for better IDE support
export type {
  Product,
  CartItem,
  CartState,
  CartManagerOptions,
  StateChangeCallback,
  ErrorCallback,
} from './cart/types';

// Convenience exports
export { createCartManager } from './cart/cart-manager';

