# Angular API Reference

Documentación completa de la API de `@alejandrovrod/blocks-angular`.

## 📦 Instalación

```bash
npm install @alejandrovrod/blocks-core @alejandrovrod/blocks-angular
```

## 📚 Tabla de Contenidos

- [Servicios](#servicios)
  - [CartService](#cartservice)
  - [CartSyncService](#cartsyncservice)
  - [CartHistoryService](#carthistoryservice)
  - [ProductService](#productservice)
  - [ProductSearchService](#productsearchservice)
  - [WishlistService](#wishlistservice)
  - [CheckoutService](#checkoutservice)
  - [ShippingService](#shippingservice)
- [Componentes](#componentes)

---

## Servicios

### CartService

Servicio para gestionar el estado del carrito usando Angular Signals.

#### Import

```typescript
import { CartService } from '@alejandrovrod/blocks-angular';
```

#### Inyección

```typescript
import { Component, inject } from '@angular/core';
import { CartService } from '@alejandrovrod/blocks-angular';

@Component({...})
export class MyComponent {
  cartService = inject(CartService);
  // o
  constructor(public cartService: CartService) {}
}
```

#### Propiedades (Signals)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `state` | `Signal<CartState>` | Estado completo del carrito (readonly) |
| `items` | `Signal<CartItem[]>` | Items del carrito (readonly) |
| `total` | `Signal<number>` | Total del carrito (readonly) |
| `itemCount` | `Signal<number>` | Cantidad de items (readonly) |

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `initialize` | `options?: CartManagerOptions` | `void` | Inicializar con opciones personalizadas |
| `addItem` | `product: Product, quantity?: number` | `void` | Agregar producto al carrito |
| `removeItem` | `itemId: string` | `void` | Eliminar item del carrito |
| `updateQuantity` | `itemId: string, quantity: number` | `void` | Actualizar cantidad de un item |
| `clear` | - | `void` | Limpiar todo el carrito |

#### Ejemplo

```typescript
import { Component, inject } from '@angular/core';
import { CartService } from '@alejandrovrod/blocks-angular';
import type { Product } from '@alejandrovrod/blocks-core';

@Component({
  selector: 'app-cart',
  template: `
    <div>
      <p>Items: {{ cartService.itemCount() }}</p>
      <p>Total: ${{ cartService.total() }}</p>
      <button (click)="addProduct()">Agregar</button>
    </div>
  `
})
export class CartComponent {
  cartService = inject(CartService);

  addProduct() {
    const product: Product = {
      id: '1',
      name: 'Producto',
      price: 99.99
    };
    this.cartService.addItem(product, 1);
  }
}
```

---

### CartSyncService

Servicio para sincronizar el carrito entre pestañas.

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `initialize` | `options?: CartSyncOptions` | `void` | Inicializar sincronización |
| `stop` | - | `void` | Detener sincronización |

---

### CartHistoryService

Servicio para gestionar el historial del carrito.

#### Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `entries` | `Signal<CartHistoryEntry[]>` | Entradas del historial |

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `saveEntry` | `label?: string` | `void` | Guardar estado actual |
| `restoreState` | `entryId: string` | `boolean` | Restaurar un estado |
| `removeEntry` | `entryId: string` | `void` | Eliminar una entrada |
| `clearHistory` | - | `void` | Limpiar todo el historial |

---

### ProductService

Servicio para gestionar productos.

#### Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `products` | `Signal<Product[]>` | Lista de productos |
| `loading` | `Signal<boolean>` | Estado de carga |
| `error` | `Signal<Error | null>` | Error si existe |

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `getProductById` | `id: string` | `Product | undefined` | Obtener producto por ID |
| `getProductBySku` | `sku: string` | `Product | undefined` | Obtener producto por SKU |
| `getProductsByCategory` | `categoryId: string` | `Product[]` | Obtener productos por categoría |
| `getProductsByTag` | `tag: string` | `Product[]` | Obtener productos por tag |
| `addProduct` | `product: Product` | `void` | Agregar producto |
| `updateProduct` | `id: string, updates: Partial<Product>` | `void` | Actualizar producto |
| `removeProduct` | `id: string` | `void` | Eliminar producto |
| `setProducts` | `products: Product[]` | `void` | Establecer lista de productos |
| `setFilters` | `filters: ProductFilter` | `void` | Aplicar filtros |
| `setSearchQuery` | `query: string` | `void` | Establecer query de búsqueda |
| `setSortBy` | `sort: ProductSort` | `void` | Establecer ordenamiento |

---

### ProductSearchService

Servicio para búsqueda de productos.

#### Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `query` | `Signal<string>` | Query actual |
| `results` | `Signal<SearchResult>` | Resultados de búsqueda |

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `setQuery` | `query: string` | `void` | Establecer query |
| `setOptions` | `options: SearchOptions` | `void` | Establecer opciones |
| `search` | `query: string, options?: SearchOptions` | `SearchResult` | Ejecutar búsqueda |

---

### WishlistService

Servicio para gestionar la lista de deseos.

#### Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `items` | `Signal<WishlistItem[]>` | Items en la lista |

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `hasProduct` | `productId: string` | `boolean` | Verificar si un producto está en la lista |
| `addItem` | `product: Product` | `void` | Agregar producto |
| `removeItem` | `itemId: string` | `void` | Eliminar item |
| `removeProduct` | `productId: string` | `void` | Eliminar producto |
| `clear` | - | `void` | Limpiar lista |

---

### CheckoutService

Servicio para gestionar el proceso de checkout.

#### Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `session` | `Signal<CheckoutSession | null>` | Sesión de checkout |
| `loading` | `Signal<boolean>` | Estado de carga |
| `error` | `Signal<Error | null>` | Error si existe |

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `initializeSession` | `subtotal: number, cartId?: string` | `void` | Inicializar sesión |
| `setShippingAddress` | `address: ShippingAddress` | `CheckoutValidationResult` | Establecer dirección de envío |
| `setBillingAddress` | `address: BillingAddress` | `CheckoutValidationResult` | Establecer dirección de facturación |
| `setPaymentMethod` | `method: PaymentMethodDetails` | `void` | Establecer método de pago |
| `validateCheckout` | - | `CheckoutValidationResult` | Validar checkout |
| `createPayment` | - | `Promise<PaymentResult>` | Crear pago |

---

### ShippingService

Servicio para calcular costos de envío.

#### Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `rates` | `Signal<ShippingRate[]>` | Tarifas disponibles |
| `loading` | `Signal<boolean>` | Estado de carga |
| `error` | `Signal<Error | null>` | Error si existe |
| `selectedOption` | `Signal<ShippingOption | null>` | Opción seleccionada |

#### Métodos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
| `calculateRates` | `request: ShippingCalculationRequest` | `Promise<ShippingRate[]>` | Calcular tarifas |
| `selectOption` | `optionId: string` | `void` | Seleccionar opción |
| `getAvailableOptions` | - | `ShippingOption[]` | Obtener opciones disponibles |

---

## Componentes

### CartViewComponent

Componente para mostrar el carrito completo.

#### Selector

```html
<vk-cart-view></vk-cart-view>
```

#### Inputs

| Input | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `className` | `string` | No | - | Clases CSS adicionales |
| `emptyMessage` | `string` | No | `'Your cart is empty'` | Mensaje cuando está vacío |
| `showHeader` | `boolean` | No | `true` | Mostrar header |
| `enableSync` | `boolean` | No | `false` | Habilitar sincronización |
| `syncOptions` | `CartSyncOptions` | No | - | Opciones de sincronización |
| `enableHistory` | `boolean` | No | `false` | Habilitar historial |
| `historyOptions` | `CartHistoryOptions` | No | - | Opciones del historial |

#### Ejemplo

```html
<vk-cart-view
  [enableSync]="true"
  emptyMessage="Tu carrito está vacío"
  class="my-cart">
</vk-cart-view>
```

---

### CartSummaryComponent

Componente para mostrar el resumen del carrito.

#### Selector

```html
<vk-cart-summary></vk-cart-summary>
```

#### Inputs

| Input | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `className` | `string` | No | - | Clases CSS adicionales |
| `showItemCount` | `boolean` | No | `true` | Mostrar cantidad de items |
| `showSubtotal` | `boolean` | No | `true` | Mostrar subtotal |
| `showTax` | `boolean` | No | `false` | Mostrar impuestos |
| `taxRate` | `number` | No | `0` | Tasa de impuestos |
| `showShipping` | `boolean` | No | `false` | Mostrar envío |
| `shippingCost` | `number` | No | `0` | Costo de envío |
| `showTotal` | `boolean` | No | `true` | Mostrar total |
| `showCheckoutButton` | `boolean` | No | `false` | Mostrar botón checkout |

#### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `checkout` | `EventEmitter<void>` | Emitido cuando se hace checkout |

---

### CartHistoryViewComponent

Componente para mostrar el historial del carrito.

#### Selector

```html
<vk-cart-history-view></vk-cart-history-view>
```

#### Inputs

| Input | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `className` | `string` | No | - | Clases CSS adicionales |
| `historyOptions` | `CartHistoryOptions` | No | - | Opciones del historial |
| `emptyMessage` | `string` | No | `'No cart history'` | Mensaje cuando no hay historial |

#### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `restore` | `EventEmitter<CartHistoryEntry>` | Emitido cuando se restaura un carrito |

#### Ejemplo

```typescript
import { Component } from '@angular/core';
import { CartHistoryViewComponent, CartHistoryService } from '@alejandrovrod/blocks-angular';
import type { CartHistoryEntry } from '@alejandrovrod/blocks-core';

@Component({
  selector: 'app-cart-history',
  standalone: true,
  imports: [CartHistoryViewComponent],
  template: `
    <vk-cart-history-view
      [historyOptions]="{ persist: true, maxEntries: 10 }"
      (restore)="handleRestore($event)"
      emptyMessage="No hay historial de carritos">
    </vk-cart-history-view>
  `
})
export class CartHistoryComponent {
  constructor(public historyService: CartHistoryService) {}

  handleRestore(entry: CartHistoryEntry): void {
    console.log('Restaurando carrito:', entry);
    // El servicio ya restaura automáticamente
  }
}
```

---

### ProductListComponent

Componente para mostrar una lista de productos.

#### Selector

```html
<vk-product-list></vk-product-list>
```

#### Inputs

| Input | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `products` | `Product[]` | Sí | Array de productos |
| `className` | `string` | No | Clases CSS adicionales |
| `emptyMessage` | `string` | No | `'No products found'` | Mensaje cuando no hay productos |

---

### ProductCardComponent

Componente para mostrar una tarjeta de producto.

#### Selector

```html
<vk-product-card></vk-product-card>
```

#### Inputs

| Input | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `product` | `Product` | Sí | El producto a mostrar |
| `className` | `string` | No | Clases CSS adicionales |

---

### WishlistViewComponent

Componente para mostrar la lista de deseos.

#### Selector

```html
<vk-wishlist-view></vk-wishlist-view>
```

#### Inputs

| Input | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `className` | `string` | No | - | Clases CSS adicionales |
| `emptyMessage` | `string` | No | `'Your wishlist is empty'` | Mensaje cuando está vacía |

---

### CheckoutFormComponent

Componente para el formulario de checkout.

#### Selector

```html
<vk-checkout-form></vk-checkout-form>
```

#### Inputs

| Input | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `subtotal` | `number` | Sí | Subtotal del carrito |
| `cartId` | `string` | No | ID del carrito |
| `className` | `string` | No | Clases CSS adicionales |

#### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `complete` | `EventEmitter<string>` | Emitido cuando el checkout se completa (sessionId) |
| `error` | `EventEmitter<Error>` | Emitido cuando hay un error |

#### Ejemplo

```typescript
import { Component } from '@angular/core';
import { CheckoutFormComponent, CartService } from '@alejandrovrod/blocks-angular';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CheckoutFormComponent],
  template: `
    <vk-checkout-form
      [subtotal]="cartService.total()"
      (complete)="handleComplete($event)"
      (error)="handleError($event)">
    </vk-checkout-form>
  `
})
export class CheckoutComponent {
  constructor(public cartService: CartService) {}

  handleComplete(sessionId: string): void {
    console.log('Checkout completado:', sessionId);
  }

  handleError(error: Error): void {
    console.error('Error en checkout:', error);
  }
}
```

---

### PaymentMethodSelectorComponent

Componente para seleccionar método de pago.

#### Selector

```html
<vk-payment-method-selector></vk-payment-method-selector>
```

#### Inputs

| Input | Tipo | Requerido | Default | Descripción |
|-------|------|-----------|---------|-------------|
| `value` | `PaymentMethodDetails` | No | - | Método seleccionado |
| `methods` | `PaymentMethod[]` | No | `['credit_card', 'debit_card', 'bank_transfer', 'cash', 'digital_wallet', 'mercado_pago']` | Métodos disponibles |
| `className` | `string` | No | - | Clases CSS adicionales |

#### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `change` | `EventEmitter<PaymentMethodDetails>` | Emitido cuando se selecciona un método |

#### Ejemplo

```typescript
import { Component, signal } from '@angular/core';
import { PaymentMethodSelectorComponent } from '@alejandrovrod/blocks-angular';
import type { PaymentMethodDetails } from '@alejandrovrod/blocks-core';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [PaymentMethodSelectorComponent],
  template: `
    <vk-payment-method-selector
      [value]="selectedMethod()"
      [methods]="['credit_card', 'mercado_pago', 'bank_transfer']"
      (change)="handleMethodChange($event)">
    </vk-payment-method-selector>
  `
})
export class PaymentComponent {
  selectedMethod = signal<PaymentMethodDetails | undefined>(undefined);

  handleMethodChange(method: PaymentMethodDetails): void {
    this.selectedMethod.set(method);
  }
}
```

---

### MercadoPagoButtonComponent

Componente para botón de pago con Mercado Pago.

#### Selector

```html
<vk-mercadopago-button></vk-mercadopago-button>
```

#### Inputs

| Input | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `publicKey` | `string` | Sí | Clave pública de Mercado Pago |
| `preferenceId` | `string` | No | ID de preferencia (opcional) |
| `className` | `string` | No | Clases CSS adicionales |
| `label` | `string` | No | `'Pay with Mercado Pago'` | Texto del botón |

#### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `success` | `EventEmitter<string>` | Emitido cuando el pago es exitoso (paymentId) |
| `error` | `EventEmitter<Error>` | Emitido cuando hay un error |

#### Ejemplo

```typescript
import { Component } from '@angular/core';
import { MercadoPagoButtonComponent } from '@alejandrovrod/blocks-angular';

@Component({
  selector: 'app-mercadopago',
  standalone: true,
  imports: [MercadoPagoButtonComponent],
  template: `
    <vk-mercadopago-button
      publicKey="YOUR_PUBLIC_KEY"
      [preferenceId]="preferenceId"
      label="Pagar con Mercado Pago"
      (success)="handleSuccess($event)"
      (error)="handleError($event)">
    </vk-mercadopago-button>
  `
})
export class MercadoPagoComponent {
  preferenceId?: string;

  handleSuccess(paymentId: string): void {
    console.log('Pago exitoso:', paymentId);
  }

  handleError(error: Error): void {
    console.error('Error en pago:', error);
  }
}
```

---

### ShippingCalculatorComponent

Componente para calcular costos de envío.

#### Selector

```html
<vk-shipping-calculator></vk-shipping-calculator>
```

#### Inputs

| Input | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `items` | `ShippingItem[]` | Sí | Items para calcular |
| `className` | `string` | No | Clases CSS adicionales |

#### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `ratesCalculated` | `EventEmitter<ShippingRate[]>` | Emitido con las tarifas calculadas |

#### Ejemplo

```typescript
import { Component, signal } from '@angular/core';
import { ShippingCalculatorComponent } from '@alejandrovrod/blocks-angular';
import type { ShippingItem, ShippingRate } from '@alejandrovrod/blocks-core';

@Component({
  selector: 'app-shipping',
  standalone: true,
  imports: [ShippingCalculatorComponent],
  template: `
    <vk-shipping-calculator
      [items]="shippingItems()"
      (ratesCalculated)="handleRates($event)">
    </vk-shipping-calculator>
  `
})
export class ShippingComponent {
  shippingItems = signal<ShippingItem[]>([]);
  rates = signal<ShippingRate[]>([]);

  handleRates(rates: ShippingRate[]): void {
    this.rates.set(rates);
  }
}
```

---

### ShippingOptionsComponent

Componente para seleccionar opciones de envío.

#### Selector

```html
<vk-shipping-options></vk-shipping-options>
```

#### Inputs

| Input | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `rates` | `ShippingRate[]` | Sí | Tarifas disponibles |
| `selectedRateId` | `string` | No | ID de tarifa seleccionada |
| `className` | `string` | No | Clases CSS adicionales |

#### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `select` | `EventEmitter<ShippingRate>` | Emitido cuando se selecciona una tarifa |

#### Ejemplo

```typescript
import { Component, signal } from '@angular/core';
import { ShippingOptionsComponent } from '@alejandrovrod/blocks-angular';
import type { ShippingRate } from '@alejandrovrod/blocks-core';

@Component({
  selector: 'app-shipping-options',
  standalone: true,
  imports: [ShippingOptionsComponent],
  template: `
    <vk-shipping-options
      [rates]="rates()"
      [selectedRateId]="selectedRateId()"
      (select)="handleSelect($event)">
    </vk-shipping-options>
  `
})
export class ShippingOptionsComponent {
  rates = signal<ShippingRate[]>([]);
  selectedRateId = signal<string | undefined>(undefined);

  handleSelect(rate: ShippingRate): void {
    this.selectedRateId.set(rate.option.id);
    console.log('Tarifa seleccionada:', rate);
  }
}
```

---

### AddressFormComponent

Componente para formulario de dirección.

#### Selector

```html
<vk-address-form></vk-address-form>
```

#### Inputs

| Input | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `initialAddress` | `Partial<ShippingAddress>` | No | Dirección inicial |
| `className` | `string` | No | Clases CSS adicionales |
| `showErrors` | `boolean` | No | `true` | Mostrar errores |

#### Outputs

| Output | Tipo | Descripción |
|--------|------|-------------|
| `submit` | `EventEmitter<ShippingAddress>` | Emitido cuando se envía el formulario |

#### Ejemplo

```typescript
import { Component } from '@angular/core';
import { AddressFormComponent } from '@alejandrovrod/blocks-angular';
import type { ShippingAddress } from '@alejandrovrod/blocks-core';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [AddressFormComponent],
  template: `
    <vk-address-form
      [initialAddress]="initialAddress"
      [showErrors]="true"
      (submit)="handleSubmit($event)">
    </vk-address-form>
  `
})
export class AddressComponent {
  initialAddress?: Partial<ShippingAddress> = {
    city: 'Buenos Aires',
    country: 'Argentina'
  };

  handleSubmit(address: ShippingAddress): void {
    console.log('Dirección enviada:', address);
  }
}
```

---

## Ejemplo Completo

```typescript
import { Component, inject } from '@angular/core';
import { CartService, CartViewComponent, CartSummaryComponent } from '@alejandrovrod/blocks-angular';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CartViewComponent, CartSummaryComponent],
  template: `
    <vk-cart-view [enableSync]="true"></vk-cart-view>
    <vk-cart-summary 
      [showTax]="true"
      [taxRate]="0.21"
      (checkout)="handleCheckout()">
    </vk-cart-summary>
  `
})
export class ShoppingCartComponent {
  cartService = inject(CartService);

  handleCheckout() {
    console.log('Checkout!', this.cartService.total());
  }
}
```

---

## Más Información

- [Guía de Instalación](../INSTALLATION.md)
- [Core API](./core/README.md)
- [React API](./react/README.md) - Para referencia de funcionalidades equivalentes



