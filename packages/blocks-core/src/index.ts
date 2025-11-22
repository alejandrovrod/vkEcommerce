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

// Storage exports
export type {
  CartStorage,
  AsyncCartStorage,
} from './cart/storage';

export {
  LocalStorageCartStorage,
  SessionStorageCartStorage,
  MemoryCartStorage,
  AsyncStorageAdapter,
} from './cart/storage';

// IndexedDB storage (optional, requires initialization)
export { IndexedDBCartStorage } from './cart/storage/indexeddb-storage';

// Cart improvements
export { CartSync } from './cart/cart-sync';
export { APICartStorage } from './cart/api-storage';
export { CartHistory } from './cart/cart-history';
export type { CartSyncOptions } from './cart/cart-sync';
export type { APIStorageOptions } from './cart/api-storage';
export type { CartHistoryOptions, CartHistoryEntry } from './cart/cart-history';

// Convenience exports
export { createCartManager } from './cart/cart-manager';

// Checkout exports
export * from './checkout/types';
export * from './checkout/checkout-manager';
export * from './checkout/mercado-pago-adapter';
export * from './checkout/payment-processor';

// Explicit type exports for checkout
export type {
  BillingAddress,
  PaymentMethodDetails,
  CheckoutSession,
  CheckoutOptions,
  PaymentResult,
  CheckoutValidationResult,
} from './checkout/types';

// Products exports
export * from './products/types';
export * from './products/product-manager';
export * from './products/product-search';
export { ProductFilterHelper } from './products/product-filter';
export * from './products/product-sorter';

// Wishlist exports
export * from './wishlist/types';
export * from './wishlist/wishlist-store';
export * from './wishlist/wishlist-manager';

// Shipping exports
export * from './shipping/types';
export * from './shipping/shipping-manager';
export * from './shipping/shipping-calculator';
export * from './shipping/shipping-providers/generic-provider';
export * from './shipping/shipping-providers/api-provider-adapter';
export * from './shipping/shipping-providers/latam-providers/correos-argentina';
export * from './shipping/shipping-providers/latam-providers/correos-chile';
export * from './shipping/shipping-providers/latam-providers/oca-argentina';
export * from './shipping/shipping-providers/latam-providers/andreani-argentina';
export * from './shipping/shipping-providers/latam-providers/dhl-latam';

// Explicit type exports for shipping
export type {
  ShippingAddress,
} from './shipping/types';

