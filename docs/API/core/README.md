# Core API Reference

Documentación completa de la API de `@alejandrovrod/blocks-core`, el paquete base framework-agnostic.

## 📦 Instalación

```bash
npm install @alejandrovrod/blocks-core
```

## 📚 Tabla de Contenidos

- [Cart (Carrito)](#cart-carrito)
  - [createCartManager](#createcartmanager)
  - [CartManager](#cartmanager)
  - [CartStore](#cartstore)
  - [CartSync](#cartsync)
  - [CartHistory](#carthistory)
  - [Storage](#storage)
- [Products (Productos)](#products-productos)
  - [createProductManager](#createproductmanager)
  - [ProductManager](#productmanager)
  - [ProductSearch](#productsearch)
- [Wishlist (Lista de Deseos)](#wishlist-lista-de-deseos)
  - [createWishlistManager](#createwishlistmanager)
  - [WishlistManager](#wishlistmanager)
- [Checkout](#checkout)
  - [createCheckoutManager](#createcheckoutmanager)
  - [CheckoutManager](#checkoutmanager)
- [Shipping (Envíos)](#shipping-envíos)
  - [createShippingManager](#createshippingmanager)
  - [ShippingManager](#shippingmanager)
- [Tipos](#tipos)

---

## Cart (Carrito)

### createCartManager

Función factory para crear un gestor de carrito.

#### Import

```typescript
import { createCartManager } from '@alejandrovrod/blocks-core';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `CartManagerOptions` | No | Opciones de configuración |

**CartManagerOptions:**
```typescript
interface CartManagerOptions {
  storage?: CartStorage;              // Implementación de almacenamiento personalizada
  storageKey?: string;                 // Clave para localStorage (default: 'vkecomblocks-cart')
  persist?: boolean;                   // Habilitar persistencia (default: false)
  onStateChange?: (state: CartState) => void;  // Callback cuando cambia el estado
  onError?: (error: Error) => void;   // Callback de errores
}
```

#### Retorno (Outputs)

```typescript
CartManager
```

#### Ejemplo

```typescript
import { createCartManager } from '@alejandrovrod/blocks-core';

const cartManager = createCartManager({
  persist: true,
  onStateChange: (state) => {
    console.log('Cart updated:', state);
  }
});
```

---

### CartManager

Clase principal para gestionar el carrito.

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `getState` | - | `CartState` | Obtener estado actual del carrito |
| `subscribe` | `callback: StateChangeCallback` | `() => void` | Suscribirse a cambios de estado |
| `addItem` | `product: Product, quantity?: number` | `void` | Agregar producto al carrito |
| `removeItem` | `itemId: string` | `void` | Eliminar item del carrito |
| `updateQuantity` | `itemId: string, quantity: number` | `void` | Actualizar cantidad de un item |
| `clear` | - | `void` | Limpiar todo el carrito |

#### Ejemplo

```typescript
import { createCartManager } from '@alejandrovrod/blocks-core';

const manager = createCartManager();

// Agregar producto
manager.addItem({
  id: '1',
  name: 'Producto',
  price: 99.99
}, 2);

// Obtener estado
const state = manager.getState();
console.log(state.items);  // Array de items
console.log(state.total);  // Total calculado
console.log(state.itemCount);  // Cantidad de items

// Suscribirse a cambios
const unsubscribe = manager.subscribe((newState) => {
  console.log('Cart changed:', newState);
});

// Limpiar cuando termine
unsubscribe();
```

---

### CartStore

Store singleton para el estado del carrito.

#### Import

```typescript
import { CartStore } from '@alejandrovrod/blocks-core';
```

#### Métodos Estáticos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `getInstance` | `storage?: CartStorage` | `CartStore` | Obtener instancia del store |

#### Ejemplo

```typescript
import { CartStore } from '@alejandrovrod/blocks-core';

const store = CartStore.getInstance();
const state = store.getState();
```

---

### CartSync

Clase para sincronizar el carrito entre pestañas del navegador.

#### Import

```typescript
import { CartSync } from '@alejandrovrod/blocks-core';
```

#### Constructor

```typescript
new CartSync(store: CartStore, options?: CartSyncOptions)
```

**CartSyncOptions:**
```typescript
interface CartSyncOptions {
  channel?: string;      // Canal de comunicación (default: 'vkecomblocks-cart-sync')
  debounceMs?: number;   // Tiempo de debounce en ms (default: 100)
}
```

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `initialize` | - | `void` | Inicializar sincronización |
| `stop` | - | `void` | Detener sincronización |

#### Ejemplo

```typescript
import { CartSync, CartStore } from '@alejandrovrod/blocks-core';

const store = CartStore.getInstance();
const sync = new CartSync(store, {
  channel: 'my-cart-sync',
  debounceMs: 200
});

sync.initialize();

// Detener cuando sea necesario
sync.stop();
```

---

### CartHistory

Clase para gestionar el historial del carrito.

#### Import

```typescript
import { CartHistory } from '@alejandrovrod/blocks-core';
```

#### Constructor

```typescript
new CartHistory(store: CartStore, options?: CartHistoryOptions)
```

**CartHistoryOptions:**
```typescript
interface CartHistoryOptions {
  maxEntries?: number;   // Máximo de entradas (default: 10)
  storageKey?: string;   // Clave de almacenamiento
}
```

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `saveEntry` | `label?: string` | `void` | Guardar estado actual |
| `restoreState` | `entryId: string` | `boolean` | Restaurar un estado guardado |
| `removeEntry` | `entryId: string` | `void` | Eliminar una entrada |
| `getEntries` | - | `CartHistoryEntry[]` | Obtener todas las entradas |
| `clearHistory` | - | `void` | Limpiar todo el historial |

#### Ejemplo

```typescript
import { CartHistory, CartStore } from '@alejandrovrod/blocks-core';

const store = CartStore.getInstance();
const history = new CartHistory(store, { maxEntries: 20 });

// Guardar estado actual
history.saveEntry('Antes de checkout');

// Restaurar un estado
const entries = history.getEntries();
if (entries.length > 0) {
  history.restoreState(entries[0].id);
}
```

---

### Storage

Implementaciones de almacenamiento para el carrito.

#### Tipos Disponibles

- `LocalStorageCartStorage` - Almacenamiento en localStorage
- `SessionStorageCartStorage` - Almacenamiento en sessionStorage
- `MemoryCartStorage` - Almacenamiento en memoria (sin persistencia)
- `IndexedDBCartStorage` - Almacenamiento en IndexedDB
- `APICartStorage` - Almacenamiento mediante API

#### Ejemplo

```typescript
import { 
  createCartManager, 
  LocalStorageCartStorage,
  IndexedDBCartStorage 
} from '@alejandrovrod/blocks-core';

// Usar localStorage
const cartWithLocalStorage = createCartManager({
  storage: new LocalStorageCartStorage('my-cart')
});

// Usar IndexedDB
const indexedDBStorage = new IndexedDBCartStorage('my-db', 'cart-store');
const cartWithIndexedDB = createCartManager({
  storage: indexedDBStorage
});
```

---

## Products (Productos)

### createProductManager

Función factory para crear un gestor de productos.

#### Import

```typescript
import { createProductManager } from '@alejandrovrod/blocks-core';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `ProductManagerOptions` | No | Opciones de configuración |

**ProductManagerOptions:**
```typescript
interface ProductManagerOptions {
  products?: Product[] | (() => Product[]) | (() => Promise<Product[]>);
  enableCache?: boolean;              // Habilitar caché (default: true)
  cacheTTL?: number;                 // TTL del caché en ms (default: 5 minutos)
  onUpdate?: (products: Product[]) => void;
  onError?: (error: Error) => void;
}
```

#### Retorno (Outputs)

```typescript
ProductManager
```

---

### ProductManager

Clase para gestionar productos.

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `initialize` | - | `Promise<void>` | Inicializar productos (si son async) |
| `getAllProducts` | - | `Product[]` | Obtener todos los productos |
| `getProductById` | `id: string` | `Product | undefined` | Obtener producto por ID |
| `getProductBySku` | `sku: string` | `Product | undefined` | Obtener producto por SKU |
| `getProductsByCategory` | `categoryId: string` | `Product[]` | Obtener productos por categoría |
| `getProductsByTag` | `tag: string` | `Product[]` | Obtener productos por tag |
| `addProduct` | `product: Product` | `void` | Agregar producto |
| `updateProduct` | `id: string, updates: Partial<Product>` | `void` | Actualizar producto |
| `removeProduct` | `id: string` | `void` | Eliminar producto |
| `setProducts` | `products: Product[]` | `void` | Establecer lista de productos |

#### Ejemplo

```typescript
import { createProductManager } from '@alejandrovrod/blocks-core';

const manager = createProductManager({
  products: async () => {
    // Cargar productos desde API
    const response = await fetch('/api/products');
    return response.json();
  }
});

await manager.initialize();
const products = manager.getAllProducts();
const product = manager.getProductById('1');
```

---

### ProductSearch

Clase estática para búsqueda de productos.

#### Import

```typescript
import { ProductSearch } from '@alejandrovrod/blocks-core';
```

#### Métodos Estáticos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `search` | `products: Product[], options: SearchOptions` | `SearchResult` | Buscar productos |

**SearchOptions:**
```typescript
interface SearchOptions {
  query?: string;           // Query de búsqueda
  filters?: ProductFilter;  // Filtros a aplicar
  sort?: ProductSort;      // Ordenamiento
  limit?: number;          // Límite de resultados
  offset?: number;        // Offset para paginación
}
```

#### Ejemplo

```typescript
import { ProductSearch } from '@alejandrovrod/blocks-core';

const products = [/* ... */];

const result = ProductSearch.search(products, {
  query: 'laptop',
  filters: {
    priceRange: { min: 500, max: 2000 },
    inStock: true
  },
  sort: { field: 'price', direction: 'asc' },
  limit: 20
});

console.log(result.products);  // Productos encontrados
console.log(result.facets);   // Facetas para filtros
console.log(result.total);    // Total de resultados
```

---

## Wishlist (Lista de Deseos)

### createWishlistManager

Función factory para crear un gestor de lista de deseos.

#### Import

```typescript
import { createWishlistManager } from '@alejandrovrod/blocks-core';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `WishlistOptions` | No | Opciones de configuración |

**WishlistOptions:**
```typescript
interface WishlistOptions {
  storageKey?: string;                 // Clave de almacenamiento
  persist?: boolean;                   // Habilitar persistencia
  onStateChange?: (state: WishlistState) => void;
  onError?: (error: Error) => void;
}
```

#### Retorno (Outputs)

```typescript
WishlistManager
```

---

### WishlistManager

Clase para gestionar la lista de deseos.

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `getState` | - | `WishlistState` | Obtener estado actual |
| `subscribe` | `callback: WishlistStateChangeCallback` | `() => void` | Suscribirse a cambios |
| `hasProduct` | `productId: string` | `boolean` | Verificar si un producto está en la lista |
| `addItem` | `product: Product` | `void` | Agregar producto |
| `removeItem` | `itemId: string` | `void` | Eliminar item |
| `removeProduct` | `productId: string` | `void` | Eliminar producto por ID |
| `clear` | - | `void` | Limpiar lista |

---

## Checkout

### createCheckoutManager

Función factory para crear un gestor de checkout.

#### Import

```typescript
import { createCheckoutManager } from '@alejandrovrod/blocks-core';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `CheckoutOptions` | No | Opciones de configuración |

**CheckoutOptions:**
```typescript
interface CheckoutOptions {
  currency?: string;                   // Moneda (default: 'ARS')
  taxRate?: number;                    // Tasa de impuestos (0-1)
  shippingCost?: number;              // Costo de envío
  discount?: {                         // Descuento
    type: 'percentage' | 'fixed';
    value: number;
  };
  mercadoPagoPublicKey?: string;      // Clave pública de Mercado Pago
  mercadoPagoAccessToken?: string;    // Token de acceso de Mercado Pago
  successUrl?: string;                 // URL de éxito
  failureUrl?: string;                // URL de fallo
  pendingUrl?: string;                // URL pendiente
  webhookUrl?: string;                // URL de webhook
  autoReturn?: 'approved' | 'all';    // Auto retorno
  metadata?: Record<string, unknown>; // Metadatos adicionales
  onStatusChange?: (session: CheckoutSession) => void;
  onError?: (error: Error) => void;
}
```

#### Retorno (Outputs)

```typescript
CheckoutManager
```

---

### CheckoutManager

Clase para gestionar el proceso de checkout.

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `initializeSession` | `subtotal: number, cartId?: string` | `void` | Inicializar sesión de checkout |
| `getSession` | - | `CheckoutSession | null` | Obtener sesión actual |
| `setShippingAddress` | `address: ShippingAddress` | `CheckoutValidationResult` | Establecer dirección de envío |
| `setBillingAddress` | `address: BillingAddress` | `CheckoutValidationResult` | Establecer dirección de facturación |
| `setPaymentMethod` | `method: PaymentMethodDetails` | `void` | Establecer método de pago |
| `validateCheckout` | - | `CheckoutValidationResult` | Validar checkout completo |
| `createPayment` | - | `Promise<PaymentResult>` | Crear pago |

#### Ejemplo

```typescript
import { createCheckoutManager } from '@alejandrovrod/blocks-core';

const checkout = createCheckoutManager({
  currency: 'ARS',
  taxRate: 0.21,
  mercadoPagoAccessToken: 'YOUR_TOKEN'
});

checkout.initializeSession(1000, 'cart-123');
checkout.setShippingAddress({
  recipientName: 'Juan Pérez',
  street: 'Av. Corrientes 123',
  city: 'Buenos Aires',
  postalCode: 'C1043AAX',
  country: 'AR'
});

const validation = checkout.validateCheckout();
if (validation.valid) {
  const payment = await checkout.createPayment();
  console.log('Payment created:', payment);
}
```

---

## Shipping (Envíos)

### createShippingManager

Función factory para crear un gestor de envíos.

#### Import

```typescript
import { createShippingManager } from '@alejandrovrod/blocks-core';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `ShippingManagerOptions` | No | Opciones de configuración |

**ShippingManagerOptions:**
```typescript
interface ShippingManagerOptions {
  providers?: ShippingProvider[];      // Proveedores de envío
  defaultProvider?: ShippingProvider;  // Proveedor por defecto
  onRateCalculated?: (rates: ShippingRate[]) => void;
  onError?: (error: Error) => void;
}
```

#### Retorno (Outputs)

```typescript
ShippingManager
```

---

### ShippingManager

Clase para gestionar cálculos de envío.

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `calculateRates` | `request: ShippingCalculationRequest` | `Promise<ShippingRate[]>` | Calcular tarifas |
| `selectOption` | `optionId: string` | `void` | Seleccionar opción de envío |
| `getSelectedOption` | - | `ShippingOption | null` | Obtener opción seleccionada |
| `getAvailableOptions` | - | `ShippingOption[]` | Obtener opciones disponibles |
| `addProvider` | `provider: ShippingProvider` | `void` | Agregar proveedor |
| `removeProvider` | `providerId: string` | `void` | Eliminar proveedor |

#### Ejemplo

```typescript
import { 
  createShippingManager,
  createCorreosArgentinaProvider 
} from '@alejandrovrod/blocks-core';

const provider = createCorreosArgentinaProvider({
  apiKey: 'YOUR_API_KEY'
});

const manager = createShippingManager({
  providers: [provider]
});

const rates = await manager.calculateRates({
  address: {
    street: 'Av. Corrientes 123',
    city: 'Buenos Aires',
    postalCode: 'C1043AAX',
    country: 'AR'
  },
  items: [
    { weight: 1, quantity: 2, value: 100 }
  ]
});
```

---

## Tipos

### Product

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  sku?: string;
  category?: string;
  tags?: string[];
  inStock?: boolean;
  [key: string]: unknown;  // Permite propiedades adicionales
}
```

### CartItem

```typescript
interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: number;
}
```

### CartState

```typescript
interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}
```

### ShippingAddress

```typescript
interface ShippingAddress {
  recipientName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
  phone?: string;
  email?: string;
}
```

### ShippingRate

```typescript
interface ShippingRate {
  option: ShippingOption;
  cost: number;
  currency: string;
  estimatedDays?: {
    min: number;
    max: number;
  };
}
```

### CheckoutSession

```typescript
interface CheckoutSession {
  id: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: CheckoutStatus;
  shippingAddress?: ShippingAddress;
  billingAddress?: BillingAddress;
  paymentMethod?: PaymentMethodDetails;
  createdAt: number;
  updatedAt: number;
}
```

---

## Más Información

- [Guía de Instalación](../INSTALLATION.md)
- [React API](./react/README.md)
- [Vue API](./vue/README.md)
- [Angular API](./angular/README.md)



