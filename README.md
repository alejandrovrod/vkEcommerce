# vkecomblocks

Modular ecommerce blocks for React, Vue, and Angular. Framework-agnostic core with lightweight framework wrappers.

## Packages

- `@vk/blocks-core` - Core logic (TypeScript, no framework dependencies)
- `@vk/blocks-react` - React hooks and components
- `@vk/blocks-vue` - Vue 3 composables and components
- `@vk/blocks-angular` - Angular services and components

## Compatibility

### Framework Versions

- **React**: >=18.0.0 (tested with 18.3.1)
- **Vue**: >=3.0.0 (tested with 3.5.13)
- **Angular**: >=18.0.0 (tested with 19.0.0)
- **TypeScript**: >=5.6.0 (recommended: 5.6.3)
- **Node.js**: >=18.0.0 (recommended: 20.x or 22.x)

## Installation

```bash
pnpm install
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test

# Run tests in watch mode (re-runs on file changes)
pnpm test:watch

# Run tests for a specific package
cd packages/blocks-core && pnpm test
cd packages/blocks-react && pnpm test
cd packages/blocks-vue && pnpm test
cd packages/blocks-angular && pnpm test

# Type check all packages
pnpm typecheck

# Clean build artifacts
pnpm clean
```

## Testing

Los tests están configurados con **Vitest** en todos los paquetes:

- **@vk/blocks-core**: 89 tests pasando ✅ (Cart, Checkout, Products, Wishlist, Shipping, Cart Sync, Cart History, API Storage)
- **@vk/blocks-react**: Tests para hooks y componentes React ✅
- **@vk/blocks-vue**: Tests para composables Vue ✅
- **@vk/blocks-angular**: 39 tests pasando ✅ (servicios: Cart, Checkout, Products, Wishlist, Shipping)

### Nota sobre Tests de Componentes Angular

Los tests de componentes Angular que usan `templateUrl` externos tienen problemas conocidos con Vitest y Angular 21. Los tests del servicio funcionan correctamente, pero los tests de componentes requieren una solución adicional.

**Estado actual:**
- ✅ Tests de servicios: 39 tests pasando
- ⚠️ Tests de componentes: 29 tests con problemas de resolución de templates (skipped)

Para más detalles, consulta [`packages/blocks-angular/TESTING_ISSUES.md`](./packages/blocks-angular/TESTING_ISSUES.md).

### Ejecutar tests desde la raíz:

```bash
# Ejecutar todos los tests una vez
pnpm test

# Ejecutar tests en modo watch (se re-ejecutan al cambiar archivos)
pnpm test:watch
```

### Ejecutar tests de un paquete específico:

```bash
# Desde la raíz del monorepo
pnpm --filter @vk/blocks-core test
pnpm --filter @vk/blocks-react test
pnpm --filter @vk/blocks-vue test
pnpm --filter @vk/blocks-angular test

# O navegando al directorio del paquete
cd packages/blocks-core
pnpm test
```

### Ejecutar tests con cobertura:

Los paquetes individuales pueden ejecutar tests con cobertura. Agrega el flag `--coverage`:

```bash
cd packages/blocks-core
pnpm test -- --coverage
```

## Usage

### React

```tsx
import { useCart, ProductCard } from '@vk/blocks-react';

function App() {
  // Sin persistencia (por defecto)
  const { items, addItem } = useCart();
  
  // Con localStorage
  // const { items, addItem } = useCart({ persist: true });
  
  return <ProductCard product={product} />;
}
```

### Vue

```vue
<script setup>
import { useCart } from '@vk/blocks-vue';
import ProductCard from '@vk/blocks-vue/components/ProductCard.vue';

// Sin persistencia (por defecto)
const { items, addItem } = useCart();

// Con localStorage
// const { items, addItem } = useCart({ persist: true });
</script>

<template>
  <ProductCard :product="product" />
</template>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { CartService, ProductCardComponent } from '@vk/blocks-angular';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <vk-product-card [product]="product"></vk-product-card>
  `
})
export class ProductsComponent {
  product = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    image: 'https://example.com/image.jpg',
    description: 'Test description'
  };
}
```

**Nota**: Este paquete usa **Angular Signals** (disponible desde Angular 21+) para manejo reactivo del estado, eliminando la necesidad de RxJS Observables.

**Nota**: Este paquete usa **Angular Signals** (disponible desde Angular 21+) para manejo reactivo del estado, eliminando la necesidad de RxJS Observables.

## Features Overview

| Module | Core | React | Vue | Angular | Status |
|--------|------|-------|-----|--------|--------|
| **Cart** | ✅ | ✅ | ✅ | ✅ | Complete |
| **Checkout** | ✅ | ✅ | ✅ | ✅ | Complete |
| **Products** | ✅ | ✅ | ✅ | ✅ | Complete |
| **Wishlist** | ✅ | ✅ | ✅ | ✅ | Complete |
| **Shipping** | ✅ | ✅ | ✅ | ✅ | Complete |
| **Cart Sync** | ✅ | ✅ | ✅ | ✅ | Complete |
| **Cart History** | ✅ | ✅ | ✅ | ✅ | Complete |
| **API Storage** | ✅ | ✅ | ✅ | ✅ | Complete |

## Modules

### Cart Module

Gestión completa del carrito de compras con sincronización, historial y múltiples estrategias de almacenamiento.

**Features:**
- ✅ Agregar/remover/actualizar items
- ✅ Sincronización entre pestañas (Cart Sync)
- ✅ Historial de carritos (Cart History)
- ✅ Múltiples estrategias de almacenamiento (localStorage, IndexedDB, API, etc.)
- ✅ Cálculo automático de totales
- ✅ Persistencia opcional

**React:**
```tsx
import { useCart, CartView, CartSummary } from '@vk/blocks-react';

function App() {
  const { items, addItem, removeItem, total } = useCart({ persist: true });
  
  return (
    <div>
      <CartView />
      <CartSummary />
    </div>
  );
}
```

**Vue:**
```vue
<script setup>
import { useCart } from '@vk/blocks-vue';

const { items, addItem, removeItem, total } = useCart({ persist: true });
</script>
```

**Angular:**
```typescript
import { Component } from '@angular/core';
import { CartService } from '@vk/blocks-angular';

@Component({
  selector: 'app-cart',
  standalone: true,
  template: `
    <div *ngFor="let item of cartService.items()">
      {{ item.product.name }} - ${{ item.product.price }}
    </div>
    <p>Total: ${{ cartService.total() }}</p>
  `
})
export class CartComponent {
  constructor(public cartService: CartService) {}
}
```

### Checkout Module

Flujo completo de checkout con integración a Mercado Pago y otros procesadores de pago.

**Features:**
- ✅ Gestión de sesión de checkout
- ✅ Direcciones de envío y facturación
- ✅ Integración con Mercado Pago
- ✅ Validación de datos
- ✅ Manejo de estados (pending, approved, rejected, cancelled)
- ✅ Webhooks y confirmación de pagos

**React:**
```tsx
import { useCheckout, CheckoutForm, MercadoPagoButton } from '@vk/blocks-react';

function CheckoutPage() {
  const checkout = useCheckout({
    mercadoPagoAccessToken: 'YOUR_TOKEN',
    currency: 'ARS'
  });
  
  return (
    <div>
      <CheckoutForm onSubmit={(address) => checkout.setShippingAddress(address)} />
      <MercadoPagoButton />
    </div>
  );
}
```

### Products Module

Gestión completa de productos con búsqueda, filtrado, ordenamiento y paginación.

**Features:**
- ✅ Búsqueda de texto
- ✅ Filtrado por categoría, precio, tags, etc.
- ✅ Ordenamiento (precio, nombre, relevancia, etc.)
- ✅ Paginación
- ✅ Caché de resultados
- ✅ Facetas para UI de filtros

**React:**
```tsx
import { useProducts, ProductList, ProductSearch, ProductFilters } from '@vk/blocks-react';

function ProductsPage() {
  const { products, setSearchQuery, setFilters, setSortBy } = useProducts({
    products: initialProducts
  });
  
  return (
    <div>
      <ProductSearch onSearch={setSearchQuery} />
      <ProductFilters onFilter={setFilters} />
      <ProductList products={products} />
    </div>
  );
}
```

### Wishlist Module

Lista de deseos con persistencia y sincronización.

**Features:**
- ✅ Agregar/remover productos
- ✅ Notas por item
- ✅ Persistencia opcional
- ✅ Metadata personalizada

**React:**
```tsx
import { useWishlist, WishlistButton, WishlistView } from '@vk/blocks-react';

function ProductCard({ product }) {
  const { addItem, removeItem, hasProduct } = useWishlist();
  
  return (
    <div>
      <h3>{product.name}</h3>
      <WishlistButton 
        product={product}
        isInWishlist={hasProduct(product.id)}
      />
    </div>
  );
}
```

### Shipping Module

Cálculo de costos de envío con soporte para múltiples proveedores y regiones LATAM.

**Features:**
- ✅ Cálculo de tarifas de envío
- ✅ Validación de direcciones
- ✅ Múltiples proveedores (genérico, API adapter)
- ✅ Proveedores LATAM pre-configurados (Correos Argentina, Correos Chile, OCA Argentina)
- ✅ Comparación de tarifas
- ✅ Cálculo del más económico

**React:**
```tsx
import { useShipping, ShippingCalculator, AddressForm } from '@vk/blocks-react';

function ShippingPage() {
  const { calculateRates, rates, loading } = useShipping();
  
  return (
    <div>
      <AddressForm onSubmit={(address) => calculateRates({ address, items })} />
      <ShippingCalculator rates={rates} />
    </div>
  );
}
```

### Cart Sync & History

Sincronización entre pestañas y historial de carritos.

**Features:**
- ✅ Sincronización en tiempo real entre pestañas
- ✅ Historial de estados del carrito
- ✅ Restauración de carritos anteriores
- ✅ Timestamps y metadatos

**React:**
```tsx
import { useCartSync, useCartHistory, CartHistoryView } from '@vk/blocks-react';

function App() {
  // Sincronización automática entre pestañas
  useCartSync();
  
  // Historial de carritos
  const history = useCartHistory();
  
  return (
    <div>
      <CartView enableSync enableHistory />
      <CartHistoryView />
    </div>
  );
}
```

## Storage Strategies

El carrito soporta múltiples estrategias de persistencia. Por defecto, **no hay persistencia** (más seguro para SSR).

### Opciones Disponibles

1. **Sin persistencia** (default) - Para SSR, testing, o cuando no necesitas guardar
2. **LocalStorage** - Persistencia simple en el navegador
3. **SessionStorage** - Persistencia por sesión
4. **IndexedDB** - Almacenamiento robusto para carritos grandes
5. **API REST** - Sincronización con backend (custom implementation)

Ver [STORAGE.md](./packages/blocks-core/STORAGE.md) para documentación completa y ejemplos.

### Ejemplos Rápidos

```typescript
// Sin persistencia (default)
const manager = createCartManager();

// Con localStorage
const manager = createCartManager({ persist: true });

// Con storage personalizado (IndexedDB, API, etc.)
import { IndexedDBCartStorage } from '@vk/blocks-core';
const storage = new IndexedDBCartStorage();
await storage.initialize();
const manager = createCartManager({ storage });
```

