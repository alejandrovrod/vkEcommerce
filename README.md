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

- **@vk/blocks-core**: Tests unitarios para la lógica del carrito
- **@vk/blocks-react**: Tests para hooks y componentes React
- **@vk/blocks-vue**: Tests para composables Vue
- **@vk/blocks-angular**: Tests para servicios Angular

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
  const { items, addItem } = useCart();
  
  return <ProductCard product={product} />;
}
```

### Vue

```vue
<script setup>
import { useCart } from '@vk/blocks-vue';

const { items, addItem } = useCart();
</script>
```

### Angular

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

**Nota**: Este paquete usa **Angular Signals** (disponible desde Angular 16+) para manejo reactivo del estado, eliminando la necesidad de RxJS Observables.

