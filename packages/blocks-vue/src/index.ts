export * from './composables/useCart';
export * from './composables/useCartSync';
export * from './composables/useCartHistory';

// Checkout exports
export * from './checkout/useCheckout';

// Products exports
export * from './products/useProducts';
export * from './products/useProductSearch';

// Wishlist exports
export * from './wishlist/useWishlist';

// Shipping exports
export * from './shipping/useShipping';

// Vue components are exported as separate files
// Import them directly: 
//   import CartItem from '@alejandrovrod/blocks-vue/components/CartItem.vue'
//   import ProductCard from '@alejandrovrod/blocks-vue/components/ProductCard.vue'
// Note: Your bundler must support .vue files (Vite, Webpack with vue-loader, etc.)


