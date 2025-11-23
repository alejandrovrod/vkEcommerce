# Módulos de vkecomblocks

Documentación detallada de cada módulo disponible en vkecomblocks.

## Tabla de Contenidos

1. [Cart Module](#cart-module)
2. [Checkout Module](#checkout-module)
3. [Products Module](#products-module)
4. [Wishlist Module](#wishlist-module)
5. [Shipping Module](#shipping-module)
6. [Cart Sync & History](#cart-sync--history)

---

## Cart Module

### Core API

```typescript
import { createCartManager, CartManager } from '@alejandrovrod/blocks-core';

const manager = createCartManager({
  persist: true, // localStorage por defecto
  storageKey: 'my-cart',
  storage: customStorage, // Storage personalizado
});

// Operaciones básicas
manager.addItem(product, quantity);
manager.removeItem(itemId);
manager.updateQuantity(itemId, quantity);
manager.clear();

// Estado
const state = manager.getState();
const { items, total, itemCount } = state;
```

### React

```tsx
import { useCart, CartView, CartSummary, CartItem } from '@alejandrovrod/blocks-react';

function App() {
  const { items, addItem, removeItem, updateQuantity, total, itemCount } = useCart({
    persist: true,
  });
  
  return (
    <div>
      <CartView 
        enableSync 
        enableHistory
        renderItem={(item) => <CartItem key={item.id} item={item} />}
      />
      <CartSummary 
        showTax 
        taxRate={0.21}
        showShipping
        shippingCost={500}
      />
    </div>
  );
}
```

### Vue

```vue
<script setup>
import { useCart } from '@alejandrovrod/blocks-vue';
import CartView from '@alejandrovrod/blocks-vue/components/CartView.vue';
import CartSummary from '@alejandrovrod/blocks-vue/components/CartSummary.vue';

const { items, addItem, removeItem, total } = useCart({ persist: true });
</script>

<template>
  <CartView :enable-sync :enable-history />
  <CartSummary :show-tax :tax-rate="0.21" />
</template>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { CartService } from '@alejandrovrod/blocks-angular';

@Component({
  selector: 'app-cart',
  standalone: true,
  template: `
    <vk-cart-view [enableSync]="true" [enableHistory]="true"></vk-cart-view>
    <vk-cart-summary 
      [showTax]="true" 
      [taxRate]="0.21"
    ></vk-cart-summary>
  `
})
export class CartComponent {
  constructor(public cartService: CartService) {}
}
```

---

## Checkout Module

### Core API

```typescript
import { createCheckoutManager } from '@alejandrovrod/blocks-core';

const manager = createCheckoutManager({
  currency: 'ARS',
  taxRate: 0.21,
  mercadoPagoAccessToken: 'YOUR_TOKEN',
  mercadoPagoPublicKey: 'YOUR_PUBLIC_KEY',
});

// Inicializar sesión
const session = manager.initializeSession(subtotal, cartId);

// Configurar direcciones
manager.setShippingAddress(address);
manager.setBillingAddress(address);

// Método de pago
manager.setPaymentMethod({ method: 'mercado_pago' });

// Crear pago
const preference = await manager.createPayment();

// Procesar pago
const result = await manager.processPayment(paymentId);
```

### React

```tsx
import { useCheckout, CheckoutForm, MercadoPagoButton } from '@alejandrovrod/blocks-react';

function CheckoutPage() {
  const checkout = useCheckout({
    currency: 'ARS',
    taxRate: 0.21,
    mercadoPagoAccessToken: process.env.MP_ACCESS_TOKEN,
  });
  
  return (
    <div>
      <CheckoutForm 
        onSubmit={(address) => {
          checkout.setShippingAddress(address);
          checkout.setBillingAddress(address);
        }}
      />
      <MercadoPagoButton 
        onSuccess={(result) => console.log('Payment approved', result)}
      />
    </div>
  );
}
```

---

## Products Module

### Core API

```typescript
import { createProductManager } from '@alejandrovrod/blocks-core';

const manager = createProductManager({
  products: initialProducts,
  enableCache: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutos
});

await manager.initialize();

// Búsqueda
const result = manager.search({
  query: 'laptop',
  filters: {
    categories: ['electronics'],
    priceRange: { min: 1000, max: 5000 },
  },
  sort: { field: 'price', direction: 'asc' },
  page: 1,
  pageSize: 20,
});

// Operaciones
manager.addProduct(product);
manager.updateProduct(id, updates);
manager.removeProduct(id);
```

### React

```tsx
import { useProducts, ProductList, ProductSearch, ProductFilters, ProductCard } from '@alejandrovrod/blocks-react';

function ProductsPage() {
  const { 
    products, 
    loading, 
    setSearchQuery, 
    setFilters, 
    setSortBy,
    setPage 
  } = useProducts({
    products: initialProducts,
  });
  
  return (
    <div>
      <ProductSearch onSearch={setSearchQuery} />
      <ProductFilters 
        onFilter={setFilters}
        facets={products.facets}
      />
      <ProductList products={products} />
      
      {/* ProductCard example */}
      <ProductCard 
        product={products[0]} 
        onAddToCart={(product) => console.log('Added', product)}
      />
    </div>
  );
}
```

### Vue

```vue
<script setup>
import { useProducts } from '@alejandrovrod/blocks-vue';
import ProductCard from '@alejandrovrod/blocks-vue/components/ProductCard.vue';
import ProductList from '@alejandrovrod/blocks-vue/components/ProductList.vue';
import ProductSearch from '@alejandrovrod/blocks-vue/components/ProductSearch.vue';
import ProductFilters from '@alejandrovrod/blocks-vue/components/ProductFilters.vue';

const { 
  products, 
  loading, 
  setSearchQuery, 
  setFilters, 
  setSortBy 
} = useProducts({
  products: initialProducts,
});
</script>

<template>
  <div>
    <ProductSearch @search="setSearchQuery" />
    <ProductFilters @filter="setFilters" :facets="products.facets" />
    <ProductList :products="products" />
    
    <!-- ProductCard example -->
    <ProductCard 
      :product="products[0]" 
      @add-to-cart="(product) => console.log('Added', product)"
    />
  </div>
</template>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { ProductService, ProductCardComponent, ProductListComponent } from '@alejandrovrod/blocks-angular';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, ProductListComponent],
  template: `
    <div>
      <vk-product-list [products]="products()"></vk-product-list>
      
      <!-- ProductCard example -->
      <vk-product-card 
        [product]="products()[0]"
        (addToCart)="onAddToCart($event)"
      ></vk-product-card>
    </div>
  `
})
export class ProductsComponent {
  products = this.productService.products;
  
  constructor(private productService: ProductService) {}
  
  onAddToCart(product: any) {
    console.log('Added', product);
  }
}
```

---

## ProductCard Component

Componente reutilizable para mostrar tarjetas de productos con funcionalidad de agregar al carrito.

### Características

- Renderizado de imagen con placeholder
- Título y descripción del producto
- Precio formateado
- Botón "Add to Cart" integrado
- Personalización mediante slots/render props
- Estructura semántica HTML5 con schema.org
- Soporte para cantidad personalizable

### React

```tsx
import { ProductCard } from '@alejandrovrod/blocks-react';

// Uso básico
<ProductCard product={product} />

// Con personalización
<ProductCard 
  product={product}
  className="custom-card"
  quantity={2}
  onAddToCart={(product) => console.log('Added', product)}
  renderImage={(product) => <img src={product.image} alt={product.name} />}
  renderTitle={(product) => <h2>{product.name}</h2>}
  renderPrice={(product) => <span>${product.price}</span>}
  renderButton={(product, onAddToCart) => (
    <button onClick={onAddToCart}>Comprar</button>
  )}
/>

// Contenido completamente personalizado
<ProductCard product={product}>
  <div>Tu contenido personalizado aquí</div>
</ProductCard>
```

### Vue

```vue
<script setup>
import ProductCard from '@alejandrovrod/blocks-vue/components/ProductCard.vue';
</script>

<template>
  <!-- Uso básico -->
  <ProductCard :product="product" />
  
  <!-- Con slots personalizados -->
  <ProductCard :product="product" @add-to-cart="handleAddToCart">
    <template #image="{ product }">
      <img :src="product.image" :alt="product.name" />
    </template>
    <template #title="{ product }">
      <h2>{{ product.name }}</h2>
    </template>
    <template #price="{ product }">
      <span>${{ product.price }}</span>
    </template>
    <template #button="{ product, onAddToCart }">
      <button @click="onAddToCart">Comprar</button>
    </template>
  </ProductCard>
  
  <!-- Contenido completamente personalizado -->
  <ProductCard :product="product">
    <div>Tu contenido personalizado aquí</div>
  </ProductCard>
</template>
```

### Angular

```typescript
import { Component } from '@angular/core';
import { ProductCardComponent } from '@alejandrovrod/blocks-angular';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <!-- Uso básico -->
    <vk-product-card [product]="product"></vk-product-card>
    
    <!-- Con slots personalizados -->
    <vk-product-card [product]="product" (addToCart)="handleAddToCart($event)">
      <div image>Imagen personalizada</div>
      <h2 title>Título personalizado</h2>
      <span price>Precio personalizado</span>
      <button button (click)="handleAdd()">Botón personalizado</button>
    </vk-product-card>
    
    <!-- Contenido completamente personalizado -->
    <vk-product-card [product]="product" [useCustomContent]="true">
      <div>Tu contenido personalizado aquí</div>
    </vk-product-card>
  `
})
export class ProductsComponent {
  product = { /* ... */ };
  
  handleAddToCart(product: any) {
    console.log('Added', product);
  }
}
```

---

## Wishlist Module

### Core API

```typescript
import { createWishlistManager } from '@alejandrovrod/blocks-core';

const manager = createWishlistManager({
  persist: true,
});

// Operaciones
manager.addItem(product, 'Remember to check reviews');
manager.removeItem(itemId);
manager.hasProduct(productId);
manager.clear();
```

### React

```tsx
import { useWishlist, WishlistButton, WishlistView } from '@alejandrovrod/blocks-react';

function ProductCard({ product }) {
  const { addItem, removeItem, hasProduct } = useWishlist();
  const isInWishlist = hasProduct(product.id);
  
  return (
    <div>
      <h3>{product.name}</h3>
      <WishlistButton 
        product={product}
        isInWishlist={isInWishlist}
        onToggle={() => {
          if (isInWishlist) {
            removeItem(product.id);
          } else {
            addItem(product);
          }
        }}
      />
    </div>
  );
}
```

---

## Shipping Module

### Core API

```typescript
import { createShippingManager, CorreosArgentinaProvider } from '@alejandrovrod/blocks-core';

const manager = createShippingManager({
  defaultProvider: new CorreosArgentinaProvider(),
  currency: 'ARS',
  enableValidation: true,
});

// Calcular tarifas
const result = await manager.calculateRates({
  address: {
    street: 'Av. Corrientes 123',
    city: 'Buenos Aires',
    postalCode: 'C1043',
    country: 'AR',
    recipientName: 'Juan Pérez',
  },
  items: [
    { weight: 1, quantity: 2, value: 100 },
  ],
});

// Obtener más económico
const cheapest = await manager.getCheapestRate(request);
```

### React

```tsx
import { useShipping, ShippingCalculator, AddressForm } from '@alejandrovrod/blocks-react';

function ShippingPage() {
  const { calculateRates, rates, loading, error } = useShipping();
  
  return (
    <div>
      <AddressForm 
        onSubmit={(address) => {
          calculateRates({
            address,
            items: cartItems,
          });
        }}
      />
      {loading && <p>Calculando...</p>}
      {error && <p>Error: {error.message}</p>}
      <ShippingCalculator rates={rates} />
    </div>
  );
}
```

---

## Cart Sync & History

### Cart Sync

Sincronización automática entre pestañas del navegador.

```typescript
import { CartSync } from '@alejandrovrod/blocks-core';

const sync = new CartSync(cartManager);
sync.initialize();

// El carrito se sincroniza automáticamente entre pestañas
```

**React:**
```tsx
import { useCartSync } from '@alejandrovrod/blocks-react';

function App() {
  useCartSync(); // Sincronización automática
  // ...
}
```

### Cart History

Historial de estados del carrito con capacidad de restauración.

```typescript
import { CartHistory } from '@alejandrovrod/blocks-core';

const history = new CartHistory(cartManager);
history.addState(); // Guardar estado actual
const entries = history.getEntries();
history.restoreState(entryId); // Restaurar un estado anterior
```

**React:**
```tsx
import { useCartHistory, CartHistoryView } from '@alejandrovrod/blocks-react';

function App() {
  const history = useCartHistory();
  
  return (
    <div>
      <CartHistoryView />
    </div>
  );
}
```

---

## Más Información

- [Storage Strategies](../packages/blocks-core/STORAGE.md) - Documentación completa de estrategias de almacenamiento
- [API Reference](./API.md) - Referencia completa de la API (próximamente)




