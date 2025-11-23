# API Reference

Documentación completa de la API de todos los paquetes de vkecomblocks.

## 📚 Paquetes

### Core (`@alejandrovrod/blocks-core`)

Lógica base framework-agnostic. Contiene todas las funciones, managers y tipos que son utilizados por los wrappers de frameworks.

- **[Core API](./core/README.md)** - Funciones, managers, tipos y storage

**Características principales:**
- Gestión de carrito (CartManager, CartStore, CartSync, CartHistory)
- Gestión de productos (ProductManager, ProductSearch)
- Lista de deseos (WishlistManager)
- Checkout (CheckoutManager, integración con Mercado Pago)
- Cálculo de envíos (ShippingManager, proveedores LATAM)

---

### React (`@alejandrovrod/blocks-react`)

Hooks y componentes para React 18+.

- **[React API](./react/README.md)** - Hooks, componentes y props

**Características principales:**
- Hooks: `useCart`, `useProducts`, `useWishlist`, `useCheckout`, `useShipping`
- Componentes: `CartView`, `ProductCard`, `CartSummary`, `WishlistView`, etc.
- Sincronización entre pestañas
- Historial del carrito

---

### Vue (`@alejandrovrod/blocks-vue`)

Composables y componentes para Vue 3.

- **[Vue API](./vue/README.md)** - Composables y componentes

**Características principales:**
- Composables: `useCart`, `useProducts`, `useWishlist`, `useCheckout`, `useShipping`
- Componentes Vue: `CartView.vue`, `ProductCard.vue`, `CartSummary.vue`, etc.
- Compatible con Composition API
- Signals reactivos

---

### Angular (`@alejandrovrod/blocks-angular`)

Servicios y componentes para Angular 21+.

- **[Angular API](./angular/README.md)** - Servicios, componentes e inputs/outputs

**Características principales:**
- Servicios: `CartService`, `ProductService`, `WishlistService`, `CheckoutService`, `ShippingService`
- Componentes standalone: `CartViewComponent`, `ProductCardComponent`, etc.
- Uso de Angular Signals
- Templates en archivos HTML separados

---

## 🔍 Búsqueda Rápida

### Por Funcionalidad

#### Carrito de Compras
- **Core**: `createCartManager`, `CartManager`, `CartStore`, `CartSync`, `CartHistory`
- **React**: `useCart`, `useCartSync`, `useCartHistory`, `<CartView>`, `<CartItem>`, `<CartSummary>`, `<CartHistoryView>`
- **Vue**: `useCart()`, `useCartSync()`, `useCartHistory()`, `<CartView>`, `<CartItem>`, `<CartSummary>`, `<CartHistoryView>`
- **Angular**: `CartService`, `CartSyncService`, `CartHistoryService`, `<vk-cart-view>`, `<vk-cart-item>`, `<vk-cart-summary>`, `<vk-cart-history-view>`

#### Productos
- **Core**: `createProductManager`, `ProductManager`, `ProductSearch`
- **React**: `useProducts`, `useProductSearch`, `<ProductCard>`, `<ProductList>`, `<ProductSearch>`, `<ProductFilters>`
- **Vue**: `useProducts()`, `useProductSearch()`, `<ProductCard>`, `<ProductList>`, `<ProductSearch>`, `<ProductFilters>`
- **Angular**: `ProductService`, `ProductSearchService`, `<vk-product-card>`, `<vk-product-list>`, `<vk-product-search>`, `<vk-product-filters>`

#### Lista de Deseos
- **Core**: `createWishlistManager`, `WishlistManager`
- **React**: `useWishlist`, `<WishlistButton>`, `<WishlistView>`
- **Vue**: `useWishlist()`, `<WishlistButton>`, `<WishlistView>`
- **Angular**: `WishlistService`, `<vk-wishlist-button>`, `<vk-wishlist-view>`

#### Checkout
- **Core**: `createCheckoutManager`, `CheckoutManager`
- **React**: `useCheckout`, `<CheckoutForm>`, `<PaymentMethodSelector>`, `<MercadoPagoButton>`
- **Vue**: `useCheckout()`, `<CheckoutForm>`, `<PaymentMethodSelector>`, `<MercadoPagoButton>`
- **Angular**: `CheckoutService`, `<vk-checkout-form>`, `<vk-payment-method-selector>`, `<vk-mercadopago-button>`

#### Envíos
- **Core**: `createShippingManager`, `ShippingManager`
- **React**: `useShipping`, `<ShippingCalculator>`, `<ShippingOptions>`, `<AddressForm>`
- **Vue**: `useShipping()`, `<ShippingCalculator>`, `<ShippingOptions>`, `<AddressForm>`
- **Angular**: `ShippingService`, `<vk-shipping-calculator>`, `<vk-shipping-options>`, `<vk-address-form>`

---

## 📖 Guías de Uso

### React

```tsx
import { useCart, CartView, ProductCard } from '@alejandrovrod/blocks-react';

function App() {
  const { items, addItem } = useCart();
  
  return (
    <div>
      <ProductCard product={product} onAddToCart={addItem} />
      <CartView />
    </div>
  );
}
```

### Vue

```vue
<script setup>
import { useCart } from '@alejandrovrod/blocks-vue';
import CartView from '@alejandrovrod/blocks-vue/components/CartView.vue';
</script>

<template>
  <CartView />
</template>
```

### Angular

```typescript
import { CartService } from '@alejandrovrod/blocks-angular';

@Component({
  template: '<vk-cart-view></vk-cart-view>'
})
export class AppComponent {
  constructor(public cart: CartService) {}
}
```

---

## 🔗 Enlaces

- [Guía de Instalación](../INSTALLATION.md)
- [Guía de Desarrollo](../DEVELOPMENT.md)
- [Documentación Principal](../README.md)



