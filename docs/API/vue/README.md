# Vue API Reference

Documentación completa de la API de `@alejandrovrod/blocks-vue`.

## 📦 Instalación

```bash
npm install @alejandrovrod/blocks-core @alejandrovrod/blocks-vue
```

## 📚 Tabla de Contenidos

- [Composables](#composables)
  - [useCart](#usecart)
  - [useCartSync](#usecartsync)
  - [useCartHistory](#usecarthistory)
  - [useProducts](#useproducts)
  - [useProductSearch](#useproductsearch)
  - [useWishlist](#usewishlist)
  - [useCheckout](#usecheckout)
  - [useShipping](#useshipping)
- [Componentes](#componentes)

---

## Composables

### useCart

Composable para gestionar el estado del carrito.

#### Import

```vue
<script setup>
import { useCart } from '@alejandrovrod/blocks-vue';
</script>
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `CartManagerOptions` | No | Opciones de configuración del carrito |

#### Retorno (Outputs)

```typescript
{
  items: Readonly<Ref<CartItem[]>>;
  total: Readonly<Ref<number>>;
  itemCount: Readonly<Ref<number>>;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
}
```

#### Ejemplo

```vue
<template>
  <div>
    <p>Items: {{ items.length }}</p>
    <p>Total: ${{ total.toFixed(2) }}</p>
    <button @click="addItem(product)">Agregar</button>
  </div>
</template>

<script setup>
import { useCart } from '@alejandrovrod/blocks-vue';
import type { Product } from '@alejandrovrod/blocks-core';

const { items, total, addItem } = useCart();

const product = {
  id: '1',
  name: 'Producto',
  price: 99.99
};
</script>
```

---

### useCartSync

Composable para sincronizar el carrito entre pestañas.

#### Import

```vue
<script setup>
import { useCartSync } from '@alejandrovrod/blocks-vue';
</script>
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `CartSyncOptions` | No | Opciones de sincronización |

#### Retorno (Outputs)

```typescript
{
  isSyncing: Readonly<Ref<boolean>>;
}
```

---

### useCartHistory

Composable para gestionar el historial del carrito.

#### Import

```vue
<script setup>
import { useCartHistory } from '@alejandrovrod/blocks-vue';
</script>
```

#### Retorno (Outputs)

```typescript
{
  entries: Readonly<Ref<CartHistoryEntry[]>>;
  saveEntry: (label?: string) => void;
  restoreEntry: (entryId: string) => boolean;
  removeEntry: (entryId: string) => void;
  clearHistory: () => void;
}
```

---

### useProducts

Composable para gestionar productos.

#### Retorno (Outputs)

```typescript
{
  products: Readonly<Ref<Product[]>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<Error | null>>;
  getProductById: (id: string) => Product | undefined;
  getProductBySku: (sku: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  getProductsByTag: (tag: string) => Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  setProducts: (products: Product[]) => void;
  setFilters: (filters: ProductFilter) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: ProductSort) => void;
}
```

---

### useProductSearch

Composable para búsqueda de productos.

#### Retorno (Outputs)

```typescript
{
  query: Ref<string>;
  results: Readonly<Ref<SearchResult>>;
  setQuery: (query: string) => void;
  setOptions: (options: SearchOptions) => void;
  search: (query: string, options?: SearchOptions) => SearchResult;
}
```

---

### useWishlist

Composable para gestionar la lista de deseos.

#### Retorno (Outputs)

```typescript
{
  items: Readonly<Ref<WishlistItem[]>>;
  hasProduct: (productId: string) => boolean;
  addItem: (product: Product) => void;
  removeItem: (itemId: string) => void;
  removeProduct: (productId: string) => void;
  clear: () => void;
}
```

---

### useCheckout

Composable para gestionar el proceso de checkout.

#### Retorno (Outputs)

```typescript
{
  session: Readonly<Ref<CheckoutSession | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<Error | null>>;
  initializeSession: (subtotal: number, cartId?: string) => void;
  setShippingAddress: (address: ShippingAddress) => CheckoutValidationResult;
  setBillingAddress: (address: BillingAddress) => CheckoutValidationResult;
  setPaymentMethod: (method: PaymentMethodDetails) => void;
  validateCheckout: () => CheckoutValidationResult;
  createPayment: () => Promise<PaymentResult>;
}
```

---

### useShipping

Composable para calcular costos de envío.

#### Retorno (Outputs)

```typescript
{
  rates: Readonly<Ref<ShippingRate[]>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<Error | null>>;
  selectedOption: Readonly<Ref<ShippingOption | null>>;
  calculateRates: (request: ShippingCalculationRequest) => Promise<ShippingRate[]>;
  selectOption: (optionId: string) => void;
  getAvailableOptions: () => ShippingOption[];
}
```

---

## Componentes

Los componentes de Vue se importan directamente desde sus archivos `.vue`:

```vue
<script setup>
import CartView from '@alejandrovrod/blocks-vue/components/CartView.vue';
import ProductCard from '@alejandrovrod/blocks-vue/components/ProductCard.vue';
import CartSummary from '@alejandrovrod/blocks-vue/components/CartSummary.vue';
</script>
```

### Componentes Disponibles

- `CartView.vue` - Vista completa del carrito
- `CartItem.vue` - Item individual del carrito
- `CartSummary.vue` - Resumen del carrito
- `CartHistoryView.vue` - Vista del historial
- `ProductCard.vue` - Tarjeta de producto

### Props de los Componentes

Los componentes Vue siguen la misma estructura de props que los componentes React. Consulta la [documentación de React](./react/README.md) para detalles de props, ya que son equivalentes.

---

## Ejemplo Completo

```vue
<template>
  <div class="app">
    <CartView 
      :enable-sync="true"
      class="my-cart"
    />
    <CartSummary 
      :show-tax="true"
      :tax-rate="0.21"
      @checkout="handleCheckout"
    />
  </div>
</template>

<script setup>
import { useCart } from '@alejandrovrod/blocks-vue';
import CartView from '@alejandrovrod/blocks-vue/components/CartView.vue';
import CartSummary from '@alejandrovrod/blocks-vue/components/CartSummary.vue';

const { items, total } = useCart();

function handleCheckout() {
  console.log('Checkout!', total.value);
}
</script>
```

---

## Más Información

- [Guía de Instalación](../INSTALLATION.md)
- [Core API](./core/README.md)
- [React API](./react/README.md) - Para referencia de props equivalentes



