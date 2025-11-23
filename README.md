# vkecomblocks

Modular ecommerce blocks for React, Vue, and Angular. Framework-agnostic core with lightweight framework wrappers.

## Packages

- `@alejandrovrod/blocks-core` - Core logic (TypeScript, no framework dependencies)
- `@alejandrovrod/blocks-react` - React hooks and components
- `@alejandrovrod/blocks-vue` - Vue 3 composables and components
- `@alejandrovrod/blocks-angular` - Angular services and components

## Compatibility

### Framework Versions

- **React**: >=18.0.0 (tested with 18.3.1)
- **Vue**: >=3.0.0 (tested with 3.5.13)
- **Angular**: >=18.0.0 (tested with 19.0.0)
- **TypeScript**: >=5.6.0 (recommended: 5.6.3)
- **Node.js**: >=18.0.0 (recommended: 20.x or 22.x)

## Installation

### Para Desarrollo (Monorepo)

```bash
pnpm install
```

### Para Usar en Tu Proyecto

Los paquetes están publicados en **GitHub Packages**. Para instalarlos:

1. **Configura el registry de GitHub Packages**:

   Crea un archivo `.npmrc` en la raíz de tu proyecto:
   ```
   @alejandrovrod:registry=https://npm.pkg.github.com
   ```
   
   **Nota:** Si el repositorio es público, esto es suficiente. Si es privado o tienes problemas, agrega:
   ```
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```
   Y configura la variable de entorno `GITHUB_TOKEN` con un Personal Access Token que tenga el scope `read:packages`.

2. **Instala los paquetes**:

   **React:**
   ```bash
   npm install @alejandrovrod/blocks-core @alejandrovrod/blocks-react
   # o
   pnpm add @alejandrovrod/blocks-core @alejandrovrod/blocks-react
   ```

   **Vue:**
   ```bash
   npm install @alejandrovrod/blocks-core @alejandrovrod/blocks-vue
   # o
   pnpm add @alejandrovrod/blocks-core @alejandrovrod/blocks-vue
   ```

   **Angular:**
   ```bash
   npm install @alejandrovrod/blocks-core @alejandrovrod/blocks-angular
   # o
   pnpm add @alejandrovrod/blocks-core @alejandrovrod/blocks-angular
   ```

Para más detalles, consulta la [guía completa de instalación](./docs/INSTALLATION.md).

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

- **@alejandrovrod/blocks-core**: 89 tests pasando ✅ (Cart, Checkout, Products, Wishlist, Shipping, Cart Sync, Cart History, API Storage)
- **@alejandrovrod/blocks-react**: Tests para hooks y componentes React ✅
- **@alejandrovrod/blocks-vue**: Tests para composables Vue ✅
- **@alejandrovrod/blocks-angular**: 39 tests pasando ✅ (servicios: Cart, Checkout, Products, Wishlist, Shipping)

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
pnpm --filter @alejandrovrod/blocks-core test
pnpm --filter @alejandrovrod/blocks-react test
pnpm --filter @alejandrovrod/blocks-vue test
pnpm --filter @alejandrovrod/blocks-angular test

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
import { useCart, ProductCard } from '@alejandrovrod/blocks-react';

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
import { useCart } from '@alejandrovrod/blocks-vue';
import ProductCard from '@alejandrovrod/blocks-vue/components/ProductCard.vue';

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
import { CartService, ProductCardComponent } from '@alejandrovrod/blocks-angular';

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
import { useCart, CartView, CartSummary } from '@alejandrovrod/blocks-react';

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
import { useCart } from '@alejandrovrod/blocks-vue';

const { items, addItem, removeItem, total } = useCart({ persist: true });
</script>
```

**Angular:**
```typescript
import { Component } from '@angular/core';
import { CartService } from '@alejandrovrod/blocks-angular';

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
import { useCheckout, CheckoutForm, MercadoPagoButton } from '@alejandrovrod/blocks-react';

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
import { useProducts, ProductList, ProductSearch, ProductFilters } from '@alejandrovrod/blocks-react';

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
import { useWishlist, WishlistButton, WishlistView } from '@alejandrovrod/blocks-react';

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
import { useShipping, ShippingCalculator, AddressForm } from '@alejandrovrod/blocks-react';

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
import { useCartSync, useCartHistory, CartHistoryView } from '@alejandrovrod/blocks-react';

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
import { IndexedDBCartStorage } from '@alejandrovrod/blocks-core';
const storage = new IndexedDBCartStorage();
await storage.initialize();
const manager = createCartManager({ storage });
```



