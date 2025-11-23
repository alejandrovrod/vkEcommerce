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
- `ProductList.vue` - Lista de productos
- `ProductSearch.vue` - Búsqueda de productos
- `ProductFilters.vue` - Filtros de productos
- `WishlistView.vue` - Vista de lista de deseos
- `WishlistButton.vue` - Botón de lista de deseos
- `CheckoutForm.vue` - Formulario de checkout
- `PaymentMethodSelector.vue` - Selector de método de pago
- `MercadoPagoButton.vue` - Botón de Mercado Pago
- `ShippingCalculator.vue` - Calculadora de envío
- `ShippingOptions.vue` - Opciones de envío
- `AddressForm.vue` - Formulario de dirección

---

### CartHistoryView

Componente para mostrar el historial del carrito.

#### Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `className` | `string` | No | - | Clases CSS adicionales |
| `historyOptions` | `CartHistoryOptions` | No | - | Opciones del historial |
| `onRestore` | `(entry: CartHistoryEntry) => void` | No | - | Callback cuando se restaura un carrito |
| `emptyMessage` | `string` | No | `'No cart history'` | Mensaje cuando no hay historial |

#### Slots

- `empty` - Contenido cuando no hay historial
- `entry` - Renderizado personalizado de cada entrada (props: `entry`, `onRestore`, `onRemove`)

#### Ejemplo

```vue
<template>
  <CartHistoryView
    :history-options="{ persist: true, maxEntries: 10 }"
    :on-restore="handleRestore"
    empty-message="No hay historial de carritos"
  >
    <template #entry="{ entry, onRestore, onRemove }">
      <div class="custom-entry">
        <p>{{ entry.label || 'Cart' }}</p>
        <p>{{ entry.state.itemCount }} items - ${{ entry.state.total.toFixed(2) }}</p>
        <button @click="onRestore">Restore</button>
        <button @click="onRemove">Remove</button>
      </div>
    </template>
  </CartHistoryView>
</template>

<script setup>
import CartHistoryView from '@alejandrovrod/blocks-vue/components/CartHistoryView.vue';
import type { CartHistoryEntry } from '@alejandrovrod/blocks-core';

function handleRestore(entry: CartHistoryEntry) {
  console.log('Restaurando carrito:', entry);
}
</script>
```

---

### CheckoutForm

Componente para el formulario de checkout.

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `subtotal` | `number` | Sí | Subtotal del carrito |
| `cartId` | `string` | No | ID del carrito |
| `className` | `string` | No | Clases CSS adicionales |

#### Slots

- `fields` - Renderizado personalizado de campos (props: `shippingAddress`, `billingAddress`, `paymentMethod`, `onShippingChange`, `onBillingChange`, `onPaymentChange`)
- `submit` - Renderizado personalizado del botón de envío (props: `loading`, `disabled`, `onSubmit`)

#### Events

- `@complete` - Emitido cuando el checkout se completa (sessionId)
- `@error` - Emitido cuando hay un error (Error)

#### Ejemplo

```vue
<template>
  <CheckoutForm
    :subtotal="total"
    @complete="handleComplete"
    @error="handleError"
  >
    <template #fields="{ shippingAddress, paymentMethod, onShippingChange, onPaymentChange }">
      <AddressForm
        :initial-address="shippingAddress"
        @submit="onShippingChange"
      />
      <PaymentMethodSelector
        :value="paymentMethod"
        :on-change="onPaymentChange"
      />
    </template>
    <template #submit="{ loading, disabled, onSubmit }">
      <button
        type="button"
        :disabled="loading || disabled"
        @click="onSubmit"
      >
        {{ loading ? 'Processing...' : 'Complete Order' }}
      </button>
    </template>
  </CheckoutForm>
</template>

<script setup>
import { useCart } from '@alejandrovrod/blocks-vue';
import CheckoutForm from '@alejandrovrod/blocks-vue/checkout/CheckoutForm.vue';
import AddressForm from '@alejandrovrod/blocks-vue/shipping/AddressForm.vue';
import PaymentMethodSelector from '@alejandrovrod/blocks-vue/checkout/PaymentMethodSelector.vue';

const { total } = useCart();

function handleComplete(sessionId: string) {
  console.log('Checkout completado:', sessionId);
}

function handleError(error: Error) {
  console.error('Error en checkout:', error);
}
</script>
```

---

### PaymentMethodSelector

Componente para seleccionar método de pago.

#### Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `value` | `PaymentMethodDetails` | No | - | Método seleccionado |
| `methods` | `PaymentMethod[]` | No | `['credit_card', 'debit_card', 'bank_transfer', 'cash', 'digital_wallet', 'mercado_pago']` | Métodos disponibles |
| `onChange` | `(method: PaymentMethodDetails) => void` | Sí | - | Callback cuando se selecciona un método |
| `className` | `string` | No | - | Clases CSS adicionales |

#### Ejemplo

```vue
<template>
  <PaymentMethodSelector
    :value="selectedMethod"
    :methods="['credit_card', 'mercado_pago', 'bank_transfer']"
    :on-change="handleMethodChange"
  />
</template>

<script setup>
import { ref } from 'vue';
import PaymentMethodSelector from '@alejandrovrod/blocks-vue/checkout/PaymentMethodSelector.vue';
import type { PaymentMethodDetails } from '@alejandrovrod/blocks-core';

const selectedMethod = ref<PaymentMethodDetails | undefined>(undefined);

function handleMethodChange(method: PaymentMethodDetails) {
  selectedMethod.value = method;
}
</script>
```

---

### MercadoPagoButton

Componente para botón de pago con Mercado Pago.

#### Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `publicKey` | `string` | Sí | - | Clave pública de Mercado Pago |
| `preferenceId` | `string` | No | - | ID de preferencia (opcional) |
| `className` | `string` | No | - | Clases CSS adicionales |
| `label` | `string` | No | `'Pay with Mercado Pago'` | Texto del botón |
| `onSuccess` | `(paymentId: string) => void` | No | - | Callback cuando el pago es exitoso |
| `onError` | `(error: Error) => void` | No | - | Callback cuando hay un error |

#### Ejemplo

```vue
<template>
  <MercadoPagoButton
    public-key="YOUR_PUBLIC_KEY"
    :preference-id="preferenceId"
    label="Pagar con Mercado Pago"
    @success="handleSuccess"
    @error="handleError"
  />
</template>

<script setup>
import { ref } from 'vue';
import MercadoPagoButton from '@alejandrovrod/blocks-vue/checkout/MercadoPagoButton.vue';

const preferenceId = ref<string | undefined>(undefined);

function handleSuccess(paymentId: string) {
  console.log('Pago exitoso:', paymentId);
}

function handleError(error: Error) {
  console.error('Error en pago:', error);
}
</script>
```

---

### ShippingOptions

Componente para seleccionar opciones de envío.

#### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `rates` | `ShippingRate[]` | Sí | Tarifas disponibles |
| `selectedRateId` | `string` | No | ID de tarifa seleccionada |
| `onSelect` | `(rate: ShippingRate) => void` | Sí | Callback cuando se selecciona una tarifa |
| `className` | `string` | No | Clases CSS adicionales |

#### Ejemplo

```vue
<template>
  <ShippingOptions
    :rates="rates"
    :selected-rate-id="selectedRateId"
    :on-select="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue';
import ShippingOptions from '@alejandrovrod/blocks-vue/shipping/ShippingOptions.vue';
import type { ShippingRate } from '@alejandrovrod/blocks-core';

const rates = ref<ShippingRate[]>([]);
const selectedRateId = ref<string | undefined>(undefined);

function handleSelect(rate: ShippingRate) {
  selectedRateId.value = rate.option.id;
  console.log('Tarifa seleccionada:', rate);
}
</script>
```

---

### AddressForm

Componente para formulario de dirección.

#### Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `initialAddress` | `Partial<ShippingAddress>` | No | - | Dirección inicial |
| `className` | `string` | No | - | Clases CSS adicionales |
| `showErrors` | `boolean` | No | `true` | Mostrar errores |
| `onSubmit` | `(address: ShippingAddress) => void` | Sí | - | Callback cuando se envía el formulario |

#### Slots

- `fields` - Renderizado personalizado de campos (props: `address`, `onChange`, `errors`)
- `submit` - Renderizado personalizado del botón de envío (props: `onSubmit`, `disabled`)

#### Ejemplo

```vue
<template>
  <AddressForm
    :initial-address="initialAddress"
    :show-errors="true"
    :on-submit="handleSubmit"
  >
    <template #fields="{ address, onChange, errors }">
      <div class="custom-fields">
        <input
          v-model="address.street"
          type="text"
          placeholder="Street"
          @input="onChange({ ...address, street: $event.target.value })"
        />
        <span v-if="errors.find(e => e.field === 'street')" class="error">
          {{ errors.find(e => e.field === 'street')?.message }}
        </span>
        <!-- Más campos... -->
      </div>
    </template>
  </AddressForm>
</template>

<script setup>
import AddressForm from '@alejandrovrod/blocks-vue/shipping/AddressForm.vue';
import type { ShippingAddress } from '@alejandrovrod/blocks-core';

const initialAddress: Partial<ShippingAddress> = {
  city: 'Buenos Aires',
  country: 'Argentina'
};

function handleSubmit(address: ShippingAddress) {
  console.log('Dirección enviada:', address);
}
</script>
```

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



