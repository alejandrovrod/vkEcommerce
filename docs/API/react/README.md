# React API Reference

Documentación completa de la API de `@alejandrovrod/blocks-react`.

## 📦 Instalación

```bash
npm install @alejandrovrod/blocks-core @alejandrovrod/blocks-react
```

## 📚 Tabla de Contenidos

- [Hooks](#hooks)
  - [useCart](#usecart)
  - [useCartSync](#usecartsync)
  - [useCartHistory](#usecarthistory)
  - [useProducts](#useproducts)
  - [useProductSearch](#useproductsearch)
  - [useWishlist](#usewishlist)
  - [useCheckout](#usecheckout)
  - [useShipping](#useshipping)
- [Componentes](#componentes)
  - [CartView](#cartview)
  - [CartItem](#cartitem)
  - [CartSummary](#cartsummary)
  - [CartHistoryView](#carthistoryview)
  - [ProductCard](#productcard)
  - [ProductList](#productlist)
  - [ProductSearch](#productsearch)
  - [ProductFilters](#productfilters)
  - [WishlistButton](#wishlistbutton)
  - [WishlistView](#wishlistview)
  - [CheckoutForm](#checkoutform)
  - [PaymentMethodSelector](#paymentmethodselector)
  - [MercadoPagoButton](#mercadopagobutton)
  - [ShippingCalculator](#shippingcalculator)
  - [ShippingOptions](#shippingoptions)
  - [AddressForm](#addressform)

---

## Hooks

### useCart

Hook para gestionar el estado del carrito de compras.

#### Import

```tsx
import { useCart } from '@alejandrovrod/blocks-react';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `CartManagerOptions` | No | Opciones de configuración del carrito |

**CartManagerOptions:**
```typescript
interface CartManagerOptions {
  storage?: CartStorage;        // Implementación de almacenamiento personalizada
  storageKey?: string;          // Clave para localStorage (default: 'vkecomblocks-cart')
  persist?: boolean;            // Habilitar persistencia (default: true)
  onStateChange?: (state: CartState) => void;  // Callback cuando cambia el estado
  onError?: (error: Error) => void;           // Callback de errores
}
```

#### Retorno (Outputs)

```typescript
{
  items: CartItem[];           // Array de items en el carrito
  total: number;               // Total del carrito
  itemCount: number;          // Cantidad total de items
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
}
```

#### Ejemplo

```tsx
import { useCart } from '@alejandrovrod/blocks-react';
import type { Product } from '@alejandrovrod/blocks-core';

function MyComponent() {
  const { items, total, addItem, removeItem } = useCart();

  const handleAddProduct = (product: Product) => {
    addItem(product, 1);
  };

  return (
    <div>
      <p>Items: {items.length}</p>
      <p>Total: ${total.toFixed(2)}</p>
      {/* ... */}
    </div>
  );
}
```

---

### useCartSync

Hook para sincronizar el carrito entre pestañas del navegador.

#### Import

```tsx
import { useCartSync } from '@alejandrovrod/blocks-react';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `CartSyncOptions` | No | Opciones de sincronización |

**CartSyncOptions:**
```typescript
interface CartSyncOptions {
  channel?: string;  // Canal de comunicación (default: 'vkecomblocks-cart-sync')
  debounceMs?: number;  // Tiempo de debounce en ms (default: 100)
}
```

#### Retorno (Outputs)

```typescript
{
  isSyncing: boolean;  // Indica si la sincronización está activa
}
```

#### Ejemplo

```tsx
import { useCartSync } from '@alejandrovrod/blocks-react';

function MyComponent() {
  const { isSyncing } = useCartSync();

  return <div>Sincronizando: {isSyncing ? 'Sí' : 'No'}</div>;
}
```

---

### useCartHistory

Hook para gestionar el historial del carrito.

#### Import

```tsx
import { useCartHistory } from '@alejandrovrod/blocks-react';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `CartHistoryOptions` | No | Opciones del historial |

**CartHistoryOptions:**
```typescript
interface CartHistoryOptions {
  maxEntries?: number;  // Máximo de entradas (default: 10)
  storageKey?: string;  // Clave de almacenamiento
}
```

#### Retorno (Outputs)

```typescript
{
  entries: CartHistoryEntry[];  // Array de entradas del historial
  saveEntry: (label?: string) => void;  // Guardar estado actual
  restoreEntry: (entryId: string) => boolean;  // Restaurar un estado
  removeEntry: (entryId: string) => void;  // Eliminar una entrada
  clearHistory: () => void;  // Limpiar todo el historial
}
```

#### Ejemplo

```tsx
import { useCartHistory } from '@alejandrovrod/blocks-react';

function MyComponent() {
  const { entries, saveEntry, restoreEntry } = useCartHistory();

  return (
    <div>
      <button onClick={() => saveEntry('Guardado manual')}>
        Guardar Estado
      </button>
      {entries.map(entry => (
        <button key={entry.id} onClick={() => restoreEntry(entry.id)}>
          Restaurar: {entry.label}
        </button>
      ))}
    </div>
  );
}
```

---

### useProducts

Hook para gestionar productos.

#### Import

```tsx
import { useProducts } from '@alejandrovrod/blocks-react';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `ProductManagerOptions` | No | Opciones del gestor de productos |

#### Retorno (Outputs)

```typescript
{
  products: Product[];  // Lista de productos
  loading: boolean;     // Estado de carga
  error: Error | null;  // Error si existe
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

#### Ejemplo

```tsx
import { useProducts } from '@alejandrovrod/blocks-react';

function ProductManager() {
  const { products, loading, setFilters, setSearchQuery } = useProducts();

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <input 
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar productos..."
      />
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

### useProductSearch

Hook para búsqueda de productos.

#### Import

```tsx
import { useProductSearch } from '@alejandrovrod/blocks-react';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `initialQuery` | `string` | No | Query inicial |
| `initialOptions` | `SearchOptions` | No | Opciones iniciales de búsqueda |

#### Retorno (Outputs)

```typescript
{
  query: string;           // Query actual
  results: SearchResult;   // Resultados de la búsqueda
  setQuery: (query: string) => void;
  setOptions: (options: SearchOptions) => void;
  search: (query: string, options?: SearchOptions) => SearchResult;
}
```

---

### useWishlist

Hook para gestionar la lista de deseos.

#### Import

```tsx
import { useWishlist } from '@alejandrovrod/blocks-react';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `WishlistOptions` | No | Opciones de la lista de deseos |

#### Retorno (Outputs)

```typescript
{
  items: WishlistItem[];  // Items en la lista
  hasProduct: (productId: string) => boolean;
  addItem: (product: Product) => void;
  removeItem: (itemId: string) => void;
  removeProduct: (productId: string) => void;
  clear: () => void;
}
```

---

### useCheckout

Hook para gestionar el proceso de checkout.

#### Import

```tsx
import { useCheckout } from '@alejandrovrod/blocks-react';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `CheckoutOptions` | No | Opciones de checkout |

#### Retorno (Outputs)

```typescript
{
  session: CheckoutSession | null;
  loading: boolean;
  error: Error | null;
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

Hook para calcular costos de envío.

#### Import

```tsx
import { useShipping } from '@alejandrovrod/blocks-react';
```

#### Parámetros (Inputs)

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `options` | `ShippingManagerOptions` | No | Opciones del gestor de envíos |

#### Retorno (Outputs)

```typescript
{
  rates: ShippingRate[];  // Tarifas disponibles
  loading: boolean;
  error: Error | null;
  selectedOption: ShippingOption | null;
  calculateRates: (request: ShippingCalculationRequest) => Promise<ShippingRate[]>;
  selectOption: (optionId: string) => void;
  getAvailableOptions: () => ShippingOption[];
}
```

---

## Componentes

### CartView

Componente para mostrar el carrito completo con todos los items.

#### Import

```tsx
import { CartView } from '@alejandrovrod/blocks-react';
import type { CartViewProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `className` | `string` | No | `''` | Clases CSS adicionales |
| `emptyMessage` | `React.ReactNode` | No | `'Your cart is empty'` | Mensaje cuando el carrito está vacío |
| `renderEmpty` | `() => React.ReactNode` | No | - | Render personalizado para carrito vacío |
| `renderItem` | `(item: CartItem) => React.ReactNode` | No | - | Render personalizado para cada item |
| `renderHeader` | `() => React.ReactNode` | No | - | Render para el header |
| `renderFooter` | `() => React.ReactNode` | No | - | Render para el footer |
| `cartOptions` | `CartManagerOptions` | No | - | Opciones del carrito |
| `itemProps` | `Omit<CartItemProps, 'item'>` | No | - | Props para los items |
| `enableSync` | `boolean` | No | `false` | Habilitar sincronización entre pestañas |
| `syncOptions` | `CartSyncOptions` | No | - | Opciones de sincronización |
| `enableHistory` | `boolean` | No | `false` | Habilitar historial |
| `historyOptions` | `CartHistoryOptions` | No | - | Opciones del historial |

#### CSS Classes

- `vkecom-cart-view` - Contenedor principal
- `vkecom-cart-header` - Header del carrito
- `vkecom-cart-list` - Lista de items
- `vkecom-cart-empty` - Estado vacío
- `vkecom-cart-footer` - Footer del carrito

#### Ejemplo

```tsx
import { CartView } from '@alejandrovrod/blocks-react';

function MyCart() {
  return (
    <CartView
      className="my-cart"
      emptyMessage="Tu carrito está vacío"
      enableSync={true}
      renderHeader={() => <h2>Mi Carrito</h2>}
    />
  );
}
```

---

### CartItem

Componente para mostrar un item individual del carrito.

#### Import

```tsx
import { CartItem } from '@alejandrovrod/blocks-react';
import type { CartItemProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `item` | `CartItem` | Sí | El item del carrito a mostrar |
| `className` | `string` | No | Clases CSS adicionales |
| `onIncrease` | `(itemId: string) => void` | No | Callback cuando se aumenta cantidad |
| `onDecrease` | `(itemId: string) => void` | No | Callback cuando se disminuye cantidad |
| `onRemove` | `(itemId: string) => void` | No | Callback cuando se elimina el item |
| `renderImage` | `(item: CartItem) => React.ReactNode` | No | Render personalizado para la imagen |
| `renderTitle` | `(item: CartItem) => React.ReactNode` | No | Render personalizado para el título |
| `renderPrice` | `(item: CartItem) => React.ReactNode` | No | Render personalizado para el precio |
| `formatPrice` | `(price: number) => string` | No | Función para formatear precios |

#### CSS Classes

- `vkecom-cart-item` - Item del carrito
- `vkecom-cart-item-image` - Imagen del producto
- `vkecom-cart-item-details` - Detalles del producto
- `vkecom-cart-item-name` - Nombre del producto
- `vkecom-cart-item-price` - Precio
- `vkecom-cart-item-quantity` - Controles de cantidad
- `vkecom-cart-item-remove` - Botón de eliminar

---

### CartSummary

Componente para mostrar el resumen del carrito con totales.

#### Import

```tsx
import { CartSummary } from '@alejandrovrod/blocks-react';
import type { CartSummaryProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `className` | `string` | No | `''` | Clases CSS adicionales |
| `cartOptions` | `CartManagerOptions` | No | - | Opciones del carrito |
| `showItemCount` | `boolean` | No | `true` | Mostrar cantidad de items |
| `showSubtotal` | `boolean` | No | `true` | Mostrar subtotal |
| `showTax` | `boolean` | No | `false` | Mostrar impuestos |
| `taxRate` | `number` | No | `0` | Tasa de impuestos (0-1) |
| `showShipping` | `boolean` | No | `false` | Mostrar costo de envío |
| `shippingCost` | `number` | No | `0` | Costo de envío |
| `showTotal` | `boolean` | No | `true` | Mostrar total |
| `renderSubtotal` | `(subtotal: number) => React.ReactNode` | No | - | Render personalizado para subtotal |
| `renderTax` | `(tax: number) => React.ReactNode` | No | - | Render personalizado para impuestos |
| `renderShipping` | `(shipping: number) => React.ReactNode` | No | - | Render personalizado para envío |
| `renderTotal` | `(total: number) => React.ReactNode` | No | - | Render personalizado para total |
| `renderItemCount` | `(count: number) => React.ReactNode` | No | - | Render personalizado para cantidad |
| `renderCheckout` | `(onCheckout: () => void) => React.ReactNode` | No | - | Render personalizado para botón checkout |
| `onCheckout` | `() => void` | No | - | Callback cuando se hace checkout |
| `formatPrice` | `(price: number) => string` | No | `(p) => '$' + p.toFixed(2)` | Función para formatear precios |

#### Ejemplo

```tsx
import { CartSummary } from '@alejandrovrod/blocks-react';

function CheckoutSummary() {
  return (
    <CartSummary
      showTax={true}
      taxRate={0.21}
      showShipping={true}
      shippingCost={10}
      onCheckout={() => console.log('Checkout!')}
      formatPrice={(price) => `$${price.toFixed(2)} USD`}
    />
  );
}
```

---

### ProductCard

Componente para mostrar una tarjeta de producto.

#### Import

```tsx
import { ProductCard } from '@alejandrovrod/blocks-react';
import type { ProductCardProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `product` | `Product` | Sí | El producto a mostrar |
| `className` | `string` | No | Clases CSS adicionales |
| `children` | `React.ReactNode` | No | Contenido completamente personalizado |
| `renderImage` | `(product: Product) => React.ReactNode` | No | Render personalizado para imagen |
| `renderTitle` | `(product: Product) => React.ReactNode` | No | Render personalizado para título |
| `renderPrice` | `(product: Product) => React.ReactNode` | No | Render personalizado para precio |
| `renderButton` | `(product: Product, onAddToCart: () => void) => React.ReactNode` | No | Render personalizado para botón |
| `onAddToCart` | `(product: Product) => void` | No | Callback cuando se agrega al carrito |
| `quantity` | `number` | No | `1` | Cantidad a agregar al carrito |

#### Ejemplo

```tsx
import { ProductCard } from '@alejandrovrod/blocks-react';

function ProductGrid({ products }) {
  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={(p) => console.log('Added:', p.name)}
          renderButton={(product, onAdd) => (
            <button onClick={onAdd} className="custom-button">
              Comprar Ahora
            </button>
          )}
        />
      ))}
    </div>
  );
}
```

---

### ProductList

Componente para mostrar una lista de productos.

#### Import

```tsx
import { ProductList } from '@alejandrovrod/blocks-react';
import type { ProductListProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `products` | `Product[]` | Sí | Array de productos a mostrar |
| `className` | `string` | No | Clases CSS adicionales |
| `emptyMessage` | `string` | No | `'No products found'` | Mensaje cuando no hay productos |
| `renderProduct` | `(product: Product) => React.ReactNode` | No | Render personalizado para cada producto |

---

### ProductSearch

Componente de búsqueda de productos.

#### Import

```tsx
import { ProductSearch } from '@alejandrovrod/blocks-react';
import type { ProductSearchProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `initialQuery` | `string` | No | Query inicial |
| `initialOptions` | `SearchOptions` | No | Opciones iniciales |
| `className` | `string` | No | Clases CSS adicionales |
| `placeholder` | `string` | No | `'Search products...'` | Placeholder del input |
| `onSearch` | `(result: { query: string; options: SearchOptions }) => void` | No | Callback cuando se busca |

---

### ProductFilters

Componente para filtrar productos.

#### Import

```tsx
import { ProductFilters } from '@alejandrovrod/blocks-react';
import type { ProductFiltersProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `filters` | `ProductFilter` | Sí | Filtros actuales |
| `facets` | `Facets` | No | Facetas disponibles para filtros |
| `className` | `string` | No | Clases CSS adicionales |
| `onChange` | `(filters: ProductFilter) => void` | No | Callback cuando cambian los filtros |

---

### WishlistButton

Botón para agregar/eliminar productos de la lista de deseos.

#### Import

```tsx
import { WishlistButton } from '@alejandrovrod/blocks-react';
import type { WishlistButtonProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `product` | `Product` | Sí | El producto |
| `className` | `string` | No | Clases CSS adicionales |
| `inWishlistLabel` | `string` | No | `'Remove from Wishlist'` | Label cuando está en lista |
| `notInWishlistLabel` | `string` | No | `'Add to Wishlist'` | Label cuando no está |
| `onAdd` | `(product: Product) => void` | No | Callback cuando se agrega |
| `onRemove` | `(productId: string) => void` | No | Callback cuando se elimina |

---

### WishlistView

Componente para mostrar la lista de deseos completa.

#### Import

```tsx
import { WishlistView } from '@alejandrovrod/blocks-react';
import type { WishlistViewProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `className` | `string` | No | Clases CSS adicionales |
| `emptyMessage` | `string` | No | `'Your wishlist is empty'` | Mensaje cuando está vacía |
| `wishlistOptions` | `WishlistOptions` | No | Opciones de la lista de deseos |

---

### CheckoutForm

Formulario completo de checkout.

#### Import

```tsx
import { CheckoutForm } from '@alejandrovrod/blocks-react';
import type { CheckoutFormProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `subtotal` | `number` | Sí | Subtotal del carrito |
| `cartId` | `string` | No | ID del carrito |
| `className` | `string` | No | Clases CSS adicionales |
| `onComplete` | `(sessionId: string) => void` | No | Callback cuando se completa |
| `onError` | `(error: Error) => void` | No | Callback de errores |

---

### PaymentMethodSelector

Selector de método de pago.

#### Import

```tsx
import { PaymentMethodSelector } from '@alejandrovrod/blocks-react';
import type { PaymentMethodSelectorProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `value` | `PaymentMethodDetails` | No | Método seleccionado |
| `methods` | `PaymentMethod[]` | No | Métodos disponibles |
| `className` | `string` | No | Clases CSS adicionales |
| `onChange` | `(method: PaymentMethodDetails) => void` | No | Callback cuando cambia |

---

### MercadoPagoButton

Botón de pago con Mercado Pago.

#### Import

```tsx
import { MercadoPagoButton } from '@alejandrovrod/blocks-react';
import type { MercadoPagoButtonProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `publicKey` | `string` | Sí | Clave pública de Mercado Pago |
| `preferenceId` | `string` | No | ID de preferencia |
| `className` | `string` | No | Clases CSS adicionales |
| `label` | `string` | No | `'Pay with Mercado Pago'` | Texto del botón |
| `onSuccess` | `(paymentId: string) => void` | No | Callback de éxito |
| `onError` | `(error: Error) => void` | No | Callback de error |

---

### ShippingCalculator

Calculadora de costos de envío.

#### Import

```tsx
import { ShippingCalculator } from '@alejandrovrod/blocks-react';
import type { ShippingCalculatorProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `items` | `ShippingItem[]` | Sí | Items para calcular envío |
| `className` | `string` | No | Clases CSS adicionales |
| `onRatesCalculated` | `(rates: ShippingRate[]) => void` | No | Callback con tarifas calculadas |
| `shippingOptions` | `ShippingManagerOptions` | No | Opciones del gestor de envíos |

---

### ShippingOptions

Selector de opciones de envío.

#### Import

```tsx
import { ShippingOptions } from '@alejandrovrod/blocks-react';
import type { ShippingOptionsProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `rates` | `ShippingRate[]` | Sí | Tarifas disponibles |
| `selectedRateId` | `string` | No | ID de tarifa seleccionada |
| `className` | `string` | No | Clases CSS adicionales |
| `onSelect` | `(rate: ShippingRate) => void` | No | Callback cuando se selecciona |

---

### AddressForm

Formulario de dirección de envío.

#### Import

```tsx
import { AddressForm } from '@alejandrovrod/blocks-react';
import type { AddressFormProps } from '@alejandrovrod/blocks-react';
```

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `initialAddress` | `Partial<ShippingAddress>` | No | Dirección inicial |
| `className` | `string` | No | Clases CSS adicionales |
| `showErrors` | `boolean` | No | `true` | Mostrar errores de validación |
| `onSubmit` | `(address: ShippingAddress) => void` | No | Callback cuando se envía |

---

## Tipos Comunes

### Product

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
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

---

## Ejemplos Completos

### Carrito Completo

```tsx
import { CartView, CartSummary, useCart } from '@alejandrovrod/blocks-react';

function ShoppingCart() {
  const { items, total } = useCart();

  return (
    <div className="shopping-cart">
      <CartView 
        className="cart-items"
        enableSync={true}
      />
      <CartSummary 
        showTax={true}
        taxRate={0.21}
        showShipping={true}
        shippingCost={10}
      />
    </div>
  );
}
```

### Catálogo de Productos

```tsx
import { ProductCard, ProductList, useProducts } from '@alejandrovrod/blocks-react';

function ProductCatalog() {
  const { products, loading, setSearchQuery } = useProducts();

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <input 
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar..."
      />
      <ProductList products={products} />
    </div>
  );
}
```

---

## Más Información

- [Guía de Instalación](../INSTALLATION.md)
- [Core API](./core/README.md) - Tipos y funciones del core
- [Ejemplos Completos](./examples.md)

